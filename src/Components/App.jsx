import React from 'react';

//Controls positioning of individual columns and applies general styling
import './App.css';

//imports React components to render()
import Header from "./Header/Header.jsx";
import NewArrivals from "./NewArrivals/NewArrivals.jsx";

// App.js value={this.state.input}
export default class App extends React.Component {
	constructor(props) {
        super(props);	
        
        /*Conditionals need to be pre-initialised, otherwise will be blank if user does not change*/
        this.state = {
            /*For new arrivals top 20*/
            newarrivals: [],
            isLoaded: false,
            
            /*For basic search*/
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

            /*For displaying results*/
            searchResults: [],
            borrowCart: []
        }
        
        this.handleBasicSearchChange = this.handleBasicSearchChange.bind(this);
        this.handleBasicSearchSubmit = this.handleBasicSearchSubmit.bind(this);
        
        this.handleAdvSearchChange = this.handleAdvSearchChange.bind(this);
        this.handleAdvSearchSubmit = this.handleAdvSearchSubmit.bind(this);

        this.rendersearchResults = this.rendersearchResults.bind(this);
        
        this.checkbasicInput = this.checkbasicInput.bind(this);
        this.checkadvInput = this.checkadvInput.bind(this);
        this.checkSearchResults = this.checkSearchResults.bind(this);
        this.checkborrowCart = this.checkborrowCart.bind(this);

        this.borrowRequest = this.borrowRequest.bind(this);
        this.cartDisplay = this.cartDisplay.bind(this);
        this.handleCartCancel = this.handleCartCancel.bind(this);
        this.handleCartCheckout = this.handleCartCheckout.bind(this);
        this.checkBorrowings = this.checkBorrowings.bind(this);
    }
	componentDidMount(){
        let that = this; //Prevents 'this' from being undefined

        /*Fetches the data on page load for the New Arrivals slideshow*/
        fetch('http://localhost:3005/NewArrivals', {mode:'cors'})
            //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
            .then(function(response){
                return response.json()
                //Examines data in response
                .then(function(data){
                    that.setState({
                        newarrivals: data,
                        isNewArrivalsLoaded: true
                    })
                })
            })  
            .catch(function(error){
                console.log('Request failed', error)
            })
    }
    handleBasicSearchChange(event){
        event.preventDefault();
        this.setState({
			basicInput: event.target.value
        });
    }
    handleBasicSearchSubmit(event) { 
        event.preventDefault();
        let that = this;

        /*Clears this.state.searchResults to prevent stacking of each new set of 
        search results*/
        this.setState({
			searchResults: []
        });

        const basicInput = this.state.basicInput;

        if(basicInput !== ""){
            fetch("http://localhost:3005/BasicSearch/"+basicInput, {method: "GET",mode:"cors"})
                //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
                .then(function(response){
                    return response.json()
                    .then(function(data){
                        console.log(data);
                         
                        /**let that=this to prevent 'this is undefined error' */
                        that.rendersearchResults(data);
                    })
                })  
                .catch(function(error){
                    console.log('Request failed', error)
                })
        } else {
            console.log("Blank query made. No query submitted");
        }
    }
    handleAdvSearchChange(event){ 
        /*When called, it looks for the state with the same name 
        as the <input> box and updates it as =event.target.value 
        (value or content of input box)*/
        /*Only works if <input> has same name as state!*/
        this.setState({ 
            [event.target.name]: event.target.value 
        })   
    }
    handleAdvSearchSubmit(event){
        let that = this;
        event.preventDefault();

        /*Clears this.state.searchResults on each new search to prevent arrays 
        of each search's results within arrays!*/
        let searchResults = this.state.searchResults;
        searchResults.splice(0,searchResults.length)
        
        /*JSON.parse cannot accept blank strings, "". The if-else here inserts string "null"
        if it detects the submitted state is ""*/
        const advTitle = this.state.advTitle === "" ? "null" : this.state.advTitle;
        const condTitAuth = this.state.condTitAuth 
        const advAuthor = this.state.advAuthor === "" ? "null" : this.state.advAuthor;
        const condAuthYr = this.state.condAuthYr;
        const advYearStart = this.state.advYearStart === "" ? "null" : this.state.advYearStart;
        const advYearEnd = this.state.advYearEnd === "" ? "null" : this.state.advYearEnd;
        const condYrPub = this.state.condYrPub;
        const advPublisher = this.state.advPublisher === "" ? "null" : this.state.advPublisher;
        const condPubSynp = this.state.condPubSynp;
        const advSynopsis = this.state.advSynopsis === "" ? "null" : this.state.advSynopsis;

        console.log(advTitle+condTitAuth+advAuthor+condAuthYr+advYearStart+" to "+advYearEnd+condYrPub+advPublisher+condPubSynp+advSynopsis)

        /*Search occurs as long as one advSearch parameter is not a "null" string*/
        if(advTitle === "null" &&  advAuthor === "null" && advPublisher === "null" && 
        advYearStart === "null" && advYearEnd === "null" && advPublisher === "null" 
        && advSynopsis === "null"){
            console.log("Blank query made. No query submitted");
        } else {
            fetch("http://localhost:3005/AdvSearch/"+advTitle+"/"+condTitAuth+"/"+advAuthor+"/"+condAuthYr+
            "/"+advYearStart+"/"+advYearEnd+"/"+condYrPub+"/"+advPublisher+"/"+condPubSynp+"/"+advSynopsis
            ,{method:"GET",mode:"cors"})
                //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
                .then(function(response){
                    return response.json()
                    .then(function(data){
                        console.log(data);

                        /**let that=this to prevent 'this is undefined error' */
                        that.rendersearchResults(data);
                    })
                })  
                .catch(function(error){
                    console.log('Request failed', error)
                })
        }
    }
    rendersearchResults(data){
        const that = this

        this.setState(prevState => ({
            /*Works similar to array.concat() method*/
            searchResults: [...prevState.searchResults, ...data]
        }))

        /**Cut out like entries by combining indexOf() and splice() and running then in a 
        for loop */

        const renderTarget = document.getElementById("searchResults");
        /**Clears "searchResults" div on each new submit to prevent stacking with prior results*/
        //renderTarget.innerHTML = ""; 
        while(renderTarget.firstChild){
            renderTarget.removeChild(renderTarget.firstChild);
        }

        const resultContent = document.createElement("div");
        const resultList = document.createElement("ul");
        const renderLength = this.state.searchResults.length;
        const searchResults = this.state.searchResults;
        const borrowCart = this.state.borrowCart;
        
        if (this.state.searchResults.length === 0) {
            alert("No results found. Try again");
        } else {
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
                 
                if (cartCheck === -1){
                    let borrowButton = document.createElement("button");            
                    borrowButton.id = "borrow."+searchResults[i].id;
                    borrowButton.onclick = function(event){that.borrowRequest(searchResults[i].id);};
                    borrowButton.innerHTML = "Borrow";
                    resultSpan.appendChild(borrowButton);
                } else {
                    let borrowButton = document.createElement("button");            
                    borrowButton.id = "borrow."+searchResults[i].id;
                    borrowButton.onclick = function(event){that.borrowRequest(searchResults[i].id);};
                    borrowButton.innerHTML = "Cancel";
                    resultSpan.appendChild(borrowButton);
                }

                resultCard.appendChild(resultSpan);
                resultList.appendChild(resultCard);

                /** Net output:
                <li> (resultCard)
                    <span>
                        The Elder Scrolls: Do you even?
                        <button id="borrow.1" onClick={(event) => {this.borrowRequest("1")}}>Borrow</button>
                    </span>
                </li> 
                */
            }

            resultContent.appendChild(resultList);
            renderTarget.appendChild(resultContent);
        }
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
            /**"new Date()" retrieves current time, getTime() converts into ms from epoch (1 Jan 1970)*/
            const borrowDate = new Date()
            const borrowDateRaw = borrowDate.getTime();
            /*Calculation converts 14 days to equivalent in miliseconds. Result placed into new Date()
            to convert raw ms into a date (still in ms)*/
            const returnDue = new Date (borrowDateRaw + 14*(24*60*60*1000)) 
            
            console.log("Book borrow date: "+borrowDate);
            /**toString() Turns the ms date into human-readable date (month-day-year)*/
            console.log("Book due date: "+returnDue.toString());
            
            const bookDetails = []
            function insertDetails(){
                let details = bookDetails

                for(let i =0; i<borrowCart.length; i++){
                    let detailsContainer = {}
                    detailsContainer["id"] = borrowCart[i].id
                    detailsContainer["title"] = borrowCart[i].title
                    detailsContainer["year"] = borrowCart[i].year
                    detailsContainer["author"] = borrowCart[i].author
                    detailsContainer["publisher"] = borrowCart[i].publisher
                    
                    /**Inserts details extracted into detailsContainer{} into bookDetails[]*/
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

                /**Don't prompt().toLowerCase(), prompt() will become null!*/
                let borrowerIdLowerCase = borrowerId.toLowerCase()

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
                    body: JSON.stringify(borrowingData) //Contains data to send
                }
                /**Both parameters are initialised with blanks */
                fetch("http://localhost:3005/Borrowings", POSTReqInit)
                    .then(function(response){
                        //return response.json()
                        console.log(response);
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
        const borrowingsButton = document.getElementById("borrowingsButton")
        const borrowingsButtonHref = borrowingsButton.getAttribute("href");
        
        const borrowingsDisplay = document.getElementById("borrowings");
        /*Clears <li> in cartDisplay for another re-rendering*/
        while(borrowingsDisplay.firstChild){
            borrowingsDisplay.removeChild(borrowingsDisplay.firstChild);
        }

        /**Need to pull from database. PUT req? */
        const borrowingsRecord = ""
        
        if (borrowingsButtonHref==="OpenBorrowings"){
            /**Check for empty cart*/
            if (borrowingsRecord.length === 0){
                const resultSpan = document.createElement("p");
                resultSpan.appendChild(document.createTextNode("No record"));
                
                borrowingsDisplay.appendChild(resultSpan);
            } else {
                const resultsList = document.createElement("ul");
                resultsList.id = "borrowingsList";

                for(let i=0; i<borrowingsRecord.length; i++){
                    let resultCard = document.createElement("li");
                    resultCard.id = "borrowingsCard."+i;
                    resultCard.setAttribute("href",borrowingsRecord[i].id)

                    let resultSpan = document.createElement("span");
                    let cardImg = document.createElement("img");
                    cardImg.id = "borrowingsCardImg."+borrowingsRecord[i].id;
                    cardImg.src = borrowingsRecord[i].coverimg;
                    cardImg.alt = borrowingsRecord[i].title;
                    cardImg.style = "width:80px; height:100px;"
                    resultSpan.appendChild(cardImg);

                    resultSpan.appendChild(document.createTextNode(borrowingsRecord[i].title+" "));

                    let cancelButton = document.createElement("button");            
                    cancelButton.id = "cancel."+borrowingsRecord[i].id;
                    //This should remove a record in the database
                    //cancelButton.onclick = function(event){that.handleCartCancel(i);};
                    //cancelButton.addEventListener("click", that.handleCartCancel[i])
                    cancelButton.innerHTML = "X";
                    resultSpan.appendChild(cancelButton);

                    resultCard.appendChild(resultSpan);
                    resultsList.appendChild(resultCard);
                    borrowingsDisplay.appendChild(resultsList);
                }
            } 
            borrowingsButton.setAttribute("href","CloseBorrowings") 
            borrowingsDisplay.style = "block";
        } else if (borrowingsButtonHref==="CloseCart"){
            borrowingsButton.style.display = "none"; //Leaves space for "Cart empty" message    
            borrowingsDisplay.style.display = "none";
            borrowingsButton.setAttribute("href","OpenBorrowings") 
        }
    }
    checkbasicInput(){
        console.log("Basic input query stored: "+this.state.basicInput);
    }
    checkadvInput(){
        console.log("Advanced input query stored: ");
        console.log("Title: "+this.state.advTitle);
        console.log("Title-Author conditional: "+this.state.condTitAuth);
        console.log("Auth: "+this.state.advAuthor);
        console.log("Author-Yr conditional: "+this.state.condAuthYr);
        console.log("Yr start: "+this.state.advYearStart);
        console.log("Yr end: "+this.state.advYearEnd);
        console.log("Yr-Publisher conditional: "+this.state.condYrPub);
        console.log("Publ: "+this.state.advPublisher);
        console.log("Publisher-synopsis conditional: "+this.state.condPubSynp);
        console.log("Synp short: "+this.state.advSynopsis);
    }
    checkSearchResults(){
        console.log(this.state.searchResults);
        //console.log(document.getElementById("searchResults").innerHTML);
    }
    checkborrowCart(){
        console.log("Books in cart: ");
        /**Adding text before this console log causes the console output to be 
         [object Object] instead of showing individual objects and their content*/
        console.log(this.state.borrowCart);
    }

	render() {	
        if (this.state.isNewArrivalsLoaded === true){
            return (
                <div>
                    <Header 
                        basicInput={this.state.basicInput} 
                        handleBasicSearchChange={this.handleBasicSearchChange} 
                        handleBasicSearchSubmit = {this.handleBasicSearchSubmit}
                    />
                
                    <NewArrivals newarrivals={this.state.newarrivals}/>

                    <h1>Advanced search</h1>
                    <form name="advsearch" onSubmit={this.handleAdvSearchSubmit}>
                        Search books matching the following criteria...
                        <p>
                            Title:&nbsp;
                            <input
                                type="text"
                                name="advTitle"
                                className="title"
                                value={this.state.advTitle}
                                onChange = {this.handleAdvSearchChange}
                                onSubmit = {this.handleAdvSearchSubmit}
                                placeholder="'Robin' or 'Robin Hood'"
                                autoComplete="on"
                                style={{borderColor:"none"}}
                            />
                            
                        </p>
                        <div onChange={this.handleAdvSearchChange}>
                            <input type="radio" name="condTitAuth" value="AND" id="ANDcondTitAuth"/><label htmlFor="ANDcondTitAuth">AND</label>
                            <input type="radio" name="condTitAuth" value="OR" id="ORcondTitAuth" defaultChecked/><label htmlFor="ORcondTitAuth">OR</label>
                        </div>
                        <p>
                            Author:&nbsp;
                            <input
                            type="text"
                            name="advAuthor"
                            className="author"
                            value={this.state.advAuthor}
                            onChange = {this.handleAdvSearchChange}
                            onSubmit = {this.handleAdvSearchSubmit}
                            placeholder="'Jane' or 'Jane Austen'"
                            autoComplete="on"
                            style={{borderColor:"none"}}
                        />
                        </p>
                        <div onChange={this.handleAdvSearchChange}>
                            <input type="radio" name="condAuthYr" value="AND" id="ANDcondAuthYr"/><label htmlFor="ANDcondAuthYr">AND</label>
                            <input type="radio" name="condAuthYr" value="OR" id="ORcondAuthYr" defaultChecked/><label htmlFor="ORcondAuthYr">OR</label>
                        </div>
                        <p>
                            Year range:&nbsp;
                            <input
                                type="text"
                                name="advYearStart"
                                className="yearstart"
                                value={this.state.advYearStart}
                                onChange = {this.handleAdvSearchChange}
                                onSubmit = {this.handleAdvSearchSubmit}
                                placeholder="From..."
                                autoComplete="on"
                                style={{borderColor:"none"}}
                            />
                            &nbsp;-&nbsp; 
                            <input
                                type="text"
                                name="advYearEnd"
                                className="yearend"
                                value={this.state.advYearEnd}
                                onChange = {this.handleAdvSearchChange}
                                onSubmit = {this.handleAdvSearchSubmit}
                                placeholder="To..."
                                autoComplete="on"
                                style={{borderColor:"none"}}
                            />
                        </p>
                        <div onChange={this.handleAdvSearchChange}>
                            <input type="radio" name="condYrPub" value="AND" id="ANDcondYrPub"/><label htmlFor="ANDcondYrPub">AND</label>
                            <input type="radio" name="condYrPub" value="OR" id="ORcondYrPub" defaultChecked/><label htmlFor="ORcondYrPub">OR</label>
                        </div>
                        <p>
                            Publisher:&nbsp;
                            <input
                                type="text"
                                name="advPublisher"
                                className="publisher"
                                value={this.state.advPublisher}
                                onChange = {this.handleAdvSearchChange}
                                onSubmit = {this.handleAdvSearchSubmit}
                                placeholder="'Penguin Books'"
                                autoComplete="on"
                                style={{borderColor:"none"}}
                            />
                        </p>
                        <div onChange={this.handleAdvSearchChange}>
                            <input type="radio" name="condPubSynp" value="AND" id="ANDcondPubSynp"/><label htmlFor="ANDcondPubSynp">AND</label>
                            <input type="radio" name="condPubSynp" value="OR" id="ORcondPubSynp" defaultChecked/><label htmlFor="ORcondPubSynp">OR</label>
                        </div>
                        <p>
                            Synopsis key words:&nbsp;
                            <input
                                type="text"
                                name="advSynopsis"
                                className="synopsis"
                                value={this.state.advSynopsis}
                                onChange = {this.handleAdvSearchChange}
                                onSubmit = {this.handleAdvSearchSubmit}
                                placeholder="Retrieves partial matches"
                                autoComplete="on"
                                style={{borderColor:"none"}}
                            /> 
                        </p>
                       

                        {/* 
                        <input type="checkbox" id="safe" name="safe" value="on" defaultChecked="true"/><label htmlFor="safe">SafeSearch</label>
                        */}    
                        <button className="searchbutton" type="submit"></button>
                        
                    </form>          
        
                    <p></p>

                    <div>
                        <button onClick={this.handleCartCheckout}>Test cart Checkout</button>
                        <button onClick={this.checkbasicInput}>Check basic search query stored in state</button>
                        <button onClick={this.checkadvInput}>Check adv search query stored in state</button>
                        <button onClick={this.handleAdvSearchSubmit}>test search query send</button>
                        <button onClick={this.checkSearchResults}>Chk search results in state</button>
                        <button onClick={this.checkborrowCart}>Check book id-s in cart</button>
                    </div>
                    
                    {/*Need to prevent last set of search results from stacking together. how to clear?*/}
                    <div>Generated search results</div>
                    <div id="searchResults"></div>
                    
                    <p></p>

                    <div>
                        <button href="OpenCart" id="cartButton" onClick={this.cartDisplay}>Cart</button> 
                        <div id="cart" style={{display: "none"}}>Cart contents</div>
                        <button id="checkoutButton" style={{display: "none"}} onClick={this.handleCartCheckout}>Checkout</button>
                    </div>

                    <div>Borrowings
                        <button href="OpenBorrowings" id="borrowingsButton" onClick={this.checkBorrowings}>Cart</button>
                        <div id="borrowings"></div>
                    </div>
                    
			    </div>
            )
        } else {
            return (
                <div>Retriving database data...</div>
            );
        }
	}
}
