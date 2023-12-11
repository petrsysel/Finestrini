type BoardEvent = "add-note-request" | "remove-note-request" | "move-note-request" | "change-note-size-request" | "change-note-color-request" | "change-note-content-request"

type BoardData = {
    operatingNoteId: NoteId,
    rect: NoteRect
}

interface IBoardUI{
    on(event: BoardEvent, callback: (data: BoardData) => void): void
    render(workspace: WorkspacePrimitive): void
}