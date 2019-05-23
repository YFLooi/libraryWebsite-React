export default function renderResults (data, brrwCart) {
    let that = this;

    //Need to store searchResults state to determine whether to render book borrow buttons innerHTML 
    //as "borrow" or "cancel" later
    //Immutably clears this.state.searchResults to prevent stacking of  
    //each new set of search results
    that.state.searchResults.splice(0,that.state.searchResults.length);
    //Assigns new search results to this.state.searchResults
    that.state.searchResults = [...that.state.searchResults, ...data]
    
    const searchResults = that.state.searchResults
    const renderTarget = document.getElementById("searchResults");
    /**Clears "searchResults" div on each new submit to prevent stacking with prior results*/
    while(renderTarget.firstChild){
        renderTarget.removeChild(renderTarget.firstChild);
    }

    const resultContent = document.createElement("div");
    const resultList = document.createElement("ul");
    const renderLength = searchResults.length;
    const borrowCart = brrwCart;
    
    if (renderLength === 0) {
        alert("No results found. Try again");
    } else {
        for(let i=0; i<renderLength; i++){
            const resultCard = document.createElement("li");

            const resultSpan = document.createElement("span");

            let cardImg = document.createElement("img");
            cardImg.id = "cardImg."+searchResults[i].id;
            cardImg.src = searchResults[i].coverimg;
            cardImg.alt = searchResults[i].title;
            cardImg.style = "width:80px; height:100px;"
            resultSpan.appendChild(cardImg);

            resultSpan.appendChild(document.createTextNode(searchResults[i].title+" "));

            /*To change innerHTML of 'borrow' button to "Cancel" if book has been borrowed*/
            /**findIndex() here checks for match between searchResult and cart contents
                If there is a match (!= -1)), 'borrow' button inner HTML is set to "Cancel" */
            let cartCheck = borrowCart.findIndex(cart => cart.id === searchResults[i].id);
                
            if (cartCheck === -1){
                let borrowButton = document.createElement("button");            
                borrowButton.id = "borrow."+searchResults[i].id;
                //Must specify "this" to be equal to "const that" to be defined
                borrowButton.onclick = function(event){that.borrowRequest(searchResults[i].id);};
                borrowButton.innerHTML = "Borrow";
                resultSpan.appendChild(borrowButton);
            } else {
                let borrowButton = document.createElement("button");            
                borrowButton.id = "borrow."+searchResults[i].id;
                borrowButton.onclick = function(event){that.borrowRequest(searchResults[i].id);};
                borrowButton.innerHTML = "Cancel";
                resultSpan.appendChild(borrowButton);
            }

            resultCard.appendChild(resultSpan);
            resultList.appendChild(resultCard);
        }

        resultContent.appendChild(resultList);
        renderTarget.appendChild(resultContent);
        document.getElementById("searchResults-page").style.display = "block";
    }
}
