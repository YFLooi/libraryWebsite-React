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
}))

export default function CartDisplayRender(props){
    const borrowCart = props.borrowCart;
    const classes = useStyles();

    return(
        <React.Fragment>
            <div id='cartDisplay' style={{ marginTop: 10, padding: 4, display: 'none'}}>
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
                <Button id='checkoutButton' onClick={props.handleCartCheckout} size='medium' variant='contained' color='inherit'>Checkout</Button>
            </div>    
            {/**Only works if all books removed from cart. handleCartCancel() will make it 'display: block'*/}
            <div id="cartEmptyDisplay" style={{display: 'none',}}>
                <Typography variant="body1" component="div" noWrap={false} style={{marginTop: 10,}}>
                    Cart's empty. Time to get some books!
                </Typography>
            </div>
        </React.Fragment>
    )       
}