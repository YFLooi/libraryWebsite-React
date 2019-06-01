import React from 'react';
import "./NewArrivals.css";

export default class NewArrivals extends React.Component {
    constructor(props) {
        super(props);		
        
        this.generateArrivals = this.generateArrivals.bind(this);
        this.clearArrivals = this.clearArrivals.bind(this);
    }
    componentWillUnmount(){
        this.clearArrivals(); /*Prevents the 'New Arrivals' from stacking on page refresh*/
    }
    generateArrivals(){
        const dataCount = this.props.newArrivals.length;
        const newArrivals = this.props.newArrivals;
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
            <div className="results">
                <p></p>
                    <section id="newArrivals"></section>
                <p></p>
            </div>
		);
	}
}
