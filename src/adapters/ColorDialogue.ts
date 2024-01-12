import { NoteColor } from "../core/WorkspaceTypes"
import { DialogueEvent, IDialogueUI } from "../ports/IDialogueUI"
import { AjaxLoader } from "../utility/AjaxLoader"
import { Color } from "../utility/Color"
import { DOMHelper } from "../utility/DOMHelper"
import { EventBehaviour } from "../utility/EventBehaviour"

export class ColorDialogue implements IDialogueUI<NoteColor>{
    private eventBehaviour: EventBehaviour<DialogueEvent, NoteColor>

    private windowElement: HTMLElement

    private closeButton: HTMLElement
    private dialogueLabel: HTMLElement
    private colorContainer: HTMLElement

    constructor(){
        this.eventBehaviour = new EventBehaviour()

        const body = DOMHelper.getBody()

        this.windowElement = document.createElement("div")
        body.appendChild(this.windowElement)
        this.windowElement.innerHTML = AjaxLoader.load("./templates/ColorDialogue.html")

        this.colorContainer = DOMHelper.get('color-container')
        this.closeButton = DOMHelper.get("color-dialogue-close-btn")
        this.dialogueLabel = DOMHelper.get("confirm-dialogue-label")

        this.hide()
    }
    
    on(event: "data-change", callback: (data: NoteColor) => void): void {
        this.eventBehaviour.on(event, callback)
    }

    show(message: string): Promise<NoteColor | undefined> {
        this.windowElement.style.display = "block"
        this.colorContainer.innerHTML = ""
        if(message) this.dialogueLabel.innerHTML = message
        
        return new Promise((resolve, reject) => {
            Color.colors.forEach(color => {
                const colorDiv = DOMHelper.createDiv()
                colorDiv.classList.add('pickable-color')
                colorDiv.style.backgroundColor = color.fill
                colorDiv.style.border = `3px solid ${color.stroke}`
    
                this.colorContainer.appendChild(colorDiv)

                colorDiv.addEventListener('click', () => {
                    this.hide()
                    resolve(color.color)
                })
            })

            this.closeButton.addEventListener("click", () => {
                this.hide()
                resolve(undefined)
            })
        })
    }

    private emit(event: DialogueEvent, data: NoteColor){
        this.eventBehaviour.emit(event, data)
    }

    private hide(){
        this.windowElement.style.display = "none"
    }
}