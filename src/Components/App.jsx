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
        this.state = {
            newarrivals: [],
            isLoaded: false,
            
            basicInput:'',

            advTitle:'',
            advAuthor:'',
            advYearStart: '',
            advYearEnd: '',
            advPublisher:'',
            advSynopsis:''
        }
        
        this.handleBasicSearchChange = this.handleBasicSearchChange.bind(this);
        this.handleBasicSearchSubmit = this.handleBasicSearchSubmit.bind(this);
        this.handleAdvSearchChange = this.handleAdvSearchChange.bind(this);
        this.handleAdvSearchSubmit = this.handleAdvSearchSubmit.bind(this);

        this.checkbasicInput = this.checkbasicInput.bind(this);
        this.checkadvInput = this.checkadvInput.bind(this);
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
			basicInput: event.target.value,
        });
    }
    handleBasicSearchSubmit(event) { 
        event.preventDefault();
        const basicInput = this.state.basicInput;

        if(basicInput !== ""){
        fetch("http://localhost:3005/BasicSearch/"+basicInput, {mode:'cors'})
            //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
            .then(function(response){
                return response.json()
                .then(function(data){
                    console.log(data);
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
        event.preventDefault();
        
        /*Everything gets passed into event? Need to sort so that only <input> which was changed
        is set to state. Otherwise, all will change at once. A switch?*/
        this.setState({
            
            advTitle: event.target.value,
            advAuthor: event.target.value,
            advYearStart: event.target.value,
            advYearEnd: event.target.value,
            advPublisher: event.target.value,
            advSynopsis:event.target.value
        });
    }
    handleAdvSearchSubmit(event){
        event.preventDefault();
    }
    checkbasicInput(){
        console.log("Basic input query stored: "+this.state.basicInput);
    }
    checkadvInput(){
        console.log("Advanced input query stored: ");
        console.log("Title: "+this.state.advTitle);
        console.log("Auth: "+this.state.advAuthor);
        console.log("Yr start: "+this.state.advYearStart);
        console.log("Yr end: "+this.state.advYearEnd);
        console.log("Publ: "+this.state.advPublisher);
        console.log("Synp short: "+this.state.advSynopsis);
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
                                name="title"
                                className="title"
                                value={this.state.advTitle}
                                onChange = {this.handleAdvSearchChange}
                                onSubmit = {this.handleAdvSearchSubmit}
                                placeholder="'Robin' or 'Robin Hood'"
                                autoComplete="on"
                                style={{borderColor:"none"}}
                            />
                            
                        </p>
                        <div>
                            <input type="radio" name="conditional1" value="AND" id="ANDconditional1"/><label htmlFor="ANDconditional1">AND</label>
                            <input type="radio" name="conditional1" value="OR" id="ORconditional1"/><label htmlFor="ORconditional1">OR</label>
                        </div>
                        <p>
                            Author:&nbsp;
                            <input
                            type="text"
                            name="author"
                            className="author"
                            value={this.state.advAuthor}
                            onChange = {this.handleAdvSearchChange}
                            onSubmit = {this.handleAdvSearchSubmit}
                            placeholder="'Jane' or 'Jane Austen'"
                            autoComplete="on"
                            style={{borderColor:"none"}}
                        />
                        </p>
                        <div>
                            <input type="radio" name="conditional2" value="AND" id="ANDconditional2"/><label htmlFor="ANDconditional2">AND</label>
                            <input type="radio" name="conditional2" value="OR" id="ORconditional2"/><label htmlFor="ORconditional2">OR</label>
                        </div>
                        <p>
                            Year range:&nbsp;
                            <input
                                type="text"
                                name="yearstart"
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
                                name="yearend"
                                className="yearend"
                                value={this.state.advYearEnd}
                                onChange = {this.handleAdvSearchChange}
                                onSubmit = {this.handleAdvSearchSubmit}
                                placeholder="To..."
                                autoComplete="on"
                                style={{borderColor:"none"}}
                            />
                        </p>
                        <div>
                            <input type="radio" name="conditional3" value="AND" id="ANDconditional3"/><label htmlFor="ANDconditional3">AND</label>
                            <input type="radio" name="conditional3" value="OR" id="ORconditional3"/><label htmlFor="ORconditional3">OR</label>
                        </div>
                        <p>
                            Publisher:&nbsp;
                            <input
                                type="text"
                                name="publisher"
                                className="publisher"
                                value={this.state.advPublisher}
                                onChange = {this.handleAdvSearchChange}
                                onSubmit = {this.handleAdvSearchSubmit}
                                placeholder="'Penguin Books'"
                                autoComplete="on"
                                style={{borderColor:"none"}}
                            />
                        </p>
                        <div>
                            <input type="radio" name="conditional4" value="AND" id="ANDconditional4"/><label htmlFor="ANDconditional4">AND</label>
                            <input type="radio" name="conditional4" value="OR" id="ORconditional4"/><label htmlFor="ORconditional4">OR</label>
                        </div>
                        <p>
                            Synopsis key words:&nbsp;
                            <input
                                type="text"
                                name="synopsis"
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
                        <button className="searchbutton" onClick={this.handleAdvSearchSubmit}></button>
                        <button className="advancedbutton"></button>
                    </form>          

                 
                    <button onClick={this.checkbasicInput}>Check basic search query stored in state</button>
                    <button onClick={this.checkadvInput}>Check adv search query stored in state</button>
                    <button onClick={this.handleAdvSearchSubmit}>test search query send</button>
                    
			    </div>
            )
        } else {
            return null;
        }
	}
}
