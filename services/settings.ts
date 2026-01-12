import { ReaderSettings } from '../types';

const SETTINGS_KEY = 'zenreader_settings';

const defaultSettings: ReaderSettings = {
  scrollAmount: 100,
  fontSize: 20,
  lineHeight: 1.8,
  theme: 'beige' as const,
};

export const getSettings = (): ReaderSettings => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return { ...defaultSettings, ...JSON.parse(stored) };
    }
  } catch (error) {
    console.error('Failed to load settings:', error);
  }
  return defaultSettings;
};

export const saveSettings = (settings: Partial<ReaderSettings>): void => {
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save settings:', error);
  }
};

export const updateScrollAmount = (amount: number): void => {
  saveSettings({ scrollAmount: amount });
};
