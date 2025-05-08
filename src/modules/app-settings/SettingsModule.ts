 import { Module } from 'types/Module';
import { Application } from 'types/Application';

const DEFAULT_OPTIONS = {
    language: [
        { label: 'English', value: 'English' },
        { label: 'Romanian', value: 'Romanian' },
        { label: 'Dutch', value: 'Dutch' }
    ],
    theme: [
        { label: 'Light', value: 'Light' },
        { label: 'Dark', value: 'Dark' }
    ]
};

export interface AvailableOptions {
    label: string;
    value: string | number;
}

export class SettingsModule implements Module {
    private app: any;
    private settings: Map<string, { value: any; options: AvailableOptions[] }>;
    private defaultSettings: Record<string, any>;
    private dialogElement: HTMLElement | null = null;
    public isDialogVisible: boolean = false;

    constructor(app: any) {
        this.app = app;
        this.settings = new Map();

        // Get saved language from settings/localStorage
        const savedSettings: Record<string, string> = JSON.parse(localStorage.getItem('appSettings') || '{}');
        console.log('SettingsLoaded - needs refactoring');

        this.defaultSettings = {
            language: savedSettings.language || 'English',
            theme: savedSettings.theme || 'Light',
            simulationInterval: savedSettings.simulationInterval || 1000
        };

        this.addSetting('language', this.defaultSettings.language, DEFAULT_OPTIONS.language);
        this.addSetting('theme', this.defaultSettings.theme, DEFAULT_OPTIONS.theme);
        this.addSetting('simulationInterval', this.defaultSettings.simulationInterval, []);

        this.loadSettings();
        this.applyTheme(this.getSetting('theme'));
        this.applyLanguage(this.getSetting('language'));
        this.applySimulationInterval(this.getSetting('simulationInterval'));
    }

    initialize(app: Application): void {
        // @todo use the app for signaling settings changes
    }

    getSetting(name: string): any {
        return this.settings.get(name)?.value ?? null;
    }

    setSetting(name: string, value: any): void {
        if (this.settings.has(name)) {
            this.settings.get(name)!.value = value;
            this.saveSettings();
        }
    }

    private addSetting(name: string, currentValue: any, availableOptions: AvailableOptions[]) {
        this.settings.set(name, { value: currentValue, options: availableOptions });
    }

    private loadSettings(): void {
        const saved = JSON.parse(localStorage.getItem('appSettings') || '{}');

        this.setSetting('language', saved.language?.value ?? this.defaultSettings.language);
        this.setSetting('theme', saved.theme?.value ?? this.defaultSettings.theme);
        this.setSetting('simulationInterval', saved.simulationInterval?.value ?? this.defaultSettings.simulationInterval);
    }

    private saveSettings(): void {
        const result: Record<string, any> = {};
        this.settings.forEach((value, key) => {
            result[key] = value;
        });
        localStorage.setItem('appSettings', JSON.stringify(result));
    }

    showSettingsDialog(): void {
        if (this.dialogElement) {
            return;
        }

        const dialog = document.createElement('div');
        dialog.className = 'settings-dialog';
        this.dialogElement = dialog;

        const header = document.createElement('div');
        header.className = 'settings-header';

        const title = document.createElement('h2');
        title.textContent = t('settings');

        const closeButton = document.createElement('button');
        closeButton.className = 'close-btn';
        closeButton.textContent = 'X';
        closeButton.addEventListener('click', () => {
            dialog.remove();
            this.dialogElement = null;
        });

        header.appendChild(title);
        header.appendChild(closeButton);

        // Language
        const languageLabel = document.createElement('label');
        languageLabel.textContent = t('language');

        const languageSelect = document.createElement('select');
        DEFAULT_OPTIONS.language.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            if (this.getSetting('language') === opt.value) {
                option.selected = true;
            }
            languageSelect.appendChild(option);
        });

        // Theme
        const themeLabel = document.createElement('label');
        themeLabel.textContent = t('theme');

        const themeSelect = document.createElement('select');
        DEFAULT_OPTIONS.theme.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            if (this.getSetting('theme') === opt.value) {
                option.selected = true;
            }
            themeSelect.appendChild(option);
        });

        // Interval
        const intervalLabel = document.createElement('label');
        intervalLabel.textContent = t('simulationInterval');

        const intervalInput = document.createElement('input');
        intervalInput.type = 'number';
        intervalInput.min = '100';
        intervalInput.value = String(this.getSetting('simulationInterval'));

        // Save
        const saveButton = document.createElement('button');
        saveButton.textContent = t('save');
        saveButton.addEventListener('click', () => {
            const language = languageSelect.value as SupportedLanguage;
            const theme = themeSelect.value;
            const interval = parseInt(intervalInput.value, 10);

            if (isNaN(interval) || interval < 100) {
                alert(t('simulationIntervalError'));
                return;
            }

            this.setSetting('language', language);
            this.setSetting('theme', theme);
            this.setSetting('simulationInterval', interval);

            alert(t('settingsSaved'));
            dialog.remove();
            this.dialogElement = null;
        });

        const container = document.createElement('div');
        container.appendChild(languageLabel);
        container.appendChild(languageSelect);
        container.appendChild(themeLabel);
        container.appendChild(themeSelect);
        container.appendChild(intervalLabel);
        container.appendChild(intervalInput);
        container.appendChild(saveButton);

        dialog.appendChild(header);
        dialog.appendChild(container);

        this.app.getLayout().appBody.appendChild(dialog);
    }
}
