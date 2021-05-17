import React from 'react';
import ReactDOM from 'react-dom';
import '@rumble-player/service';

import { BrowserRouter } from 'react-router-dom';
import App from './app/app';
import Home from './app/components/spotify/home';
import Service, { BR } from './Service';






ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
      <Service.Provider value={BR}>
        <Home />
      </Service.Provider>

		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);


