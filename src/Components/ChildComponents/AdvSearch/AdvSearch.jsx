import React from 'react';
import renderResults from "../ExportedFunctions/RenderResults.js";
import borrowRequest from "../ExportedFunctions/BorrowRequest.js";

//Controls positioning of individual columns and applies general styling
//.css

export default class AdvSearch extends React.Component {
    constructor(props){
        super(props)
        this.handleAdvSearchChange = this.handleAdvSearchChange.bind(this);
        this.handleAdvSearchSubmit = this.handleAdvSearchSubmit.bind(this);
        this.renderResults = renderResults.bind(this);
        this.borrowRequest = borrowRequest.bind(this);
    }
    handleAdvSearchChange(event){ 
        /*When called, it looks for the state with the same name 
        as the <input> box and updates it as =event.target.value 
        (value or content of input box)*/
        /*Only works if <input> has same name as state!*/
        this.props.stateUpdater([event.target.name],event.target.value)
    }
    handleAdvSearchSubmit(event){
        const that = this;
        event.preventDefault();
        
        /*JSON.parse cannot accept blank strings, "". The if-else here inserts string "null"
        if it detects the submitted state is ""*/
        const advTitle = this.props.advTitle === "" ? "null" : this.props.advTitle;
        const condTitAuth = this.props.condTitAuth 
        const advAuthor = this.props.advAuthor === "" ? "null" : this.props.advAuthor;
        const condAuthYr = this.props.condAuthYr;
        const advYearStart = this.props.advYearStart === "" ? "null" : this.props.advYearStart;
        const advYearEnd = this.props.advYearEnd === "" ? "null" : this.props.advYearEnd;
        const condYrPub = this.props.condYrPub;
        const advPublisher = this.props.advPublisher === "" ? "null" : this.props.advPublisher;
        const condPubSynp = this.props.condPubSynp;
        const advSynopsis = this.props.advSynopsis === "" ? "null" : this.props.advSynopsis;
    
        console.log(advTitle+condTitAuth+advAuthor+condAuthYr+advYearStart+" to "+advYearEnd+condYrPub+advPublisher+condPubSynp+advSynopsis)
    
        /*Search occurs as long as one advSearch parameter is not a "null" string*/
        if(advTitle === "null" &&  advAuthor === "null" && advPublisher === "null" && 
        advYearStart === "null" && advYearEnd === "null" && advPublisher === "null" 
        && advSynopsis === "null"){
            console.log("Blank query made. No query submitted");
        } else {
            fetch("http://localhost:3005/AdvSearch/"+advTitle+"/"+condTitAuth+"/"+advAuthor+"/"+condAuthYr+
            "/"+advYearStart+"/"+advYearEnd+"/"+condYrPub+"/"+advPublisher+"/"+condPubSynp+"/"+advSynopsis
            ,{method:"GET",mode:"cors"})
                //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
                .then(function(response){
                    return response.json()
                    .then(function(data){
                        console.log("Results of AdvSrch:");
                        console.log(data);
                        that.renderResults(data, that.props.borrowCart);
                    })
                })  
                .catch(function(error){
                    console.log('Request failed', error)
                })
        }
    }
    render(){
        return(
            <div>
                <h1>Advanced search</h1>
                <form name="advsearch" onSubmit={this.handleAdvSearchSubmit}>
                    Search books matching the following criteria...
                    <p>
                        Title:&nbsp;
                        <input
                            type="text"
                            name="advTitle"
                            className="title"
                            value={this.props.advTitle}
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
                        value={this.props.advAuthor}
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
                            value={this.props.advYearStart}
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
                            value={this.props.advYearEnd}
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
                            value={this.props.advPublisher}
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
                            value={this.props.advSynopsis}
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
            </div> 
        )         
    }
    
}