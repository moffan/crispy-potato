import { Octokit } from "octokit";
import type { CrispyPotatoPluginSettings } from "../settings-tab";

type IssueState = "all" | "open" | "closed" | undefined;

type GithubIssuePromise = ReturnType<GitHub["getIssues"]>

export type GitHubIssues = Awaited<GithubIssuePromise>

export class GitHub {
	private octokit;
	private readonly per_page = 100;

	constructor(private options: CrispyPotatoPluginSettings) {
		const { auth } = options;
		this.octokit = new Octokit({
			auth,
		});
	}

	async login() {
		const { data } = await this.octokit.rest.users.getAuthenticated();
		const { login } = data;

		return login;
	}

	async getIssues(state: IssueState = "all") {
		const options = {
			...this.options,
			per_page: this.per_page,
			state,
		};

		const issueData = await this.octokit.paginate(
			this.octokit.rest.issues.listForRepo,
			options
		);

		return issueData;
	}
}

