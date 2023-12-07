interface IWorkspaceRepository{
    save(workspace: WorkspacePrimitive): Promise<void>
    load(): Promise<WorkspacePrimitive>
}