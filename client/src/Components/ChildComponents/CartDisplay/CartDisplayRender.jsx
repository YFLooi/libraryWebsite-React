import React from 'react';
import { makeStyles} from '@material-ui/core/styles';
import { Grid, Typography } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
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
    },
    cartDisplayContainer: {
        marginTop: 10, 
        marginBottom: '15%',
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
    },
}))

export default function CartDisplayRender(props){
    const borrowCart = props.borrowCart;
    const classes = useStyles();

    return(
        <React.Fragment>
            <Typography variant='h4' align='left' classes={{root: classes.pageTitle}}>Cart contents</Typography>
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