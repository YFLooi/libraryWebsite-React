import React from 'react';
import {
    BrowserRouter,
    Switch,
    Route
} from "react-router-dom";

import HomePage from "./ChildComponents/HomePage/HomePage.jsx";
import LoadingScreen from "./ChildComponents/LoadingScreen/LoadingScreen.jsx";
import AdvSearch from "./ChildComponents/AdvSearch/AdvSearch.jsx";
import SearchResults from "./ChildComponents/SearchResults/SearchResults.jsx";
import NoResults from "./ChildComponents/NoResults/NoResults.jsx";
import CartDisplay from "./ChildComponents/CartDisplay/CartDisplay.jsx";
import Borrowings from "./ChildComponents/Borrowings/Borrowings.jsx";
import Explore from "./ChildComponents/Explore/Explore.jsx";
import SuggestBooks from "./ChildComponents/SuggestBooks/SuggestBooks.jsx";

//For material UI navbar
import Navbar from './Navbar.jsx'

export default class App extends React.Component {
    constructor(props){
        super(props);
        
        /**Placing all states in single parent page allows for easier manipulation with Redux later*/
        this.state = {
            /**For basic search*/
            basicInput: '',

            /*For advanced search*/
            advTitle: '',
            condTitAuth:'OR',
            advAuthor: '',
            condAuthYr:'OR',
            advYearStart: '',
            advYearEnd: '',
            condYrPub: 'OR',
            advPublisher: '',
            condPubSynp:'OR',
            advSynopsis: '',

            //For rendering search results
            searchResults: [],
            //Checks if new results retrived by Basic and AdvSearch on submit.
            //"false" on page refresh and on 1st render at /Search-Results
            isNewResultsLoaded: false, 

            //For rendering cart contents
            borrowCart: [],
            
            //For rendering list of borrowers and their details
            borrowingsRecord: [],
            passwordInput: '',
            isBorrowingsPasswordCorrect: false,
            expandList: false,
        }
        this.stateUpdater = this.stateUpdater.bind(this);
    } 
    stateUpdater(name,data){
        /* [] allows an external variable to define object property "name". In this case, 
        it's parameter "name".*/
        this.setState({
            [name]: data
        })
    }
    render() {
        return(
            <BrowserRouter>
                <Navbar/>

                <Switch>
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
                        path="/NoResults"
                        component={NoResults}
                    />}
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
                            passwordInput={this.state.passwordInput}
                            borrowingsRecord={this.state.borrowingsRecord}
                            isBorrowingsPasswordCorrect={this.state.isBorrowingsPasswordCorrect}
                            expandList = {this.state.expandList}
                            stateUpdater={this.stateUpdater}
                        />}
                    />
                    <Route 
                        path="/Explore"
                        render={(props) => <Explore {...props} 
                            borrowCart={this.state.borrowCart}
                            stateUpdater={this.stateUpdater}
                        />}
                    />}
                    <Route 
                        path="/SuggestBooks"
                        component={SuggestBooks}
                    />}
                </Switch>
            </BrowserRouter>    
        );   
    }
}



