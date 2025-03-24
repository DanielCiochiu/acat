import { AppModules, ModuleName, ModuleNames } from '../AppModules.ts'; 
import { Application } from '../types/Application.ts';
import { AppLayout } from './AppLayout.ts';
import { Automata } from '../types/Automata.ts';
import { DrawerMenu } from '../modules/menu/hamburger-menu/views/DrawerMenu.ts';
import { ContextMenu } from '../modules/menu/context-menu/ContextMenu.ts';

/**
 * This is the abstract application implementation that shadows a lot of under the hood logic
 * for allowing the child class to be more readable
 */
export class AbstractApplication implements Application {
    // holds the list of modules instantiated within the application
    protected modules: Map<ModuleName, InstanceType<(typeof AppModules)[ModuleName]>> = new Map();

    // returns access to the layout UI component
    protected layout: AppLayout | null = null;

    // references the running automata
    protected activeAutomata: Automata | null = null;

    // Reference to the theme toggle button to avoid losing it
    protected themeToggleButton: HTMLElement | null = null;

    /**
     * The constructor receives the root element in which it should render its components
     */
    constructor(protected root: HTMLElement) {}

    /**
     * Returns access to a specific module identified by its name
     */
    getModule<T extends ModuleName>(name: T): InstanceType<(typeof AppModules)[T]> | null {
        return <InstanceType<(typeof AppModules)[T]>>this.modules.get(name) ?? null;
    }

    /**
     * Runs the application and initializez the modules
     */
    run() {
        // Store reference to ThemeToggleButton when the app starts
        this.themeToggleButton = this.getLayout().contextMenu.querySelector('theme-toggle-button');

        if (!this.themeToggleButton) {
            this.themeToggleButton = document.createElement('theme-toggle-button');
            this.getLayout().contextMenu.appendChild(this.themeToggleButton);
        }
    }

    /**
     * Returns the Layout instance that allows injecting child elements in different areas of the application
     */
    getLayout(): AppLayout {
        if (this.layout === null) throw new Error('Layout needs to be created before it can be accessed.');

        return this.layout;
    }

    /**
     * Simulates the selected automata
     */
    simulateAutomata(automata: Automata) {
        // clearing the previous simulation
        this.clearBodyContent();

        this.activeAutomata = automata;

        const contextMenu = this.getModule(ModuleNames.ContextMenu) as ContextMenu | null;
        contextMenu?.refreshToolbar(automata.getContextBar());

        this.activeAutomata.runSimulation(this);
    }

    /**
     * Returns access to the current simulating automata if exists otherwise null
     */
    getRunningAutomata(): Automata | null {
        return this.activeAutomata;
    }


    /**
     * Emptying the body content but keeping the drawer menu and theme toggle button
     */
    protected clearBodyContent() {
        const body = this.getLayout().appBody;
        for (let i = body.children.length - 1; i >= 0; i--) {
            if (
                body.children[i] instanceof DrawerMenu ||
                body.children[i] === this.themeToggleButton
            ) {
                continue;
            }
            // removing the child
            body.children[i].remove();
        }

        // Reattach themeToggleButton if it was removed
        if (this.themeToggleButton && !this.themeToggleButton.isConnected) {
            this.getLayout().contextMenu.appendChild(this.themeToggleButton);
        }
    }
}
