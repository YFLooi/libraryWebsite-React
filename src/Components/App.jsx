import React from 'react';

//Controls positioning of individual columns and applies general styling
import './App.css';

//imports React components to render()
import Header from "./Header/Header.jsx";

/*
import Navbar from "./Navbar.jsx";
import Results from "./Results.jsx";
import Form from "./Form.jsx";
*/

// App.js value={this.state.input}
export default class App extends React.Component {
	render() {
		return (
			<div>
				<Header/>
                
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
