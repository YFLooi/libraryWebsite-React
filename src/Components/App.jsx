import React from 'react';
//Controls positioning of individual columns and applies general styling
import './App.css';

//imports React components to render()
import MainPage from './MainPage/MainPage.jsx';
import Borrowings from './Borrowings/Borrowings.jsx';

// App.js value={this.state.input}
export default class App extends React.Component {
	render() {	    
        return (
            <React.Fragment>
                <MainPage/>     
                <p></p>       
                <Borrowings/>
                <p></p>    
            </React.Fragment>
        ); 
	}
}

