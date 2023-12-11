type DialogueEvent = "data-change"
type DialogueCanceled = undefined

interface IDialogueUI<T> {
    on(event: DialogueEvent, callback: (data: T) => void): void
    show(): Promise<T|DialogueCanceled>
}