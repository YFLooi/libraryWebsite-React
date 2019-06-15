import React, { Component } from 'react'
import PropTypes from 'prop-types'
//import styles from './styles.css'

export default class SearchBox extends Component {  
    //Does the same thing as constructor(props){} 
    static propTypes = {    
        /**value: The default value for the input box.     
         * placeholder: The placeholder text for the input box.*/    
        value: PropTypes.string,    
        placeholder: PropTypes.string,
        data: PropTypes.array.isRequired 
    }
    state = {value: ''}
    static defaultProps = {    
        /*Set data prop as an empty array in case it's not passed.*/    
        data: []  
    }

    componentDidMount(){    
        const {value} = this.props
        this.setState({      
            value: value    
        })  
    }
    handleInputChange = e => {    
        const { value } = e.target
        this.setState({      
            value: value    
        })  
    }
    //This function is responsible for rendering the dropdown
    dropdownNode = () => {        
        const { data } = this.props
        return (      
            <div className={`react-search-box-dropdown ${styles.dropdown}`}>        
                <ul className={styles.dropdownList}>          
                    {data.map(record => {  
                        return (              
                            <li key={record.key} className={`react-search-box-dropdown-list-item ${styles.dropdownListItem}`}>{record.value}</li>            
                        )          
                    })}        
                </ul>      
            </div>    
        )  
    }
    //This function is responsible for rendering the input box.     
    //The input box acts as a source of entry for the data from the user.
    inputNode = () => {        
        const { placeholder } = this.props    
        const { value } = this.state
        return (      
            <input        
                className={styles.input}        
                type='text'        
                placeholder={placeholder}        
                value={value}        
                onChange={this.handleInputChange}      
            />    
        )  
    }
    render() {    
        return (
            <div className={styles.container}>{this.inputNode()} {this.dropdownNode()}</div>  
        )
    }
}