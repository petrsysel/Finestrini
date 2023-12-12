export type DialogueEvent = "data-change"
export type DialogueCanceled = undefined

export interface IDialogueUI<T> {
    on(event: DialogueEvent, callback: (data: T) => void): void
    show(): Promise<T|DialogueCanceled>
}