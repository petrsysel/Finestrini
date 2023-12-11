class ConfirmDialogue implements IDialogueUI<boolean>{
    private eventBehaviour: EventBehaviour<DialogueEvent, boolean>

    private windowElement: HTMLElement

    private yesButton: HTMLElement
    private noButton: HTMLElement
    private closeButton: HTMLElement

    constructor(){
        this.eventBehaviour = new EventBehaviour()

        const body = DOMHelper.getBody()

        this.windowElement = document.createElement("div")
        body.appendChild(this.windowElement)
        this.windowElement.innerHTML = AjaxLoader.load("./templates/ConfirmDialogue.html")

        this.yesButton = DOMHelper.get("confirm-dialogue-yes-btn")
        this.noButton = DOMHelper.get("confirm-dialogue-no-btn")
        this.closeButton = DOMHelper.get("confirm-dialogue-close-btn")

        this.hide()
    }
    
    on(event: "data-change", callback: (data: boolean) => void): void {
        this.eventBehaviour.on(event, callback)
    }

    show(): Promise<boolean | undefined> {
        this.windowElement.style.display = "block"

        return new Promise((resolve, reject) => {
            this.yesButton.addEventListener("click", () => {
                this.hide()
                resolve(true)
            })
            this.noButton.addEventListener("click", () => {
                this.hide()
                resolve(false)
            })
            this.closeButton.addEventListener("click", () => {
                this.hide()
                resolve(false)
            })
        })
    }

    private emit(event: DialogueEvent, data: boolean){
        this.eventBehaviour.emit(event, data)
    }

    private hide(){
        this.windowElement.style.display = "none"
    }
}