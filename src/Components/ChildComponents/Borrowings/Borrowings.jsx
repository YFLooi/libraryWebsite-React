import React from 'react';
import {
    //Allows us to connect to <Hashrouter/> from a child component
    withRouter
  } from "react-router-dom"; 
import "./Borrowings.css";
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

        const that = this;
        const borrowingsLock = this.props.passwordInput; /**Initialise as "" */

        if (borrowingsLock !== "password"){
            alert("Wrong Password");
        } else if(borrowingsLock === "password"){
            this.props.stateUpdater("isBorrowingsPasswordCorrect",true) 
        }
    }
    /** 
    generateBorrowings(data){
        const that = this;

        const borrowingsDisplay = document.getElementById("borrowings");
        
        //Clears <li> in borrowingsDisplay for another re-rendering 
        while(borrowingsDisplay.firstChild){
            borrowingsDisplay.removeChild(borrowingsDisplay.firstChild);
        }

        this.props.stateUpdater("borrowingsRecord",[...this.props.borrowingsRecord, ...data])
        const borrowingsRecord = this.props.borrowingsRecord;
        //Check for empty borrowings record
        if (borrowingsRecord.length === 0){
            <TypoGraphy variant="body1" component="div" noWrap={false}>
                No borrowings recorded
            </TypoGraphy>
        } else {
            const recordsList = document.createElement("ol");
            recordsList.id = "borrowingsList";

            for(let i=0; i<borrowingsRecord.length; i++){
                let recordCard = document.createElement("li");
                recordCard.id = "borrowingsCard."+i;
                recordCard.setAttribute("href",borrowingsRecord[i].borrowerId)

                //toDateString() turns new Date() into "day-of-week month-day-year"
                let borrowDate = borrowingsRecord[i].borrowDate;
                let returnDue = borrowingsRecord[i].returnDue;
                let currentDate = new Date().getTime();
                
                //Months start from zero in JS
                //let testCurrentDate = new Date(2019, 5, 29, 7, 30, 0, 0).getTime();
                
                //toFixed(1) fixes the equation's output to 1 decimal place by turning 
                //it into a string, so do the math before invoking this method!
                let daysLate = ((currentDate - returnDue)/(1000*60*60*24)).toFixed(1);
                //Adds a check that ensure currentDaysLate = 0 if daysLate > 0 (not late)
                let currentDaysLate = "0.00";
                let lateFine = "0.00"
                //Use parseFloat to convert the strings of number-decimals (floats) back into numbers
                if(parseFloat(daysLate) >0){
                    currentDaysLate = daysLate;
                    //Fine rate of 50 sen per day
                    lateFine = (parseFloat(currentDaysLate)*0.5).toFixed(2);
                } else {
                    currentDaysLate = "0.00";
                    lateFine = "0.00";
                }

                let borrowDateString = new Date(parseInt(borrowDate)).toDateString();
                let returnDueString = new Date(parseInt(returnDue)).toDateString();
                
                let recordSpan = document.createElement("span");
                recordSpan.appendChild(document.createTextNode("Borrower id: "+borrowingsRecord[i].borrowerId+" | "));
                recordSpan.appendChild(document.createTextNode("Borrow date: "+borrowDateString+" | "));
                recordSpan.appendChild(document.createTextNode("Return due: "+returnDueString+" | "));
                recordSpan.appendChild(document.createTextNode("Days late: "+currentDaysLate+" | "));
                recordSpan.appendChild(document.createTextNode("Late fine: RM "+lateFine+" "));

                let cancelButton = document.createElement("button");            
                cancelButton.id = "cancel."+i;
                //This button should remove a record in the database and delete the borrower's entry
                cancelButton.onclick = function(event){that.handleBorrowingsCancel(i,borrowDate);};
                //cancelButton.addEventListener("click", that.handleCartCancel[i])
                cancelButton.innerHTML = "X";
                recordSpan.appendChild(cancelButton);

                
                let booksDiv = document.createElement("div");
                let borrowersBooks = borrowingsRecord[i].books;
                for(let j=0; j<borrowersBooks.length; j++){
                    let bookCard = document.createElement("div");

                    let bookSpan = document.createElement("span");
                    let bookImg = document.createElement("img");
                    bookImg.id = "cartCardImg."+borrowersBooks[j].id;
                    bookImg.src = borrowersBooks[j].coverimg;
                    bookImg.alt = borrowersBooks[j].title;
                    bookImg.style = "width:80px; height:100px;"
                    bookSpan.appendChild(bookImg);
                    
                    bookSpan.appendChild(document.createTextNode(borrowersBooks[j].id+","))
                    bookSpan.appendChild(document.createTextNode(borrowersBooks[j].title+","))
                    bookSpan.appendChild(document.createTextNode(borrowersBooks[j].year+","))
                    bookSpan.appendChild(document.createTextNode(borrowersBooks[j].publisher))
                    
                    bookCard.appendChild(bookSpan);
                    booksDiv.appendChild(bookCard)
                } 

                recordCard.appendChild(recordSpan);
                recordCard.appendChild(booksDiv);
                recordsList.appendChild(recordCard);
                borrowingsDisplay.appendChild(recordsList);
            }
        } 
    }
    */
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
            mode:"cors",   
            cache:"no-cache",
            credentials:"same-origin",
            headers:{
                "Content-Type": "application/json",
            },
            redirect: "error",
            //Contains data to send. Need to JSON.stringify, pg's auto-convert bugged 
            //and pg only accepts arrays as JSON, since PSQL does the same
            body: JSON.stringify(deleteTarget) 
        }
        /**Both parameters are initialised with blanks */
        fetch("http://localhost:3005/Delete-Borrowings", DELETEReqInit)
            .then(function(response){
                return response.json()
                .then(function(data){
                    //Returns confirmation that record deleted for borrowerid = x                
                    console.log(data)
                })
            })  
            .catch(function(error){
                console.log('Request failed', error)
            })
            
        /**If user removes all borrowing entries which is indicated by 
         * this.state.borrowingRecord.length === 0, the message "No record" 
        appears*/
        if (this.props.borrowingsRecord.length === 0){
            const resultSpan = document.createElement("p");
            resultSpan.appendChild(document.createTextNode("No record"));
            
            const cartDisplay = document.getElementById("borrowings");
            cartDisplay.appendChild(resultSpan);
        }
    }   
    render() { 
        //If wrong/no password, prompts for password
        if(this.props.isBorrowingsPasswordCorrect === false){
            return(
                <div id='borrowings-page'>
                    <div><TypoGraphy variant='h5' align='left'>Borrowings record</TypoGraphy></div>
                    <TypoGraphy variant='body1' align='left'>Librarians only. Please provide a valid password</TypoGraphy>
                    <div style={{height:48, position:'relative',}}>
                        <form onSubmit = {this.checkBorrowings}>
                            <Input
                                type='password'
                                name='passwordInput'
                                id='passwordInput'
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

