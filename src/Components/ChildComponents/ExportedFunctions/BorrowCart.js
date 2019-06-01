function cartDisplay () {
    const that = this;

    const cartButton = document.getElementById("cartButton")
    const cartButtonHref = cartButton.getAttribute("href");
    
    const cartDisplay = document.getElementById("cartDisplay");
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
        document.getElementById("cartDisplay-page").style.display = "block";
        cartDisplay.style.display = "block";
    } else if (cartButtonHref==="CloseCart"){
        checkoutButton.style.display = "none"; //Leaves space for "Cart empty" message    
        document.getElementById("cartDisplay-page").style.display = "none";
        cartDisplay.style.display = "none";
        cartButton.setAttribute("href","OpenCart") 
    }
}
function handleCartCancel (idx) {
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
        
        const cartDisplay = document.getElementById("cartDisplay");
        cartDisplay.appendChild(resultSpan);
    }
}
function handleCartCheckout () {
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

export{
    cartDisplay,
    handleCartCancel,
    handleCartCheckout,
}