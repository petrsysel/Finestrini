import Konva from "konva"
import { BoardData, BoardEvent, IBoardUI } from "../../ports/IBoardUI"
import { AjaxLoader } from "../../utility/AjaxLoader"
import { DOMHelper } from "../../utility/DOMHelper"
import { EventBehaviour } from "../../utility/EventBehaviour"
import { Board } from "../../core/WorkspaceTypes"
import { Color } from "../../utility/Color"

export type KonvaData = {
    space: number,
    widthDots: number,
    cornerRadius: number,
    offset: number
}

export class KonvaBoard implements IBoardUI{
    private eventBehaviour: EventBehaviour<BoardEvent, BoardData>
    private boardElement: HTMLElement
    private addNoteElement: HTMLElement

    private stage: any
    private backgroundLayer: any
    private noteLayer: any

    private widthDots: number | undefined

    private data: KonvaData

    constructor(){
        this.eventBehaviour = new EventBehaviour()

        const body = DOMHelper.getBody()

        this.boardElement = document.createElement("div")
        this.boardElement.id = "konva-container"
        body.appendChild(this.boardElement)

        this.data = this.calculateKonvaData(20, window.innerWidth)

        this.boardElement.addEventListener("resize", () => {
            console.log("resizing")
        })

        this.addNoteElement = DOMHelper.createDiv()
        this.addNoteElement.innerHTML = AjaxLoader.load("./templates/KonvaBoard.html")
        body.appendChild(this.addNoteElement)
        this.addNoteElement.addEventListener("click", () => {
            this.emit("add-note-request", null)
        })

        this.stage = new Konva.Stage({
            container: "konva-container",
            width: window.innerWidth,
            height: window.innerHeight*0,
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

    render(board: Board, widthDots: number): void {
        if(!this.widthDots){
            console.log("rendering background")
            this.data = this.calculateKonvaData(widthDots, window.innerWidth)
            this.renderBackground(widthDots)
        }
        this.widthDots = widthDots
        
        board.notes.forEach(b => {
            const color = Color.random()
            const rect = new Konva.Rect({
                x: b.rect.x * this.data.space + this.data.offset,
                y: b.rect.y * this.data.space + this.data.offset,
                width: b.rect.width * this.data.space,
                height: b.rect.height * this.data.space,
                fill: color.fill,
                stroke: color.stroke,
                cornerRadius: this.data.cornerRadius,
                draggable: true,
                content: "Hello"
            })
            console.log(rect)
            this.noteLayer.add(rect)
        })
        
    }

    private renderBackground(widthDots: number){
        this.backgroundLayer.destroyChildren()
        const space = this.stage.width() / widthDots
        const heightCount = this.stage.height()/space

        console.log(space)
        console.log(heightCount)
        for(let i = 0; i < widthDots; i++){
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

    private calculateKonvaData(widthDots: number, boardWidth: number): KonvaData{
        const space = boardWidth / widthDots
        return {
            space: space,
            widthDots:widthDots,
            cornerRadius: space/2,
            offset: space/2
        }
    }
}