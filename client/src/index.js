import React from 'react';
import { render } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './Components/App.jsx';
import * as serviceWorker from './serviceWorker';

render((
	<BrowserRouter>
		<App/>
	</BrowserRouter>	
), document.getElementById('root'));
//This sets the render target of the 'App' component at '<div id = root>' in /%public%/index.html

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
