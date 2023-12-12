import { Board, BoardId } from "../core/WorkspaceTypes"

export type ControlPanelEvent = "initialized" | "change-board-request" | "rename-board-request" | "add-board-request" | "remove-board-request" | "export-request" | "import-request" | "help-request"

export type ControlPanelData = {
    activeBoard: BoardId
} | null

export interface IControlPanelUI{
    on(event: ControlPanelEvent, callback: (data: ControlPanelData) => void): void
    render(boards: Board[], activeBoardId: BoardId): void
}