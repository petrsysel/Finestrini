import { ConfirmDialogue } from "./adapters/ConfirmDialogue"
import { ControlPanel } from "./adapters/ControlPanel"
import { InputDialogue } from "./adapters/InputDialogue"
import { KonvaBoard } from "./adapters/Konva/KonvaBoard"
import { App } from "./core/App"
import { NoteColor } from "./core/WorkspaceTypes"
import { IDialogueUI } from "./ports/IDialogueUI"
import { IWorkspaceRepository } from "./ports/IWorkspaceRepository"

function main(){
    const localStorage = {} as IWorkspaceRepository
    const externalStorage = {} as IWorkspaceRepository
    const controlPanel = new ControlPanel()
    const confirmDialogue = new ConfirmDialogue()
    const inputDialogue = new InputDialogue()
    const richTextDialogue = {} as IDialogueUI<string>
    const colorDialogue = {} as IDialogueUI<NoteColor>
    const board = new KonvaBoard()

    const app = new App(
        localStorage,
        externalStorage,
        controlPanel,
        confirmDialogue,
        inputDialogue,
        richTextDialogue,
        colorDialogue,
        board
    )
} 

window.addEventListener("load", () => {
    main()
})