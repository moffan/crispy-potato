import { PluginSettingTab, App, Setting } from "obsidian";
import type { CrispyPotatoPlugin } from "./plugin";

export interface CrispyPotatoPluginSettings {
	auth: string;
	issueFolder: string;
	owner: string;
	repo: string;
}

export const DEFAULT_SETTINGS: CrispyPotatoPluginSettings = {
	auth: "",
	issueFolder: "issues",
	owner: "",
	repo: "",
};

export class CrispyPotatoSettingTab extends PluginSettingTab {
	plugin: CrispyPotatoPlugin;

	constructor(app: App, plugin: CrispyPotatoPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Github token")
			.setDesc("It's a secret")
			.addText((text) =>
				text
					.setPlaceholder("Enter your secret")
					.setValue(this.plugin.settings.auth)
					.onChange(async (value) => {
						this.plugin.settings.auth = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Issue folder")
			.setDesc("Where issues notes will be created")
			.addText((text) =>
				text
					.setPlaceholder("Issue folder path")
					.setValue(this.plugin.settings.issueFolder)
					.onChange(async (value) => {
						this.plugin.settings.issueFolder = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Owner")
			.setDesc("Owner of the repo")
			.addText((text) =>
				text
					.setPlaceholder("Repo owner")
					.setValue(this.plugin.settings.owner)
					.onChange(async (value) => {
						this.plugin.settings.owner = value;
						await this.plugin.saveSettings();
					})
			);

		new Setting(containerEl)
			.setName("Repo name")
			.setDesc("Name of repo to manage issues for")
			.addText((text) =>
				text
					.setPlaceholder("Repo name")
					.setValue(this.plugin.settings.repo)
					.onChange(async (value) => {
						this.plugin.settings.repo = value;
						await this.plugin.saveSettings();
					})
			);
	}
}
