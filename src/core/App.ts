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

        const renderBoard = (calledBy: string) => {
            // console.log(`Rendering... Called by: ${calledBy}`)
            controlPanel.render(this.workspace.getBoardList(), this.activeBoardId, localStorage.lastSave())
            board.render(this.workspace.getBoardById(this.activeBoardId)!, this.workspace.getWidth())
            localStorage.save(this.workspace.getPrimitive())
        }

        controlPanel.on("rename-board-request", async data => {
            const newName = await inputDialogue.show()
            if(newName && newName.length != 0) this.workspace.renameBoard(this.activeBoardId, newName)
        })
        controlPanel.on("add-board-request", async data => {
            const name = await inputDialogue.show()
            if(!name || name.length == 0) return
            
            this.activeBoardId = this.workspace.createBoard(name)
            
            renderBoard("add-board-request")
        })
        controlPanel.on("change-board-request", data => {
            if(data) this.activeBoardId = data.activeBoard

            renderBoard("change-board-request")
        })
        controlPanel.on("rename-board-request", async () => {
            const newName = await inputDialogue.show()
            if(newName) this.workspace.renameBoard(this.activeBoardId, newName)
            
            renderBoard("rename-board-request")
        })
        controlPanel.on("remove-board-request", async () => {
            const confirmation = await confirmDialogue.show()
            if(confirmation){
                this.workspace.removeBoard(this.activeBoardId)
                this.activeBoardId = this.workspace.getSomeBoard().id
            }
            renderBoard("remove-board-request")
        })

        board.on("add-note-request", data => {
            if(!data) return
            this.workspace.createNote(this.activeBoardId, data.rect.x, data.rect.y)
            renderBoard("add-note-request")
        })

        board.on('board-resize-request', () => {
            renderBoard('board-resize-request')
        })

        board.on('move-note-request', data => {
            if(!data) return

            // UDĚLAT LÉPE!
            if(data.rect.y > 0){
                this.workspace.changeNotePosition(this.activeBoardId, data.operatingNoteId, data.rect.x, data.rect.y)
            }
            else{
                this.workspace.changeNotePosition(this.activeBoardId, data.operatingNoteId, data.rect.x, 1)
            }
            
            renderBoard('move-note-request')
        })

        board.on('change-note-size-request', data => {
            if(!data) return
            this.workspace.changeNoteRect(this.activeBoardId, data.operatingNoteId, data.rect)
            renderBoard('change-note-size-request')
        })
        board.on('remove-note-request', async data => {
            if(!data) return
            const confirmation = await confirmDialogue.show("Přeješ si odstranit tuto poznámku?")
            if(!confirmation) return 
            this.workspace.removeNote(this.activeBoardId, data.operatingNoteId)
            renderBoard('remove-note-request')
        })
        board.on('change-note-color-request', async data => {
            if(!data) return
            const color = await colorDialogue.show()
            if(!color) return
            this.workspace.changeNoteColor(this.activeBoardId, data.operatingNoteId, color)
            renderBoard('change-note-color-request')
        })
        board.on('change-note-content-request', async data => {
            if(!data) return
            const note = this.workspace.getNote(this.activeBoardId, data.operatingNoteId)!

            const content = await richTextDialogue.show(note.content)
            if(!content) return

            this.workspace.changeNoteContent(this.activeBoardId, data.operatingNoteId, content)
            renderBoard('change-note-content-request')
        })

        controlPanel.on('export-request', () => {
            externalStorage.save(this.workspace.getPrimitive())
        })
        controlPanel.on('import-request', async () => {
            try{
                const loadedWorkspace = await externalStorage.load()
                this.workspace.changeWorkspace(loadedWorkspace)
                this.activeBoardId = this.workspace.getSomeBoard().id
                renderBoard('import-request')
            }
            catch(e){
                console.log(e)
            }
        })
        controlPanel.on('help-request', () => {
            this.activeBoardId = this.workspace.loadHelp()
            renderBoard('help-request')
        })

        localStorage.load().then(loadedWorkspace => {
            console.log("loaded")
            console.log(loadedWorkspace)
            this.workspace.changeWorkspace(loadedWorkspace)
            this.activeBoardId = this.workspace.getSomeBoard().id
        }).catch(reason => {
            console.log(reason)
        }).finally(() => {
            renderBoard("init render")
        })
        
    }
}