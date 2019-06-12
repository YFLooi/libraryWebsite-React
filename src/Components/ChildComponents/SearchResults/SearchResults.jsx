import React from 'react';
import "./SearchResults.css"

window.onload = function(){
    console.log("Screen refresh detected. Redirecting?")
    return <Redirect to='/Home' />
}
export default class SearchResults extends React.Component {
    constructor(props){
        super(props);

        this.renderResults = this.renderResults.bind(this)
    }
    componentDidMount(){
        console.log("Search results to render:")
        this.renderResults(this.props.searchResults, this.props.borrowCart);
    }
    renderResults (data, brrwCart) {
        let that = this;
        const searchResults = this.props.searchResults
        const renderTarget = document.getElementById("searchResults");

        /**Clears "searchResults" <div/> on each new submit to prevent stacking with prior results*/
        while(renderTarget.firstChild){
            renderTarget.removeChild(renderTarget.firstChild);
        }
    
        const resultContent = document.createElement("div");
        const resultList = document.createElement("ul");
        const renderLength = searchResults.length;
        const borrowCart = brrwCart;
       
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
            
            let borrowButton = document.createElement("button");            
            borrowButton.id = "borrow."+searchResults[i].id;
            //Must specify "this" to be equal to "const that" to be defined
            borrowButton.onclick = function(event){that.borrowRequest(searchResults[i].id);};
            if (cartCheck === -1){
                borrowButton.innerHTML = "Borrow";
                resultSpan.appendChild(borrowButton);
            } else {
                borrowButton.innerHTML = "Cancel";
                resultSpan.appendChild(borrowButton);
            }

            resultCard.appendChild(resultSpan);
            resultList.appendChild(resultCard);
        }

        resultContent.appendChild(resultList);
        renderTarget.appendChild(resultContent);
        document.getElementById("searchResults-page").style.display = "block";

        //Ensures next search attempt does not allow an empty "Results" page to appear
        this.props.stateUpdater("isResultsLoaded",false)
    }    
    render() {
		return (
            <div id="searchResults-page" style={{display: "none"}}>
                <h1>Generated search results</h1>
                <div id="searchResults"></div>           
            </div>    
		);
	}
}
