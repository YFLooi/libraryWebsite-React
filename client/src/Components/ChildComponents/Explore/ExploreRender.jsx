import React from 'react';
import { useEffect, } from 'react';
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
    }
}));

function ExploreRender(props){  
    const classes = useStyles();

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
                        let newCardData = props.cardData.splice(0, props.cardData.length);
                        newCardData = [...newCardData, ...data];
                        props.exploreStateUpdater('cardData', [...newCardData]);
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
        const genresToRender = props.genres 
        const arrayLength = genresToRender.length;
        
        //'20' means the array goes from 0-19.
        let genreButtonsArray = Array(arrayLength).fill().map((item, i) => 
            <Button 
                id = {`genreButton.${i}`} 
                variant = "contained" color="inherit" 
                classes = {{root: classes.genreButton}} 
                key = {`genreButton.${i}`} 
                onClick={() => {genreButtonClick(genresToRender[i]);}}
            >
                {genresToRender[i]}
            </Button>
        )

        let newGenreButtons = props.genreButtons.splice(0, props.genreButtons.length);
        newGenreButtons = [...newGenreButtons, ...genreButtonsArray]
        props.exploreStateUpdater('genreButtons', [...newGenreButtons]);
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
                        let newCardData = props.cardData.splice(0, props.cardData.length);
                        newCardData = [...newCardData, ...data];
                        props.exploreStateUpdater('cardData', [...newCardData]);
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
    const borrowRequest = (idx) => {
        const cardData = props.cardData;
        console.log(cardData);
        console.log(`Book index to target: ${idx}`)

        /** 
        const cart = props.borrowCart;
        //'id' here is the book id. It allows access to other data related to 
        //the book 
        const targetButton = document.getElementById("borrow."+idx)
        //Specify [0] to return the first match to the className
        const buttonText = targetButton.getElementsByClassName('MuiButton-label')[0].innerHTML;
        
        if(buttonText === "Borrow"){
            //Retrieves index position in searchResults of object having input book id
            const targetIndex = cardData.findIndex(data => data.id === idx)
            
            if (targetIndex === -1){
                console.log(`Unable to find data for book of index number ${idx}`)
            } else {
                ///Obtains the object at the target index position in searchResults 
                const bookData  = cardData[targetIndex];
                console.log('Data on target book to borrow:')
                console.log(bookData)
        
                //This method adds new book object data to the end of the 
                //existing array immutably
                let updatedBorrowCart = [...cart, bookData]
                props.stateUpdater("borrowCart",updatedBorrowCart)

                //Updates #cartCounter to show number of books in this.props.borrowcart
                //Use updatedBorrowCart instead of this.props.borrowCart because it updates first
                document.getElementById("cartCounter").innerHTML = parseInt(updatedBorrowCart.length,10);
        
                //Changes button to say "Cancel" after being clicked
                //document.querySelector('.borrow.'+idx+'.MuiButton-label').innerHTML = "Cancel";
                targetButton.getElementsByClassName('MuiButton-label')[0].innerHTML = 'Cancel';
            }
        }else if(buttonText === "Cancel"){
            //Find index containing target book id from borrowCart
            const targetIndex = cart.findIndex(x => x.id === idx)
            console.log("Target of removal position: "+targetIndex);
    
            //Condition prevents .splice if id to remove not in cart 
            if(targetIndex === -1){
                console.log(`Error finding cart item of id ${idx}`)
            } else {
                //Removes item at targetPosition. If we set const new = cart.splice(), 
                //"const new" has a value = the removed item
                cart.splice(targetIndex,1);  
                let updatedBorrowCart = [...cart] //Keep state immutable with spread syntax!               
                console.log(updatedBorrowCart.length)
                props.stateUpdater("borrowCart",updatedBorrowCart) 

                //Updates #cartCounter to show number of books in this.props.borrowcart
                //Use updatedBorrowCart instead of this.props.borrowCart because it updates first
                document.getElementById("cartCounter").innerHTML = parseInt(updatedBorrowCart.length,10);
            
                //Cancelling a borrow request makes book available to "Borrow" again
                targetButton.getElementsByClassName('MuiButton-label')[0].innerHTML = "Borrow";       
            }
        }else{
            console.log('buttonText is not "Borrow" nor "Cancel"');
        }
        */
    }
    const borrowButtonRender = (bookId) => {
        /*To change innerHTML of 'borrow' button to "Cancel" if book has been borrowed*/
        /**findIndex() here checks for match between searchResult and cart contents
        If there is a match (!= -1)), 'borrow' button inner HTML is set to "Cancel" */
        let cartCheck = props.borrowCart.findIndex(cart => cart.id === bookId);
        
        if (cartCheck === -1){
            return (
                <Button onClick={() => {borrowRequest(bookId);}} id={'borrow.'+bookId} 
                size="small" color="primary">
                    Borrow
                </Button>
            )
        } else {
            return (
                <Button onClick={() => {borrowRequest(bookId);}} id={'borrow.'+bookId} 
                size="small" color="primary">
                    Cancel
                </Button>
            )
        }
    }
    const renderResultsCards = (data) => {  //Every item to insert into slide
        let arrayLength = data.length;

        //'20' means the array goes from 0-19.
        let resultsArray = Array(arrayLength).fill().map((item, i) => 
            <Grid item key={`resultsCard.${i}`}>
                <Card classes={{root: classes.resultsCard}}>
                    <CardActionArea>
                        {/**onClick={() => {renderDetails(item.id, i);}} */}
                        <CardMedia
                            component="img"
                            alt={data[i].title}
                            height="210"
                            src={data[i].coverimg}
                            classes= {{media: classes.resultsCardImage}}
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
                        <Button size="small" color="primary">
                            {/**onClick={() => {renderDetails(item.id, i);}} */}
                            Details
                        </Button>
                    </CardActions>
                </Card>
            </Grid>
        )

        let newResultsCards = props.resultsCards.splice(0, props.resultsCards.length);
        newResultsCards = [...newResultsCards, ...resultsArray];
        props.exploreStateUpdater('resultsCards', [...newResultsCards]);
        document.getElementById("resultsPlaceholder").style.display = "none";
    }
    const renderDetailsCard = (bookId) => {
        let detailsOverlay = document.getElementById(`detailsOverlay`);
        const cardData = props.cardData;

        let targetIndex = cardData.findIndex(item => item.id === bookId);
        console.log(`Array position containing target book details: ${targetIndex}`)
        let bookDetails = cardData[targetIndex];
        
        let newDetailsCard = [
            <Card key='bookDetails' classes={{root: classes.detailsCard}}>
                <div className={classes.infoBox}>
                    <CardMedia
                        component='img'
                        alt={`front cover for ${bookDetails.title}`}
                        src={bookDetails.coverimg}
                        classes= {{media: classes.detailsCardImage}}
                    />
                    <div className={classes.infoAndActions}>
                    <CardHeader
                        title = {bookDetails.title}
                        subheader = {
                            <React.Fragment>
                                {bookDetails.author} <br/> 
                                {bookDetails.publisher}
                            </React.Fragment>
                        }
                        classes = {{root: classes.bookInfo, title: classes.detailsCardTitle, subheader: classes.detailsCardSubheader}}
                    />
                    <CardActions classes={{root: classes.cardActions}}>
                        {/*borrowButtonRender(bookId)*/}
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

        let newDetailsCardArray = props.detailsCard.splice(0, props.detailsCard.length);
        newDetailsCardArray = [...newDetailsCardArray, ...newDetailsCard];
        props.exploreStateUpdater('detailsCard', [...newDetailsCardArray]);

        detailsOverlay.style.display= 'block';
    }
    const hideDetailsCard = () => {
        //Need to do this mutably. Otherwise, Borrow button will be stuck on last Cancel
        props.exploreStateUpdater('detailsCard', []);
                
        //Should keep appended Details card. That way, there is no load time if 'Details' is clicked again
        document.getElementById(`detailsOverlay`).style.display = 'none';
    }
    const stateCheck = () => {
        console.log(`genreButtons:`)
        console.log(props.genreButtons)
        console.log(`resultsCards:`)
        console.log(props.resultsCards)
        console.log(`detailsCard:`)
        console.log(props.detailsCard)
        console.log(`cardData:`)
        console.log(props.cardData)
    }
    return (
        <div className={classes.outerContainer}> 
            <div className='title'>
                <Typography variant="h5" color="inherit" margin="normal">
                    Explore <b><span id='selectedGenre'>adventure</span></b>
                </Typography>
            </div>
            <div id='detailsOverlay' className={classes.detailsOverlay}>
                {props.detailsCard} {/**Must use state here: When state updates, the update is pushed to all calls of that state*/}
            </div>
            <div className={classes.genres}> 
                {props.genreButtons}
            </div>
            <button onClick={() => {stateCheck()}}>Statecheck at render</button> 
            <div id='resultsPlaceholder' className={classes.resultsPlaceholder}><Typography variant="h6" color="inherit">Loading</Typography></div>
            <div className={classes.resultsDisplayContainer}>
                <Grid container spacing={1} justify="center">
                    {props.resultsCards}
                </Grid>
            </div>
        </div> 
    )
}

//Allows this child class to interface with <Hashrouter/> in parent class MainPage()
export default withRouter(ExploreRender);
