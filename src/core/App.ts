class App{
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

        controlPanel.on("rename-board-request", async data => {
            const newName = await inputDialogue.show()
            if(newName && newName.length != 0) this.workspace.renameBoard(this.activeBoardId, newName)
        })
        controlPanel.on("add-board-request", async data => {
            const name = await inputDialogue.show()
            if(!name || name.length == 0) return
            
            this.activeBoardId = this.workspace.createBoard(name)
            controlPanel.render(this.workspace.getBoardList(), this.activeBoardId)
        })
        controlPanel.on("remove-board-request", data => {
            this.workspace.removeBoard(this.activeBoardId)
            this.activeBoardId = this.workspace.getSomeBoard().id
        })
        controlPanel.on("change-board-request", data => {
            if(data) this.activeBoardId = data.activeBoard
            controlPanel.render(this.workspace.getBoardList(), this.activeBoardId)
        })

        controlPanel.render(this.workspace.getBoardList(), this.activeBoardId)
        
        // board.render(initBoard)
    }
}