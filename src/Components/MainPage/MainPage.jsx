import React from 'react';
import "./MainPage.css";

import NewArrivals from "./ChildComponents/NewArrivals/NewArrivals.jsx";
import BasicSearch from "./ChildComponents//BasicSearch/BasicSearch.jsx";
import AdvSearch from "./ChildComponents/AdvSearch/AdvSearch.jsx";
import renderResults from "./ExportedFunctions/RenderResults.js";
import { 
    handleBasicSearchChange,
    handleBasicSearchSubmit,
    handleAdvSearchChange,
    handleAdvSearchSubmit 
} from "./ExportedFunctions/Search.js";
import{
    borrowRequest,
    cartDisplay,
    handleCartCancel,
    handleCartCheckout,
} from "./ExportedFunctions/BorrowCart.js";

export default class MainPage extends React.Component {
    constructor(props){
        super(props);
 
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

            searchResults:[],
            borrowCart: [],
        }

        //Notice how 'this' is missing on the right side for imported functions
        //Handles basic search
        this.handleBasicSearchChange = handleBasicSearchChange.bind(this);
        this.handleBasicSearchSubmit = handleBasicSearchSubmit.bind(this);

        //Handles advanced search
        this.handleAdvSearchChange = handleAdvSearchChange.bind(this);
        this.handleAdvSearchSubmit = handleAdvSearchSubmit.bind(this);

        //Renders search results
        this.renderResults = renderResults.bind(this);
      
        //Handles borrowCart
        this.borrowRequest = borrowRequest.bind(this);
        this.cartDisplay = cartDisplay.bind(this);
        this.handleCartCancel = handleCartCancel.bind(this);
        this.handleCartCheckout = handleCartCheckout.bind(this);
    } 
    render() {
        return(
            <div>
                <header>
                    <span className="header-logo">
                        <img className="logo" src="./assets/logo.png" alt="library"/>
                    </span>

                    <span className="header-search">
                        <BasicSearch 
                            basicInput={this.state.basicInput}
                            handleBasicSearchChange={this.handleBasicSearchChange}
                            handleBasicSearchSubmit={this.handleBasicSearchSubmit}
                        />
                    </span>
                    <span className="cart-button">
                        <button href="OpenCart" id="cartButton" onClick={this.cartDisplay}></button>
                    </span>
                    <span id="borrowings-button" className="borrowings-button"></span>
                </header>	
               
                <NewArrivals/>

                <AdvSearch 
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

                    handleAdvSearchChange={this.handleAdvSearchChange}
                    handleAdvSearchSubmit={this.handleAdvSearchSubmit}
                />
                <p></p>
                <div id="searchResults-page" style={{display: "none"}}>
                    <h1>Generated search results</h1>
                    <div id="searchResults"></div>           
                </div>    
                <p></p>
                <div id="cartDisplay-page" style={{display: "none"}}>
                    <h1>Cart contents:</h1>
                    <div id="cartDisplay"></div>
                    {/**checkoutButton only display if items are present in cart*/}
                    <button id="checkoutButton" style={{display: "none"}} onClick={this.handleCartCheckout}>Checkout</button>
                </div>
            </div>
        );
    }
}



