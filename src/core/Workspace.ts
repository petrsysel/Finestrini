import { AjaxLoader } from "../utility/AjaxLoader"
import { Board, BoardId, Note, NoteColor, NoteId, NoteRect, WorkspacePrimitive } from "./WorkspaceTypes"
import { WorkspaceUtility } from "./WorkspaceUtility"

export class Workspace{
    private primitive: WorkspacePrimitive
    
    constructor(){
        this.primitive = {
            boards: [],
            width: 45
        }
    }

    createBoard(name: string): BoardId{
        const newBoard = {
            id: crypto.randomUUID(),
            name: name,
            notes: []
        }
        this.primitive.boards.push(newBoard)
        return newBoard.id
    }

    removeBoard(id: BoardId){
        this.primitive.boards = this.primitive.boards.filter(b => b.id != id)
    }

    renameBoard(id: BoardId, newName: string){
        this.primitive.boards = this.primitive.boards.map(b => {
            if(b.id == id) return {...b, ["name"]:newName}
            return b
        })
    }

    getSomeBoard(){
        if(this.primitive.boards.length === 0) this.createBoard("Finestrini")
        return this.primitive.boards[0]
    }

    getBoardList(){
        return [...this.primitive.boards]
    }

    createNote(boardId: BoardId, x: number, y: number){
        const board = this.primitive.boards.find(b => b.id == boardId)
        if(!board) return

        board.notes.push({
            id: crypto.randomUUID(),
            color: WorkspaceUtility.getRandomColor(),
            content: "{}",
            rect: {
                width: 10,
                height: 5,
                x: x,
                y: y
            }
        })
    }

    removeNote(boardId: BoardId, noteId: NoteId){
        this.primitive.boards.map(b => {
            if(b.id === boardId){
                b.notes = b.notes.filter(n => n.id != noteId)
            }
            return b
        })
    }

    changeNoteColor(boardId: BoardId, noteId: NoteId, color: NoteColor){
        let note = this.primitive.boards.find(b => b.id == boardId)?.notes.find(n => n.id == noteId)
        if(!note) return
        note.color = color
    }

    changeNoteContent(boardId: BoardId, noteId: NoteId, content: string){
        let note = this.primitive.boards.find(b => b.id == boardId)?.notes.find(n => n.id == noteId)
        if(!note) return
        note.content = content
    }
    
    changeNotePosition(boardId: BoardId, noteId: NoteId, x: number, y: number){
        let note = this.primitive.boards.find(b => b.id == boardId)?.notes.find(n => n.id == noteId)
        if(!note) return
        note.rect.x = x
        note.rect.y = y
    }

    changeNoteSize(boardId: BoardId, noteId: NoteId, width: number, height: number){
        let note = this.primitive.boards.find(b => b.id == boardId)?.notes.find(n => n.id == noteId)
        if(!note) return
        note.rect.width = width
        note.rect.height = height
    }

    changeNoteRect(boardId: BoardId, noteId: NoteId, rect: NoteRect){
        let note = this.primitive.boards.find(b => b.id == boardId)?.notes.find(n => n.id == noteId)
        if(!note) return
        note.rect = rect
    }

    getBoardById(boardId: BoardId){
        return this.primitive.boards.find(b => b.id == boardId)
    }

    getPrimitive(){
        return {...this.primitive}
    }
    getWidth(){
        return this.primitive.width
    }
    getNote(boardId: BoardId, noteId: NoteId): Note | undefined{
        const board = this.primitive.boards.find(b => b.id == boardId)
        if(!board) return undefined
        return board.notes.find(n => n.id === noteId)
    }

    changeWorkspace(workspace: WorkspacePrimitive){
        this.primitive = workspace
    }
    loadHelp(): BoardId{
        const helpBoardString = AjaxLoader.load('./templates/help.json')
        const board: Board = JSON.parse(helpBoardString)
        board.id = crypto.randomUUID()
        this.primitive.boards.push(board)
        return board.id
    }
}