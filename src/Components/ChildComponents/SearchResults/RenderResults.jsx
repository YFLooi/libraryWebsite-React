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

export default function RenderResults(props){
    const searchResults = props.searchResults
    const borrowCart = props.borrowCart;
    const classes = useStyles();

    const borrowButtonRender = (resultId) => {
        /*To change innerHTML of 'borrow' button to "Cancel" if book has been borrowed*/
        /**findIndex() here checks for match between searchResult and cart contents
        If there is a match (!= -1)), 'borrow' button inner HTML is set to "Cancel" */
        let cartCheck = borrowCart.findIndex(cart => cart.id === resultId);
        
        if (cartCheck === -1){
            return (
                <Button onClick={() => {props.borrowRequest(resultId);}} id={'borrow.'+resultId} size="small" color="primary">
                    Borrow
                </Button>
            )
        } else {
            return (
                <Button onClick={() => {props.borrowRequest(resultId);}} id={'borrow.'+resultId} size="small" color="primary">
                    Cancel
                </Button>
            )
        }
    }
    return(
        <React.Fragment>
            <Typography variant="h5" component="h2">Search results</Typography>
            <div style={{ marginTop: 20, padding: 4 }}>
                <Grid container spacing={1} justify="center">
                    {/**post.map generates one card for each element in const posts*/}
                    {searchResults.map(function(item,i) {
                        return(
                            <Grid item key={item.title}>
                                <Card classes={{root: classes.card}}>
                                    <CardActionArea>
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
                                        {/**<Typography component="p" variant="body1" noWrap={true}>{item.synopsis}</Typography>*/}
                                    </CardContent>
                                    </CardActionArea>
                                    <CardActions>
                                        {borrowButtonRender(item.id)}
                                        <Button size="small" color="primary">
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