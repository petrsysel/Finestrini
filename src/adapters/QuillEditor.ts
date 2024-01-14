// import Quill, { QuillOptionsStatic } from "quill"
import Quill from "quill"
import { NoteColor } from "../core/WorkspaceTypes"
import { DialogueEvent, IDialogueUI } from "../ports/IDialogueUI"
import { AjaxLoader } from "../utility/AjaxLoader"
import { Color } from "../utility/Color"
import { DOMHelper } from "../utility/DOMHelper"
import { EventBehaviour } from "../utility/EventBehaviour"
import { QuillDeltaToHtmlConverter } from "quill-delta-to-html"

export class QuillEditor implements IDialogueUI<string>{
    private eventBehaviour: EventBehaviour<DialogueEvent, string>
    private windowElement: HTMLElement
    private closeButton: HTMLElement

    private quill: Quill

    constructor(){
        this.eventBehaviour = new EventBehaviour()

        const body = DOMHelper.getBody()

        

        this.windowElement = document.createElement("div")
        body.appendChild(this.windowElement)
        this.windowElement.innerHTML = AjaxLoader.load("./templates/RichTextDialogue.html")

        this.closeButton = DOMHelper.get("editor-dialogue-close-btn")

        const editorElement = DOMHelper.get('editor-container')

        const toolbarOptions = [
            ['bold', 'italic', 'underline', 'strike'],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            [{ 'indent': '-1'}, { 'indent': '+1' }],
          
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
          
            [{ 'color': [] }, { 'background': [] }],
            [{ 'align': [] }]
          ];     
        this.quill = new Quill('#editor-container', {
            modules: {
                toolbar: toolbarOptions
            },
            placeholder: 'Vlož svůj text...',
            theme: 'snow'
        })
        
        this.hide()
    }
    
    on(event: "data-change", callback: (data: string) => void): void {
        this.eventBehaviour.on(event, callback)
    }

    show(message: string): Promise<string | undefined> {
        this.windowElement.style.display = "block"
        try{
            this.quill.setContents(JSON.parse(message))
        }
        catch(e){

        }
        
        return new Promise((resolve, reject) => {
            this.closeButton.addEventListener("click", () => {
                this.hide()
                const delta = this.quill.getContents()
                
                resolve(JSON.stringify(delta))
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