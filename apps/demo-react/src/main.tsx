import React from 'react';
import ReactDOM from 'react-dom';
import '@rumble-player/rp'

import { BrowserRouter } from 'react-router-dom';

import App from './app/app';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
