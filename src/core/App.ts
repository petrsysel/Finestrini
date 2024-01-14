import { IBoardUI } from "../ports/IBoardUI"
import { IControlPanelUI } from "../ports/IControlPanelUI"
import { IDialogueUI } from "../ports/IDialogueUI"
import { IWorkspaceRepository } from "../ports/IWorkspaceRepository"
import { Workspace } from "./Workspace"
import { BoardId, NoteColor } from "./WorkspaceTypes"

export class App{
    private workspace: Workspace
    private activeBoardId: BoardId

    constructor(
        localStorage: IWorkspaceRepository,
        externalStorage: IWorkspaceRepository,
        controlPanel: IControlPanelUI,
        confirmDialogue: IDialogueUI<boolean>,
        inputDialogue: IDialogueUI<string>,
        richTextDialogue: IDialogueUI<string>,
        colorDialogue: IDialogueUI<NoteColor>,
        board: IBoardUI
    ){
        this.workspace = new Workspace()
        const initBoard = this.workspace.getSomeBoard()
        this.activeBoardId = initBoard.id

        const renderBoard = () => {
            board.render(this.workspace.getBoardById(this.activeBoardId)!, this.workspace.getWidth())
        }

        controlPanel.on("rename-board-request", async data => {
            const newName = await inputDialogue.show()
            if(newName && newName.length != 0) this.workspace.renameBoard(this.activeBoardId, newName)
        })
        controlPanel.on("add-board-request", async data => {
            const name = await inputDialogue.show()
            if(!name || name.length == 0) return
            
            this.activeBoardId = this.workspace.createBoard(name)
            controlPanel.render(this.workspace.getBoardList(), this.activeBoardId)

            renderBoard()
        })
        controlPanel.on("change-board-request", data => {
            if(data) this.activeBoardId = data.activeBoard
            controlPanel.render(this.workspace.getBoardList(), this.activeBoardId)

            renderBoard()
        })
        controlPanel.on("rename-board-request", async () => {
            const newName = await inputDialogue.show()
            if(newName) this.workspace.renameBoard(this.activeBoardId, newName)
            controlPanel.render(this.workspace.getBoardList(), this.activeBoardId)
        })
        controlPanel.on("remove-board-request", async () => {
            const confirmation = await confirmDialogue.show()
            if(confirmation){
                this.workspace.removeBoard(this.activeBoardId)
                this.activeBoardId = this.workspace.getSomeBoard().id
                controlPanel.render(this.workspace.getBoardList(), this.activeBoardId)
            }
            renderBoard()
        })

        board.on("add-note-request", () => {
            this.workspace.createNote(this.activeBoardId, 1, 1)
            renderBoard()
        })

        board.on('board-resize-request', () => {
            renderBoard()
        })

        board.on('move-note-request', data => {
            if(!data) return
            if(data.rect.y > 0){
                this.workspace.changeNotePosition(this.activeBoardId, data.operatingNoteId, data.rect.x, data.rect.y)
            }
            
            renderBoard()
        })

        board.on('change-note-size-request', data => {
            if(!data) return
            this.workspace.changeNoteRect(this.activeBoardId, data.operatingNoteId, data.rect)
            renderBoard()
        })
        board.on('remove-note-request', async data => {
            if(!data) return
            const confirmation = await confirmDialogue.show("Přeješ si odstranit tuto poznámku?")
            if(!confirmation) return 
            this.workspace.removeNote(this.activeBoardId, data.operatingNoteId)
            renderBoard()
        })
        board.on('change-note-color-request', async data => {
            if(!data) return
            const color = await colorDialogue.show()
            if(!color) return
            this.workspace.changeNoteColor(this.activeBoardId, data.operatingNoteId, color)
            renderBoard()
        })
        board.on('change-note-content-request', async data => {
            if(!data) return
            const note = this.workspace.getNote(this.activeBoardId, data.operatingNoteId)!

            const content = await richTextDialogue.show(note.content)
            if(!content) return

            this.workspace.changeNoteContent(this.activeBoardId, data.operatingNoteId, content)
            renderBoard()
        })

        controlPanel.render(this.workspace.getBoardList(), this.activeBoardId)
        renderBoard()
    }
}