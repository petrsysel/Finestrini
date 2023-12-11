class DOMHelper{
    static get(id: string){
        return document.getElementById(id) as HTMLElement
    }

    static getBody(){
        return document.getElementsByTagName("body")[0]
    }
}