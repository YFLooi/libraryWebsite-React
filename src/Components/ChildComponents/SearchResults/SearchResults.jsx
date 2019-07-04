import React from 'react';
import {
    //Allows us to connect to <Hashrouter/> from a child component
    withRouter
  } from "react-router-dom"; 
import "./SearchResults.css"
import RenderResults from './RenderResults.jsx'

class SearchResults extends React.Component {
    constructor(props){
        super(props);

        this.renderResults = this.renderResults.bind(this);
        this.borrowRequest = this.borrowRequest.bind(this);
    }
    componentDidMount(){
        if(this.props.searchResults.length === 0){
            //Ensures when page refreshes or if this.state.searchResults is empty, 
            //there is no way to land on a blank results page
            this.props.history.push('/');
        } 
    }
    renderResults (data, brrwCart) {
        let that = this;
        const searchResults = this.props.searchResults
        const renderTarget = document.getElementById("searchResults");

        /**Clears "searchResults" <div/> on each new submit to prevent stacking with prior results*/
        while(renderTarget.firstChild){
            renderTarget.removeChild(renderTarget.firstChild);
        }
    
        const resultContent = document.createElement("div");
        const resultList = document.createElement("ul");
        const renderLength = searchResults.length;
        const borrowCart = brrwCart;
       
        for(let i=0; i<renderLength; i++){
            const resultCard = document.createElement("li");

            const resultSpan = document.createElement("span");

            let cardImg = document.createElement("img");
            cardImg.id = "cardImg."+searchResults[i].id;
            cardImg.src = searchResults[i].coverimg;
            cardImg.alt = searchResults[i].title;
            cardImg.style = "width:80px; height:100px;"
            resultSpan.appendChild(cardImg);

            resultSpan.appendChild(document.createTextNode(searchResults[i].title+" "));

            /*To change innerHTML of 'borrow' button to "Cancel" if book has been borrowed*/
            /**findIndex() here checks for match between searchResult and cart contents
                If there is a match (!= -1)), 'borrow' button inner HTML is set to "Cancel" */
            let cartCheck = borrowCart.findIndex(cart => cart.id === searchResults[i].id);
            
            let borrowButton = document.createElement("button");            
            borrowButton.id = "borrow."+searchResults[i].id;
            //Must specify "this" to be equal to "const that" to be defined
            borrowButton.onclick = function(event){that.borrowRequest(searchResults[i].id);};
            if (cartCheck === -1){
                borrowButton.innerHTML = "Borrow";
                resultSpan.appendChild(borrowButton);
            } else {
                borrowButton.innerHTML = "Cancel";
                resultSpan.appendChild(borrowButton);
            }

            resultCard.appendChild(resultSpan);
            resultList.appendChild(resultCard);
        }

        resultContent.appendChild(resultList);
        renderTarget.appendChild(resultContent);
        document.getElementById("searchResults-page").style.display = "block";

        //Ensures page does not redirect to /Search-Results if user goes to another page
        this.props.stateUpdater("isNewResultsLoaded",false)
    }    
    borrowRequest (idx) {
        /*'id' here is the book id. It allows access to other data related to 
        the book */
        const buttonText = document.getElementById("borrow."+idx).innerHTML;
        const cart = this.props.borrowCart;
        const searchResults = this.props.searchResults;
    
        if(buttonText === "Borrow"){
            /**Retrieves index position in searchResults of object having input book id*/
            const targetIndex = searchResults.findIndex(searchResult => searchResult.id === idx)
    
            /**Obtains the object at the target index position in searchResults */
            const bookData  = searchResults[targetIndex];
    
            /*This method adds new book object data to the end of the 
            existing array immutably*/
            let updatedBorrowCart = [...cart, bookData]
            this.props.stateUpdater("borrowCart",updatedBorrowCart)

            //Updates #cartCounter to show number of books in this.props.borrowcart
            //Use updatedBorrowCart instead of this.props.borrowCart because it updates first
            document.getElementById("cartCounter").innerHTML = parseInt(updatedBorrowCart.length,10);
    
            /*Changes button to say "Cancel" after being clicked*/
            document.getElementById("borrow."+idx).innerHTML = "Cancel";
        }else if(buttonText === "Cancel"){
            //Find index containing target book id from borrowCart
            const targetIndex = cart.findIndex(x => x.id === idx)
            console.log("Target of removal position: "+targetIndex);
    
            //Condition prevents .splice if id to remove not in cart 
            if(targetIndex !== -1){
                /*Removes item at targetPosition. If we set const new = cart.splice(), 
                "const new" has a value = the removed item*/
                cart.splice(targetIndex,1);  
                let updatedBorrowCart = [...cart] //Keep state immutable with spread syntax!               
                console.log(updatedBorrowCart.length)
                this.props.stateUpdater("borrowCart",updatedBorrowCart) 

                //Updates #cartCounter to show number of books in this.props.borrowcart
                //Use updatedBorrowCart instead of this.props.borrowCart because it updates first
                document.getElementById("cartCounter").innerHTML = parseInt(updatedBorrowCart.length,10);
            }
            /**Cancelling a borrow request makes book available to "Borrow" again*/
            document.getElementById("borrow."+idx).innerHTML = "Borrow";       
        }
    }
    render() { 
        return (
            <React.Fragment>
                <RenderResults
                    searchResults = {this.props.searchResults}
                    renderResults = {this.renderResults}
                    borrowRequest = {this.borrowRequest}
                />
            </React.Fragment>
        );
	}
}

export default withRouter(SearchResults);