 import React, {Component} from 'react';
import PropTypes from 'prop-types'
import "./Dropdown.css";

class Dropdown extends React.Component {   
    constructor(props){
        super(props);

    }
    
    render() {
        //Does not work to declare a history.push() here. Maybe because BasicSearch is displayed
        //no matter which other component is on display?
        return (
            <input              
                type='text'     
                placeholder="generates suggestion by typing..."      
                style={{width:"300px"}}
            />
        )
    }
}
/***/

//Allows this child class to interface with <Hashrouter/> in parent class MainPage()
export default Dropdown;

