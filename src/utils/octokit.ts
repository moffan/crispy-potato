import { Octokit } from "octokit";
import type { CrispyPotatoPluginSettings } from "../settings";

export class GitHub {
	private octokit;

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

	async getIssues(state: "all" | "open" | "closed" | undefined = "all") {
		const { repo, owner } = this.options;

		const options = {
			repo,
			owner,
			per_page: 100,
			state,
		};

		const issueData = await this.octokit.paginate(
			this.octokit.rest.issues.listForRepo,
			options
		);

		return issueData;
	}
}
