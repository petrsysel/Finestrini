import { Board, Note, NoteRect } from "../core/WorkspaceTypes";
import { BoardData, BoardEvent, IBoardUI } from "../ports/IBoardUI";
import { AjaxLoader } from "../utility/AjaxLoader";
import { Color } from "../utility/Color";
import { DOMHelper } from "../utility/DOMHelper";
import { EventBehaviour } from "../utility/EventBehaviour";

export class HTMLBoard implements IBoardUI {
    boardElement: HTMLElement
    boardContainer: HTMLElement
    signal: EventBehaviour<BoardEvent, BoardData>
    addNoteButton: HTMLAnchorElement

    constructor(){
        this.signal = new EventBehaviour()

        this.boardContainer = DOMHelper.createDiv()
        this.boardContainer.innerHTML = AjaxLoader.load('templates/HtmlBoard.html')
        DOMHelper.getBody().appendChild(this.boardContainer)

        this.boardElement = document.getElementById('html-board') as HTMLElement
        this.addNoteButton = DOMHelper.get('add-note-button') as HTMLAnchorElement
        this.addNoteButton.addEventListener('click', () => {
            this.emit('add-note-request', null)
        })

        new ResizeObserver(() => {
            this.emit('board-resize-request', null)
        }).observe(this.boardElement)

        // DOMHelper.getBody().appendChild(this.boardElement)
    }

    on(event: BoardEvent, callback: (data: BoardData) => void): void {
        this.signal.on(event, callback)
    }

    private emit(event: BoardEvent, data: BoardData){
        this.signal.emit(event, data)
    }

    render(board: Board, boardWidth: number): void {
        this.renderBackground(boardWidth)
        this.boardElement.innerHTML = ""
        console.log(board.notes)
        board.notes.forEach(note => {
            this.renderNote(note, boardWidth)
        })
    }

    private renderBackground(width: number){
        const tileSize = this.getTileWidth(width)

        this.boardElement.style.background = 'white'
        this.boardElement.style.backgroundImage = 'radial-gradient(black 1px, transparent 0)'
        this.boardElement.style.backgroundSize = `${tileSize}px ${tileSize}px`
    }

    private renderNote(note: Note, boardWidth: number){
        const noteElement = DOMHelper.create('div')
        noteElement.classList.add('note')

        const tileWidth = this.getTileWidth(boardWidth)

        noteElement.style.left = `${note.rect.x * tileWidth - tileWidth/2}px`
        noteElement.style.top = `${note.rect.y * tileWidth - tileWidth/2}px`

        noteElement.style.width = `${note.rect.width * tileWidth - 6}px`
        noteElement.style.height = `${note.rect.height * tileWidth - 6}px`

        noteElement.style.borderRadius = `${tileWidth/3}px`
        noteElement.style.backgroundColor = Color.get(note.color).fill
        const borderColor = Color.get(note.color).stroke
        noteElement.style.border = `3px solid ${borderColor}`

        const innerContainer = DOMHelper.createDiv()
        innerContainer.classList.add('inner-note')
        noteElement.appendChild(innerContainer)

        const resizer = DOMHelper.createDiv()
        resizer.classList.add('resizer')
        resizer.style.backgroundColor = Color.get(note.color).stroke
        innerContainer.appendChild(resizer)

        const mover = DOMHelper.createDiv()
        mover.classList.add('mover')
        mover.style.backgroundColor = Color.get(note.color).stroke
        innerContainer.appendChild(mover)

        const startWidth = this.pxToNumber(noteElement.style.width)
        const startHeight = this.pxToNumber(noteElement.style.height)
        this.moveElement(resizer,
            // onMove
            (dx, dy) => {
                noteElement.style.width = `${startWidth + dx}px`
                noteElement.style.height = `${startHeight + dy}px`
            },
            // onDragEnd
            (dx, dy) => {
                const tileWidth = this.getTileWidth(boardWidth)
                const newRect: NoteRect = {
                    x: note.rect.x,
                    y: note.rect.y,
                    width: Math.round(this.pxToNumber(noteElement.style.width) / tileWidth),
                    height: Math.round(this.pxToNumber(noteElement.style.height) / tileWidth)
                }
                this.emit('change-note-size-request', {
                    rect: newRect,
                    operatingNoteId: note.id
                })
            }
        )


        this.boardElement.appendChild(noteElement);

        const startLeft = this.pxToNumber(noteElement.style.left)
        const startTop = this.pxToNumber(noteElement.style.top)

        this.moveElement(mover,
            // onMove
            (dx,dy) => {
                noteElement.style.left = `${startLeft + dx}px`
                noteElement.style.top = `${startTop + dy}px`
            },
            // onDragEnd
            (dx,dy) => {
                const tileWidth = this.getTileWidth(boardWidth)
                const newRect: NoteRect = {
                    x: Math.round((this.pxToNumber(noteElement.style.left) + tileWidth/2) / tileWidth),
                    y: Math.round((this.pxToNumber(noteElement.style.top) + tileWidth/2) / tileWidth),
                    width: note.rect.width,
                    height: note.rect.height
                }
                console.log(`x: ${newRect.x} y: ${newRect.y}`)
                console.log(note.id)
                this.emit('move-note-request', {
                    rect: newRect,
                    operatingNoteId: note.id
                })
            }
        )
    }

    private getTileWidth(boardWidth: number){
        const tileSize = this.boardElement.clientWidth / boardWidth
        return tileSize
    }

    private moveElement(element: HTMLElement, onMove: (dx:number, dy: number) => void, onDragEnd: (dx:number, dy: number) => void){
        let startX = 0
        let startY = 0

        // window.onmouseup = 
        element.addEventListener('mouseup', function(e){
            onDragEnd(e.clientX, e.clientY)
        })
        
        element.onmousedown = function(e){
            startX = e.clientX
            startY = e.clientY

            window.onmousemove = function(emove){
                onMove(emove.clientX - startX, emove.clientY - startY)
            }
        }
    }

    private pxToNumber(pxValue: string){
        return +(pxValue.replace('px', ''))
    }
}