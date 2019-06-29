import React from 'react';
import {
    withRouter,
  } from "react-router-dom";
import "./BasicSearch.css";
import IntegrationAutosuggest from "./MaterialAutosuggest.jsx"

class BasicSearch extends React.Component {   
    constructor(props){
        super(props);
        this.handleBasicSearchSubmit = this.handleBasicSearchSubmit.bind(this);
    }
    handleBasicSearchSubmit(input){ 
        const that = this;

        //Adds record of Basic search term in state for Redux later
        that.props.stateUpdater("basicInput",input)    
        
        //String passed to PSQL must be free of special characters, otherwise it'll bug (parentheses not balanced)
        const removeSpecialChars = (string) => {
            return string.replace(/(?!\w|\s)./g, '')
              .replace(/\s+/g, ' ')
              .replace(/\s/g, '') // removes whitespace
              .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
          }
        let basicInput = '^'+removeSpecialChars(input);
        console.log("String submitted for basic search: "+basicInput);
        
        //Use value stored in state instead. <Autocomplete/> returns all kinds of jibberish which
        //enables a search even on an empty string. 
        if(that.props.basicInput !== ""){
            fetch("http://localhost:3005/BasicSearch/"+basicInput, {method: "GET",mode:"cors"})
                //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
                .then(function(response){
                    return response.json()
                    .then(function(data){
                        console.log("Results of BasicSrch:");
                        console.log(data);
                        
                        //Prevents rendering if no results returned from search
                        if (data.length === 0) {
                            alert("No results found. Try again");
                        } else {
                            let currentResults = that.props.searchResults
                            currentResults.splice(0, currentResults.length);
                            let newResults = [...currentResults, ...data];

                            that.props.stateUpdater("searchResults",newResults);
                            that.props.stateUpdater("isNewResultsLoaded",true);
                                        
                            //Only allows redirect to /Search-Results to render if this.state.searchResults is updated
                            //For some reason, "return <Redirect to='/Search-Results'/>" does not work here
                            if(that.props.isNewResultsLoaded === true){
                                //A little cheat: Since I can't push to /SearchResults to trigger
                                //componentDidMount() when at /SearchResults to render the search results, 
                                //I jump pages first
                                that.props.history.push('/LoadingScreen');
                                that.props.history.push('/SearchResults');
                            } else {
                                console.log("Error updating this.state.searchResults")
                            }
                        }
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
        //Does not work to declare a history.push() here. Maybe because BasicSearch is displayed
        //no matter which other component is on display?
        return (
            <React.Fragment>
                <IntegrationAutosuggest
                    handleBasicSearchSubmit = {this.handleBasicSearchSubmit}
                    stateUpdater = {this.props.stateUpdater}
                    searchResults = {this.props.searchResults}
                />         
            </React.Fragment>
        )
    }
}

//Allows this child class to interface with <Hashrouter/> in parent class MainPage()
export default withRouter(BasicSearch);
