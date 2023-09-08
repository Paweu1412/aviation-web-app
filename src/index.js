import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';

import './index.scss';

import App from './pages/App/App';

const root = ReactDOM.createRoot(document.getElementById('root'));



root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
