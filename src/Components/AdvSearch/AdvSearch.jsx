import React from 'react';

//Controls positioning of individual columns and applies general styling
//.css

// App.js value={this.state.input}
export default class AdvSearch extends React.Component {
    render(){
        return(
            <div>
                <h1>Advanced search</h1>
                <form name="advsearch" onSubmit={this.props.handleAdvSearchSubmit}>
                    Search books matching the following criteria...
                    <p>
                        Title:&nbsp;
                        <input
                            type="text"
                            name="advTitle"
                            className="title"
                            value={this.props.advTitle}
                            onChange = {this.props.handleAdvSearchChange}
                            onSubmit = {this.props.handleAdvSearchSubmit}
                            placeholder="'Robin' or 'Robin Hood'"
                            autoComplete="on"
                            style={{borderColor:"none"}}
                        />
                        
                    </p>
                    <div onChange={this.props.handleAdvSearchChange}>
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
                        onChange = {this.props.handleAdvSearchChange}
                        onSubmit = {this.props.handleAdvSearchSubmit}
                        placeholder="'Jane' or 'Jane Austen'"
                        autoComplete="on"
                        style={{borderColor:"none"}}
                    />
                    </p>
                    <div onChange={this.props.handleAdvSearchChange}>
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
                            onChange = {this.props.handleAdvSearchChange}
                            onSubmit = {this.props.handleAdvSearchSubmit}
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
                            onChange = {this.props.handleAdvSearchChange}
                            onSubmit = {this.props.handleAdvSearchSubmit}
                            placeholder="To..."
                            autoComplete="on"
                            style={{borderColor:"none"}}
                        />
                    </p>
                    <div onChange={this.props.handleAdvSearchChange}>
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
                            onChange = {this.props.handleAdvSearchChange}
                            onSubmit = {this.props.handleAdvSearchSubmit}
                            placeholder="'Penguin Books'"
                            autoComplete="on"
                            style={{borderColor:"none"}}
                        />
                    </p>
                    <div onChange={this.props.handleAdvSearchChange}>
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
                            onChange = {this.props.handleAdvSearchChange}
                            onSubmit = {this.props.handleAdvSearchSubmit}
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