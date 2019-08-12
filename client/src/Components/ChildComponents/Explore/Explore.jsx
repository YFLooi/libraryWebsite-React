import React from 'react';
import ExploreRender from './ExploreRender.jsx';

class Explore extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            genres: [ 
                'adult-fiction', 'adventure', 'autobiography', 'biography', 'business', 
                'childrens', 'childrens-classics', 'classics', 'comic-book', 'contemporary', 'fantasy', 
                'historical-fiction', 'history', 'horror', 'mystery', 'religion', 'science', 'self-help'
            ],
            genreButtons: [],
            resultsCards: [],
            detailsCard: [],
            cardData: [],
        }

        this.exploreStateUpdater = this.exploreStateUpdater.bind(this);
        this.stateCheck = this.stateCheck.bind(this);
    }
    /** 
    componentDidMount(){
        let that = this;
        //Set 'adventure' as default category on load of this page
        fetch('/Explore/adventure', {method:"GET"})
        //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
        .then(function(response){
            return response.json()
            //Examines data in response
            .then(function(data){
                console.log(data)

                if(data.length > 0){
                    that.cardData.splice(0, this.cardData.length);
                    that.setState ({
                        cardData: [...data]
                    })
                    that.genreButtonsRender();
                    
                    //Send data directly to card rendering function. This eliminates render lag
                    that.renderResultsCards(data);
                }else{
                    console.log("Render failed: newarrivals data not found")
                }
            })
        }).catch(function(error){
            console.log('Request failed', error)
        })   
    }
    componentWillUnmount(){
        document.getElementById("resultsPlaceholder").style.display = "block";
    }
    */
   exploreStateUpdater(name,data){
        /* [] allows an external variable to define object property "name". In this case, 
        it's parameter "name".*/
        this.setState({
            [name]: data
        })
    }
    stateCheck() {
        console.log(`genreButtons:`)
        console.log(this.state.genreButtons)
        console.log(`resultsCards:`)
        console.log(this.state.resultsCards)
        console.log(`detailsCard:`)
        console.log(this.state.detailsCard)
        console.log(`cardData:`)
        console.log(this.state.cardData)
    }

    render() {
        return (
            <React.Fragment>
                <button onClick={() => {this.stateCheck()}}>Statecheck</button>
                <ExploreRender 
                    borrowCart = {this.props.borrowCart}
                    stateUpdater = {this.props.stateUpdater}

                    genres = {this.state.genres}
                    genreButtons = {this.state.genreButtons} 
                    resultsCards = {this.state.resultsCards}
                    detailsCard = {this.state.detailsCard}
                    cardData = {this.state.cardData}

                    exploreStateUpdater = {this.exploreStateUpdater}
                />
                {/** 
                    genreButtonsRender = {this.genreButtonsRender} 
                    genreButtonClick = {this.genreButtonClick}
                    renderResultsCards = {this.renderResultsCards} 
                    borrowButtonRender = {this.borrowButtonRender} 
                    renderDetailsCard = {this.renderDetailsCard}
                    hideDetailsCard = {this.hideDetailsCard}
                */}
            </React.Fragment>
        )
    }
}

export default Explore;