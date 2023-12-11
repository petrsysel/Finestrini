type ShapeColor = {
    color: NoteColor,
    fill: string,
    stroke: string
}
class Color{
    static colors: ShapeColor[] = [
        {
            color: " pink",
            fill: "#FFC5C5",
            stroke: "#FFEBD8"
        },
        {
            color: "blue",
            fill: "#F1F0E8",
            stroke: "#D7E5CA"
        },
        {
            color: "green",
            fill: "#ECE3CE",
            stroke: "#739072"
        },
        {
            color: "orange",
            fill: "#FCDDB0",
            stroke: "#FF9F9F"
        },
        {
            color: "purple",
            fill: "#DEBACE",
            stroke: "#65647C"
        },
        {
            color: "red",
            fill: "#F8C4B4",
            stroke: "#B06161"
        },
        {
            color: "yellow",
            fill: "#F6FDC3",
            stroke: "#FFCF96"
        }
    ]
    static get(color: NoteColor){
        return this.colors.find(c => c.color == color)!
    }
    static getFill(color: NoteColor){
        return this.get(color).fill
    }
    static getStroke(color: NoteColor){
        return this.get(color).stroke
    }
    static random(){
        return this.colors[Math.floor(Math.random()*this.colors.length)]
    }
}