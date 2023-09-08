import './App.scss';

const App = () => {
	return (
		<div className="App">
			<div className="container">
        <div className="header">
          <h1>✈️ Essential Flight Tools by Paweł Nosalski</h1>
        </div>

        <div className="main">
          <div className="tabs">
            <div className="tab active">Weather</div>
            <div className="tab">Transition Level</div>
          </div>

        </div>
		  </div>

      {/* <div className="bottom-corners">
        <div className="bottom-corners__left"></div>
        <div className="bottom-corners__center"></div>
        <div className="bottom-corners__right"></div>
      </div> */}
    </div>
	);
}

export default App;