import { CrispyPotatoPluginSettings } from "../settings";
import { GitHub, GitHubIssues } from "./github";
import { removeSpecialChars } from "./string-utils";
import { TFile, Vault } from "obsidian";
import * as path from "path";
import * as yaml from "yaml";

export class IssueManagement {

    private readonly issueDataPath: string;

    constructor(private github: GitHub, private settings: CrispyPotatoPluginSettings, private vault: Vault) {
        this.issueDataPath = path.join(this.settings.issueFolder, "issues.json")

    }

    async downloadIssues() {
        let issueData = await this.getCachedIssues()
        if (!issueData) {
            debugger
            console.debug("getting issues from github")
            issueData = await this.github.getIssues()

            await this.createIssueFolderIfNotExists();
            const file = this.vault.getAbstractFileByPath(this.issueDataPath)
            if (!!file) {
                await this.vault.delete(file)
            }

            console.debug("creating issues meta data file");
            await this.vault.create(this.issueDataPath, JSON.stringify(issueData));
            console.debug("issue meta data file created")
        }

        this.saveIssuesToVault(issueData);
        if (!issueData) {
            throw new Error("Failed to download issues")
        }
    }

    private async getCachedIssues(): Promise<GitHubIssues | undefined> {
        const file: TFile = this.vault.getAbstractFileByPath(this.issueDataPath) as TFile;
        if (!file) {
            return undefined;
        }

        const data = await this.vault.read(file);

        return JSON.parse(data)
    }

    private async saveIssuesToVault(issues: GitHubIssues) {
        for (const issue of issues) {
            try {
                const { number, title: unsafeTitle, body,
                    created_at,
                    html_url,
                    labels: issueLabels,
                    milestone: issueMilestone,
                    state,
                    updated_at,
                } = issue;

                // filename 
                const title = removeSpecialChars(unsafeTitle)
                const issueFilename = `${number} - ${title}.md`;

                // properties
                const metaData = {
                    created_at,
                    github: html_url,
                    issue: number,
                    labels: issueLabels.map(l => typeof l === "string" ? l : l.name),
                    milestone: issueMilestone?.title,
                    state,
                    updated_at,
                }
                const metaDataString = `---\n${yaml.stringify(metaData)}\n---\n`;

                //content
                const content = body ?? "";


                // save
                const issueFilepath = path.join(this.settings.issueFolder, issueFilename)
                const issueFile = this.vault.getAbstractFileByPath(issueFilepath)
                if (!!issueFile) {
                    console.debug(`Issue ${issueFilename} allready exists`);
                    this.vault.delete(issueFile)
                }

                console.debug(`Creating issue ${issueFilename}`);


                await this.vault.create(issueFilepath, `${metaDataString}${content}`)
            } catch (error) {
                console.error(error)
            }
        }

        console.debug("issues created")
    }



    private async createIssueFolderIfNotExists() {
        if (!this.vault.getAbstractFileByPath(this.settings.issueFolder)) {
            console.debug("creating issue folder");
            await this.vault.createFolder(this.settings.issueFolder)
        }
    }
}