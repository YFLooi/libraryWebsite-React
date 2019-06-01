import React from 'react';
import "./SearchResults.css"

export default class SearchResults extends React.Component {
    render() {
		return (
            <div id="searchResults-page" style={{display: "none"}}>
                <h1>Generated search results</h1>
                <div id="searchResults"></div>           
            </div>    
		);
	}
}
