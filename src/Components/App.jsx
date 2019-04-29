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
        this.borrowRequest = this.borrowRequest.bind(this);
        this.checkborrowCart = this.checkborrowCart.bind(this);

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
            fetch("http://localhost:3005/BasicSearch/"+basicInput, {mode:'cors'})
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
        this.setState({
			searchResults: []
        });

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
            ,{mode:'cors'})
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
        this.setState(prevState => ({
            /*Works similar to array.concat() method*/
            searchResults: [...prevState.searchResults, ...data]
        }))

        const renderTarget = document.getElementById("searchResults");
        const resultContent = document.createElement("div");
        const resultList = document.createElement("ul");
        const renderLength = this.state.searchResults.length;

        for(let i=0; i<renderLength; i++){
            const resultCard = document.createElement("li");
            resultCard.appendChild(document.createTextNode(this.state.searchResults[i].title))
            resultList.appendChild(resultCard);
        }

        resultContent.appendChild(resultList);
        renderTarget.appendChild(resultContent);
    }
    borrowRequest(id){
        //'id' here is the book id
        let buttonText = document.getElementById("borrow."+id).innerHTML;
        let cart = this.state.borrowCart;
        console.log(buttonText);

        if(buttonText === "Borrow"){
            /*This method adds each new book id to the end of the existing array immutably*/
            this.setState({
                borrowCart: [...cart, id]
            })
            document.getElementById("borrow."+id).innerHTML = "Cancel";
        }else if(buttonText === "Cancel"){
            //Remove added book id from borrowCart
            let targetPosition = cart.indexOf(id);
            console.log("Target of removal position: "+targetPosition);

            //Prevents splice if id to remove not in cart 
            if(targetPosition !== -1){
                /*Removes item at targetPosition. If we set const new = cart.splice(), 
                "const new" has a value = the removed item*/
                cart.splice(targetPosition,1);                 
                this.setState({
                    borrowCart: [...cart] //Keep state immutable with spread syntax!
                })
            }
            document.getElementById("borrow."+id).innerHTML = "Borrow";       
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
    }
    checkborrowCart(){
        console.log("Book ids in cart: "+this.state.borrowCart);
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

                    <div><u>Mock search results</u>
                        <div >
                            <span>
                                The Elder Scrolls: Do you even?
                                <button id="borrow.1" onClick={(event) => {this.borrowRequest("1")}}>Borrow</button>
                            </span>
                        </div>
                        <div >
                            <span>
                                The Lusty Argonian Maid: Scaly Hentai
                                <button id="borrow.2" onClick={(event) => {this.borrowRequest("2")}}>Borrow</button>
                            </span>
                        </div>
                        <div >
                            <span>
                                Big book of poison
                                <button id="borrow.3" onClick={(event) => {this.borrowRequest("3")}}>Borrow</button>
                            </span>
                        </div>
                        <div >
                            <span>
                                Sorenova: Him, her, it?
                                <button id="borrow.4" onClick={(event) => {this.borrowRequest("4")}}>Borrow</button>
                            </span>
                        </div>
                    </div>
                    
                    <p>
                        <button onClick={this.checkbasicInput}>Check basic search query stored in state</button>
                        <button onClick={this.checkadvInput}>Check adv search query stored in state</button>
                        <button onClick={this.handleAdvSearchSubmit}>test search query send</button>
                        <button onClick={this.checkSearchResults}>Chk search results in state</button>
                        <button onClick={this.checkborrowCart}>Check book id-s in cart</button>
                    </p>

                    {/*Need to prevent last set of search results from stacking together. how to clear?*/}
                    <div>Generated search results</div>
                    <div id="searchResults"></div>


			    </div>
            )
        } else {
            return (
                <div>Retriving database data...</div>
            );
        }
	}
}
