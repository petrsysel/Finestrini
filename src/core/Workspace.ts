class Workspace{
    private primitive: WorkspacePrimitive
    
    constructor(){
        this.primitive = {
            boards: [],
            width: 20
        }
    }

    createBoard(name: string){
        this.primitive.boards.push({
            id: crypto.randomUUID(),
            name: name,
            notes: []
        })
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
        if(this.primitive.boards.length === 0) this.createBoard("Finestrino")
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
            content: "",
            rect: {
                width: 6,
                height: 4,
                x: x,
                y: y
            }
        })
    }
}