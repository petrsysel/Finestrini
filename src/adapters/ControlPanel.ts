class ControlPanel implements IControlPanelUI{
    element: HTMLElement
    constructor(){
        this.element = document.createElement('div')
        document.getElementsByTagName("body")[0].appendChild(this.element)
        this.init()
    }

    private async init(){
        console.log("initializing")
        this.element.innerHTML = await AjaxLoader.load("templates/ControlPanel.html")

        
    }

    on(event: ControlPanelEvent, callback: (data: ControlPanelData) => void): void {
        
    }

    render(boards: Board[]): void {
        
    }
}