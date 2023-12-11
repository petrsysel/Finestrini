class ControlPanel implements IControlPanelUI{
    private eventBehaviour: EventBehaviour<ControlPanelEvent, ControlPanelData>
    private element: HTMLElement
    private activeBoardLabel: HTMLElement
    private boardDropdownContent: HTMLElement
    
    private addBoardBtn: HTMLElement
    private renameBoardBtn: HTMLElement
    private removeBoardBtn: HTMLElement

    constructor(){
        this.eventBehaviour = new EventBehaviour()
        this.element = document.createElement('div')
        document.getElementsByTagName("body")[0].appendChild(this.element)
        
        this.element.innerHTML = AjaxLoader.load("templates/ControlPanel.html")
        this.activeBoardLabel = DOMHelper.get("active-board-label")
        this.boardDropdownContent = DOMHelper.get("board-dropdown-content")

        this.addBoardBtn = DOMHelper.get("add-board-btn")
        this.addBoardBtn.addEventListener("click", () => {
            this.emit("add-board-request", null)
        })

        this.renameBoardBtn = DOMHelper.get("rename-board-btn")
        this.renameBoardBtn.addEventListener("click", () => {
            this.emit("rename-board-request", null)
        })

        this.removeBoardBtn = DOMHelper.get("remove-board-btn")
        this.removeBoardBtn.addEventListener("click", () => {
            this.emit("remove-board-request", null)
        })
    }

    on(event: ControlPanelEvent, callback: (data: ControlPanelData) => void): void {
        this.eventBehaviour.on(event, callback)
    }

    private emit(event: ControlPanelEvent, data: ControlPanelData){
        this.eventBehaviour.emit(event, data)
    }

    render(boards: Board[], activeBoardId: BoardId): void {
        const board = boards.find(b => b.id == activeBoardId)
        if(!board) return
        const dropdownBoards = boards.filter(b => b.id !=activeBoardId)

        this.boardDropdownContent.innerHTML = ""
        dropdownBoards.forEach(b => {
            const boardSelect = document.createElement("p")
            boardSelect.innerHTML = b.name
            boardSelect.addEventListener("click", () => this.eventBehaviour.emit("change-board-request", {
                activeBoard: b.id
            }))
            this.boardDropdownContent.appendChild(boardSelect)
        })
        this.activeBoardLabel.innerHTML = board.name
    }
}