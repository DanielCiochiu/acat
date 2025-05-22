// src/modules/system-interaction/DialogModule.ts


import {Module} from "../../types/Module.ts";

/**
 * Dialog module that provides customizable dialog functionality
 * Implements the Module interface and provides methods for showing
 * information dialogs and requesting user input.
 */
export class DialogModule implements Module {
    private readonly dialogContainer: HTMLDivElement;
    private activeDialog: HTMLDivElement | null = null;

    constructor() {
        // Create a container for all dialogs
        this.dialogContainer = document.createElement('div');
        this.dialogContainer.className = 'dialog-container';
        this.dialogContainer.style.position = 'fixed';
        this.dialogContainer.style.top = '0';
        this.dialogContainer.style.left = '0';
        this.dialogContainer.style.width = '100%';
        this.dialogContainer.style.height = '100%';
        this.dialogContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        this.dialogContainer.style.backdropFilter = 'blur(8px)';
        this.dialogContainer.style.backdropFilter = 'blur(8px)';
        this.dialogContainer.style.display = 'none';
        this.dialogContainer.style.justifyContent = 'center';
        this.dialogContainer.style.alignItems = 'center';
        this.dialogContainer.style.zIndex = '9999';

        // Append to document when module is instantiated
        document.body.appendChild(this.dialogContainer);
    }

    /**
     * Initialize the module
     */
    initialize(): void {
        console.log('Dialog module initialized');
    }

    /**
     * Display an information dialog with a title and message
     * @param title The dialog title
     * @param message The message to display
     */
    showInfo(title: string, message: string): void {
        // Create dialog element
        const dialog = this.createDialogElement();

        // Add title
        const titleElement = document.createElement('h3');
        titleElement.textContent = title;
        titleElement.style.margin = '0 0 10px 0';
        dialog.appendChild(titleElement);

        // Add message
        const messageElement = document.createElement('p');
        messageElement.textContent = message;
        messageElement.style.margin = '0 0 20px 0';
        dialog.appendChild(messageElement);

        // Add OK button
        const okButton = document.createElement('button');
        okButton.textContent = 'OK';
        okButton.style.padding = '8px 16px';
        okButton.style.cursor = 'pointer';
        okButton.style.backgroundColor = '#007bff';
        okButton.style.color = '#fff';
        okButton.style.border = 'none';
        okButton.style.borderRadius = '4px';
        okButton.style.transition = 'background-color 0.2s ease';
        okButton.onclick = () => this.closeDialog();

        // Add hover effect with event listeners
        okButton.addEventListener('mouseover', () => {
            okButton.style.backgroundColor = '#0056b3';
        });
        okButton.addEventListener('mouseout', () => {
            okButton.style.backgroundColor = '#007bff';
        });

        dialog.appendChild(okButton);

        // Show the dialog
        this.showDialog(dialog);
    }

    /**
     * Request input from the user
     * @returns A Promise that resolves to the user's input or null if canceled
     */
    requestInput(title: string = 'Input Required'): Promise<string | null> {
        return new Promise((resolve) => {
            // Create dialog element
            const dialog = this.createDialogElement();

            // Add title
            const titleElement = document.createElement('h3');
            titleElement.textContent = title;
            titleElement.style.margin = '0 0 10px 0';
            dialog.appendChild(titleElement);

            // Add input field
            const input = document.createElement('input');
            input.type = 'text';
            input.style.width = '100%';
            input.style.padding = '8px';
            input.style.marginBottom = '20px';
            input.style.boxSizing = 'border-box';
            input.style.border = '1px solid #ccc';
            input.style.borderRadius = '4px';
            dialog.appendChild(input);

            // Add button container
            const buttonContainer = document.createElement('div');
            buttonContainer.style.display = 'flex';
            buttonContainer.style.justifyContent = 'space-between';
            buttonContainer.style.width = '100%';
            dialog.appendChild(buttonContainer);

            // Add Cancel button
            const cancelButton = document.createElement('button');
            cancelButton.textContent = 'Cancel';
            cancelButton.style.padding = '8px 16px';
            cancelButton.style.cursor = 'pointer';
            cancelButton.style.backgroundColor = '#6c757d';
            cancelButton.style.color = '#fff';
            cancelButton.style.border = 'none';
            cancelButton.style.borderRadius = '4px';
            cancelButton.style.transition = 'background-color 0.2s ease';

            cancelButton.addEventListener('mouseover', () => {
                cancelButton.style.backgroundColor = '#5a6268';
            });
            cancelButton.addEventListener('mouseout', () => {
                cancelButton.style.backgroundColor = '#6c757d';
            });

            cancelButton.onclick = () => {
                this.closeDialog();
                resolve(null);
            };
            buttonContainer.appendChild(cancelButton);

            // Add OK button
            const okButton = document.createElement('button');
            okButton.textContent = 'OK';
            okButton.style.padding = '8px 16px';
            okButton.style.cursor = 'pointer';
            okButton.style.backgroundColor = '#007bff';
            okButton.style.color = '#fff';
            okButton.style.border = 'none';
            okButton.style.borderRadius = '4px';
            okButton.style.transition = 'background-color 0.2s ease';

            okButton.addEventListener('mouseover', () => {
                okButton.style.backgroundColor = '#0056b3';
            });
            okButton.addEventListener('mouseout', () => {
                okButton.style.backgroundColor = '#007bff';
            });

            okButton.onclick = () => {
                const value = input.value.trim();
                this.closeDialog();
                resolve(value);
            };
            buttonContainer.appendChild(okButton);

            // Show the dialog and focus the input
            this.showDialog(dialog);
            input.focus();

            // Handle Enter key
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const value = input.value.trim();
                    this.closeDialog();
                    resolve(value);
                }
            });
        });
    }

    /**
     * Create a base dialog element with common styling
     */
    private createDialogElement(): HTMLDivElement {
        const dialog = document.createElement('div');
        dialog.className = 'dialog';
        dialog.style.backgroundColor = 'white';
        dialog.style.borderRadius = '10px';
        dialog.style.padding = '20px';
        dialog.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
        dialog.style.maxWidth = '400px';
        dialog.style.width = '90%';
        dialog.style.animation = 'fadeIn 0.3s ease-out';
        dialog.style.border = '1px solid rgba(0, 0, 0, 0.08)';

        // Add keyframes for fadeIn animation
        if (!document.getElementById('dialogAnimationStyle')) {
            const style = document.createElement('style');
            style.id = 'dialogAnimationStyle';
            style.textContent = `
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }
            `;
            document.head.appendChild(style);
        }

        return dialog;
    }

    /**
     * Show the dialog by adding it to the container and making the container visible
     */
    private showDialog(dialog: HTMLDivElement): void {
        // Clear any existing dialogs
        this.dialogContainer.innerHTML = '';

        // Store reference to active dialog
        this.activeDialog = dialog;

        // Add dialog to container and show
        this.dialogContainer.appendChild(dialog);
        this.dialogContainer.style.display = 'flex';
    }

    /**
     * Close the active dialog
     */
    private closeDialog(): void {
        this.dialogContainer.style.display = 'none';
        this.activeDialog = null;
    }
}