import { NoteColor } from "./WorkspaceTypes"

export class WorkspaceUtility{
    static getRandomColor(): NoteColor{
        const colors: NoteColor[] = ["red", "green", "yellow", "blue", "purple", " pink", "orange"]
        return colors[Math.floor(Math.random() * colors.length)]
    }
}