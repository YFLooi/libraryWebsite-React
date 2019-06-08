import React from 'react';

export default class CartDisplay extends React.Component {
    constructor(props){
        super(props);

        this.cartDisplay = this.cartDisplay.bind(this);
        this.handleCartCancel = this.handleCartCancel.bind(this);
        this.handleCartCheckout = this.handleCartCheckout.bind(this);
    }
    componentDidMount(){
        //Runs function to render cart when Router URL is /Cart
        this.cartDisplay();
    }
    cartDisplay () {
        const that = this;
        
        const cartDisplay = document.getElementById("cartDisplay");
        /*Clears <li> in cartDisplay for another re-rendering*/
        while(cartDisplay.firstChild){
            cartDisplay.removeChild(cartDisplay.firstChild);
        }
    
        const checkoutButton = document.getElementById("checkoutButton");
        const borrowCart = that.props.borrowCart;
       
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
    }
    handleCartCancel(idx){
        /**This setup of getting bookId from the card href is necessary because appending
        this.props.borrowCart[i].id as property "idx" of handleCartCancel() has resulted in
        the "id" going null as books are cleared from the cart
        */
        const cardIndex = document.getElementById("cartCard."+idx)
        const bookId = cardIndex.getAttribute("href");
        
        /**Remove book <li> on click*/
        if (cardIndex.parentNode) {
            cardIndex.parentNode.removeChild(cardIndex);
        }
    
        /**Updates this.state.borrowCart to reflect book removed */
        const targetIndex = this.props.borrowCart.findIndex(cart => cart.id === bookId);
        console.log("Removal target index: "+targetIndex);
        const newCart = this.props.borrowCart.splice(targetIndex,1)
        /**Passes update made to copy of state back to state*/
        this.props.stateUpdater("borrowCart",newCart)
    
        /**If user removes all items from cart, the message "Cart empty" 
        appears*/
        if (newCart.length === 0){
            const resultSpan = document.createElement("p");
            resultSpan.appendChild(document.createTextNode("Cart empty"));
            
            const cartDisplay = document.getElementById("cartDisplay");
            cartDisplay.appendChild(resultSpan);
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

                //Blots out the checkoutButton again because cart becomes empty after checkout
                document.getElementById("checkoutButton").style.display = "none";

                //Reverts cart back to "empty" after checkout
                const cartDisplay = document.getElementById("cartDisplay");
                /*Clears <li> in cartDisplay*/
                while(cartDisplay.firstChild){
                    cartDisplay.removeChild(cartDisplay.firstChild);
                }
                
                const resultSpan = document.createElement("p");
                resultSpan.appendChild(document.createTextNode("Cart empty"));
                cartDisplay.appendChild(resultSpan);
                alert("Books added to account of ID: "+borrowerId);
            }else{
                alert("Please insert your library ID")
            }
        }
    }
    render() {
		return (
            <div id="cartDisplay-page">
                <h1>Cart contents:</h1>
                <div id="cartDisplay"></div>
                {/**checkoutButton only display if items are present in cart*/}
                <button id="checkoutButton" style={{display: "none"}} onClick={this.handleCartCheckout}>Checkout</button>
            </div>
		);
	}
}
