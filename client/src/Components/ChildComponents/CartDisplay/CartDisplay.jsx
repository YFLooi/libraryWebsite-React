import React from 'react';
import CartDisplayRender from './CartDisplayRender.jsx'

export default class CartDisplay extends React.Component {
    constructor(props){
        super(props);

        this.handleCartCancel = this.handleCartCancel.bind(this);
        this.handleCartCheckout = this.handleCartCheckout.bind(this);
    }
    componentDidMount(){
        if (this.props.borrowCart.length === 0){
            document.getElementById("cartDisplay").style.display = 'none';
            document.getElementById("cartEmptyDisplay").style.display = 'block';
        } else {
            document.getElementById("cartDisplay").style.display = 'block';
            document.getElementById("cartEmptyDisplay").style.display = 'none';
        }
    }
    handleCartCancel(idx){
        /**This setup of getting bookId from the card href is necessary because appending
        this.props.borrowCart[i].id as property "idx" of handleCartCancel() has resulted in
        the "id" going null as books are cleared from the cart
        */
        const cardIndex = document.getElementById("cartCard."+idx)
        const bookId = cardIndex.getAttribute("href");
        console.log(cardIndex);
        console.log(bookId);
        
        /**Remove book <li> on click
        if (cardIndex.parentNode) {
            cardIndex.parentNode.removeChild(cardIndex);
        }*/
        cardIndex.style.display = 'none';

        console.log("Current books in cart:"+this.props.borrowCart);
        console.log(this.props.borrowCart);

        /**Updates this.state.borrowCart to reflect book removed */
        const newCart = this.props.borrowCart
        const targetIndex = this.props.borrowCart.findIndex(cart => cart.id === bookId);
        console.log("Removal target index: "+targetIndex);
        //This returns the array minus the data removed at the target index
        //If we want the data removed, set this equal to a variable, aka const x = newCart.splice(x,x)
        //const x will be = data removed
        newCart.splice(targetIndex,1) 
        /**Passes update made to copy of state back to state*/
        this.props.stateUpdater("borrowCart",newCart)

        console.log("New books in cart:");
        console.log(this.props.borrowCart);
        //Updates #cartCounter to show number of books in this.props.borrowcart
        //Use newCart instead of this.props.borrowCart because it updates first
        document.getElementById("cartCounter").innerHTML = parseInt(newCart.length,10);
    
        /**If user removes all items from cart, the message "Cart empty" 
        appears*/
        if (newCart.length === 0){   
            const cartEmptyDisplay = document.getElementById("cartEmptyDisplay");
            cartEmptyDisplay.style.display = 'block';

            const checkoutButton= document.getElementById("checkoutButton");
            checkoutButton.style.display = 'none';
        }
    }
    handleCartCheckout () {
        const borrowCart = this.props.borrowCart;
    
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
                    cache:"no-cache",
                    headers:{
                        "Content-Type": "application/json",
                    },
                    redirect: "error",
                    //Contains data to send. Need to JSON.stringify, pg's auto-convert bugged 
                    //and pg only accepts arrays as JSON, since PSQL does the same
                    body: JSON.stringify(borrowingData) 
                }
                /**Both parameters are initialised with blanks */
                fetch("/Create-Borrowings", POSTReqInit)
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

                //Blots out the checkoutButton again because cart becomes empty after checkout
                document.getElementById("checkoutButton").style.display = "none";

                //Reverts cart back to "empty" after checkout
                const cartDisplay = document.getElementById("cartDisplay");
                /*Clears <li> in cartDisplay*/
                while(cartDisplay.firstChild){
                    cartDisplay.removeChild(cartDisplay.firstChild);
                }
                const cartEmptyDisplay = document.getElementById("cartEmptyDisplay");
                cartEmptyDisplay.style.display = 'block';
                alert("Books added to account of ID: "+borrowerId);

                //Updates #cartCounter to show number of books in this.props.borrowcart after checkout
                document.getElementById("cartCounter").innerHTML = 0;
            }else{
                alert("Please insert your library ID")
            }
        }
    }
    render() {
		return (
            <React.Fragment>
                <CartDisplayRender
                    borrowCart = {this.props.borrowCart}
                    handleCartCancel = {this.handleCartCancel}
                    handleCartCheckout = {this.handleCartCheckout}
                />
            </React.Fragment>
		);
	}
}
