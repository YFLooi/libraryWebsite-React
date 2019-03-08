import React from 'react';
import "./Header.css";

// App.js value={this.state.input}
export default class App extends React.Component {
    constructor(props) {
        super(props);		
        this.state = {
			input: '' 
        }
    }
    render() {
		return (
            <header>
                <span className="header-logo">
                    <img className="logo" src="./assets/logo.png" alt="library"/>
                </span>
                <span className="header-search">
                    <form>
                        <input
                            type="text"
                            name="searchbar"
                            className="searchbar"
                            value={this.state.input}
                            placeholder="Search for books..."
                            autoComplete="on"
                            style={{borderColor:"none"}}
                        /> 
                        <button className="searchbutton"></button>
                        <button className="advancedbutton"></button>
                    </form>          
                </span>
                <span className="header-buttons">
                    <button className="cartbutton"></button>
                    <button className="loginbutton"></button>
                </span>

            </header>			
		);
	}
}
