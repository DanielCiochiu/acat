import { AbstractApplication } from './core/AbstractApplication.ts';
import { AppModules, ModuleName } from './AppModules.ts';
import { AppLayout } from './core/AppLayout.ts';

/**
 * The Simulator application that implements the Application interface
 */
export class App extends AbstractApplication {
    /**
     * Constructor receives the root element of the application and instantiates the modules
     */
    constructor(root: HTMLElement) {
        // calling super for passing over the root element
        super(root);

        // instantiating the registered modules
        const names = Object.keys(AppModules) as Array<ModuleName>;
        for (let i = 0, len = names.length; i < len; i++) {
            this.modules.set(names[i], new AppModules[names[i]]());
        }
    }

    /**
     * Runs the simulator application
     */
    run() {
        // creating the application layout
        this.layout = new AppLayout();
        this.root.appendChild(this.layout);

        // initializing all modules
        for (const [, module] of this.modules) {
            module.initialize(this);
        }
    }
}