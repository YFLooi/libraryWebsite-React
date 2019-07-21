import React from 'react';
import {
    //Allows us to connect to <Hashrouter/> from a child component
    withRouter
  } from "react-router-dom"; 
import { Input, Button } from '@material-ui/core';
import TypoGraphy from '@material-ui/core/Typography'
import BorrowingsRender from './BorrowingsRender.jsx';

class Borrowings extends React.Component {
    constructor(props) {
        super(props);	
      
        this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
        this.checkBorrowings = this.checkBorrowings.bind(this);
        //this.generateBorrowings = this.generateBorrowings.bind(this);
        this.handleBorrowingsCancel = this.handleBorrowingsCancel.bind(this);
    }
    componentWillUnmount(){
        //Prevents stacking of db search results if /Borrowings is loaded again
        const currentBorrowingsRecord = this.props.borrowingsRecord;
        currentBorrowingsRecord.splice(0,currentBorrowingsRecord.length)
        this.props.stateUpdater("borrowingsRecord",[...currentBorrowingsRecord])

        //Locks back /Borrowings on route change/exit
        this.props.stateUpdater("isBorrowingsPasswordCorrect",false)
        //Removes password stored in this.state.passwordInput
        //Also clears the password input box because its value is set to this.state.passwordInput
        this.props.stateUpdater('passwordInput','')
    }
    handlePasswordInputChange(event){
        this.props.stateUpdater("passwordInput",event.target.value)
    }
    checkBorrowings(event){
        //So that I do not open a new window each time I check /Borrowings
        event.preventDefault();

        const borrowingsLock = this.props.passwordInput; /**Initialise as "" */

        if (borrowingsLock !== "password"){
            alert("Wrong Password");
        } else if(borrowingsLock === "password"){
            this.props.stateUpdater("isBorrowingsPasswordCorrect",true) 
        }
    }
    handleBorrowingsCancel(idx,borrowDate){
        const cardIndex = document.getElementById("borrowingsCard."+idx)
        const borrowerId = cardIndex.getAttribute("href");
        console.log(`Data sent for borrower ${borrowerId} who borrowed on ${borrowDate}`)
        
        /**Remove borrowing <li> on click*/
        if (cardIndex.parentNode) {
            cardIndex.parentNode.removeChild(cardIndex);
        }

        //Updates borrowingsRecord state and 'borrowings' db table reflect borrowing entry 
        //removed. Updating state prevents need to query table each time an entry is removed
        //to see if no records remain
        const newRecord = this.props.borrowingsRecord;
        const targetIndex = newRecord.findIndex(record => record.borrowerid === borrowerId);
        console.log("Removal target index: "+targetIndex);
        /**No need for this.setState(), splice() updates state*/
        newRecord.splice(targetIndex,1)

        let deleteTarget = {
            targetBorrowerId: borrowerId,
            targetBorrowDate: borrowDate
        }

        const DELETEReqInit = {
            method:"DELETE", 
            cache:"no-cache",
            headers:{
                "Content-Type": "application/json",
            },
            redirect: "error",
            //Contains data to send. Need to JSON.stringify, pg's auto-convert bugged 
            //and pg only accepts arrays as JSON, since PSQL does the same
            body: JSON.stringify(deleteTarget) 
        }
        /**Both parameters are initialised with blanks */
        fetch("/Delete-Borrowings", DELETEReqInit)
            .then(function(response){
                return response.json()
                .then(function(data){
                    //Returns confirmation of record deleted for borrowerid = x                
                    console.log(data)
                })
            })  
            .catch(function(error){
                console.log('Request failed', error)
            })
            
        //If user removes all borrowing entries which is indicated by 
        //this.state.borrowingRecord.length === 0, the message 
        //"All recorded borrowings cleared" appears
        if (this.props.borrowingsRecord.length === 0){
            document.getElementById('borrowingsDisplay').display = 'none';
            document.getElementById('borrowingsEmptyDisplay').display = 'block';
        }
    }   
    render() { 
        //If wrong/no password, prompts for password
        if(this.props.isBorrowingsPasswordCorrect === false){
            return(
                <div id='borrowings-page'>
                    <div><TypoGraphy variant='h4' align='left' style={{ marginTop: 5, marginBottom: 5,}}>Borrowings record</TypoGraphy></div>
                    <TypoGraphy variant='body1' align='left'>Librarians only. Please provide a valid password</TypoGraphy>
                    <div style={{marginTop: 10, height:48, position:'relative',}}>
                        <form onSubmit = {this.checkBorrowings}>
                            <Input
                                type='password'
                                name='passwordInput'
                                value={this.props.passwordInput}
                                onChange = {this.handlePasswordInputChange}
                                onSubmit = {this.checkBorrowings}
            
                                placeholder="Hint: 'p***w**d'"
                                autoComplete='off'
                                style={{border:'2px solid gray', float:'left',}}
                                size='medium'
                            />
                            <Button type='submit' variant='contained' color='inherit' size='medium' style={{marginLeft: 10, float:'left'}}>Submit</Button>                         
                        </form>
                    </div>
                </div> 
            )
        } else if (this.props.isBorrowingsPasswordCorrect === true) {
            return (
                <React.Fragment>
                    <BorrowingsRender
                        handleBorrowingsCancel = {this.handleBorrowingsCancel}
                        stateUpdater = {this.props.stateUpdater}
                        borrowingsRecord = {this.props.borrowingsRecord}
                        expandList = {this.props.expandList}
                        isBorrowingsPasswordCorrect = {this.props.isBorrowingsPasswordCorrect}
                    />
                </React.Fragment>
           )
        }
	}
}

export default withRouter(Borrowings);

