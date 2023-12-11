function main(){
    const localStorage = {} as IWorkspaceRepository
    const externalStorage = {} as IWorkspaceRepository
    const controlPanel = new ControlPanel()
    const confirmDialogue = new ConfirmDialogue()
    const inputDialogue = new InputDialogue()
    const richTextDialogue = {} as IDialogueUI<string>
    const colorDialogue = {} as IDialogueUI<NoteColor>
    const board = {} as IBoardUI

    const app = new App(
        localStorage,
        externalStorage,
        controlPanel,
        confirmDialogue,
        inputDialogue,
        richTextDialogue,
        colorDialogue,
        board
    )
} 