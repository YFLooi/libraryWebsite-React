function handleBasicSearchChange(event){
    this.setState({
        basicInput: event.target.value
    });
}
function handleBasicSearchSubmit(event){ 
    const that = this;
    event.preventDefault();
    const basicInput = this.state.basicInput;

    if(basicInput !== ""){
        fetch("http://localhost:3005/BasicSearch/"+basicInput, {method: "GET",mode:"cors"})
            //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
            .then(function(response){
                return response.json()
                .then(function(data){
                    console.log("Results of BasicSrch:");
                    console.log(data);
                    
                    //'this' of this component cannot be recognised here
                    //Thus, we bind this to "const that"
                    that.renderResults(data, that.state.borrowCart);
                })
            })  
            .catch(function(error){
                console.log('Request failed', error)
            })
    } else {
        console.log("Blank query made. No query submitted");
    }
}
function handleAdvSearchChange(event){ 
    /*When called, it looks for the state with the same name 
    as the <input> box and updates it as =event.target.value 
    (value or content of input box)*/
    /*Only works if <input> has same name as state!*/
    this.setState({ 
        [event.target.name]: event.target.value 
    })  
}
function handleAdvSearchSubmit(event){
    const that = this;
    event.preventDefault();
    
    /*JSON.parse cannot accept blank strings, "". The if-else here inserts string "null"
    if it detects the submitted state is ""*/
    const advTitle = this.state.advTitle === "" ? "null" : this.state.advTitle;
    const condTitAuth = this.state.condTitAuth 
    const advAuthor = this.state.advAuthor === "" ? "null" : this.state.advAuthor;
    const condAuthYr = this.state.condAuthYr;
    const advYearStart = this.state.advYearStart === "" ? "null" : this.state.advYearStart;
    const advYearEnd = this.state.advYearEnd === "" ? "null" : this.state.advYearEnd;
    const condYrPub = this.state.condYrPub;
    const advPublisher = this.state.advPublisher === "" ? "null" : this.state.advPublisher;
    const condPubSynp = this.state.condPubSynp;
    const advSynopsis = this.state.advSynopsis === "" ? "null" : this.state.advSynopsis;

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
                    that.renderResults(data, that.state.borrowCart);
                })
            })  
            .catch(function(error){
                console.log('Request failed', error)
            })
    }
}

export { 
    handleBasicSearchChange,
    handleBasicSearchSubmit,
    handleAdvSearchChange,
    handleAdvSearchSubmit, 
};