import React from 'react';
import ReactDOM from 'react-dom';
import MainPage from './Components/MainPage.jsx';

ReactDOM.render(
	<MainPage/>,
	//This sets the render target of the 'App' component at '<div id = root>' in /%public%/index.html 
	document.getElementById('root')
);

