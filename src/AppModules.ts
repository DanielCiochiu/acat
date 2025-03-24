import { AppMenu } from './modules/menu/app-menu/AppMenu.ts';
import { ContextMenu } from './modules/menu/context-menu/ContextMenu.ts';
import { HamburgerMenu } from './modules/menu/hamburger-menu/HamburgerMenu.ts';
import { AppLogo } from './modules/menu/app-logo/AppLogo.ts';
import { ThemeToggle } from './modules/menu/theme-toggle/ThemeToggle.ts';
import { DFASimulation } from './modules/automata/finite-automata/DFASimulation.ts'; // Import DFASimulation

// This registry contains all the applications modules
export const AppModules = {
  HamburgerMenu,
  AppLogo,
  AppMenu,
  ContextMenu,
  ThemeToggle, // Added the new theme toggle module
  DFASimulation, // Add DFASimulation to the modules
} as const;

export type ModuleName = keyof typeof AppModules;
export const ModuleNames: Record<ModuleName, ModuleName> = Object.keys(AppModules).reduce(
  (keys, key) => ({ ...keys, [key]: key }),
  {}
) as Record<ModuleName, ModuleName>;