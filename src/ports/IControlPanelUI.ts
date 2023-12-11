type ControlPanelEvent = "initialized" | "change-board-request" | "rename-board-request" | "add-board-request" | "remove-board-request" | "export-request" | "import-request" | "help-request"

type ControlPanelData = {
    activeBoard: BoardId
} | null

interface IControlPanelUI{
    on(event: ControlPanelEvent, callback: (data: ControlPanelData) => void): void
    render(boards: Board[], activeBoardId: BoardId): void
}