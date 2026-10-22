import type { ZoneId } from '../model/types';

export type StockLength = 300 | 400 | 600;

export interface UserPreferences {
  version: 2;
  selectedZone: ZoneId;
  selectedMemberId: string | null;
  /** Stage shown in the model; null shows the finished frame. */
  stage: number | null;
  built: Record<string, true>;
  cut: Record<string, true>;
  stockLength: StockLength;
}

export interface PreferencesProps {
  preferences: UserPreferences;
  setPreferences: (update: (previous: UserPreferences) => UserPreferences) => void;
}
