import React from 'react';
import {
    withRouter,
  } from "react-router-dom";
import ReactSearchBox from "react-search-box";
import "./BasicSearch.css";

class BasicSearch extends React.Component {   
    constructor(props){
        super(props);

        this.state = {
            data: [ 
                {key: "john",value: "John Doe"},    
                {key: "jane",value: "Jane Doe"},    
                {key: "mary",value: "Mary Phillips"},    
                {key: "robert",value: "Robert"},    
                {key: "karius",value: "Karius"}  
            ] 
        }

        this.handleBasicSearchChange = this.handleBasicSearchChange.bind(this);
        this.handleBasicSearchSubmit = this.handleBasicSearchSubmit.bind(this);
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
            <form onSubmit={this.handleBasicSearchSubmit}>
                {/*This default search is set to search partial, case-insensitive 
                matches of title, author, and publisher*/}
                <input
                    type="text"
                    name="searchbar"
                    id="searchbar"
                    className="searchbar"
                    value={this.props.basicInput}
                    onChange = {this.handleBasicSearchChange}
                    onSubmit = {this.handleBasicSearchSubmit}
                    placeholder="Search books..."
                    autoComplete="off"
                    style={{borderColor:"none"}}
                /> 

                <ReactSearchBox          
                    placeholder="Search books..."          
                    value=""          
                    data={this.state.data}        
                />    
                <button id="searchbutton" type="submit"></button>
            </form> 	
        )
    }
}

//Allows this child class to interface with <Hashrouter/> in parent class MainPage()
export default withRouter(BasicSearch);
