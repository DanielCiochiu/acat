// modules/settings/SettingsService.ts
import { Module } from '../../types/Module.ts';
import { ISettingsSubscriber } from './ISettingsSubscriber';
import { Application } from '../../types/Application.ts';

/**
 * Service responsible for managing application settings and notifying subscribers
 * when settings are saved
 */
export class SettingsService implements Module {
    private subscribers: ISettingsSubscriber[] = [];
    private settings: Record<string, any> = {};
    private application: Application | null = null;

    /**
     * Initialize the settings service
     */
    public initialize(): void {
        // Load settings from localStorage
        this.loadSettings();
        console.log('Settings service initialized');
    }

    /**
     * Set the application reference
     * @param app The application instance
     */
    public setApplication(app: Application): void {
        this.application = app;
    }

    /**
     * Subscribe to settings changes
     * @param subscriber The subscriber implementing ISettingsSubscriber
     */
    public subscribe(subscriber: ISettingsSubscriber): void {
        if (!this.subscribers.includes(subscriber)) {
            this.subscribers.push(subscriber);
            console.log(`Subscriber added to settings service: ${subscriber.constructor.name}`);
        }
    }

    /**
     * Unsubscribe from settings changes
     * @param subscriber The subscriber to remove
     */
    public unsubscribe(subscriber: ISettingsSubscriber): void {
        const index = this.subscribers.indexOf(subscriber);
        if (index !== -1) {
            this.subscribers.splice(index, 1);
            console.log(`Subscriber removed from settings service: ${subscriber.constructor.name}`);
        }
    }

    /**
     * Save settings and notify all subscribers
     * @param key The setting key
     * @param value The setting value
     */
    public saveSetting<T>(key: string, value: T): void {
        // Update the setting
        this.settings[key] = value;

        // Save to localStorage
        localStorage.setItem(key, JSON.stringify(value));

        // Notify subscribers
        this.notifySubscribers();

        console.log(`Setting saved: ${key}=${JSON.stringify(value)}`);
    }

    /**
     * Save multiple settings at once and notify subscribers
     * @param newSettings Object containing key-value pairs of settings
     */
    public saveSettings(newSettings: Record<string, any>): void {
        // Update settings
        Object.entries(newSettings).forEach(([key, value]) => {
            this.settings[key] = value;
            localStorage.setItem(key, JSON.stringify(value));
        });

        // Notify subscribers
        this.notifySubscribers();

        console.log('Multiple settings saved:', newSettings);
    }

    /**
     * Get a specific setting value
     * @param key The setting key
     * @param defaultValue Default value if setting doesn't exist
     */
    public getSetting<T>(key: string, defaultValue?: T): T {
        if (this.settings[key] !== undefined) {
            return this.settings[key];
        }

        // Try to load from localStorage if not in memory
        try {
            const storedValue = localStorage.getItem(key);
            if (storedValue !== null) {
                const parsedValue = JSON.parse(storedValue);
                this.settings[key] = parsedValue;
                return parsedValue;
            }
        } catch (error) {
            console.error(`Error loading setting ${key}:`, error);
        }

        return defaultValue as T;
    }

    /**
     * Get all current settings
     */
    public getSettings(): Record<string, any> {
        return { ...this.settings };
    }

    /**
     * Load all settings from localStorage
     */
    private loadSettings(): void {
        // This is a simplistic approach - in a real application you might want
        // to have a predefined list of settings to load
        try {
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key) {
                    const value = localStorage.getItem(key);
                    if (value) {
                        try {
                            this.settings[key] = JSON.parse(value);
                        } catch {
                            // If not valid JSON, store as string
                            this.settings[key] = value;
                        }
                    }
                }
            }
            console.log('Settings loaded from localStorage');
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    /**
     * Notify all subscribers about settings changes
     */
    private notifySubscribers(): void {
        for (const subscriber of this.subscribers) {
            try {
                subscriber.onSettingsSaved(this.getSettings());
            } catch (error) {
                console.error(`Error notifying subscriber ${subscriber.constructor.name}:`, error);
            }
        }
    }
}