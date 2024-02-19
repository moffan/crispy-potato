import { StrictMode } from "react";
import { ItemView, WorkspaceLeaf } from "obsidian";
import { Root, createRoot } from "react-dom/client";
import { ReactView } from "./react-view";
import { AppContext } from "./context";
import { GitHub } from "../utils/github"
import { CrispyPotatoPluginSettings } from "src/settings-tab";

export const VIEW_TYPE_ISSUE_MANAGEMENT = "issue-management-view";

interface IssueManagementViewOptions {
    github: GitHub, settings: CrispyPotatoPluginSettings
}

export class IssueManagementView extends ItemView {
    root: Root | null = null;

    constructor(leaf: WorkspaceLeaf, private options: IssueManagementViewOptions) {
        super(leaf);
    }

    getViewType() {
        return VIEW_TYPE_ISSUE_MANAGEMENT;
    }

    getDisplayText() {
        return "Issue management!";
    }

    public getIcon(): string {
        return "kanban-square";
    }

    async onOpen() {
        this.root = createRoot(this.containerEl.children[1]);
        this.root.render(
            <StrictMode>
                <AppContext.Provider value={{ app: this.app, ...this.options }} >
                    <ReactView />
                </AppContext.Provider>
            </StrictMode>
        );
    }

    async onClose() {
        this.root?.unmount();
    }
}