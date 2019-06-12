import React from 'react';
import {
    Route,
    NavLink,
    HashRouter,
  } from "react-router-dom";
import "./MainPage.css";

import NewArrivals from "./ChildComponents/NewArrivals/NewArrivals.jsx";
import BasicSearch from "./ChildComponents//BasicSearch/BasicSearch.jsx";
import AdvSearch from "./ChildComponents/AdvSearch/AdvSearch.jsx";
import SearchResults from "./ChildComponents/SearchResults/SearchResults.jsx";
import CartDisplay from "./ChildComponents/CartDisplay/CartDisplay.jsx";
import Borrowings from "./ChildComponents/Borrowings/Borrowings.jsx";

class MainPage extends React.Component {
    constructor(props){
        super(props);
        
        /**Placing all states in single parent page allows for easier manipulation with Redux later*/
        this.state = {
            /**For basic search*/
            basicInput: "",

            /*For advanced search*/
            advTitle: "",
            condTitAuth:'OR',
            advAuthor: "",
            condAuthYr:'OR',
            advYearStart: "",
            advYearEnd: "",
            condYrPub: "OR",
            advPublisher: "",
            condPubSynp:'OR',
            advSynopsis: "",

            //For rendering search results
            searchResults: [],
            isResultsLoaded: false,

            //For rendering cart contents
            borrowCart: []
        }
        this.stateUpdater = this.stateUpdater.bind(this);
        this.stateChecker = this.stateChecker.bind(this);

    } 
    /*Universal state manipulator! It allows all child component functions to be outsourced 
    as props by providing them a means to manipulate state!!*/
    stateUpdater(name,data){
        /* [] allows an external variable to define object property "name". In this case, 
        it's parameter "name".*/
        this.setState({
            [name]: data
        })
    }
    stateChecker(){
        console.log("this.state.isResultsLoaded value: "+this.state.isResultsLoaded)
    }
    render() {
        return(
            <HashRouter>
                <header>
                    <div id="header-logo">
                        <NavLink to="/Home"><img id="logo" src="./assets/logo.png" alt="home button"/></NavLink>
                    </div>

                    <div id="header-search">
                        <BasicSearch 
                            basicInput={this.state.basicInput}
                            
                            borrowCart={this.state.borrowCart}
                            searchResults={this.state.searchResults}

                            stateUpdater={this.stateUpdater}
                        />
                        <NavLink to="/Advanced-Search"><span id="advancedButton"></span></NavLink>
                    </div>
                    <div id="header-buttons"> 
                        <NavLink to="/Cart"><span id="cartButton"></span></NavLink>
                        <NavLink to="/Borrowings"><span id="borrowingsButton"></span></NavLink>
                    </div>
                </header>	

                <ul className="navbar">
                    {/**'to' is an identifier prop to ensure the right content is loaded */}
                    <li><NavLink to="/Home">Home</NavLink></li>
                    <li><NavLink to="/Advanced-Search">Advanced Search</NavLink></li>
                    <li><NavLink to="/Cart">Cart</NavLink></li>
                    <li><NavLink to="/Search-Results">Search Results</NavLink></li>
                    <li></li>
                </ul>

                <div className="content">
                    {/**Matches URL defined in "to" prop to correct content (components)
                    When the NavLink for "/" is clicked, the contents of the render() method
                    in component "Home" are rendered here in the "content" <div>*/}
                    <Route 
                        path="/Home" 
                        component={NewArrivals}
                    />
                    <Route 
                        path="/Advanced-Search" 
                        render={(props) => <AdvSearch {...props}
                            advTitle={this.state.advTitle}
                            condTitAuth={this.state.condTitAuth}
                            advAuthor={this.state.advAuthor}
                            condAuthYr={this.state.condAuthYr}
                            advYearStart={this.state.advYearStart}
                            advYearEnd={this.state.advYearEnd}
                            condYrPub={this.state.condYrPub}
                            advPublisher={this.state.advPublisher}
                            condPubSynp={this.state.condPubSynp}
                            advSynopsis={this.state.advSynopsis} 
                            
                            isResultsLoaded={this.state.isResultsLoaded}
                            searchResults={this.state.searchResults}
                            borrowCart={this.state.borrowCart}
        
                            stateUpdater={this.stateUpdater}
                        />}
                    />
                    <Route 
                        path="/Search-Results"
                        render={(props) => <SearchResults {...props}
                            searchResults={this.state.searchResults}
                            borrowCart={this.state.borrowCart}

                            stateUpdater={this.stateUpdater}
                        />}
                    />
                    <Route 
                        path="/Cart" 
                        render={(props) => <CartDisplay {...props}
                            borrowCart={this.state.borrowCart}
                            stateUpdater={this.stateUpdater}
                        />}
                    />
                    <Route 
                        path="/Borrowings" 
                        component={Borrowings}
                    />

                </div>
                
                <p>
                    <button onClick={this.stateChecker}>State check</button>
                </p>
            </HashRouter>    
        );   
    }
}

export default MainPage;

