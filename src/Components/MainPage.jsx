import React from 'react';
import {
    Route,
    NavLink,
    HashRouter,
  } from "react-router-dom";
import "./MainPage.css";

import NewArrivals from "./ChildComponents/NewArrivals/NewArrivals.jsx";
import LoadingScreen from "./ChildComponents/LoadingScreen/LoadingScreen.jsx";
import Dropdown from "./ChildComponents/Dropdown/Dropdown.jsx";
import BasicSearch from "./ChildComponents//BasicSearch/BasicSearch.jsx";
import AdvSearch from "./ChildComponents/AdvSearch/AdvSearch.jsx";
import SearchResults from "./ChildComponents/SearchResults/SearchResults.jsx";
import CartDisplay from "./ChildComponents/CartDisplay/CartDisplay.jsx";
import Borrowings from "./ChildComponents/Borrowings/Borrowings.jsx";

export default class MainPage extends React.Component {
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
            //Checks if new results retrived by Basic and AdvSearch on submit.
            //"false" on page refresh and on 1st render at /Search-Results
            isNewResultsLoaded: false, 

            //For rendering cart contents
            borrowCart: [],
            
            //For rendering list of borrowers and their details
            borrowingsRecord: [],
            passwordInput: "",
            isBorrowingsPasswordCorrect: false
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
        console.log("this.state.isNewResultsLoaded value: "+this.state.isNewResultsLoaded);
        //console.log("this.state.borrowingsRecord value: "+this.state.borrowingsRecord);
        //console.log(this.state.borrowingsRecord);
        //console.log("this.state.passwordInput value: "+this.state.passwordInput);
    }
    render() {
        return(
            <HashRouter>
                <header>
                    <div id="header-logo">
                        <NavLink to="/"><img id="logo" src="./assets/logo.png" alt="home button"/></NavLink>
                    </div>

                    <div id="header-search">
                        <BasicSearch 
                            basicInput={this.state.basicInput}
                            
                            borrowCart={this.state.borrowCart}
                            searchResults={this.state.searchResults}
                            isNewResultsLoaded={this.state.isNewResultsLoaded}

                            stateUpdater={this.stateUpdater}
                        />
                        <NavLink to="/AdvancedSearch"><span id="advancedButton"></span></NavLink>
                    </div>
                    <div id="header-buttons"> 
                        <NavLink to="/Cart"><span id="cartButton"></span></NavLink>
                        <NavLink to="/Borrowings"><span id="borrowingsButton"></span></NavLink>
                    </div>
                </header>	

                <ul className="navbar">                    
                    <li><NavLink to="/">Home</NavLink></li>
                    <li><NavLink to="/AdvancedSearch">Advanced Search</NavLink></li>
                    <li><NavLink to="/Cart">Cart</NavLink></li>
                    <li id="borrowingsTab"><NavLink to="/Borrowings">Librarian access</NavLink></li>
                    {/**Secret page! Should not be visible if this.state.searchResults === []
                    <li><NavLink to="/SearchResults">Search Results</NavLink></li>
                    */}
                </ul>
                

                <div className="content">
                    {/**Matches URL defined in "to" prop to correct content (components)
                    When the NavLink for "/" is clicked, the contents of the render() method
                    in component "Home" are rendered here in the "content" <div>*/}
                    <Route 
                        exact path="/" 
                        component={NewArrivals}
                    />
                    <Route 
                        path="/LoadingScreen" 
                        component={LoadingScreen}
                    />
                    <Route 
                        path="/AdvancedSearch" 
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
                            
                            isNewResultsLoaded={this.state.isNewResultsLoaded}
                            searchResults={this.state.searchResults}
                            borrowCart={this.state.borrowCart}
        
                            stateUpdater={this.stateUpdater}
                        />}
                    />
                    <Route 
                        path="/SearchResults"
                        render={(props) => <SearchResults {...props}
                            isNewResultsLoaded={this.state.isNewResultsLoaded}
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
                        render={(props) => <Borrowings {...props}
                            borrowingsRecord={this.state.borrowingsRecord}
                            passwordInput={this.state.passwordInput}
                            isBorrowingsPasswordCorrect={this.state.isBorrowingsPasswordCorrect}
                            stateUpdater={this.stateUpdater}
                        />}
                    />

                </div>
                
                <p>
                    <button onClick={this.stateChecker}>State check</button>
                </p>
                <p>
                    <Dropdown/>
                </p>
            </HashRouter>    
        );   
    }
}



