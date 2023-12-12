export class AjaxLoader {
    static load(path: string): string{
        const httpRequest = new XMLHttpRequest()

        httpRequest.open('GET', path, false)
        httpRequest.send()
        if(httpRequest.status === 200){
            return httpRequest.responseText
        }
        else throw new Error(`Request failed: ${httpRequest.statusText}`)
    }
}