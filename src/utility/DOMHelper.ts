class DOMHelper{
    static get(id: string){
        return document.getElementById(id) as HTMLElement
    }

    static getBody(){
        return document.getElementsByTagName("body")[0]
    }

    static createDiv(){
        return this.create("div")
    }
    static create(tagname: keyof HTMLElementTagNameMap){
        return document.createElement(tagname)
    }

}