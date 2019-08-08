import React from 'react';
import { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Card, CardMedia, CardContent, CardActions, CardActionArea } from '@material-ui/core/';
import {
    withRouter,
} from "react-router-dom";
import Typography from '@material-ui/core/Typography';
import loadingBackground from './icons/loadingimg.gif';

const useStyles = makeStyles(theme => ({
    outerContainer:{
        marginLeft: '2%'
    },
    genres:{
        overflow: 'auto'
    },
    genreButton: {
        float: 'left',
        margin: 3,
    },
    resultsPlaceholder: {
        display: 'block',
        margin: '20px auto 0px auto',
        width: 300,
        height: 100,

        textAlign: 'center',

        backgroundImage: `url(${loadingBackground})`,
        backgroundPositionX: '0%', //0 for align left , 50% for align centre
        backgroundPositionY: 'bottom',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
        backgroundSize: '100% 75%',
    },
    resultsDisplayContainer: {
        marginTop: 20, 
        marginBottom: '15%',
    },
    resultsCard:{
        minWidth: 155,
        maxWidth: 155,
        paddingTop: 5,
    },
    resultsCardImage:{
        minWidth: 140,
        maxWidth: 145,
        margin: 'auto auto',
    },
}));

//Renders on load into buttons
const genres = [
    'new arrivals', 'adult-fiction', 'adventure', '(auto)biography', 'business', 
    'childrens', 'childrens-classics', 'classics', 'comic-book', 'contemporary', 'fantasy', 
    'historical-fiction', 'history', 'horror', 'mystery', 'religion', 'science', 'self-help'
]

function Explore(props){  
    const classes = useStyles();

    //One state Hook per state, otherwise they can add weirdly when mixed
    //Use 'let', not 'const'. State is always manipulated
    let [genreButtons, setGenreButtons] = React.useState([]);
    let [cards, setCards] = React.useState([]); //Place initial state value on pg refresh on right side
    let [cardData, setCardData] = React.useState([]);

    //Handles all lifecycle methods for this component
    useEffect(() => {
        //Set 'new arrivals' as default category on load of this page
        fetch('/NewArrivals', {method:"GET"})
            //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
            .then(function(response){
                return response.json()
                //Examines data in response
                .then(function(data){
                    console.log(data)

                    if(data.length > 0){
                        cardData.splice(0, cardData.length);
                        setCardData([...data])
                        //Send data directly to rendering function. This skips use of state for storage
                        genreButtonsRender();
                        resultsCards(data);
                    }else{
                        console.log("Render failed: newarrivals data not found")
                    }
                })
            }).catch(function(error){
                console.log('Request failed', error)
            })
            
            //Equivalent of componentWillUnmount()
            return() => {
                document.getElementById("resultsPlaceholder").style.display = "block";
            }
    }, []);

    const genreButtonsRender = () => { 
        let arrayLength = genres.length;
        
        //'20' means the array goes from 0-19.
        let genresButtonsArray = Array(arrayLength).fill().map((item, i) => 
            <Button variant="contained" color="inherit" classes={{root: classes.genreButton}} key={`genreButton.${i}`}>{genres[i]}</Button>
        )

        genreButtons.splice(0, genreButtons.length);
        setGenreButtons([...genresButtonsArray])
    }

    const resultsCards = (data) => {  //Every item to insert into slide
        let cardData = data;
        let arrayLength = cardData.length;

        //'20' means the array goes from 0-19.
        let resultsArray = Array(arrayLength).fill().map((item, i) => 
            <Grid item key={`resultsCard.${i}`}>
                <Card classes={{root: classes.resultsCard}}>
                    <CardActionArea>
                        {/**onClick={() => {renderDetails(item.id, i);}} */}
                        <CardMedia
                            component="img"
                            alt={cardData[i].title}
                            height="210"
                            src={cardData[i].coverimg}
                            classes= {{media: classes.resultsCardImage}}
                        />
                        <CardContent>
                            <Typography variant="body1" component="h2" noWrap={false}>
                                <b>{cardData[i].title}</b>
                            </Typography>
                            <Typography variant="body1" component="div" noWrap={true}>
                                {cardData[i].author}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        {/*borrowButtonRender(cardData[i].id)*/} 
                        <Button size="small" color="primary">
                            {/**onClick={() => {renderDetails(item.id, i);}} */}
                            Details
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        )

        cards.splice(0, cards.length);
        setCards([...resultsArray])
        document.getElementById("resultsPlaceholder").style.display = "none";
    }

    return (
        <div className={classes.outerContainer}> 
            <div className='title'>
                <Typography variant="h5" color="inherit" margin="normal">Explore</Typography>
            </div>
            <div className={classes.genres}> 
                {genreButtons}
            </div>
            <div id='resultsPlaceholder' className={classes.resultsPlaceholder}><Typography variant="h6" color="inherit">Loading</Typography></div>
            <div className={classes.resultsDisplayContainer}>
                <Grid container spacing={1} justify="center">
                    {cards}
                </Grid>
            </div>
            {/** For the 'Details' overlay of each card
                <CarouselDetails
                    targetBookId={this.state.targetBookId}
                    newArrivals={this.state.newArrivals}
                    borrowCart={this.props.borrowCart}
                    stateUpdater={this.props.stateUpdater}
                    carouselStateUpdater={this.carouselStateUpdater}
                />
            */}
        </div> 
    )
}

//Allows this child class to interface with <Hashrouter/> in parent class MainPage()
export default withRouter(Explore);
