import React from 'react';
import "./BasicSearch.css";

export default class BasicSearch extends React.Component {   
    render() {
		return (
            <form onSubmit={this.props.handleBasicSearchSubmit}>
                {/*This default search is set to search partial, case-insensitive 
                matches of title, author, and publisher*/}
                <input
                    type="text"
                    name="searchbar"
                    className="searchbar"
                    value={this.props.basicInput}
                    onChange = {this.props.handleBasicSearchChange}
                    onSubmit = {this.props.handleBasicSearchSubmit}
                    placeholder="Search books..."
                    autoComplete="off"
                    style={{borderColor:"none"}}
                /> 
                <button className="searchbutton" type="submit"></button>
                <span id="advanced-button">
                    <button className="advancedbutton"></button>
                </span>
            </form> 	
		)
	}
}
