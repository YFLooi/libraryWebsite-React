import React, { useEffect, useState } from 'react';
import {
    withRouter,
} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, FormControlLabel, InputLabel, Input, TextField, Button } from '@material-ui/core';
import TypoGraphy from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
    outerContainer:{
        marginLeft: '2%'
    },
    title: {
        marginTop: '5%',
        marginLeft: '2%',
    },
    form: {
        marginLeft: '2%',
        width: '100%'
    },
    //General styling for each <input> box 
    inputBox: {
        marginTop: '1%',
        marginBottom: '1%',
        marginLeft: '2%',
        width: '90%',
        height: 48
    },
    submitButton: {
        marginTop: '2%',
        //Centres the button relative to the <form/>
        /** 
        display: 'block', 
        margin: '0 auto',     
        */
    },
}));

function SuggestBooks (props) {   
    const classes = useStyles();

    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [year, setYear] = useState('')
    const [publisher, setPublisher] = useState('')

    const handleSuggestionChange = (event) => { 
        if (event.target.name === 'title'){
            setTitle(event.target.value)
        } else if (event.target.name === 'author'){
            setAuthor(event.target.value)
        } else if (event.target.name === 'year'){
            setYear(event.target.value)
        } else if (event.target.name === 'publisher'){
            setPublisher(event.target.value)
        } else {
            console.log('Invalid event name passed to handeSuggestionChange()')
        }
    }
    const handleSuggestionSubmit = (event) => {
        event.preventDefault();
        console.log('Form submit event triggered')
        
        /** 
        //JSON.parse cannot accept blank strings, ''. The if-else here inserts string 'null'
        //if it detects the submitted state is ''
        const advTitle = reducedAdvTitle === '' ? 'null' : reducedAdvTitle;
        const condTitAuth = props.condTitAuth 
        const advAuthor = props.advAuthor === '' ? 'null' : props.advAuthor;
        const condAuthYr = props.condAuthYr;
        const advYearStart = props.advYearStart === '' ? 'null' : props.advYearStart;
        const advYearEnd = props.advYearEnd === '' ? 'null' : props.advYearEnd;
        const condYrPub = props.condYrPub;
        const advPublisher = props.advPublisher === '' ? 'null' : props.advPublisher;
        const condPubSynp = props.condPubSynp;
        const advSynopsis = props.advSynopsis === '' ? 'null' : props.advSynopsis;
    
        console.log(advTitle+condTitAuth+advAuthor+condAuthYr+advYearStart+' to '+advYearEnd+condYrPub+advPublisher+condPubSynp+advSynopsis)
    
        //Search occurs as long as one advSearch parameter is not a 'null' string
        if(advTitle === 'null' &&  advAuthor === 'null' && advPublisher === 'null' && 
        advYearStart === 'null' && advYearEnd === 'null' && advPublisher === 'null' 
        && advSynopsis === 'null'){
            console.log('Blank query made. No query submitted');
        } else {
            fetch('/AdvSearch/'+advTitle+'/'+condTitAuth+'/'+advAuthor+'/'+condAuthYr+
            '/'+advYearStart+'/'+advYearEnd+'/'+condYrPub+'/'+advPublisher+'/'+condPubSynp+'/'+advSynopsis
            ,{method:'GET'})
                //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
                .then(function(response){
                    return response.json()
                    .then(function(data){
                        console.log('Results of AdvSrch:');
                        console.log(data);

                        //Prevents rendering if no results returned from search
                        if (data.length === 0) {
                            //alert('No results found. Try again');
                            props.history.push('/NoResults');
                        } else {
                            let currentResults = props.searchResults
                            currentResults.splice(0, currentResults.length);
                            let newResults = [...currentResults, ...data];

                            props.stateUpdater('searchResults',newResults)
                            props.stateUpdater('isNewResultsLoaded',true)
        
                            //Timeout necessary because asnyc nature of JS allows code after
                            //props.stateUpdater() to run before it sets 'isNewResultsLoaded'
                            //to 'true'
                            setTimeout(function(){
                                props.history.push('/SearchResults');
                            }, 500)
                        }
                    })
                })  
                .catch(function(error){
                    console.log('Request failed', error)
                })
        }
        */
    }
    return(
        <React.Fragment>
            <TypoGraphy variant='h4' className={classes.title} color='inherit'>Suggest books</TypoGraphy>
            <TypoGraphy variant='body1' className={classes.title} color='inherit'>
                *Required: Title, author, year
            </TypoGraphy>
            <form name='advsearch' className={classes.form} onSubmit={handleSuggestionSubmit}>
                {/*Styling with className also works on vanilla HTML*/}
                <FormControl classes={{root: classes.inputBox}}>
                    {/**Displays label for input field, like a placeholder */}
                    <InputLabel htmlFor='Title'>Title</InputLabel>
                    {/**Same as HTML input field*/}
                    <Input id='advTitle' name='title' type='text' autoComplete='on' onChange = {handleSuggestionChange}/>
                </FormControl>
                <FormControl classes={{root: classes.inputBox}}>
                    <InputLabel htmlFor='Author'>Author</InputLabel>
                    <Input id='advAuthor' name='author' type='text' autoComplete='on' onChange = {handleSuggestionChange}/>
                </FormControl>
                <FormControl classes={{root: classes.inputBox}}>
                    <InputLabel htmlFor='Year start'>Year start</InputLabel>
                    <Input id='advYearStart' name='year' type='text' autoComplete='on' onChange = {handleSuggestionChange}/>
                </FormControl>
                <FormControl classes={{root: classes.inputBox}}>
                    <InputLabel htmlFor='Publisher'>Publisher</InputLabel>
                    <Input id='advPublisher' name='publisher' type='text' autoComplete='on' onChange = {handleSuggestionChange}/>
                </FormControl>
                <Button variant='contained' color='primary' size='medium' type='submit' classes={{root: classes.submitButton}}>
                    Submit
                </Button>
            </form>

            <TypoGraphy variant='h4' className={classes.title} color='inherit'>Prior suggestions</TypoGraphy>
        </React.Fragment> 
    )   
}

//Allows this child class to interface with <Hashrouter/> in parent class MainPage()
export default withRouter(SuggestBooks);
