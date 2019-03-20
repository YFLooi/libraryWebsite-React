import React from 'react';
import "./Header.css";

// App.js value={this.state.input}
export default class App extends React.Component {
    constructor(props) {
        super(props);		
        this.state = {
			input: '' 
        }

        this.handlechange = this.handlechange.bind(this);
        this.searchbarcheck = this.searchbarcheck.bind(this);
    }
    searchbarcheck(event){
        event.preventDefault();
        console.log(this.refs.searchbar.value)
    }
    handlechange(event){
        event.preventDefault();
        this.setState({
			input: event.target.value,
        });
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
                            ref="searchbar"
                            value={this.state.input}
                            onChange = {this.handlechange}
                            placeholder="Search for books..."
                            autoComplete="on"
                            style={{borderColor:"none"}}
                        /> 
                        <button className="searchbutton" onClick={this.searchbarcheck}></button>
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
