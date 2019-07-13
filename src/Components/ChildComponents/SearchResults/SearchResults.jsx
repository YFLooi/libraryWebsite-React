import React from 'react';
import {
    //Allows us to connect to <Hashrouter/> from a child component
    withRouter
  } from "react-router-dom"; 
import SearchResultsRender from './SearchResultsRender.jsx'

class SearchResults extends React.Component {
    constructor(props){
        super(props);

        this.borrowRequest = this.borrowRequest.bind(this);
    }
    componentDidMount(){
        if(this.props.searchResults.length === 0){
            //Ensures when page refreshes or if this.state.searchResults is empty, 
            //there is no way to land on a blank results page
            this.props.history.push('/');
        } 
        //Ensures page does not redirect to /Search-Results if user goes to another page
        this.props.stateUpdater("isNewResultsLoaded",false)
    }
    borrowRequest (idx) {
        /*'id' here is the book id. It allows access to other data related to 
        the book */
        console.log('Borrow request made');
        const targetButton = document.getElementById("borrow."+idx)
        //Specify [0] to return the first match to the className
        const buttonText = targetButton.getElementsByClassName('MuiButton-label')[0].innerHTML;
        
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
    
            //Changes button to say "Cancel" after being clicked
            //document.querySelector('.borrow.'+idx+'.MuiButton-label').innerHTML = "Cancel";
            targetButton.getElementsByClassName('MuiButton-label')[0].innerHTML = 'Cancel';
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
            targetButton.getElementsByClassName('MuiButton-label')[0].innerHTML = "Borrow";       
        }else{
            console.log('buttonText is not "Borrow" nor "Cancel"');
        }
    }
    render() { 
        return (
            <React.Fragment>
                <SearchResultsRender
                    searchResults = {this.props.searchResults}
                    borrowCart = {this.props.borrowCart}
                    stateUpdater = {this.props.stateUpdater}
                    borrowRequest = {this.borrowRequest}
                />
            </React.Fragment>
        );
	}
}

export default withRouter(SearchResults);