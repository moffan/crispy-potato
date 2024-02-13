import { Notice, Plugin, WorkspaceLeaf } from "obsidian";
import {
	DEFAULT_SETTINGS,
	CrispyPotatoPluginSettings,
	CrispyPotatoSettingTab,
} from "./settings";
import { GitHub } from "./utils/octokit";
import { IssueManagementView, VIEW_TYPE_ISSUE_MANAGEMENT } from "./issue-management"

export default class CrispyPotatoPlugin extends Plugin {
	settings: CrispyPotatoPluginSettings;
	github: GitHub

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new CrispyPotatoSettingTab(this.app, this));

		this.github = new GitHub(this.settings);
		const user = await this.github?.login();

		this.registerView(
			VIEW_TYPE_ISSUE_MANAGEMENT,
			(leaf) => {
				const options = {
					github: this.github, settings: this.settings
				}
				return new IssueManagementView(leaf, options)
			}
		);

		this.addRibbonIcon(
			"kanban-square",
			"Crispy Potato",
			() => {
				this.activateIssueManagementView();
			}
		);

		this.addStatusBarItem().setText(!!user ? "Logged in as: " + user : "Not logged in");
	}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async activateIssueManagementView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;
		const leaves = workspace.getLeavesOfType(VIEW_TYPE_ISSUE_MANAGEMENT);

		if (leaves.length > 0) {
			// A leaf with our view already exists, use that
			leaf = leaves[0];
		} else {
			// Our view could not be found in the workspace, create a new leaf
			// in the right sidebar for it
			leaf = workspace.getRightLeaf(false);
			await leaf.setViewState({ type: VIEW_TYPE_ISSUE_MANAGEMENT, active: true });
		}

		// "Reveal" the leaf in case it is in a collapsed sidebar
		workspace.revealLeaf(leaf);
	}

}
