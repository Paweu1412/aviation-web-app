import { useState } from 'react';

import Settings from '../tabs/Settings/Settings';
import Transition from '../tabs/Transition/Transition';
import Weather from '../tabs/Weather/Weather';
import Main from '../tabs/Main/Main';

import './App.scss';

const App = () => {
  const [tab, setTab] = useState(0);

	return (
		<div className="App">
			<div className="container">
        <div className="header">
          <h1>✈️ Essential Flight Tools by Paweł Nosalski</h1>
        </div>

        <div className="tabs">
          <div className={`tab${tab === 1 ? ' active' : ''}`} onClick={() => setTab(1)}>Weather</div>
          <div className={`tab${tab === 2 ? ' active' : ''}`} onClick={() => setTab(2)}>Transition Level</div>
          <div className={`tab${tab === 3 ? ' active' : ''}`} onClick={() => setTab(3)}>Settings</div>
        </div>

        {tab === 0 && <Main />}
        {tab === 1 && <Weather />}
        {tab === 2 && <Transition />}
        {tab === 3 && <Settings />}
		  </div>
    </div>
	);
}

export default App;