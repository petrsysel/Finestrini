type DialogueEvent = "data-change"

interface IDialogueUI<T> {
    on(event: DialogueEvent, callback: (data: T) => void): void
    show(): Promise<T>
}