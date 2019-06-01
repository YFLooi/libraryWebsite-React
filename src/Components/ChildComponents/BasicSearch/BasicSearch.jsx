import React from 'react';
import "./BasicSearch.css";
import renderResults from "../ExportedFunctions/RenderResults.js";
import borrowRequest from "../ExportedFunctions/BorrowRequest.js";

export default class BasicSearch extends React.Component {   
    constructor(props){
        super(props);
        this.handleBasicSearchChange = this.handleBasicSearchChange.bind(this);
        this.handleBasicSearchSubmit = this.handleBasicSearchSubmit.bind(this);
        this.renderResults = renderResults.bind(this);
        this.borrowRequest = borrowRequest.bind(this);
    }
    handleBasicSearchChange(event){
        this.props.stateUpdater("basicInput",event.target.value)
    }
    handleBasicSearchSubmit(event){ 
        const that = this;
        event.preventDefault();
        const basicInput = this.props.basicInput;
    
        if(basicInput !== ""){
            fetch("http://localhost:3005/BasicSearch/"+basicInput, {method: "GET",mode:"cors"})
                //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
                .then(function(response){
                    return response.json()
                    .then(function(data){
                        console.log("Results of BasicSrch:");
                        console.log(data);
                        
                        //'this' of this component cannot be recognised here
                        //Thus, we bind this to "const that"
                        that.renderResults(data, that.props.borrowCart);
                    })
                })  
                .catch(function(error){
                    console.log('Request failed', error)
                })
        } else {
            console.log("Blank query made. No query submitted");
        }
    }
    render() {
		return (
            <form onSubmit={this.handleBasicSearchSubmit}>
                {/*This default search is set to search partial, case-insensitive 
                matches of title, author, and publisher*/}
                <input
                    type="text"
                    name="searchbar"
                    className="searchbar"
                    value={this.props.basicInput}
                    onChange = {this.handleBasicSearchChange}
                    onSubmit = {this.handleBasicSearchSubmit}
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
