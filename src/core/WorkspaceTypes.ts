export type WorkspacePrimitive = {
    boards: Board[],
    width: number
}

export type Board = {
    id: BoardId,
    name: string,
    notes: Note[]
}

export type NoteRect = {
    x: number,
    y: number,
    width: number,
    height: number
}

export type NoteColor = "red" | "green" | "yellow" | "blue" | "purple" | " pink" | "orange"

export type Note = {
    id: NoteId,
    content: string,
    color: NoteColor,
    rect: NoteRect
}

export type BoardId = string
export type NoteId = string