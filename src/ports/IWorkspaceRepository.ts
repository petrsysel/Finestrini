import { WorkspacePrimitive } from "../core/WorkspaceTypes"

export interface IWorkspaceRepository{
    save(workspace: WorkspacePrimitive): Promise<void>
    load(): Promise<WorkspacePrimitive>
    lastSave(): string
}