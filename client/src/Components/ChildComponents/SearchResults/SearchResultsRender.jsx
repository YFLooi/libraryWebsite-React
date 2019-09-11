import React, { useEffect, useState }  from 'react';
import { makeStyles} from '@material-ui/core/styles';
import { Grid, Typography } from "@material-ui/core";
import { Card, CardHeader, CardMedia, CardActionArea, CardActions, CardContent, } from "@material-ui/core/";
import Button from "@material-ui/core/Button";
import DetailsCardRender from '../DetailsCardRender/DetailsCardRender.jsx'

const useStyles = makeStyles(theme => ({ 
    pageHeader:{
        marginTop: '5%',
        marginLeft: '2%',
    },
    resultsDisplayContainer: {
        marginTop: 10, 
        marginBottom: '15%',
    },
    resultsCard:{
        maxWidth: 155,
    },
    resultsCardImage:{
        maxWidth: 155,
    }
}))

export default function SearchResultsRender(props){
    let borrowCart = props.borrowCart;
    const classes = useStyles();

    useEffect(() => {
        console.log('Data from search:');
        console.log(props.searchResults);
        setSearchResults([...props.searchResults]);
    }, []); //Change in this prop effects the above actions
    const [searchResults, setSearchResults] = React.useState([]);
    const [targetBookId, setTargetBookId] = React.useState(null);

    const searchResultsStateUpdater = (name,data) => {
        if (name === 'bookData'){
            setSearchResults([...data]);
        } else if (name === 'targetBookId'){
            setTargetBookId(data);
        } else {
            console.log('Invalid state name passed')
        }
    }
    const borrowButtonRender = (bookId) => {
        //To change innerHTML of 'borrow' button to "Cancel" if book has been borrowed
        //findIndex() here checks for match between searchResult and cart contents
        //If there is a match (!= -1)), 'borrow' button inner HTML is set to "Cancel" 
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
    return(
        <React.Fragment>
            <Typography variant="h5" component="h2" classes={{root: classes.pageHeader}}>Search results</Typography>
            <DetailsCardRender
                targetBookId={targetBookId}
                bookData={searchResults}
                borrowCart={props.borrowCart}
                stateUpdater={props.stateUpdater}
                callingComponentStateUpdater={searchResultsStateUpdater}
            />
            <div className={classes.resultsDisplayContainer}>
                <Grid container spacing={1} justify="center">
                    {/**searchResults.map generates one card for each element in
                    this.state.searchResults. It re-renders entirely upon any change in 
                    state, for example when a 'Borrow' request is made.
                    That's why if 'Details' overlay is activated, both 'Borrow' 
                    butons change when the 'Borrow' button in the 'Details' 
                    overlay is clicked*/}
                    {searchResults.map(function(item,i) {
                        return(
                            <Grid item key={`card.${i}`}>
                                <Card classes={{root: classes.resultsCard}}>
                                    <CardActionArea onClick={() => {searchResultsStateUpdater('targetBookId', item.id);}}>
                                        <CardMedia
                                            component="img"
                                            alt={item.title}
                                            height="210"
                                            src={item.coverimg}
                                            classes= {{media: classes.resultsCardImage}}
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
                                        {/*Do not wrap like renderDetailsCard() so that it runs on render{}. Otherwise, there will
                                        be an error about some 'invalid child prop'*/}
                                        {borrowButtonRender(item.id)} 
                                        <Button size="small" color="primary" onClick={() => {searchResultsStateUpdater('targetBookId', item.id);}}>
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