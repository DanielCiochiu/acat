import { Module } from '../../../types/Module.ts';
import { Application } from '../../../types/Application.ts';
import { ThemeToggleButton } from './ThemeToggleButton.ts';

export class ThemeToggle implements Module {
  private button!: HTMLElement;

  /**
   * Initializes the theme toggle button
   */
  initialize(app: Application): void {
    // Try to find the existing theme toggle button in the layout
    this.button = app.getLayout().contextMenu.querySelector('theme-toggle-button') as HTMLElement;

    if (!this.button) {
      this.button = new ThemeToggleButton();
      app.getLayout().contextMenu.appendChild(this.button);
    }

    this.addEventListeners();
  }

  /**
   * Adds event listeners for the toggle button
   */
  private addEventListeners(): void {
    this.button.addEventListener('click', () => this.toggleTheme());
  }

  /**
   * Toggles between light and dark theme
   */
  private toggleTheme(): void {
    document.documentElement.classList.toggle('dark-theme');

    if (document.documentElement.classList.contains('dark-theme')) {
      document.documentElement.style.setProperty('--body-background', '#222');
      document.documentElement.style.setProperty('--text-color', '#fff');
    } else {
      document.documentElement.style.setProperty('--body-background', '#fff');
      document.documentElement.style.setProperty('--text-color', '#000');
    }
  }
}

// Register the custom element if not already defined
if (!customElements.get('theme-toggle-button')) {
  customElements.define('theme-toggle-button', ThemeToggleButton);
}
