class AjaxLoader {
    static load(path: string): Promise<string>{
        return new Promise((resolve, reject) => {
            const httpRequest = new XMLHttpRequest()

            httpRequest.onload = function(ev){
                resolve(this.responseText)
            }
            httpRequest.onerror = ev => reject()
            httpRequest.onabort = ev => reject()

            httpRequest.open('GET', path, true)
            httpRequest.send()
        })
    }
}