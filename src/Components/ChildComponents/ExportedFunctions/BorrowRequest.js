export default function borrowRequest (idx) {
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
            this.props.stateUpdater("borrowCart",updatedBorrowCart) 
        }
        /**Cancelling a borrow request makes book available to "Borrow" again*/
        document.getElementById("borrow."+idx).innerHTML = "Borrow";       
    }
}