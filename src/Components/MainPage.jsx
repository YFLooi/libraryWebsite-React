import React from 'react';
import {
    Route,
    NavLink,
    HashRouter
  } from "react-router-dom";
import "./MainPage.css";

import NewArrivals from "./ChildComponents/NewArrivals/NewArrivals.jsx";
import BasicSearch from "./ChildComponents//BasicSearch/BasicSearch.jsx";
import AdvSearch from "./ChildComponents/AdvSearch/AdvSearch.jsx";
import SearchResults from "./ChildComponents/SearchResults/SearchResults.jsx";
import CartDisplay from "./ChildComponents/CartDisplay/CartDisplay.jsx";
import Borrowings from "./ChildComponents/Borrowings/Borrowings.jsx";

import{
    cartDisplay,
    handleCartCancel,
    handleCartCheckout,
} from "./ChildComponents/ExportedFunctions/BorrowCart.js";

export default class MainPage extends React.Component {
    constructor(props){
        super(props);
        
        /**Placing all states in single parent page allows for easier manipulation with Redux later*/
        this.state = {
            /*For new arrivals top 20*/
            newArrivals: [],
            isNewArrivalsLoaded: false,

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

            searchResults:[],
            borrowCart: [],
        }
        this.stateUpdater = this.stateUpdater.bind(this);

        //Handles borrowCart
        this.cartDisplay = cartDisplay.bind(this);
        this.handleCartCancel = handleCartCancel.bind(this);
        this.handleCartCheckout = handleCartCheckout.bind(this);
    } 
    /**Have to place here to ensure isNewArrivalsLoaded is updated to render entire page*/
    componentDidMount(){
        try {
            let that = this; //Prevents 'this' from being undefined

            /*Fetches the data on page load for the New Arrivals slideshow*/
            fetch('http://localhost:3005/newArrivals', {method:"GET", mode:"cors"})
                //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
                .then(function(response){
                    return response.json()
                    //Examines data in response
                    .then(function(data){
                        console.log(data)

                        let updatedNewArrivals = that.state.newArrivals
                        updatedNewArrivals.splice(0,updatedNewArrivals.length);
                        //This immutably updates state 
                        that.setState({
                            newArrivals: [...updatedNewArrivals, ...data],
                            isNewArrivalsLoaded: true
                        })

                        if(that.state.isNewArrivalsLoaded === true){
                            that.generateArrivals()
                        }else{
                            console.log("No data received on new arrivals")
                        }
                    })
                })  
                .catch(function(error){
                    console.log('Request failed', error)
                })
        } catch (e) {
            if (this.props.newArrivals === []) {
                console.log("Error loading top 20 books");
            }        
        }
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
        if(this.state.isNewArrivalsLoaded===false){
            return(
                <p>Fetching data from server...</p>
            );
        } else {
            return(
                <div>
                    <header>
                        <span className="header-logo">
                            <img className="logo" src="./assets/logo.png" alt="library"/>
                        </span>
    
                        <span className="header-search">
                            <BasicSearch 
                                basicInput={this.state.basicInput}
                                
                                borrowCart={this.state.borrowCart}
                                searchResults={this.state.searchResults}
    
                                stateUpdater={this.stateUpdater}
                            />
                        </span>
                        <span className="cart-button">
                            <button href="OpenCart" id="cartButton" onClick={this.cartDisplay}></button>
                        </span>
                        <span id="borrowings-button" className="borrowings-button"></span>
                    </header>	

                    <HashRouter>
                        <ul className="navbar">
                            {/**'to' is an identifier prop to ensure the right content is loaded */}
                            <li><NavLink to="/Home">Home</NavLink></li>
                            <li><NavLink to="/Advanced-Search">Advanced Search</NavLink></li>
                            <li><NavLink to="/Search-Results">Search Results</NavLink></li>
                            <li><NavLink to="/Cart">Cart</NavLink></li>
                            <li><NavLink to="/Borrowings">Borrowings</NavLink></li>
                        </ul>

                        <div className="content">
                            {/**Matches URL defined in "to" prop to correct content (components)
                            When the NavLink for "/" is clicked, the contents of the render() method
                            in component "Home" are rendered here in the "content" <div>*/}
                            <Route 
                                path="/Home" 
                                render={(props) => <NewArrivals {...props}
                                    newArrivals={this.state.newArrivals} 
                                    isNewArrivalsLoaded={this.state.isNewArrivalsLoaded}
                                    stateUpdater={this.stateUpdater}
                                />}
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
                                    
                                    borrowCart={this.state.borrowCart}
                                    searchResults={this.state.searchResults}
                
                                    stateUpdater={this.stateUpdater}
                                />}
                            />
                            <Route 
                                path="/Search-Results" 
                                component={SearchResults}
                            />
                            <Route 
                                path="/Cart" 
                                render={(props) => <CartDisplay {...props}
                                    handleCartCheckout={this.handleCartCheckout}
                                />}
                            />
                            <Route 
                                path="/Borrowings" 
                                component={Borrowings}
                            />

                        </div>
                    </HashRouter>    
                </div>
            );   
        }       
    }
}



