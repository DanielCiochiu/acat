// src/modules/system-interaction/SystemInteraction.ts

import { DialogModule } from "./DialogModule";
import {Module} from "../../types/Module.ts";

/**
 * SystemInteraction module that serves as the entry point for dialog functionality
 */
export class SystemInteraction implements Module {
    private dialogModule: DialogModule;

    constructor() {
        this.dialogModule = new DialogModule();
    }

    /**
     * Initialize the module
     */
    initialize(): void {
        console.log('System Interaction module initialized');
        this.dialogModule.initialize();
    }

    /**
     * Display an information dialog with a title and message
     * Replacement for alert()
     * @param title The dialog title
     * @param message The message to display
     */
    showInfo(title: string, message: string): void {
        this.dialogModule.showInfo(title, message);
    }

    /**
     * Request input from the user
     * Replacement for prompt()
     * @param title The prompt message
     * @returns A Promise that resolves to the user's input or null if canceled
     */
    requestInput(title: string): Promise<string | null> {
        return this.dialogModule.requestInput(title);
    }
}

// Export a singleton instance for easy access
export const systemInteraction = new SystemInteraction();