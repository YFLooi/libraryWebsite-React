import React from 'react';
import "./NewArrivals.css";

export default class NewArrivals extends React.Component {
    constructor(props) {
        super(props);		
        
        this.state = {
             /*For new arrivals top 20*/
             newarrivals: [],
             isNewArrivalsLoaded: false,
        }

        this.generateArrivals = this.generateArrivals.bind(this);
        this.clearArrivals = this.clearArrivals.bind(this);
        this.storeCheck = this.storeCheck.bind(this)
    }

    componentDidMount(){
        try {
            let that = this; //Prevents 'this' from being undefined

            /*Fetches the data on page load for the New Arrivals slideshow*/
            fetch('http://localhost:3005/NewArrivals', {method:"GET", mode:"cors"})
                //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
                .then(function(response){
                    return response.json()
                    //Examines data in response
                    .then(function(data){
                        that.setState({
                            newarrivals: data,
                            isNewArrivalsLoaded: true
                        })
                        that.generateArrivals()
                    })
                })  
                .catch(function(error){
                    console.log('Request failed', error)
                })
        } catch (e) {
            if (this.state.newarrivals === []) {
                console.log("Error loading top 20 books");
            }        
        }
    }
    componentWillUnmount(){
        this.clearArrivals(); /*Prevents the 'New Arrivals' from stacking on page refresh*/
    }
    generateArrivals(){
        const dataCount = this.state.newarrivals.length;
        const newarrivals = this.state.newarrivals;
        const targetAttr = document.getElementById('newarrivals');
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
                cardPoster.setAttribute('src',newarrivals[i].coverimg);
                cardPoster.setAttribute('alt',newarrivals[i].title);
                card.appendChild(cardPoster);

                //Adds book title
                const cardTitle = document.createElement('div');
                cardTitle.appendChild(document.createTextNode(newarrivals[i].title)); //Syntax to target obj in array: Call object item number(i), then property(Here: 'title')
                card.appendChild(cardTitle);

                //Adds book author
                const cardAuthor = document.createElement('div');
                cardAuthor.appendChild(document.createTextNode(newarrivals[i].author)); 
                card.appendChild(cardAuthor);

                //Attaches complete card to 'wrap' as each card is completed
                wrap.appendChild(card);
            } 
            targetAttr.appendChild(wrap);
        }
    }
    clearArrivals(){
        //const targetParent = document.getElementById('newarrivals'); 
        const targetChild = document.getElementById('card');
        if(targetChild != null) {
            targetChild.parentNode.removeChild(targetChild)
        } 
    }
    storeCheck(){
        let newarrivals = this.state.newarrivals;
        console.log(newarrivals);
        console.log(newarrivals[1].title);
    }

    render() {
		return (
            <div className="results">
                <p></p>
                    <section id="newarrivals"></section>
                <p></p>
                <button onClick={this.storeCheck}>Check new arrivals</button>
                <button onClick={this.generateArrivals}>Generate arrivals</button>
                <button onClick={this.clearArrivals}>Clear arrivals</button>

            </div>
		);
	}
}
