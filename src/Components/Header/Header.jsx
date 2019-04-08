import React from 'react';
import "./Header.css";

// App.js value={this.state.input}
export default class App extends React.Component {   
    render() {
		return (
            <header>
                <span className="header-logo">
                    <img className="logo" src="./assets/logo.png" alt="library"/>
                </span>
                <span className="header-search">
                    <form>
                        {/*This default search is set to search partial, case-insensitive matches of title, author, and publisher*/}
                        <input
                            type="text"
                            name="searchbar"
                            className="searchbar"
                            ref="searchbar"
                            value={this.props.basicInput}
                            onChange = {this.props.handleBasicSearchChange}
                            onSubmit = {this.props.handleBasicSearchSubmit}
                            placeholder="Search books"
                            autoComplete="on"
                            style={{borderColor:"none"}}
                        /> 
                        <button className="searchbutton" onClick={this.props.handleBasicSearchSubmit}></button>
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
