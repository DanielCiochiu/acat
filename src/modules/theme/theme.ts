// modules/theme/theme.ts
import { Application } from '../../types/Application.ts';
import { Module } from '../../types/Module.ts';
import { ISettingsSubscriber } from '../settings/ISettingsSubscriber.ts';
import { ModuleNames } from '../../AppModules.ts';

/**
 * The Theme module responsible for managing the application's theme
 * Implements ISettingsSubscriber to receive notifications when settings are saved
 */
export class Theme implements Module, ISettingsSubscriber {
    private application: Application | null = null;
    private readonly THEME_SETTING_KEY = 'theme';

    /**
     * Initialize the theme module
     */
    initialize(): void {
        const savedTheme = localStorage.getItem(this.THEME_SETTING_KEY) as "white" | "dark";
        if (!savedTheme) localStorage.setItem(this.THEME_SETTING_KEY, "white");
        this.setTheme(savedTheme || "white");

        const toggleButton = document.getElementById("theme-button");

        if (toggleButton) {
            const newButton = toggleButton.cloneNode(true) as HTMLElement;
            toggleButton.replaceWith(newButton);

            newButton.addEventListener("click", () => {
                const currentTheme = document.documentElement.getAttribute("data-theme");
                const newTheme = currentTheme === "dark" ? "white" : "dark";
                this.setTheme(newTheme);

                // Also save the theme to settings to notify subscribers
                if (this.application) {
                    // Access the SettingsService through the application's getModule method
                    const settingsService = this.getSettingsService();
                    if (settingsService) {
                        settingsService.saveSetting(this.THEME_SETTING_KEY, newTheme);
                    }
                }
            });
        }

        // Subscribe to settings changes
        const settingsService = this.getSettingsService();
        if (settingsService) {
            settingsService.subscribe(this);
        }
    }

    /**
     * Set the application reference
     * @param app The application instance
     */
    setApplication(app: Application): void {
        this.application = app;

        // Subscribe to settings changes when application is set
        const settingsService = this.getSettingsService();
        if (settingsService) {
            settingsService.subscribe(this);
        }
    }

    /**
     * Helper method to get the settings service from the application
     */
    private getSettingsService(): any {
        if (!this.application) {
            return null;
        }

        // Use the correct getModule method from your Application interface
        return this.application.getModule(ModuleNames.Settings);
    }

    /**
     * ISettingsSubscriber implementation - called when settings are saved
     * @param updatedSettings The updated settings
     */
    onSettingsSaved(updatedSettings: Record<string, any>): void {
        console.log('Theme module received settings update', updatedSettings);

        // Check if theme setting was updated
        if (updatedSettings[this.THEME_SETTING_KEY] !== undefined) {
            const newTheme = updatedSettings[this.THEME_SETTING_KEY] as "white" | "dark";
            const currentTheme = document.documentElement.getAttribute("data-theme");

            // Only update if theme actually changed
            if (newTheme !== currentTheme) {
                this.setTheme(newTheme);
            }
        }
    }

    /**
     * Set the application theme
     * @param theme The theme to apply ('white' or 'dark')
     */
    setTheme(theme: "white" | "dark"): void {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem(this.THEME_SETTING_KEY, theme);
        console.log(`Theme set to: ${theme}`);
    }
}