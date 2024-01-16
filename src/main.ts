import { ColorDialogue } from "./adapters/ColorDialogue"
import { ConfirmDialogue } from "./adapters/ConfirmDialogue"
import { ControlPanel } from "./adapters/ControlPanel"
import { ExternalStorage } from "./adapters/ExternalStorage"
import { HTMLBoard } from "./adapters/HTMLBoard"
import { InputDialogue } from "./adapters/InputDialogue"
import { KonvaBoard } from "./adapters/Konva/KonvaBoard"
import { LocalStorage } from "./adapters/LocalStorage"
import { QuillContentParser } from "./adapters/QuillContentParser"
import { QuillEditor } from "./adapters/QuillEditor"
import { App } from "./core/App"
import { NoteColor } from "./core/WorkspaceTypes"
import { IDialogueUI } from "./ports/IDialogueUI"
import { IWorkspaceRepository } from "./ports/IWorkspaceRepository"

function main(){
    const localStorage = new LocalStorage()
    const externalStorage = new ExternalStorage()
    const controlPanel = new ControlPanel()
    const confirmDialogue = new ConfirmDialogue()
    const inputDialogue = new InputDialogue()
    const richTextDialogue = new QuillEditor()
    const colorDialogue = new ColorDialogue()
    const contentParser = new QuillContentParser()
    const board = new HTMLBoard(contentParser)

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