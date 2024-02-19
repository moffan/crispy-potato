import { IssueManagement } from "src/utils/issue-management";
import { useApp } from "./context";
import { useState } from "react";

export const ReactView = () => {
    const { app, settings, github } = useApp();
    const { vault } = app;

    const [isWorking, setIsWorking] = useState(false)

    const issueManagement = new IssueManagement(github, settings, vault)

    const getIssues = async () => {
        setIsWorking(true)

        try {
            await issueManagement.downloadIssues();
        } finally {
            setIsWorking(false)
        }
    }

    return <>
        <h4>{settings.repo}</h4>
        <button onClick={getIssues} disabled={isWorking} style={{ background: isWorking ? "red" : "green" }}>Get issues</button>
    </>;
};