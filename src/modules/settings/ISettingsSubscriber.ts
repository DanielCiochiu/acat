// ISettingsSubscriber.ts
import { Module } from '../../types/Module.ts';

/**
 * Interface that defines what a settings subscriber should implement
 * Any module that needs to be notified when settings are saved
 * should implement this interface
 */
export interface ISettingsSubscriber extends Module {
    /**
     * Method that will be called when settings are saved
     * @param updatedSettings The updated settings object
     */
    onSettingsSaved(updatedSettings: Record<string, any>): void;
}
