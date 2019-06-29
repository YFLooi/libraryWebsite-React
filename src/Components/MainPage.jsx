import React from 'react';
import {
    Route,
    NavLink,
    HashRouter,
  } from "react-router-dom";
import "./MainPage.css";

import HomePage from "./ChildComponents/HomePage/HomePage.jsx";
import LoadingScreen from "./ChildComponents/LoadingScreen/LoadingScreen.jsx";
import AdvSearch from "./ChildComponents/AdvSearch/AdvSearch.jsx";
import SearchResults from "./ChildComponents/SearchResults/SearchResults.jsx";
import CartDisplay from "./ChildComponents/CartDisplay/CartDisplay.jsx";
import Borrowings from "./ChildComponents/Borrowings/Borrowings.jsx";

//For material UI navbar
import Navbar from './Navbar.jsx'
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar'
import TypoGraphy from '@material-ui/core/Typography'

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
    render() {
        return(
            <HashRouter>
                {/** 
                <header>
                    <div id="header-logo">
                        <NavLink to="/"><img id="logo" src="./assets/logo.png" alt="home button"/></NavLink>
                    </div>

                    <div id="header-search">
                        <NavLink to="/AdvancedSearch"><span id="advancedButton"></span></NavLink>
                    </div>
                    <div id="header-buttons"> 
                        <NavLink to="/Cart">
                            <span id="cartButton">
                                <span id="cartCounter">0</span>
                            </span>
                        </NavLink>
                */}   
                        {/**Controlling functions are borrowRequest() in SearchResults.jsx 
                        and handleCartCancel() in CartDisplay.jsx
                        <NavLink to="/Borrowings"><span id="borrowingsButton"></span></NavLink>
                    </div>
                </header>	*/}
                
                <Navbar/>

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
                        render={(props) => <HomePage {...props}
                                basicInput={this.state.basicInput}
                    
                                borrowCart={this.state.borrowCart}
                                searchResults={this.state.searchResults}
                                isNewResultsLoaded={this.state.isNewResultsLoaded}

                                stateUpdater={this.stateUpdater}
                            />
                        }
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
            </HashRouter>    
        );   
    }
}



