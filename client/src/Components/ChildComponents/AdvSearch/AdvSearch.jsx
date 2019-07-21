import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    //Allows us to connect to <Hashrouter/> from a child component
    withRouter
} from 'react-router-dom'; 
import TypoGraphy from '@material-ui/core/Typography'
//Radio and RadioGroup are for the radio buttons
import { FormControl, FormControlLabel, InputLabel, Input, TextField, Button, Radio, RadioGroup} from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
    },
    title: {
        marginTop: '5%',
    },
    //Width of the containing <div> for each box
    categoryContainer:{
        width: '100%',
        height: 54,
    },
    //General styling for each <input> box excluding 'Year Start', 'Year end', 'Synopsis' 
    formcontrol: {
        width: '90%',
        height: 48,
    },
    //Styling specific to 'Year Start' and 'Year end' criteria
    years: {
        float: 'left',
        width: '40%',
        height: 48,
    },
    yearsDivider: {
        float: 'left',
        width: 30,
        height: 48,
        paddingTop: 20,
    },
    //For the AND/OR radio buttons
    conditionals: {
        display: 'inline-block',
        width: '90%',
        height: 48,
    },
    synopsisContainer:{
        width: '100%',
        height: 140,
        marginBottom: '2%'
    },
    synopsisBox:{
        width: '90%',
    },
    submitButton: {
        //Centres the button relative to the <form/>
        /** 
        display: 'block', 
        margin: '0 auto',     
        */
    },
}));

function AdvSearch(props){
    const classes = useStyles();
    const handleAdvSearchChange = (event) => { 
        /*When called, it looks for the state with the same name 
        as the <input> box and updates it as =event.target.value 
        (value or content of input box)*/
        /*Only works if <input> has same name as state!*/
        props.stateUpdater([event.target.name],event.target.value)
    }
    const handleAdvSearchSubmit = (event) => {
        event.preventDefault();
        
        const removeSpecialChars = (string) => {
            return string.replace(/(?!\w|\s)./g, '')
              .replace(/\s+/g, ' ')
              .replace(/\s/g, '') // removes whitespace
              .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
        }
        let reducedAdvTitle = removeSpecialChars(props.advTitle).toLowerCase();

        /*JSON.parse cannot accept blank strings, ''. The if-else here inserts string 'null'
        if it detects the submitted state is ''*/
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
    
        /*Search occurs as long as one advSearch parameter is not a 'null' string*/
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
                            alert('No results found. Try again');
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
    }
    return(
        <React.Fragment>
            <TypoGraphy variant='h4' className={classes.title} color='inherit'>Advanced search</TypoGraphy>
            <TypoGraphy variant='h5' className={classes.title} color='inherit'>
                Use OR/AND to chain multiple criteria together
            </TypoGraphy>
            <form name='advsearch' onSubmit={handleAdvSearchSubmit}>
                {/*Styling with className also works on vanilla HTML*/}
                <div className={classes.categoryContainer}>
                    <FormControl className={classes.formcontrol}>
                        {/**Displays label for input field, like a placeholder */}
                        <InputLabel htmlFor='Title'>Title</InputLabel>
                        {/**Same as HTML input field*/}
                        <Input id='advTitle' name='advTitle' type='text' autoComplete='off' onChange = {handleAdvSearchChange}/>
                    </FormControl>
                </div>
                <div className={classes.categoryContainer}>
                    <RadioGroup
                        name='condTitAuth'
                        value={props.condTitAuth}
                        onChange={handleAdvSearchChange}
                        className={classes.conditionals}
                    >
                        <FormControlLabel value='OR' control={<Radio/>} label='OR' />
                        <FormControlLabel value='AND' control={<Radio />} label='AND' />
                    </RadioGroup>
                </div>
                <div className={classes.categoryContainer}>
                    <FormControl className={classes.formcontrol}>
                        <InputLabel htmlFor='Author'>Author</InputLabel>
                        <Input id='advAuthor' name='advAuthor' type='text' autoComplete='off' onChange = {handleAdvSearchChange}/>
                    </FormControl>
                </div>
                <div className={classes.categoryContainer}>
                    <RadioGroup
                        name='condAuthYr'
                        value={props.condAuthYr}
                        onChange={handleAdvSearchChange}
                        className={classes.conditionals}
                    >
                        <FormControlLabel value='OR' control={<Radio/>} label='OR' />
                        <FormControlLabel value='AND' control={<Radio />} label='AND' />
                    </RadioGroup>
                </div>
                <div className={classes.categoryContainer}>
                    <FormControl className={classes.years}>
                        <InputLabel htmlFor='Year start'>Year start</InputLabel>
                        <Input id='advYearStart' name='advYearStart' type='text' autoComplete='off' onChange = {handleAdvSearchChange}/>
                    </FormControl>
                    <TypoGraphy className={classes.yearsDivider} variant='body1' align='center'>to</TypoGraphy>
                    <FormControl className={classes.years}>
                        <InputLabel htmlFor='Year end'>Year end</InputLabel>
                        <Input id='advYearEnd' name='advYearEnd' type='text' autoComplete='off' onChange = {handleAdvSearchChange}/>
                    </FormControl>
                </div>
                <div className={classes.categoryContainer}>
                    <RadioGroup
                        name='condYrPub'
                        value={props.condYrPub}
                        onChange={handleAdvSearchChange}
                        className={classes.conditionals}
                    >
                        <FormControlLabel value='OR' control={<Radio/>} label='OR' />
                        <FormControlLabel value='AND' control={<Radio />} label='AND' />
                    </RadioGroup>
                </div>
                <div className={classes.categoryContainer}>
                    <FormControl className={classes.formcontrol}>
                        <InputLabel htmlFor='Publisher'>Publisher</InputLabel>
                        <Input id='advPublisher' name='advPublisher' type='text' autoComplete='off' onChange = {handleAdvSearchChange}/>
                    </FormControl>
                </div>
                <div className={classes.categoryContainer}>
                    <RadioGroup
                        name='condPubSynp'
                        value={props.condPubSynp}
                        onChange={handleAdvSearchChange}
                        className={classes.conditionals}
                    >
                        <FormControlLabel value='OR' control={<Radio/>} label='OR' />
                        <FormControlLabel value='AND' control={<Radio />} label='AND' />
                    </RadioGroup>
                </div>
                <div className={classes.synopsisContainer}>
                    <TextField id='advSynopsis' name='advSynopsis' className={classes.synopsisBox} label='Synopsis Keywords' type='text' multiline rows='4' autoComplete='off' onChange={handleAdvSearchChange}/>
                </div>
                <div className={classes.categoryContainer}>
                    <Button variant='contained' color='inherit' size='medium' type='submit' className={classes.submitButton}>
                        Begin search
                    </Button>
                </div>
            </form>
        </React.Fragment> 
    )   
}

//Allows this child class to interface with <Hashrouter/> in parent class MainPage()
export default withRouter(AdvSearch);
