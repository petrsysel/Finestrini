import { Board, Note, NoteRect } from "../core/WorkspaceTypes";
import { BoardData, BoardEvent, IBoardUI } from "../ports/IBoardUI";
import { IContentParser } from "../ports/IContentParser";
import { AjaxLoader } from "../utility/AjaxLoader";
import { Color } from "../utility/Color";
import { DOMHelper } from "../utility/DOMHelper";
import { EventBehaviour } from "../utility/EventBehaviour";

export class HTMLBoard implements IBoardUI {
    boardElement: HTMLElement
    boardContainer: HTMLElement
    signal: EventBehaviour<BoardEvent, BoardData>
    addNoteButton: HTMLAnchorElement
    noteContentParser: IContentParser

    listenerLayer: HTMLElement

    constructor(noteContentParser: IContentParser){
        this.noteContentParser = noteContentParser
        this.signal = new EventBehaviour()

        this.boardContainer = DOMHelper.createDiv()
        this.boardContainer.innerHTML = AjaxLoader.load('templates/HtmlBoard.html')
        DOMHelper.getBody().appendChild(this.boardContainer)

        this.boardElement = document.getElementById('html-board') as HTMLElement
        this.addNoteButton = DOMHelper.get('add-note-button') as HTMLAnchorElement
        // this.addNoteButton. onmouseup = () => {
        //     this.emit('add-note-request', {
        //         rect:{
        //             x:1,
        //             y:1,
        //             height:5,
        //             width:10
        //         },
        //         operatingNoteId: "---"
        //     })
        // }

        new ResizeObserver(() => {
            this.emit('board-resize-request', null)
        }).observe(this.boardElement)

        // DOMHelper.getBody().appendChild(this.boardElement)
        this.listenerLayer = DOMHelper.createDiv()
        this.boardElement.appendChild(this.listenerLayer)
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
        // console.log("rendering")
        this.updateAddButton(boardWidth)
        this.listenerLayer = DOMHelper.createDiv()
        this.listenerLayer.classList.add('listener-layer')
        this.boardElement.appendChild(this.listenerLayer)

        const tile = this.getTileWidth(boardWidth)

        board.notes.forEach(note => {
            this.renderNote(note, boardWidth)

            if((note.rect.y + note.rect.height)*tile > this.pxToNumber(this.boardElement.style.height) - 25*tile){
                this.increaseHeight()
            }
        })
        
    }

    private increaseHeight(){
        const height = this.pxToNumber(this.boardElement.style.height)
        this.boardElement.style.height = `${height + 1000}px`
    }

    private getScrollY(){
        return document.getElementsByClassName('board-container')[0].scrollTop
    }

    private updateAddButton(boardWidth: number){
        const tile = this.getTileWidth(boardWidth)
        
        this.addNoteButton.onmousedown = () => {
            this.emit('add-note-request', {
                rect:{
                    x:boardWidth/2- 5,
                    y: this.getScrollY()/tile + (innerHeight/2)/tile - 5,
                    height:5,
                    width:10
                },
                operatingNoteId: "---"
            })
        }
    }

    private renderBackground(width: number){
        const tileSize = this.getTileWidth(width)

        this.boardElement.style.background = 'transparent'
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
        const contentHolder = DOMHelper.createDiv()
        const content = JSON.parse(note.content)
        contentHolder.innerHTML = this.noteContentParser.parse(JSON.stringify(content))
        
        contentHolder.classList.add('note-content-holder')
        innerContainer.appendChild(contentHolder)

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

        this.renderControls(note, innerContainer)

        ;(noteElement as HTMLElement).addEventListener('dblclick', () => {
            const data: BoardData = {
                operatingNoteId: note.id,
                rect: note.rect
            }
            this.emit('change-note-content-request', data)
        })

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

        this.listenerLayer.appendChild(noteElement);

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
                this.emit('move-note-request', {
                    rect: newRect,
                    operatingNoteId: note.id
                })
            }
        )
    }

    private renderControls(note: Note, element: HTMLElement){
        const controlContainer = DOMHelper.createDiv()
        controlContainer.classList.add('note-controls-container')

        const editButton = DOMHelper.create('a') as HTMLAnchorElement
        const editImage = DOMHelper.create('img') as HTMLImageElement
        editImage.style.backgroundColor = Color.get(note.color).fill
        editImage.style.borderRadius = '100px'
        editImage.style.border = `3px solid ${Color.get(note.color).stroke}`
        editImage.src = "./icons/edit100.png"
        editButton.appendChild(editImage)
        controlContainer.appendChild(editButton)

        const colorButton = DOMHelper.create('a') as HTMLAnchorElement
        const colorImage = DOMHelper.create('img') as HTMLImageElement
        colorImage.style.backgroundColor = Color.get(note.color).fill
        colorImage.style.borderRadius = '100px'
        colorImage.style.border = `3px solid ${Color.get(note.color).stroke}`
        colorImage.src = "./icons/colorpicker100.png"
        colorButton.appendChild(colorImage)
        controlContainer.appendChild(colorButton)

        const removeButton = DOMHelper.create('a') as HTMLAnchorElement
        const removeImage = DOMHelper.create('img') as HTMLImageElement
        removeImage.style.backgroundColor = Color.get(note.color).fill
        removeImage.style.borderRadius = '100px'
        removeImage.style.border = `3px solid ${Color.get(note.color).stroke}`
        removeImage.src = "./icons/remove100.png"
        removeButton.appendChild(removeImage)
        controlContainer.appendChild(removeButton)

        element.appendChild(controlContainer)

        controlContainer.addEventListener('mouseup', e => {e.stopPropagation()}, false)
        removeButton.addEventListener('click', e => {
            const data: BoardData = {
                operatingNoteId: note.id,
                rect: note.rect
            }
            this.emit('remove-note-request', data)
        })
        colorButton.addEventListener('click', () => {
            const data: BoardData = {
                operatingNoteId: note.id,
                rect: note.rect
            }
            this.emit('change-note-color-request', data)
        })
        editButton.addEventListener('click', () => {
            const data: BoardData = {
                operatingNoteId: note.id,
                rect: note.rect
            }
            this.emit('change-note-content-request', data)
        })
    }

    private getTileWidth(boardWidth: number){
        const tileSize = this.boardElement.clientWidth / boardWidth
        return tileSize
    }

    private moveElement(element: HTMLElement, onMove: (dx:number, dy: number) => void, onDragEnd: (dx:number, dy: number) => void){
        let startX = 0
        let startY = 0

        let dragStart = false

        // const mouseupListener = 
        // window.onmouseup = mouseupListener
        this.listenerLayer.addEventListener('mouseup', function(e: MouseEvent){
            if(dragStart) dragStart = false
            else return
            onDragEnd(e.clientX - startX, e.clientY - startY)
        }, false)
        
        element.onmousedown = function(e){
            startX = e.clientX
            startY = e.clientY
            dragStart = true

            window.onmousemove = function(emove){
                onMove(emove.clientX - startX, emove.clientY - startY)
            }
        }
    }

    private pxToNumber(pxValue: string){
        return +(pxValue.replace('px', ''))
    }
}