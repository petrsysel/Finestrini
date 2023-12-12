export class EventBehaviour<Emits, Provides>{
    private _listeners: {event: Emits, callback: (data:Provides) => void}[]

    constructor(){
        this._listeners = []
    }
    emit(event: Emits, data: Provides){
        this._listeners.forEach(listener => {
            if(listener.event == event){
                listener.callback(data)
            }
        })
    }
    on(event: Emits, callback: (data:Provides) => void){
        this._listeners.push({event: event, callback: callback})
    }
}