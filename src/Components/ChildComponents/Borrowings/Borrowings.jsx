import React from 'react';
import {
    //Allows us to connect to <Hashrouter/> from a child component
    withRouter
  } from "react-router-dom"; 
import "./Borrowings.css";

class Borrowings extends React.Component {
    constructor(props) {
        super(props);	
        
        this.handlePasswordInputChange = this.handlePasswordInputChange.bind(this);
        this.checkBorrowings = this.checkBorrowings.bind(this);
        this.generateBorrowings = this.generateBorrowings.bind(this);
        this.handleBorrowingsCancel = this.handleBorrowingsCancel.bind(this);
    }
    componentWillUnmount(){
        //Prevents stacking of db search results if /Borrowings is loaded again
        const currentBorrowingsRecord = this.props.borrowingsRecord;
        currentBorrowingsRecord.splice(0,currentBorrowingsRecord.length)
        this.props.stateUpdater("borrowingsRecord",[...currentBorrowingsRecord])

        //Locks back /Borrowings on route change/exit
        this.props.stateUpdater("isBorrowingsPasswordCorrect",false)
    }
    handlePasswordInputChange(event){
        this.props.stateUpdater("passwordInput",event.target.value)
    }
    checkBorrowings(event){
        //So that I do not open a new window each time I check /Borrowings
        event.preventDefault();

        const that = this;
        const borrowingsLock = this.props.passwordInput; /**Initialise as "" */
        console.log(borrowingsLock)

        if (borrowingsLock !== "password"){
            alert("Wrong Password");
        } else if(borrowingsLock === "password"){
            this.props.stateUpdater("isBorrowingsPasswordCorrect",true)

            const GETReqInit = {
                method:"GET",
                mode:"cors",   
                cache:"no-cache",
                credentials:"same-origin",
                redirect: "error",
            }
            /**Both parameters are initialised with blanks */
            fetch("http://localhost:3005/Check-Borrowings", GETReqInit)
                .then(function(response){
                    //pg automatically calls JSON.parse()
                    return response.json()
                    .then(function(data){
                        //.map() server response to an array of objects
                        const borrowingsData = data.map(function(prop){
                            //Headers in psql always in lower case. Convert back to camelCase here
                            let borrowerId = prop.borrowerid
                            let borrowDate = prop.borrowdate
                            let returnDue = prop.returndue
                            //PSQL stores arrays as JSON. Need to parse back into JS
                            let books = JSON.parse(prop.books)

                            return {borrowerId, borrowDate, returnDue, books}
                        })
                        that.generateBorrowings(borrowingsData)
                    })
                })  
                .catch(function(error){
                    console.log('Request failed', error)
                })
        }
    }
    generateBorrowings(data){
        const that = this;

        const borrowingsDisplay = document.getElementById("borrowings");
        /*Clears <li> in borrowingsDisplay for another re-rendering*/
        while(borrowingsDisplay.firstChild){
            borrowingsDisplay.removeChild(borrowingsDisplay.firstChild);
        }

        this.props.stateUpdater("borrowingsRecord",[...this.props.borrowingsRecord, ...data])
        const borrowingsRecord = this.props.borrowingsRecord;
        //Check for empty cart
        if (borrowingsRecord.length === 0){
            const recordSpan = document.createElement("p");
            recordSpan.appendChild(document.createTextNode("No record"));
            
            borrowingsDisplay.appendChild(recordSpan);
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
                
                /* toFixed(1) fixes the equation's output to 1 decimal place by turning 
                    * it into a string, so do the math before invoking this method!*/
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

        //Removes password stored in this.state.passwordInput
        this.props.stateUpdater("passwordInput","")
    }
    handleBorrowingsCancel(idx,borrowDate){
        const cardIndex = document.getElementById("borrowingsCard."+idx)
        const borrowerId = cardIndex.getAttribute("href");
        console.log(`Data sent for borrower ${borrowerId} who borrowerd on ${borrowDate}`)
        
        /**Remove borrowing <li> on click*/
        if (cardIndex.parentNode) {
            cardIndex.parentNode.removeChild(cardIndex);
        }

        /**Updates borrowingsRecord state and 'borrowings' db table reflect borrowing entry 
         * removed. Updating state prevents need to query table each time an entry is removed
         * to see if no records remain
        */
        const newRecord = this.props.borrowingsRecord;
        const targetIndex = newRecord.findIndex(record => record.borrowerId === borrowerId);
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
                <div id="borrowings-page">
                    <div><h1>Borrowings record</h1></div>
                    <div>Librarians only. Please provide a valid password</div>
                    <div>
                        <form onSubmit = {this.checkBorrowings}>
                            <input
                                type="password"
                                name="passwordInput"
                                id="passwordInput"
                                value={this.props.passwordInput}
                                onChange = {this.handlePasswordInputChange}
                                onSubmit = {this.checkBorrowings}
                                placeholder="Hint: 'p***w**d'"
                                autoComplete="off"
                                style={{borderColor:"none"}}
                            />
                            <span><button type="submit">Submit</button></span>
                        </form>
                    </div>
                </div> 
            )
        }else if(this.props.isBorrowingsPasswordCorrect === true){
            return (
                <div id="borrowings-page">
                    <div><h1>Borrowings record</h1></div>
                    <div>Late return fine set to RM 0.50 per day late</div>
                    <div id="borrowings"></div>
                </div>
            );
        }
	}
}

export default withRouter(Borrowings);