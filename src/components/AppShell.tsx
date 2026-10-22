import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Button,
  Divider,
  FluentProvider,
  Switch,
  Tab,
  TabList,
  Toolbar,
  webDarkTheme,
  type BrandVariants,
} from '@fluentui/react-components';
import {
  ArrowDownloadRegular,
  ArrowResetRegular,
  BookOpenRegular,
  CartRegular,
  CubeRegular,
  CutRegular,
  DocumentRegular,
} from '@fluentui/react-icons';
import { AnimatePresence, motion } from 'motion/react';
import { createLightTheme } from '@fluentui/react-components';
import { exportPreferences, loadPreferences, resetPreferences } from '../lib/local-storage';

const brandRamp: BrandVariants = {
  10: '#061F1D', 20: '#092D2A', 30: '#0B3D39', 40: '#0D4E49',
  50: '#0E6059', 60: '#0F766E', 70: '#13877E', 80: '#21978D',
  90: '#39A79E', 100: '#54B7AF', 110: '#72C7BF', 120: '#93D6CF',
  130: '#B5E4DF', 140: '#D1F0ED', 150: '#E8F8F6', 160: '#F5FCFB',
};

const lightTheme = createLightTheme(brandRamp);
const darkTheme = { ...webDarkTheme, colorBrandForeground1: '#54B7AF', colorBrandBackground: '#0F766E' };

const navigation = [
  { to: '/', label: 'מודל', icon: <CubeRegular /> },
  { to: '/build-guide', label: 'שלבים', icon: <BookOpenRegular /> },
  { to: '/cut-list', label: 'חיתוך', icon: <CutRegular /> },
  { to: '/shopping', label: 'קניות', icon: <CartRegular /> },
];

export function AppShell() {
  const [dark, setDark] = useState(() => localStorage.getItem('outdoor-kitchen-theme') === 'dark');
  const location = useLocation();
  const navigate = useNavigate();

  function toggleTheme(checked: boolean) {
    setDark(checked);
    localStorage.setItem('outdoor-kitchen-theme', checked ? 'dark' : 'light');
    document.documentElement.dataset.theme = checked ? 'dark' : 'light';
  }

  function handleReset() {
    if (!window.confirm('לאפס את סימוני ההתקדמות והבחירות?')) return;
    resetPreferences();
    window.location.reload();
  }

  return (
    <FluentProvider theme={dark ? darkTheme : lightTheme} className="app-provider">
      <div className="app-shell" dir="rtl">
        <header className="app-header">
          <div className="brand-lockup">
            <span className="brand-mark" aria-hidden="true">מ</span>
            <div>
              <strong>מטבח חוץ</strong>
              <span>תכנית עבודה</span>
            </div>
          </div>
          <Toolbar aria-label="פעולות מקומיות" className="header-tools">
            <span className="local-indicator"><span />עותק מקומי</span>
            <Button appearance="subtle" icon={<ArrowDownloadRegular />} aria-label="ייצוא ההתקדמות" title="ייצוא ההתקדמות" onClick={() => exportPreferences(loadPreferences())} />
            <Button appearance="subtle" icon={<ArrowResetRegular />} aria-label="איפוס ההתקדמות" title="איפוס ההתקדמות" onClick={handleReset} />
            <Switch
              checked={dark}
              onChange={(_, data) => toggleTheme(data.checked)}
              label={dark ? 'ערכת לילה' : 'ערכת יום'}
            />
          </Toolbar>
        </header>

        <nav className="primary-nav" aria-label="ניווט ראשי">
          <TabList selectedValue={location.pathname} onTabSelect={(_, data) => navigate(String(data.value))}>
            {navigation.map((item) => (
              <Tab key={item.to} value={item.to} icon={item.icon}>{item.label}</Tab>
            ))}
          </TabList>
          <a className="document-chip" href={`${import.meta.env.BASE_URL}documents/outdoor-kitchen-plan.pdf`} target="_blank" rel="noreferrer"><DocumentRegular /> התכנית המקורית (PDF)</a>
        </nav>

        <main className="page-main">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              className="route-frame"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        <Divider />
        <footer className="app-footer">
          <span>המידות לפי תכנית העבודה מ-21.10 · פריטים עם ⚠ דורשים אימות</span>
          <span>ההתקדמות נשמרת בדפדפן הזה בלבד</span>
        </footer>
      </div>
    </FluentProvider>
  );
}