import React from 'react';
import { useState } from 'react';
import { makeStyles} from '@material-ui/core/styles';
import { Grid, Typography } from "@material-ui/core";
import {Card, CardHeader, CardActionArea, CardActions, CardContent, CardMedia } from "@material-ui/core/";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({ 
    //Width of 155px ensures 2 cards per row on a standard iPhone 
    card:{
        maxWidth: 155,
    },
    cardImage:{
        maxWidth: 155,
    },
    pageTitle: {
        marginTop: 5, 
        marginBottom: 5,
        marginLeft: '2%',
    },
    cartDisplayContainer: {
        marginTop: 10, 
        marginBottom: '15%',
        marginLeft: '2%',
        padding: 4, 
        display: 'none'
    },
    checkoutButtonContainer:{
        margin: '5% auto',
        textAlign: 'center', //Centres the <Button/>
    },
    cartEmptyDisplayContainerCaption:{
        marginTop: 10, 
        marginBottom: 20,
        marginLeft: '2%',
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
}))

export default function CartDisplayRender(props){
    const borrowCart = props.borrowCart;
    const classes = useStyles();

    const [detailsCard, setDetailsCard] = useState([])

    const renderDetailsCard = (bookId) => {
        let detailsOverlay = document.getElementById(`detailsOverlay`);
        let targetIndex = borrowCart.findIndex(item => item.id === bookId);
        console.log(`Array position containing target book details: ${targetIndex}`)
        let bookDetails = borrowCart[targetIndex];
        
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

    return(
        <React.Fragment>
            <Typography variant='h4' align='left' classes={{root: classes.pageTitle}}>Cart contents</Typography>
            <div id='detailsOverlay' className={classes.detailsOverlay}>
                {detailsCard} {/**Must use state here: When state updates, the update is pushed to all calls of that state*/}
            </div>
            <div id='cartDisplay' className={classes.cartDisplayContainer}>
                <Grid container spacing={1} justify="center">
                    {/**post.map generates one card for each element in const posts*/}
                    {borrowCart.map(function(result,i) {
                        return(
                            <Grid item key={result.title} id={'cartCard.'+i} href={result.id}>
                                <Card classes={{root: classes.card}}>
                                    <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        alt={result.title}
                                        height="210"
                                        src={result.coverimg}
                                        classes= {{media: classes.cardImage}}
                                        onClick={() => {renderDetailsCard(borrowCart[i].id);}}
                                    />
                                    <CardContent>
                                        <Typography variant="body1" component="h2" noWrap={false}>
                                            <b>{result.title}</b>
                                        </Typography>
                                        <Typography variant="body1" component="div" noWrap={true}>
                                            {result.author}
                                        </Typography>
                                    </CardContent>
                                    </CardActionArea>
                                    <CardActions>
                                        {/**Need to wrap functions with property passed like this. 
                                        Otherwise, it runs on ComponentDidMount*/}
                                        <Button size="small" color="primary" onClick={() => {props.handleCartCancel(i)}}>
                                            Cancel
                                        </Button>
                                        <Button size="small" color="primary" onClick={() => {renderDetailsCard(borrowCart[i].id);}}>
                                            Details
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
                <div className={classes.checkoutButtonContainer}>
                    <Button id='checkoutButton' classes={{root: classes.checkoutButton}} onClick={props.handleCartCheckout} size='medium' variant='contained' color='inherit'>Checkout</Button>
                </div>
            </div>    
            {/**Only works if all books removed from cart. handleCartCancel() will make it 'display: block'*/}
            <div id="cartEmptyDisplay" className={classes.cartEmptyDisplayContainer}>
                <Typography variant="body1" component="div" noWrap={false} classes={{root: classes.cartEmptyDisplayContainerCaption}}>
                    Cart's empty. Time to get some books!
                </Typography>
            </div>
        </React.Fragment>
    )       
}