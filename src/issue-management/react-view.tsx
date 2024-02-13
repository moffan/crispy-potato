import { useApp } from "./context";
import * as path from "path"

export const ReactView = () => {
    const { app, settings, github } = useApp();
    const { vault } = app;

    const createIssueFolderIfNotExists = async () => {
        if (!vault.getAbstractFileByPath(settings.issueFolder)) {
            console.log("creating issue folder");
            await vault.createFolder(settings.issueFolder)
        } else {
            console.log("issue folder exists")
        }
    }

    const getIssues = async () => {
        await createIssueFolderIfNotExists()
        const filepath = path.join(settings.issueFolder, "issues.json")

        console.log("getting issues from github")
        const issues = await github.getIssues()

        const file = vault.getAbstractFileByPath(filepath)
        if (!!file) {
            await vault.delete(file)
        }

        await vault.create(filepath, JSON.stringify(issues));
        console.log("issues saved")

        console.log("creating issues");

        for (const issue of issues) {

            const { number, title, body } = issue;
            const issueFilename = `Issue-${number}.md`;
            // const issueFilename = `${number} - ${title}.md`;
            const issueFilepath = path.join(settings.issueFolder, issueFilename)

            if (vault.getAbstractFileByPath(issueFilepath)) {
                console.log(`Issue ${issueFilename} allready exists`);

                continue;
            }
            if (!body) {
                console.log(`Issue ${issueFilename} has no content`);
                continue;
            }

            console.log(`Creating issue ${issueFilename}`);
            await vault.create(issueFilepath, body!)
        }

        console.log("issues created")
    }

    return <>
        <h4>{vault.getName()}</h4>
        <button onClick={getIssues}>Get issues</button>
    </>;
};