import { createContext, useContext } from "react";
import { App } from "obsidian";
import type { GitHub } from "../utils/github";
import type { CrispyPotatoPluginSettings } from "src/settings";


interface IAppContext {
    app: App
    github: GitHub
    settings: CrispyPotatoPluginSettings
}

export const AppContext = createContext<IAppContext | undefined>(undefined);

export const useApp = (): IAppContext => {
    const context = useContext(AppContext);
    if (!context) { throw new Error("Context missing") }

    return context
};