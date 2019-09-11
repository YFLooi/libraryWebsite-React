import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    withRouter,
} from "react-router-dom";
import TypoGraphy from '@material-ui/core/Typography'
//import { Button } from '@material-ui/core';
import background from './icons/ConfusedOwl.png'

const useStyles = makeStyles(theme => ({
    outerDiv: {
        marginTop: '5%',
        marginLeft: '2%' 
    },
    typography:{
        textAlign: 'center',
    },
    backgroundImageDiv: {
        marginTop: '2.5%',
        marginBottom: '2.5%',
        width: '100%',
        height: 250,

        backgroundImage: `url(${background})`,
        backgroundPositionX: '50%',
        backgroundPositionY: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
        backgroundSize: 'contain', //Ensures background does not overflow out of <div>
    },
    backgroundImageAttribution: {
        marginTop: '0.5%',
        marginBottom: '2.5%',
        fontSize: 'x-small',
        textAlign: 'center',
    },
    links:{ 
        backgroundColor: 'LightGray',
        color: 'blue',
        cursor: 'pointer',

        '&:hover': { 
            color: 'purple' 
        },
    },
}));

function NoResults (props) {   
    const classes = useStyles();

    return (
        <div className={classes.outerDiv}> 
            <TypoGraphy classes={{root: classes.typography}} variant='h4' color='inherit'>Whoops, that's a dud!</TypoGraphy>
            <TypoGraphy classes={{root: classes.typography}} variant='body1' color='inherit'>
                No results were found for your search. Try different terms
            </TypoGraphy>
            <div className={classes.backgroundImageDiv}></div>
            <div className={classes.backgroundImageAttribution}>Made with love by <a href='https://pixabay.com/vectors/owl-bird-eyes-cartoon-good-4073873/'>Pixabay</a></div>
            <TypoGraphy classes={{root: classes.typography}} variant='body1' color='inherit'>
                Looking to Explore? <span className={classes.links} onClick={() => {props.history.push('/Explore');}}>Browse our collection</span>
            </TypoGraphy>
            <p></p>
            <TypoGraphy classes={{root: classes.typography}} variant='body1' color='inherit'>
                Want new books for the library? <span className={classes.links} onClick={() => {props.history.push('/SuggestBooks');}}>Let us know here</span>
            </TypoGraphy>
            <p></p>
            <TypoGraphy classes={{root: classes.typography}} variant='body1' color='inherit'>
                <span className={classes.links} onClick={() => {props.history.push('/');}}>Back to Home Page</span>
            </TypoGraphy>
        </div>
    )
}

//Allows this child class to interface with <Hashrouter/> in parent class MainPage()
export default withRouter(NoResults);
