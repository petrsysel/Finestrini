type WorkspacePrimitive = {
    boards: Board[],
    width: number
}

type Board = {
    id: BoardId,
    name: string,
    notes: Note[]
}

type NoteRect = {
    x: number,
    y: number,
    width: number,
    height: number
}

type NoteColor = "red" | "green" | "yellow" | "blue" | "purple" | " pink" | "orange"

type Note = {
    id: NoteId,
    content: string,
    color: NoteColor,
    rect: NoteRect
}

type BoardId = string
type NoteId = string