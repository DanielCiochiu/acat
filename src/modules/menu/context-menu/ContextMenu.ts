import { Module } from '../../../types/Module.ts';
import { Application } from '../../../types/Application.ts';
import { DefaultToolbar } from './DefaultToolbar.ts';
import { PlayButton } from './buttons/PlayButton.ts';
import { PauseButton } from './buttons/PauseButton.ts';
import { RefreshButton } from './buttons/RefreshButton.ts';
import { removeAllChildren } from '../../../helpers/dom.ts';

/**
 * The context menu module that handles updating the context items when a automata component is selected
 */
export class ContextMenu implements Module {
    // references the application
    protected app: Application | null = null;

    /**
     * Initializes the current module
     */
    initialize(app: Application): void {
        this.app = app;

        this.app.getLayout().contextMenu.appendChild(
            new DefaultToolbar({
                buttons: [
                    new PlayButton(() => console.log('Play button clicked')),
                    new PauseButton(() => console.log('Pause button clicked')),
                    new RefreshButton(() => console.log('Refresh button clicked')),
                ],
            }),
        );
    }

    /**
     * Called for refreshing the context menu toolbar when a new automata was selected
     */
    refreshToolbar(newToolbar: DefaultToolbar) {
        const container = this.app?.getLayout().contextMenu;
        if (container) {
            // Save reference to ThemeToggleButton
            const themeToggle = container.querySelector('theme-toggle-button');

            // Clear all elements
            removeAllChildren(container);

            container.appendChild(newToolbar);

            // Reattach the ThemeToggleButton if it exists
            if (themeToggle) {
                container.appendChild(themeToggle);
            }
        }
    }
}
