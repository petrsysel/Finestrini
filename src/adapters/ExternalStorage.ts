import { WorkspacePrimitive } from "../core/WorkspaceTypes";
import { IWorkspaceRepository } from "../ports/IWorkspaceRepository";
import { DOMHelper } from "../utility/DOMHelper";

export class ExternalStorage implements IWorkspaceRepository{
    downloadElement: HTMLAnchorElement
    loadElement: HTMLInputElement

    constructor(){
        this.downloadElement = DOMHelper.create('a') as HTMLAnchorElement
        this.loadElement = DOMHelper.create('input') as HTMLInputElement
        this.loadElement.type = 'file'
        this.loadElement.accept = '.fini'
    }
    load(): Promise<WorkspacePrimitive> {
        this.loadElement.click()
        const failedLabel = "Failed to load file"
        
        return new Promise((resolve, reject) => {
            this.loadElement.onchange = e => {
                const fileList = this.loadElement.files;
                if(fileList){
                    const reader = new FileReader()
                    reader.readAsText(fileList[0])
                    reader.onload = function(){
                        try{
                            const workspace: WorkspacePrimitive = JSON.parse(reader.result as string)
                            resolve(workspace)
                        }
                        catch(e){
                            reject(failedLabel)
                        }
                    }
                    reader.onerror = () => {reject(failedLabel)}
                    reader.onabort = () => {reject(failedLabel)}
                }
            }
            this.loadElement.onerror = () => {reject(failedLabel)}
            this.loadElement.onabort = () => {reject(failedLabel)}
        })
    }
    save(workspace: WorkspacePrimitive): Promise<void> {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workspace));
        this.downloadElement.setAttribute("href", dataStr);
        this.downloadElement.setAttribute("download", "finestrini-workspace.fini");
        this.downloadElement.click();
        return new Promise((resolve, reject) => {
            resolve()
        })
    }
}