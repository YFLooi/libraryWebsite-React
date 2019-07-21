import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import { Grid, Typography } from "@material-ui/core";
import { Card, CardHeader, CardMedia, CardActionArea, CardActions, CardContent, } from "@material-ui/core/";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({ 
    pageHeader:{
        marginTop: '5%',
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
        margin: '30% auto', /*Centers the card*/
        width: '90%',
        padding: '5px 5px 5px 5px',
        height: '210', 
        cursor: 'pointer',
    },
    infoBox:{
        display: 'flex',
        flexDirection: 'row',
        padding: '3%',
    },
    resultsDisplayContainer: {
        marginTop: 10, 
        marginBottom: '15%',
    },
    detailsCardImage: {
        display: 'flex',
        maxWidth: 155,
        maxHeight: 465,
    },
    infoAndActions:{
        display: 'flex',
        flexDirection: 'column', //So that <CardActions/> appear below text
    },
    bookInfo: {
        display: 'flex',
    },
    cardActions:{
        display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',
        padding: '0 0 0 20',
    },
    //Width of 155px ensures 2 cards per row on a standard iPhone 
    card:{
        maxWidth: 155,
    },
    cardImage:{
        maxWidth: 155,
    },
}))

export default function SearchResultsRender(props){
    const searchResults = props.searchResults
    const borrowCart = props.borrowCart;
    const classes = useStyles();
    
    let [state, setState] = React.useState({
        storedDetailsCard: [],
    });

    const borrowButtonRender = (bookId) => {
        /*To change innerHTML of 'borrow' button to "Cancel" if book has been borrowed*/
        /**findIndex() here checks for match between searchResult and cart contents
        If there is a match (!= -1)), 'borrow' button inner HTML is set to "Cancel" */
        let cartCheck = borrowCart.findIndex(cart => cart.id === bookId);
        
        if (cartCheck === -1){
            return (
                <Button onClick={() => {props.borrowRequest(bookId);}} id={'borrow.'+bookId} size="small" color="primary">
                    Borrow
                </Button>
            )
        } else {
            return (
                <Button onClick={() => {props.borrowRequest(bookId);}} id={'borrow.'+bookId} size="small" color="primary">
                    Cancel
                </Button>
            )
        }
    }
    const renderDetails = (bookId) => {
        let detailsOverlay = document.getElementById(`detailsOverlay`);
        let targetIndex = searchResults.findIndex(item => item.id === bookId);
        console.log(`Array position containing target book details: ${targetIndex}`)
        let bookDetails = searchResults[targetIndex];
        
        let detailsCard = [
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
                        {borrowButtonRender(bookId)}
                        <Button size="small" color="primary" onClick={() => {hideDetails();}}>
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

        state.storedDetailsCard.splice(0, state.storedDetailsCard.length);
        setState({
            ...state,
            storedDetailsCard: [...detailsCard],
        });
        detailsOverlay.style.display= 'block';
    }
    const hideDetails = () => {
        //Should keep appended Details card. That way, there is no load time if 'Details' is clicked again
        document.getElementById(`detailsOverlay`).style.display = 'none';
    }

    return(
        <React.Fragment>
            <Typography variant="h5" component="h2" classes={{root: classes.pageHeader}}>Search results</Typography>
            <div id='detailsOverlay' className={classes.detailsOverlay}>
                {state.storedDetailsCard} {/**Must use state here: When state updates, the update is pushed to all calls of that state*/}
            </div>
            <div className={classes.resultsDisplayContainer}>
                <Grid container spacing={1} justify="center">
                    {/**post.map generates one card for each element in const posts*/}
                    {searchResults.map(function(item,i) {
                        return(
                            <Grid item key={`card.${i}`}>
                                <Card classes={{root: classes.card}}>
                                    <CardActionArea onClick={() => {renderDetails(item.id, i);}}>
                                        <CardMedia
                                            component="img"
                                            alt={item.title}
                                            height="210"
                                            src={item.coverimg}
                                            classes= {{media: classes.cardImage}}
                                        />
                                        <CardContent>
                                            <Typography variant="body1" component="h2" noWrap={false}>
                                                <b>{item.title}</b>
                                            </Typography>
                                            <Typography variant="body1" component="div" noWrap={true}>
                                                {item.author}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions>
                                        {/*Do not wrap like renderDetails() so that it runs on render{}. Otherwise, there will
                                        be an error about some 'invalid child prop'*/}
                                        {borrowButtonRender(item.id)} 
                                        <Button size="small" color="primary" onClick={() => {renderDetails(item.id, i);}}>
                                            Details
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
            </div>
        </React.Fragment>
    )
}