export type DialogueEvent = "data-change"
export type DialogueCanceled = undefined

export interface IDialogueUI<T> {
    on(event: DialogueEvent, callback: (data: T) => void): void
    show(message?: string): Promise<T|DialogueCanceled>
}