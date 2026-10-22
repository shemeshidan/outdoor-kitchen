import React from 'react';
import ReactDOM from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { FluentProvider, createLightTheme, type BrandVariants } from '@fluentui/react-components';
import App from './app/App';
import './styles/theme.css';

const brandRamp: BrandVariants = {
  10: '#061F1D', 20: '#092D2A', 30: '#0B3D39', 40: '#0D4E49',
  50: '#0E6059', 60: '#0F766E', 70: '#13877E', 80: '#21978D',
  90: '#39A79E', 100: '#54B7AF', 110: '#72C7BF', 120: '#93D6CF',
  130: '#B5E4DF', 140: '#D1F0ED', 150: '#E8F8F6', 160: '#F5FCFB',
};

const theme = createLightTheme(brandRamp);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <FluentProvider theme={theme}>
      <HashRouter>
        <App />
      </HashRouter>
    </FluentProvider>
  </React.StrictMode>,
);