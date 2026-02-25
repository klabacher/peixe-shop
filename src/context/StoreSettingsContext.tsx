import { createContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { StoreSettings } from '../types/product';
import { DEFAULT_STORE_SETTINGS } from '../types/product';
import { getStoreSettings } from '../firebase/firestore';

export interface StoreSettingsContextType {
  settings: StoreSettings;
  loading: boolean;
  refresh: () => void;
}

export const StoreSettingsContext = createContext<StoreSettingsContextType>({
  settings: DEFAULT_STORE_SETTINGS,
  loading: true,
  refresh: () => {},
});

export function StoreSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [loading, setLoading] = useState(true);

  const loadSettings = useCallback(() => {
    getStoreSettings()
      .then((data) => {
        setSettings(data);
      })
      .catch((err) => {
        console.error('Failed to load store settings:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const refresh = useCallback(() => {
    setLoading(true);
    loadSettings();
  }, [loadSettings]);

  return (
    <StoreSettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </StoreSettingsContext.Provider>
  );
}
