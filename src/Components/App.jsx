import React from 'react';

//Controls positioning of individual columns and applies general styling
import './App.css';

//imports React components to render()
import Header from "./Header/Header.jsx";
import Results from "./Results/Results.jsx";

/*
import Navbar from "./Navbar.jsx";
import Results from "./Results.jsx";
import Form from "./Form.jsx";
*/

// App.js value={this.state.input}
export default class App extends React.Component {
	constructor(props) {
        super(props);		
        this.state = {
			newarrivals: [] 
        }
    }
	componentDidMount(){
        let that = this;

        /*Activates the app.get() at the API (server.js*/
        fetch('http://localhost:3005/', {mode:'cors'})
            //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
            .then(function(response){
                return response.json()
                //Examines data in response
                .then(function(data){
                    that.setState({
                        newarrivals: data
                    })
                })
            })  
            .catch(function(error){
                console.log('Request failed', error)
            })
    }
	render() {	
		return (
			<div>
				<Header/>
                
                <Results newarrivals={this.state.newarrivals}/>
                {/*
				<Navbar/>
				
				
				<div className="col-2"> 
					<Form />
				</div> 
				
				<div className="col-3">
					<Results/>
                </div>
                */}
				
			</div>
		);
	}
}
