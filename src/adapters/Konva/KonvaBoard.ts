class KonvaBoard implements IBoardUI{
    private eventBehaviour: EventBehaviour<BoardEvent, BoardData>
    private boardElement: HTMLElement

    private stage: any
    private backgroundLayer: any
    private noteLayer: any

    constructor(){
        this.eventBehaviour = new EventBehaviour()

        const body = DOMHelper.getBody()

        this.boardElement = document.createElement("div")
        this.boardElement.id = "konva-container"
        body.appendChild(this.boardElement)

        this.boardElement.addEventListener("resize", () => {
            console.log("resizing")
            
        })

        this.stage = new Konva.Stage({
            container: "konva-container",
            width: window.innerWidth,
            height: window.innerHeight*7,
            scrollable: true
        })
        this.backgroundLayer = new Konva.Layer()
        this.noteLayer = new Konva.Layer()

        this.stage.add(this.backgroundLayer)
        this.stage.add(this.noteLayer)
    }

    on(event: BoardEvent, callback: (data: BoardData) => void): void {
        this.eventBehaviour.on(event, callback)
    }

    render(workspace: WorkspacePrimitive): void {
        const space = this.stage.width() / workspace.width
        const heightCount = this.stage.height()/space

        console.log(space)
        console.log(heightCount)
        for(let i = 0; i < workspace.width; i++){
            for(let j = 0; j < heightCount; j++){
                const dot = new Konva.Circle({
                    x: i*space + space/2,
                    y: j*space + space/2,
                    radius: 1,
                    fill: "#1b6e40",
                })
                this.backgroundLayer.add(dot)
            }
        }
    }

    private emit(event: BoardEvent, data: BoardData){
        this.eventBehaviour.emit(event, data)
    }
}