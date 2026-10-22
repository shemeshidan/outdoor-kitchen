import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import type { UserPreferences } from '../types/kitchen-plan';
import { loadPreferences, savePreferences } from '../lib/local-storage';
import { AppShell } from '../components/AppShell';
import { ModelPage } from '../features/model/ModelPage';
import { BuildGuidePage } from '../features/guide/BuildGuidePage';
import { CutListPage } from '../features/cut-list/CutListPage';
import { ShoppingPage } from '../features/shopping/ShoppingPage';

export default function App() {
  const [preferences, setPreferencesState] = useState<UserPreferences>(loadPreferences);
  const setPreferences = useCallback((update: (previous: UserPreferences) => UserPreferences) => setPreferencesState(update), []);

  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  const props = { preferences, setPreferences };

  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<ModelPage {...props} />} />
        <Route path="build-guide" element={<BuildGuidePage {...props} />} />
        <Route path="cut-list" element={<CutListPage {...props} />} />
        <Route path="shopping" element={<ShoppingPage {...props} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
