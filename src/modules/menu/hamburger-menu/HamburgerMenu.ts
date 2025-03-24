import { Module } from '../../../types/Module.ts';
import { Application } from '../../../types/Application.ts';
import { HamburgerIcon } from './views/HamburgerIcon.ts';
import { DrawerMenu } from './views/DrawerMenu.ts';
import { DrawerCategory } from './views/DrawerCategory.ts';

/**
 * This class handles the hamburger menu implementation
 * Initially, it was implemented with the purpose of showing all the automata simulations
 * available in this simulator
 */
export class HamburgerMenu implements Module {
    // references the application
    protected app: Application | null = null;
    // references the drawer menu
    protected drawer: DrawerMenu | null = null;

    /**
     * Initializes the current menu
     */
    initialize(app: Application): void {
        this.app = app;
        // adding the hamburger icon to the hamburger menu
        app.getLayout().hamburgerMenu.appendChild(new HamburgerIcon(this.onToggleMenu));
        // adding the drawer menu to DOM
        this.drawer = new DrawerMenu();
        app.getLayout().appBody.appendChild(this.drawer);
    }

    /**
     * Appends a drawer category to this menu
     */
    addCategory(category: DrawerCategory) {
        this.drawer?.appendChild(category);
    }

    /**
     * Returns access to the drawer category if found otherwise null
     */
    getCategory(id: string): DrawerCategory | null {
        for (let i = 0, len = this.drawer?.children.length ?? 0; i < len; i++) {
            const drawerCat = <DrawerCategory>this.drawer?.children[i];
            if (drawerCat.is(id)) {
                return drawerCat;
            }
        }

        return null;
    }

    /**
     * Handler for opening the drawer menu
     */
    onToggleMenu = () => {
        this.drawer?.classList.toggle('visible');
    };
}