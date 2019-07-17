import React from 'react';
import ReactDOM from 'react-dom';
import App from './Components/App.jsx';

ReactDOM.render(
	<App/>,
	//This sets the render target of the 'App' component at '<div id = root>' in /%public%/index.html 
	document.getElementById('root')
);

