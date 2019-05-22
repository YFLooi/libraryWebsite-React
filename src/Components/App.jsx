import React from 'react';
//Controls positioning of individual columns and applies general styling
import './App.css';

//imports React components to render()
import HandleSearch from './HandleSearch/HandleSearch';

// App.js value={this.state.input}
export default class App extends React.Component {
	constructor(props) {
        super(props);	
        
        /*Conditionals need to be pre-initialised, otherwise will be blank if user does not change*/
        this.state = { 
            /*For displaying results*/
            borrowCart: [],
            borrowingsRecord: []
        }
        
        //this.rendersearchResults = this.rendersearchResults.bind(this);

        this.borrowRequest = this.borrowRequest.bind(this);
        this.cartDisplay = this.cartDisplay.bind(this);
        this.handleCartCancel = this.handleCartCancel.bind(this);
        this.handleCartCheckout = this.handleCartCheckout.bind(this);
        this.checkBorrowings = this.checkBorrowings.bind(this);
        this.generateBorrowings = this.generateBorrowings.bind(this);
        this.handleBorrowingsCancel = this.handleBorrowingsCancel.bind(this);
    }
	
    borrowRequest(idx){
        /*'id' here is the book id. It allows access to other data related to 
        the book */
        const buttonText = document.getElementById("borrow."+idx).innerHTML;
        const cart = this.state.borrowCart;
        const searchResults = this.state.searchResults;

        if(buttonText === "Borrow"){
            /**Retrieves index position in searchResults of object having input book id*/
            const targetIndex = searchResults.findIndex(searchResult => searchResult.id === idx)

            /**Obtains the object at the target index position in searchResults */
            const bookData  = this.state.searchResults[targetIndex];

            /*This method adds new book object data to the end of the 
            existing array immutably*/
            this.setState({
                borrowCart: [...cart, bookData]
            })

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
                this.setState({
                    borrowCart: [...cart] //Keep state immutable with spread syntax!
                })
            }
            /**Cancelling a borrow request makes book available to "Borrow" again*/
            document.getElementById("borrow."+idx).innerHTML = "Borrow";       
        }
    }
    cartDisplay(){
        const that = this;

        const cartButton = document.getElementById("cartButton")
        const cartButtonHref = cartButton.getAttribute("href");
        
        const cartDisplay = document.getElementById("cart");
        /*Clears <li> in cartDisplay for another re-rendering*/
        while(cartDisplay.firstChild){
            cartDisplay.removeChild(cartDisplay.firstChild);
        }

        const checkoutButton = document.getElementById("checkoutButton");
        const borrowCart = that.state.borrowCart;
        
        if (cartButtonHref==="OpenCart"){
            /**Check for empty cart*/
            if (borrowCart.length === 0){
                const resultSpan = document.createElement("p");
                resultSpan.appendChild(document.createTextNode("Cart empty"));
                
                cartDisplay.appendChild(resultSpan);
            } else {
                const resultsList = document.createElement("ul");
                resultsList.id = "cartResultsList";

                for(let i=0; i<borrowCart.length; i++){
                    let resultCard = document.createElement("li");
                    resultCard.id = "cartCard."+i;
                    resultCard.setAttribute("href",borrowCart[i].id)

                    let resultSpan = document.createElement("span");
                    let cardImg = document.createElement("img");
                    cardImg.id = "cartCardImg."+borrowCart[i].id;
                    cardImg.src = borrowCart[i].coverimg;
                    cardImg.alt = borrowCart[i].title;
                    cardImg.style = "width:80px; height:100px;"
                    resultSpan.appendChild(cardImg);

                    resultSpan.appendChild(document.createTextNode(borrowCart[i].title+" "));

                    let cancelButton = document.createElement("button");            
                    cancelButton.id = "cancel."+borrowCart[i].id;
                    cancelButton.onclick = function(event){that.handleCartCancel(i);};
                    //cancelButton.addEventListener("click", that.handleCartCancel[i])
                    cancelButton.innerHTML = "X";
                    resultSpan.appendChild(cancelButton);

                    resultCard.appendChild(resultSpan);
                    resultsList.appendChild(resultCard);
                    cartDisplay.appendChild(resultsList);

                    /**checkoutButton should render only if cart has items */
                    checkoutButton.style.display = "block";
                }
            } 
            cartButton.setAttribute("href","CloseCart") 
            cartDisplay.style = "block";
        } else if (cartButtonHref==="CloseCart"){
            checkoutButton.style.display = "none"; //Leaves space for "Cart empty" message    
            cartDisplay.style.display = "none";
            cartButton.setAttribute("href","OpenCart") 
        }
    }
    handleCartCancel(idx){
        /**This setup of getting bookId from the card href is necessary because appending
        this.state.borrowCart[i].id as property "idx" of handleCartCancel() has resulted in
        the "id" going null as books are cleared from the cart
        */
        const cardIndex = document.getElementById("cartCard."+idx)
        const bookId = cardIndex.getAttribute("href");
        
        /**Remove book <li> on click*/
        if (cardIndex.parentNode) {
            cardIndex.parentNode.removeChild(cardIndex);
        }

        /**Updates this.state.borrowCart to reflect book removed */
        const newCart = this.state.borrowCart;
        const targetIndex = newCart.findIndex(cart => cart.id === bookId);
        console.log("Removal target index: "+targetIndex);
        /**No need for this.setState(), splice() updates state*/
        newCart.splice(targetIndex,1)

        /**If user removes all items from cart, the message "Cart empty" 
        appears*/
        if (newCart.length === 0){
            const resultSpan = document.createElement("p");
            resultSpan.appendChild(document.createTextNode("Cart empty"));
            
            const cartDisplay = document.getElementById("cart");
            cartDisplay.appendChild(resultSpan);
        }
    }
    handleCartCheckout(){
        const borrowCart = this.state.borrowCart;

        /**Prevents function handleCartCheckout() from running on an empty cart*/
        if (borrowCart === []){
            alert("You have not selected any books");
        } else {
            /*Store all time data in ms from epoch. This allows conversion at will into date-time using new Date(x)
            where x = Time from epoch in ms*/
            /**"new Date()" retrieves current time, getTime() converts into ms from epoch (1 Jan 1970)*/
            const borrowDate = new Date().getTime();
            /*Calculation converts 14 days to equivalent in miliseconds. Result placed into new Date()
            to convert raw ms into a date (still in ms)*/
            const returnDue = borrowDate + 14*(24*60*60*1000) 
            
            console.log("Book borrow date: "+borrowDate.toString());
            /**toString() Turns the ms date into human-readable date (month-day-year)*/
            console.log("Book due date: "+returnDue.toString());
            
            const bookDetails = [];
            
            function insertDetails(){
                let details = bookDetails

                for(let i =0; i<borrowCart.length; i++){
                    let detailsContainer = {}
                    detailsContainer["id"] = borrowCart[i].id
                    detailsContainer["title"] = borrowCart[i].title
                    detailsContainer["year"] = borrowCart[i].year
                    detailsContainer["author"] = borrowCart[i].author
                    detailsContainer["publisher"] = borrowCart[i].publisher
                    detailsContainer["coverimg"] = borrowCart[i].coverimg
                    
                    //Inserts details extracted into detailsContainer{} into bookDetails[]
                    details[i]=detailsContainer
                }

                return details;
            }
            insertDetails();
            
            let borrowerId = "" /**Initialise as "" */
            borrowerId = prompt("Type your library id:")

            /**If borrowerId === null, the whole site will bug out*/
            if (borrowerId !== "" && borrowerId !== null && typeof borrowerId !== undefined){    
                /**Immutably clears this.state.borrowCart after borrow request is submitted */
                borrowCart.splice(0,borrowCart.length)

                let borrowerIdLowerCase = borrowerId.toLowerCase();

                let borrowingData = {
                    borrowerid: borrowerIdLowerCase,
                    borrowdate: borrowDate,
                    returndue: returnDue,
                    books: bookDetails
                }

                const POSTReqInit = {
                    method:"POST",
                    mode:"cors",   
                    cache:"no-cache",
                    credentials:"same-origin",
                    headers:{
                        "Content-Type": "application/json",
                    },
                    redirect: "error",
                    //Contains data to send. Need to JSON.stringify, pg's auto-convert bugged 
                    //and pg only accepts arrays as JSON, since PSQL does the same
                    body: JSON.stringify(borrowingData) 
                }
                /**Both parameters are initialised with blanks */
                fetch("http://localhost:3005/Create-Borrowings", POSTReqInit)
                    .then(function(response){
                        return response.json()
                        .then(function(data){
                            /**Returns confirmation that entry added for borrowerid = x*/                
                            console.log(data)
                        })
                    })  
                    .catch(function(error){
                        console.log('Request failed', error)
                    })
            }else{
                alert("Please insert your library ID")
            }
        }
    }
    checkBorrowings(){
        const that = this;
        const borrowingsButtonHref = document.getElementById("borrowingsButton").getAttribute("href");
        let borrowingsLock = "" /**Initialise as "" */

        //Password check
        if (borrowingsButtonHref ==="OpenBorrowings"){
            /**Simple password to lock access to librarians only */
            borrowingsLock = prompt("Enter password (Hint: p******d):")
        }

        //Actio now depends on the button's href to open/close the list of borrowers 
        if (borrowingsButtonHref==="OpenBorrowings" && borrowingsLock !== "password"){
            alert("Wrong Password");
        } else if(borrowingsButtonHref==="OpenBorrowings" && borrowingsLock === "password"){
            const GETReqInit = {
                method:"GET",
                mode:"cors",   
                cache:"no-cache",
                credentials:"same-origin",
                redirect: "error",
            }
            /**Both parameters are initialised with blanks */
            fetch("http://localhost:3005/Check-Borrowings", GETReqInit)
                .then(function(response){
                    //pg automatically calls JSON.parse()
                    return response.json()
                    .then(function(data){
                        const borrowingsData = data.map(function(prop){
                            //Headers in psql always in lower case. Convert back to camelCase here
                            let borrowerId = prop.borrowerid
                            let borrowDate = prop.borrowdate
                            let returnDue = prop.returndue
                            //PSQL stores arrays as JSON. Need to parse back into JS
                            let books = JSON.parse(prop.books)

                            return {borrowerId, borrowDate, returnDue, books}
                        })
                        that.generateBorrowings(borrowingsData)
                    })
                })  
                .catch(function(error){
                    console.log('Request failed', error)
                })
        } else if (borrowingsButtonHref==="CloseBorrowings"){
            //Just want to trigger the function to close the borrowings view
            that.generateBorrowings(null)
        }
    }
    generateBorrowings(data){
        const that = this;
        const borrowingsButton = document.getElementById("borrowingsButton")
        const borrowingsButtonHref = borrowingsButton.getAttribute("href");

        const borrowingsDisplay = document.getElementById("borrowings");
        /*Clears <li> in borrowingsDisplay for another re-rendering*/
        while(borrowingsDisplay.firstChild){
            borrowingsDisplay.removeChild(borrowingsDisplay.firstChild);
        }

        that.setState({
            borrowingsRecord: data
        })

        const borrowingsRecord = that.state.borrowingsRecord;
        if (borrowingsButtonHref==="OpenBorrowings"){
            //Check for empty cart
            if (borrowingsRecord.length === 0){
                const recordSpan = document.createElement("p");
                recordSpan.appendChild(document.createTextNode("No record"));
                
                borrowingsDisplay.appendChild(recordSpan);
            } else {
                const recordsList = document.createElement("ol");
                recordsList.id = "borrowingsList";

                for(let i=0; i<borrowingsRecord.length; i++){
                    let recordCard = document.createElement("li");
                    recordCard.id = "borrowingsCard."+i;
                    recordCard.setAttribute("href",borrowingsRecord[i].borrowerId)

                    //toDateString() turns new Date() into "day-of-week month-day-year"
                    let borrowDate = borrowingsRecord[i].borrowDate;
                    let returnDue = borrowingsRecord[i].returnDue;
                    let currentDate = new Date().getTime();
                    
                    //Months start from zero in JS
                    //let testCurrentDate = new Date(2019, 5, 29, 7, 30, 0, 0).getTime();
                    
                    /* toFixed(1) fixes the equation's output to 1 decimal place by turning 
                     * it into a string, so do the math before invoking this method!*/
                    let daysLate = ((currentDate - returnDue)/(1000*60*60*24)).toFixed(1);
                    //Adds a check that ensure currentDaysLate = 0 if daysLate > 0 (not late)
                    let currentDaysLate = "0.00";
                    let lateFine = "0.00"
                    //Use parseFloat to convert the strings of number-decimals (floats) back into numbers
                    if(parseFloat(daysLate) >0){
                        currentDaysLate = daysLate;
                        //Fine rate of 50 sen per day
                        lateFine = (parseFloat(currentDaysLate)*0.5).toFixed(2);
                    } else {
                        currentDaysLate = "0.00";
                        lateFine = "0.00";
                    }

                    let borrowDateString = new Date(parseInt(borrowDate)).toDateString();
                    let returnDueString = new Date(parseInt(returnDue)).toDateString();
                    
                    let recordSpan = document.createElement("span");
                    recordSpan.appendChild(document.createTextNode("Borrower id: "+borrowingsRecord[i].borrowerId+" | "));
                    recordSpan.appendChild(document.createTextNode("Borrow date: "+borrowDateString+" | "));
                    recordSpan.appendChild(document.createTextNode("Return due: "+returnDueString+" | "));
                    recordSpan.appendChild(document.createTextNode("Days late: "+currentDaysLate+" | "));
                    recordSpan.appendChild(document.createTextNode("Late fine: RM "+lateFine+" "));

                    let cancelButton = document.createElement("button");            
                    cancelButton.id = "cancel."+i;
                    //This button should remove a record in the database and delete the borrower's entry
                    cancelButton.onclick = function(event){that.handleBorrowingsCancel(i,borrowDate);};
                    //cancelButton.addEventListener("click", that.handleCartCancel[i])
                    cancelButton.innerHTML = "X";
                    recordSpan.appendChild(cancelButton);

                    
                    let booksDiv = document.createElement("div");
                    let borrowersBooks = borrowingsRecord[i].books;
                    for(let j=0; j<borrowersBooks.length; j++){
                        let bookCard = document.createElement("div");

                        let bookSpan = document.createElement("span");
                        let bookImg = document.createElement("img");
                        bookImg.id = "cartCardImg."+borrowersBooks[j].id;
                        bookImg.src = borrowersBooks[j].coverimg;
                        bookImg.alt = borrowersBooks[j].title;
                        bookImg.style = "width:80px; height:100px;"
                        bookSpan.appendChild(bookImg);
                        
                        bookSpan.appendChild(document.createTextNode(borrowersBooks[j].id+","))
                        bookSpan.appendChild(document.createTextNode(borrowersBooks[j].title+","))
                        bookSpan.appendChild(document.createTextNode(borrowersBooks[j].year+","))
                        bookSpan.appendChild(document.createTextNode(borrowersBooks[j].publisher))
                        
                        bookCard.appendChild(bookSpan);
                        booksDiv.appendChild(bookCard)
                    } 

                    recordCard.appendChild(recordSpan);
                    recordCard.appendChild(booksDiv);
                    recordsList.appendChild(recordCard);
                    borrowingsDisplay.appendChild(recordsList);
                }
            } 
            borrowingsButton.setAttribute("href","CloseBorrowings") 
            borrowingsDisplay.style = "block";
        } else if (borrowingsButtonHref==="CloseBorrowings"){
            borrowingsDisplay.style.display = "none";
            borrowingsButton.setAttribute("href","OpenBorrowings") 
        }
    }
    handleBorrowingsCancel(idx,borrowDate){
        /**This setup of getting bookId from the card href is necessary because appending
        this.state.borrowCart[i].id as property "idx" of handleCartCancel() has resulted in
        the "id" going null as books are cleared from the cart
        */
        const cardIndex = document.getElementById("borrowingsCard."+idx)
        const borrowerId = cardIndex.getAttribute("href");
        console.log(`Data sent for borrower ${borrowerId} who borrowerd on ${borrowDate}`)
        
        /**Remove borrowing <li> on click*/
        if (cardIndex.parentNode) {
            cardIndex.parentNode.removeChild(cardIndex);
        }

        /**Updates borrowingsRecord state and 'borrowings' db table reflect borrowing entry 
         * removed. Updating state prevents need to query table each time an entry is removed
         * to see if no records remain
        */
        /**Updates this.state.borrowCart to reflect book removed */
        const newRecord = this.state.borrowingsRecord;
        const targetIndex = newRecord.findIndex(record => record.borrowerId === borrowerId);
        console.log("Removal target index: "+targetIndex);
        /**No need for this.setState(), splice() updates state*/
        newRecord.splice(targetIndex,1)

        let deleteTarget = {
            targetBorrowerId: borrowerId,
            targetBorrowDate: borrowDate
        }

        const DELETEReqInit = {
            method:"DELETE",
            mode:"cors",   
            cache:"no-cache",
            credentials:"same-origin",
            headers:{
                "Content-Type": "application/json",
            },
            redirect: "error",
            //Contains data to send. Need to JSON.stringify, pg's auto-convert bugged 
            //and pg only accepts arrays as JSON, since PSQL does the same
            body: JSON.stringify(deleteTarget) 
        }
        /**Both parameters are initialised with blanks */
        fetch("http://localhost:3005/Delete-Borrowings", DELETEReqInit)
            .then(function(response){
                return response.json()
                .then(function(data){
                    //Returns confirmation that record deleted for borrowerid = x                
                    console.log(data)
                })
            })  
            .catch(function(error){
                console.log('Request failed', error)
            })
            
        /**If user removes all borrowing entries which is indicated by 
         * this.state.borrowingRecord.length === 0, the message "No record" 
        appears*/
        if (this.state.borrowingsRecord.length === 0){
            const resultSpan = document.createElement("p");
            resultSpan.appendChild(document.createTextNode("No record"));
            
            const cartDisplay = document.getElementById("borrowings");
            cartDisplay.appendChild(resultSpan);
        }
    }
	render() {	    
        return (
            <div>
                <HandleSearch/>            
                <div>
                    <button href="OpenCart" id="cartButton" onClick={this.cartDisplay}>Cart</button> 
                    <div id="cart" style={{display: "none"}}>Cart contents</div>
                    <button id="checkoutButton" style={{display: "none"}} onClick={this.handleCartCheckout}>Checkout</button>
                </div>
                <p></p>
                <div>
                    <button href="OpenBorrowings" id="borrowingsButton" onClick={this.checkBorrowings}>Borrowings</button>
                    <div id="borrowings"></div>
                </div>
            </div>
        ); 
	}
}

