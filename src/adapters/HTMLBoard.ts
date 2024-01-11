import { Board } from "../core/WorkspaceTypes";
import { BoardData, BoardEvent, IBoardUI } from "../ports/IBoardUI";
import { AjaxLoader } from "../utility/AjaxLoader";
import { DOMHelper } from "../utility/DOMHelper";

export class HTMLBoard implements IBoardUI {
    boardElement: HTMLElement
    boardContainer: HTMLElement

    constructor(){

        this.boardContainer = DOMHelper.createDiv()
        this.boardContainer.innerHTML = AjaxLoader.load('templates/HtmlBoard.html')
        DOMHelper.getBody().appendChild(this.boardContainer)

        this.boardElement = document.getElementById('html-board') as HTMLElement
        console.log(this.boardElement)

        // DOMHelper.getBody().appendChild(this.boardElement)
    }

    on(event: BoardEvent, callback: (data: BoardData) => void): void {
        
    }

    render(board: Board, widthDots: number): void {
        console.log("Rendering board...")
        this.renderBackground(widthDots)
    }

    private renderBackground(width: number){
        console.log("width")
        console.log(this.boardElement.clientWidth)

        const tileSize = this.boardElement.clientWidth / width

        this.boardElement.style.background = 'white'
        this.boardElement.style.backgroundImage = 'radial-gradient(black 1px, transparent 0)'
        this.boardElement.style.backgroundSize = `${tileSize}px ${tileSize}px`
        // this.boardElement.style.backgroundPosition = '-19px -19px'

        // background: white;
        // background-image: radial-gradient(black 1px, transparent 0);
        // background-size: 40px 40px;
        // background-position: -19px -19px;
    }
}