import { WorkspacePrimitive } from "../core/WorkspaceTypes";
import { IWorkspaceRepository } from "../ports/IWorkspaceRepository";

export class LocalStorage implements IWorkspaceRepository{
    storageKey: string
    private lastSaved: string
    constructor(){
        this.storageKey = 'finestrini-storage'
        this.lastSaved = ""
    }
    load(): Promise<WorkspacePrimitive> {
        const failedLabel = "Cannot load backup..."
        console.log("loading")
        return new Promise((resolve, reject) => {
            const item = localStorage.getItem(this.storageKey)
            if(item){
                try{

                    const workspace: WorkspacePrimitive = JSON.parse(item)
                    resolve(workspace)
                }
                catch(e){
                    reject(failedLabel)
                }
            }
            else{
                reject(failedLabel)
            }
        })
    }
    save(workspace: WorkspacePrimitive): Promise<void> {
        // console.log(`Saving... ${Date.now()}`)
        const stringWorkspace = JSON.stringify(workspace)
        localStorage.setItem(this.storageKey, stringWorkspace)
        return new Promise((resolve, reject) => {
            const date = new Date()
            this.lastSaved = `${date.getHours()}:${date.getMinutes()}`
            resolve()
        })
    }

    lastSave(){
        return this.lastSaved
    }
}