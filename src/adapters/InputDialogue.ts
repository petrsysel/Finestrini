class InputDialogue implements IDialogueUI<string>{
    private dialogueElement: HTMLElement
    private okButtonElement: HTMLElement
    private closeButtonElement: HTMLElement
    private inputElement: HTMLInputElement

    constructor(){
        this.dialogueElement = document.createElement("div")
        this.dialogueElement.innerHTML = AjaxLoader.load("./templates/InputDialogue.html")
        const body = DOMHelper.getBody()
        body.appendChild(this.dialogueElement)

        this.okButtonElement = DOMHelper.get("input-dialogue-ok-btn")
        this.closeButtonElement = DOMHelper.get("input-dialogue-close-btn")
        this.inputElement = DOMHelper.get("dialogue-user-input") as HTMLInputElement

        this.hide()
    }
    on(event: "data-change", callback: (data: string) => void): void {
        
    }
    show(): Promise<string|DialogueCanceled> {
        this.dialogueElement.style.display = "block"
        this.inputElement.value = ""
        return new Promise((resolve, reject) => {
            this.okButtonElement.addEventListener("click", () => {
                this.hide()
                resolve(this.inputElement.value)
            })
            this.closeButtonElement.addEventListener("click", () => {
                this.hide()
                resolve(undefined)
            })
        })
    }

    private hide(){
        this.dialogueElement.style.display = "none"
    }
}