import React from 'react';
import { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Button, Grid, Card, CardHeader, CardMedia, CardContent, CardActions, CardActionArea 
} from '@material-ui/core/';
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
    detailsOverlay:{
        position: 'fixed',
        display: 'none',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2, /*Allows the sidebar <div> to stack on top of all other <div>-s. Number = Stack Order*/
        backgroundColor: 'rgba(0,0,0,0.5)', /*Adds a shadow to denote the overlay area to click to exit*/
        
        /*Scolling `takes place in the overlay, NOT the <div> within the overlay*/
        overflowY:'scroll',
        webkitOverflowScrolling:'touch',
    },
    detailsCard:{
        position: 'relative', 
        margin: '20% auto', /*Centers the card*/
        width: '90%',
        padding: '5px 5px 5px 5px',
        height: '210', 
        cursor: 'pointer',
    },
    detailsCardInfoBox:{
        display: 'flex',
        flexDirection: 'row',
        padding: '3%',
    },
    detailsCardImage: {
        display: 'flex',
        minWidth: 155,
        minHeight: 205,
        maxWidth: 155,
        maxHeight: 205,
    },
    detailsCardInfoAndActions:{
        display: 'flex',
        flexDirection: 'column', //So that <CardActions/> appear below text
    },
    detailsCardBookInfo: {
        display: 'flex',
    },
    detailsCardActions:{
        display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',
        padding: '0 0 0 20',
    }
}));

//Renders on load into buttons
const genres = [
    'adult-fiction', 'adventure', 'autobiography', 'biography', 'business', 
    'childrens', 'childrens-classics', 'classics', 'comic-book', 'contemporary', 'fantasy', 
    'historical-fiction', 'history', 'horror', 'mystery', 'religion', 'science', 'self-help'
]

function Explore(props){  
    const classes = useStyles();

    //One state Hook per state, otherwise they can act weirdly when mixed
    //If changes need to happen on state update and there are >1 state in a Hook,
    //the Hook will only effect the change for 1 state!
    //Use 'let', not 'const'. State is always manipulated
    const [genreButtons, setGenreButtons] = useState([])
    const [resultsCards, setResultsCards] = useState([])
    const [detailsCard, setDetailsCard] = useState([])


    //Necessary because for some reason, none of the functions
    //can access state if they manipulate the data they pull from state!
    let stateClone = {
        cardData: []
    }
    
    //Handles all lifecycle methods for this component
    useEffect(() => {
        //Set 'new arrivals' as default category on load of this page
        fetch('/Explore/adventure', {method:"GET"})
            //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
            .then(function(response){
                return response.json()
                //Examines data in response
                .then(function(data){
                    console.log(data)

                    if(data.length > 0){
                        stateClone.cardData.splice(0, stateClone.cardData.length);
                        stateClone.cardData = [...data];

                        genreButtonsRender();
                        
                        //Send data directly to card rendering function. This eliminates render lag
                        renderResultsCards(data);
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
        let genreButtonsArray = Array(arrayLength).fill().map((item, i) => 
            <Button 
                id = {`genreButton.${i}`} 
                variant = "contained" color="inherit" 
                classes = {{root: classes.genreButton}} 
                key = {`genreButtonItem.${i}`} 
                onClick={() => {genreButtonClick(genres[i]);}}
            >
                {genres[i]}
            </Button>
        )

        let oldGenreButtons = genreButtons;
        let newGenreButtons = oldGenreButtons.splice(0, oldGenreButtons.length);
        setGenreButtons(
            [...newGenreButtons, ...genreButtonsArray]
        );
        
        console.log(genreButtonsArray);
    }
    const genreButtonClick = (genreText) => {
        //Set 'selectedGenre' <span> of page title to the genre chosen
        document.getElementById('selectedGenre').innerHTML = genreText;

        //Looks for books matching selected genre
        fetch(`/Explore/${genreText}`, {method:"GET"})
            //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
            .then(function(response){
                return response.json()
                //Examines data in response
                .then(function(data){
                    console.log(data)

                    if(data.length > 0){
                        stateClone.cardData.splice(0, stateClone.cardData.length);
                        stateClone.cardData = [...data]
                        
                        //Send data directly to rendering function to prevent lag
                        renderResultsCards(data);
                        
                    }else{
                        console.log(`Render failed: No data not found for genre ${genreText}`)
                    }
                })
            }).catch(function(error){
                console.log('Request failed', error)
            })
    }
    const renderResultsCards = (data) => {  //Every item to insert into slide
        let arrayLength = data.length;

        //'20' means the array goes from 0-19.
        let resultsArray = Array(arrayLength).fill().map((item, i) => 
            <Grid item key={`resultsCard.${i}`}>
                <Card classes={{root: classes.resultsCard}}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            alt={data[i].title}
                            height="210"
                            src={data[i].coverimg}
                            classes= {{media: classes.resultsCardImage}}
                            onClick={() => {renderDetailsCard(data[i].id);}}
                        />
                        <CardContent>
                            <Typography variant="body1" component="h2" noWrap={false}>
                                <b>{data[i].title}</b>
                            </Typography>
                            <Typography variant="body1" component="div" noWrap={true}>
                                {data[i].author}
                            </Typography>
                        </CardContent>
                    </CardActionArea>
                    <CardActions>
                        {borrowButtonRender(data[i].id)} 
                        <Button size="small" color="primary" onClick={() => {renderDetailsCard(data[i].id);}}>
                            Details
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        )

        let oldResultsCards = resultsCards
        let newResultsCards = oldResultsCards.splice(0, oldResultsCards.length);
        setResultsCards([...newResultsCards, resultsArray])
        document.getElementById("resultsPlaceholder").style.display = "none";
    }
    const borrowButtonRender = (bookId) => {
        /*To change innerHTML of 'borrow' button to "Cancel" if book has been borrowed*/
        /**findIndex() here checks for match between searchResult and cart contents
        If there is a match (!= -1)), 'borrow' button inner HTML is set to "Cancel" */
        let cartCheck = props.borrowCart.findIndex(cart => cart.id === bookId);
        
        if (cartCheck === -1){
            return (
                <Button onClick={() => {borrowRequest(bookId);}} className={'borrow.'+bookId} 
                size="small" color="primary">
                    Borrow
                </Button>
            )
        } else {
            return (
                <Button onClick={() => {borrowRequest(bookId);}} className={'borrow.'+bookId} 
                size="small" color="primary">
                    Cancel
                </Button>
            )
        }
    }
    const borrowRequest = (idx) => {
        //Grabs the 'Borrow' buttons in the Card and its Details card with the 
        //same className
        //targetButtons thus becomes an array
        const targetButtons = document.getElementsByClassName("borrow."+idx)
        console.log(targetButtons)

        //Specify [0] to return the first match to the className
        const buttonText = targetButtons[0].getElementsByClassName('MuiButton-label')[0].innerHTML;
        const cardData = stateClone.cardData;
        let cart = props.borrowCart;
        
        if(buttonText === "Borrow"){
            //Retrieves index position in searchResults of object having input book id
            const targetIndex = cardData.findIndex(data => data.id === idx)
            
            if (targetIndex === -1){
                console.log(`Unable to find data for book of index number ${idx}`)
            } else {
                //Obtains the object at the target index position in searchResults 
                let bookData  = cardData[targetIndex];  
                console.log('Data on target book:');
                console.log(bookData);
                
                //This method adds new book object data to the end of the 
                //existing array immutably
                cart.splice(cart.length, 0, bookData)
                console.log('Update to be sent to this.state.borrowCart:');
                console.log(cart);
                props.stateUpdater('borrowCart',cart);

                //Updates #cartCounter to show number of books in this.props.borrowcart
                //Use updatedBorrowCart instead of this.props.borrowCart because it updates first
                document.getElementById("cartCounter").innerHTML = parseInt(cart.length,10);
        
                //For loop necessary because when 'Details' is clicked, 2 Borrow buttons 
                //appear with the same className. The loop ensures the innerHTML of 
                //both buttons changes to either 'Borrow' or 'Cancel'
                //Changes button to say "Cancel" after being clicked
                //Target: "document.querySelector('.borrow.'+idx+'.MuiButton-label').innerHTML = "Cancel";
                for (let i=0; i<targetButtons.length; i++){
                    targetButtons[i].getElementsByClassName('MuiButton-label')[0].innerHTML = 'Cancel'
                }
            }
        }else if(buttonText === "Cancel"){
            //Find index containing target book id from borrowCart
            const targetIndex = cart.findIndex(cartItem => cartItem.id === idx)
            console.log("Target of removal position: "+targetIndex);
    
            //Condition prevents .splice if id to remove not in cart 
            if(targetIndex === -1){
                console.log(`Error finding cart item of id ${idx}`)
            } else {
                //Removes item at targetPosition. If we set const new = cart.splice(), 
                //"const new" has a value = the removed item
                cart.splice(targetIndex,1);  
                console.log('Update to be sent to this.state.borrowCart:')
                console.log(cart);
                props.stateUpdater("borrowCart",cart) 

                //Updates #cartCounter to show number of books in this.props.borrowcart
                //Use updatedBorrowCart instead of this.props.borrowCart because it updates first
                document.getElementById("cartCounter").innerHTML = parseInt(cart.length,10);
            
                //Cancelling a borrow request makes book available to "Borrow" again
                for (let i=0; i<targetButtons.length; i++){
                    targetButtons[i].getElementsByClassName('MuiButton-label')[0].innerHTML = 'Borrow'
                }
            }
        }else{
            console.log('buttonText is not "Borrow" nor "Cancel"');
        }
    }
    const renderDetailsCard = (bookId) => {
        let detailsOverlay = document.getElementById(`detailsOverlay`);
        let targetIndex = stateClone.cardData.findIndex(item => item.id === bookId);
        console.log(`Array position containing target book details: ${targetIndex}`)
        let bookDetails = stateClone.cardData[targetIndex];
        
        let newDetailsCardArray = [
            <Card key='bookDetails' classes={{root: classes.detailsCard}}>
                <div className={classes.detailsCardInfoBox}>
                    <CardMedia
                        component='img'
                        alt={`front cover for ${bookDetails.title}`}
                        src={bookDetails.coverimg}
                        classes= {{media: classes.detailsCardImage}}
                    />
                    <div className={classes.detailsCardInfoAndActions}>
                        <CardHeader
                            title = {bookDetails.title}
                            subheader = {
                                <React.Fragment>
                                    {bookDetails.author} <br/> 
                                    {bookDetails.publisher}
                                </React.Fragment>
                            }
                            classes = {{root: classes.detailsCardBookInfo, title: classes.detailsCardTitle, subheader: classes.detailsCardSubheader}}
                        />
                        <CardActions classes={{root: classes.detailsCardActions}}>
                            {borrowButtonRender(bookId)}
                            <Button size="small" color="primary" onClick={() => {hideDetailsCard();}}>
                                Close
                            </Button>
                        </CardActions>
                    </div>
                </div>
                <CardContent>
                    <Typography variant="h6" component="div" noWrap={true}>
                        <u>Synopsis</u>
                    </Typography>
                    <Typography variant="body1" component="div" noWrap={false}>
                        {bookDetails.synopsis}
                    </Typography>
                </CardContent>
            </Card>
        ]

        let oldDetailsCard = detailsCard
        let newDetailsCard = oldDetailsCard.splice(0, oldDetailsCard.length);
        setDetailsCard([...newDetailsCard, ...newDetailsCardArray])
        detailsOverlay.style.display= 'block';
    }
    const hideDetailsCard = () => {
        //Need to do this mutably. Otherwise, Borrow button will be stuck on last Cancel
        setDetailsCard([]);
                
        //Should keep appended Details card. That way, there is no load time if 'Details' is clicked again
        document.getElementById(`detailsOverlay`).style.display = 'none';
    }

    return (
        <div className={classes.outerContainer}> 
            <div className='title'>
                <Typography variant="h5" color="inherit" margin="normal">
                    Explore <b><span id='selectedGenre'>adventure</span></b>
                </Typography>
            </div>
            <div id='detailsOverlay' className={classes.detailsOverlay}>
                {detailsCard} {/**Must use state here: When state updates, the update is pushed to all calls of that state*/}
            </div>
            <div className={classes.genres}> 
                {genreButtons}
            </div>
            <div id='resultsPlaceholder' className={classes.resultsPlaceholder}><Typography variant="h6" color="inherit">Loading</Typography></div>
            <div className={classes.resultsDisplayContainer}>
                <Grid container spacing={1} justify="center">
                    {resultsCards}
                </Grid>
            </div>
        </div> 
    )
}

//Allows this child class to interface with <Hashrouter/> in parent class MainPage()
export default withRouter(Explore);
