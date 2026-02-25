import { useContext } from 'react';
import { StoreSettingsContext } from './StoreSettingsContext';

export function useStoreSettings() {
  return useContext(StoreSettingsContext);
}
