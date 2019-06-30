import React from 'react';
import "./HomePage.css";
import TypoGraphy from '@material-ui/core/Typography'
import BasicSearch from '../BasicSearch/BasicSearch.jsx';

export default class HomePage extends React.Component {
    constructor(props) {
        super(props);		
        
        this.generateArrivals = this.generateArrivals.bind(this);
        this.clearArrivals = this.clearArrivals.bind(this);
    }
    componentDidMount(){
        let that = this; //Prevents 'this' from being undefined
        /*Fetches the data on page load for the New Arrivals slideshow*/
        fetch('http://localhost:3005/newArrivals', {method:"GET", mode:"cors"})
            //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
            .then(function(response){
                return response.json()
                //Examines data in response
                .then(function(data){
                    console.log(data)

                    if(data.length > 0){
                        //Send data directly to rendering function. This skips use of state for storage
                        that.generateArrivals(data)
                        //Sets state to determine whether to render website. 
                    }else{
                        console.log("Render failed: newarrivals.db is empty")
                    }
                })
            }).catch(function(error){
                console.log('Request failed', error)
            })  
    }
    componentWillUnmount(){
        this.clearArrivals(); /*Prevents the 'New Arrivals' from stacking on page refresh*/
    }
    generateArrivals(data){
        const dataCount = data.length;
        const newArrivals = data;
        const targetAttr = document.getElementById('newArrivals');
        const wrap = document.createElement('section');
        wrap.setAttribute('id', 'card');
        
        if (dataCount > 1){
            for (let i = 0; i<dataCount; i++) {
                //Create a new card for each of 20 new arrivals
                const card = document.createElement('div');
                card.setAttribute('class', 'cardContent');

                //Adds book img
                const cardPoster = document.createElement('img');
                cardPoster.setAttribute('class','cardPoster');
                cardPoster.setAttribute('src',newArrivals[i].coverimg);
                cardPoster.setAttribute('alt',newArrivals[i].title);
                card.appendChild(cardPoster);

                //Adds book title
                const cardTitle = document.createElement('div');
                cardTitle.appendChild(document.createTextNode(newArrivals[i].title)); //Syntax to target obj in array: Call object item number(i), then property(Here: 'title')
                card.appendChild(cardTitle);

                //Adds book author
                const cardAuthor = document.createElement('div');
                cardAuthor.appendChild(document.createTextNode(newArrivals[i].author)); 
                card.appendChild(cardAuthor);

                //Attaches complete card to 'wrap' as each card is completed
                wrap.appendChild(card);
            } 
            targetAttr.appendChild(wrap);
        } else{
            console.log("No data received on new arrivals")
        }
    }
    clearArrivals(){
        //const targetParent = document.getElementById('newArrivals'); 
        const targetChild = document.getElementById('card');
        if(targetChild != null) {
            targetChild.parentNode.removeChild(targetChild)
        } 
    }
    render() {
		return (
            <div className="homepage">
                
                <BasicSearch
                    basicInput={this.props.basicInput}
                    
                    borrowCart={this.props.borrowCart}
                    searchResults={this.props.searchResults}
                    isNewResultsLoaded={this.props.isNewResultsLoaded}

                    stateUpdater={this.props.stateUpdater}
                />
                <TypoGraphy variant="h5" color="inherit">New Arrivals</TypoGraphy>
                <div className="results">
                    <section id="newArrivals"></section>
                </div>
            </div>
		);
	}
}
