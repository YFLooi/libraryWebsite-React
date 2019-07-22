import React from 'react';
import { useEffect, useState } from 'react';
import { Switch, Route } from "react-router-dom";

import logo from './logo.svg';
import './App.css';

import HomePage from "./ChildComponents/HomePage/HomePage.jsx";
import LoadingScreen from "./ChildComponents/LoadingScreen/LoadingScreen.jsx";
import AdvSearch from "./ChildComponents/AdvSearch/AdvSearch.jsx";
import SearchResults from "./ChildComponents/SearchResults/SearchResults.jsx";
import CartDisplay from "./ChildComponents/CartDisplay/CartDisplay.jsx";
import Borrowings from "./ChildComponents/Borrowings/Borrowings.jsx";

//For material UI navbar
import Navbar from './Navbar.jsx'

class App extends React.Component {
  constructor(props){
      super(props);

     /**Placing all states in single parent page allows for easier manipulation with Redux later*/
     this.state = {
        //For the est
        cards: [],

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
    this.renderData = this.renderData.bind(this);
  }
  stateUpdater(name,data){
    /* [] allows an external variable to define object property "name". In this case, 
    it's parameter "name".*/
    this.setState({
        [name]: data
    })
  }
  //Runs on ComponentDidMount() 
  componentDidMount(){
    const that = this;
    fetch('/NewArrivals', {method:"GET"})
    //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
    .then(function(response){
        return response.json()
        //Examines data in response
        .then(function(data){
            console.log(data)
            that.renderData(data)
        })
    }).catch(function(error){
        console.log('Request failed', error)
    })  
  }
  renderData(data){ 
    this.state.cards.splice(0, this.state.cards.length);
    let newCards = [];
    newCards.splice(0, newCards.length);

    for(let i=0; i<4; i++){
      let card = [
        <div key={`card.${i}`} style={{width: '100%', height: 'auto', border:'1px solid white'}}>
            {data[i].title}
        </div>
      ]
      newCards = [...newCards, ...card]
    }
    this.setState({
      cards: [...newCards]
    }) 
  }
  render(){
    return (
      <React.Fragment>
        <div className="App">
          {/*
          <header className="App-header">
            <div>
              Titles available:
              {this.state.cards}
            </div>
            <img src={logo} className="App-logo" alt="logo" />
            <p>
              Edit <code>src/App.js</code> and save to reload.
            </p>
            <a
              className="App-link"
              href="https://reactjs.org"
              target="_blank"
              rel="noopener noreferrer"
            >
              Learn React
            </a>
          </header>
          */ }
        </div>
      
        <Navbar/>

        <Switch>
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
                  passwordInput={this.state.passwordInput}
                  borrowingsRecord={this.state.borrowingsRecord}
                  isBorrowingsPasswordCorrect={this.state.isBorrowingsPasswordCorrect}
                  expandList = {this.state.expandList}
                  stateUpdater={this.stateUpdater}
              />}
          />

        </Switch>
      </React.Fragment>
    );
  }
}

export default App;
