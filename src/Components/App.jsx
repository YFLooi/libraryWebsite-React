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
            input:'',
            newarrivals: [],
            isLoaded: false 
        }
        
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.checkinput = this.checkinput.bind(this);
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
    handleChange(event){
        event.preventDefault();
        this.setState({
			input: event.target.value,
        });
    }
    handleSubmit(event) {
        event.preventDefault();
        /* const currentQuery = this.state.input;
        this.props.submitNewQuery(currentQuery);*/
        
        const input = "Ladybird";
        fetch("http://localhost:3005/Search/"+input, {mode:'cors'})
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
    }
    checkinput(event){
        event.preventDefault();
        console.log(this.state.input);
    }
	render() {	
        if (this.state.isNewArrivalsLoaded === true){
            return (
                <div>
                    <Header 
                        input={this.state.input} 
                        handleChange={this.handleChange} 
                        handleSubmit = {this.handleSubmit}
                    />
                
                    <NewArrivals newarrivals={this.state.newarrivals}/>

                    <button onClick={this.checkinput}>Check this.state.input</button>
                    <button onClick={this.handleSubmit}>test search query send</button>
                    
			    </div>
            )
        } else {
            return null;
        }
	}
}
