import React from 'react';
import deburr from 'lodash/deburr';
import Autosuggest from 'react-autosuggest';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles} from '@material-ui/core/styles';
import { Search, Settings } from '@material-ui/icons'
import {
    withRouter,
} from "react-router-dom";
import background from './icons/background.png';

function renderInputComponent(inputProps) {
    //How CSS is passed from "const useStyles()" to this <TextField/>:
    /*  Define CSS in input{} object in "const useStyles" 
        In IntegrationAutosuggest(), place its classes prop inside inputProps and have 
        classes = useStyles() 
        renderInputComponent() is passed the css through the inputProps property.
        Retrieve by assigning renderInputComponent()'s classes prop = inputProps then
        pulling out the CSS in the input{} object as classes.input
     */  
    const {classes, inputRef = () => {}, ref, ...other } = inputProps;
    return (
        <TextField
            //fullWidth //Causes <Textfield/> to occupy full width of box
            variant = 'filled' //Automatically changes <input/> into gray box with underline
            fullWidth = {false}
            InputProps={{
                inputRef: node => {
                    ref(node);
                    inputRef(node);
                },
                classes: {
                    input: classes.input,
                },
                disableUnderline: true //Stops that pesky underline
            }}
            {...other}
        />
    );
}

function renderSuggestion(suggestion, { query, isHighlighted }) {
    const matches = match(suggestion.label, query);
    const parts = parse(suggestion.label, matches)

    return (
        <MenuItem selected={isHighlighted} component="div">
        <div>
            {parts.map(part => (
            <span key={part.text} style={{ fontWeight: part.highlight ? 500 : 400 }}>
                {part.text}
            </span>
            ))}
        </div>
        </MenuItem>
    );
}

function getSuggestions(value) {
    const inputValue = deburr(value.trim()).toLowerCase();
    const inputLength = inputValue.length;
    let count = 0;

    return inputLength === 0
        ? []
        : suggestions.filter(suggestion => {
            //Not sure how, but this seems to only allow elements in the array to be
            //suggested if their first letter(s) matches the value in state.single
            const keep = count < 5 && suggestion.label.slice(0, inputLength).toLowerCase() === inputValue;
            if (keep) {
                count += 1;
            }
            return keep;
        });
}

function getSuggestionValue(suggestion) {
    return suggestion.label;
}
const useStyles = makeStyles(theme => ({
    root: { //Outer div box
        marginTop: '1%',
        marginBottom: '1%',
        width:'100%',
        height: 200,
        position: 'relative',

        backgroundImage: `url(${background})`,
        backgroundPositionX: '50%',
        backgroundPositionY: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
        backgroundSize: '100%',
    },
    content:{ //Inner div box 
        width:'95%',
        height: 45, //Controls the height of the <TextField/> by being the relative measure
        position: 'absolute',
        border: '2px solid black',
        background: 'white',
        //Horizontal and vertical inner divs are 95% of outer div's width and height respectively, 
        //so add 2.5% margin on left and right to centre
        //'6.5%' ensures a bias towards the top (7.5% = centre), due to the searchboxbox text 
        //aligned bottom
        margin:'2.5% 2.5% 0 2.5%', 
    },
    container: { //Contains the searchbox
        width:'70%',
        height: 45,
        float: 'left',
    },   
    //CSS in this object is passed to renderInputComponent() for the <TextField/> box
    input: {
        maxHeight: 6,
        background: 'white',
        //Causes <TextField/>'s background colour to change on hover
        /** transition: theme.transitions.create(['border-color', 'box-shadow']),
            '&:hover': {
            backgroundColor: '#fff',
        },
        //Causes <TextField/>'s border to turn green on click (typing cursor visible)
        '&:focus': {
            border: '2px solid green',
        },*/
    },
    buttonBox: {
        width: '30%',
        float: 'left',
    },
    //Plain CSS has taken over <button/> sizing. Material <button/> API seems to constantly force size!
    buttonIcon: {
        width: '60%',
        height: '60%',
        marginLeft: '22%',
        marginTop: '22%',
    },
    suggestionsContainerOpen: { //The box containing all suggestions
        zIndex: 1, //Prevents suggestions from pushing down content
        marginTop: 1,
        left: 0,
    },
    suggestionsList: { //The list within the box containing all suggestions
        margin: 0,
        padding: 0,
        listStyleType: 'none',
    },
    suggestion: { //Each line of suggestions
        display: 'block',
    },
}));

const titleCss = makeStyles(theme => ({
    root: { //Outer div box
        width:'100%',
        height: 50,
        color: 'white',
        paddingTop: '5%',
    },
}));

//Contains the suggestions returned by the handleChange() function
let suggestions = [];

//Added "props" parameter to allow passing of functions and state as props from BasicSearch.jsx
//Note that access is by "props.function" instead of "this.props.function"
function IntegrationAutosuggest(props) {
    const classes = useStyles();
    const titleStyle = titleCss();

    const [state, setState] = React.useState({
        single: '',
        popper: '',
    });
    const [stateSuggestions, setSuggestions] = React.useState([]);

    const handleSuggestionsFetchRequested = ({ value }) => {
        //setTimeout() to allow time for fetch() request in handleChange() to retrive suggestions
        //to insert into suggestions[]. Otherwise, suggestions[] will be a blank array or have
        //invalid suggestions
        setTimeout(function(){
            setSuggestions(getSuggestions(value));
        },200) 
    };
    const handleSuggestionsClearRequested = () => {
        setSuggestions([]);
    };
    const handleChange = name => (event, { newValue }) => {
        setState({
            ...state,
            [name]: newValue,
        });

        //Passes the value updated in this component's states to be used in the
        //function triggered on Enter keypress
        props.basicSearchStateUpdater(name, newValue);
        
        //String passed to PSQL must be free of special characters, otherwise it'll bug (parentheses not balanced)
        const removeSpecialChars = (string) => {
            return string.replace(/(?!\w|\s)./g, '')
              .replace(/\s+/g, ' ')
              //.replace(/\s/g, '') // removes whitespace
              .replace(/^(\s*)([\W\w]*)(\b\s*$)/g, '$2');
          }
        let basicInput = '.*'+removeSpecialChars(state.single)+'.*';
        //Timeout left in in case necessary to delay queries to server
       
        //Obtains data for search suggestions
        fetch("http://localhost:3005/Suggestions/"+basicInput, {method: "GET",mode:"cors"})
        //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
        .then(function(response){
            return response.json()
            .then(function(data){
                console.log("List of suggestions:");
                console.log(data);
                
                if(data.length === 0){
                    console.log("No suggestions available")
                } else {
                    //Clears "suggestions" array immutably
                    suggestions.splice(0, suggestions.length);
                    let newSuggestions = data.map(obj =>{ 
                        let rObj = {};
                        rObj["label"] = obj.title;
                        return rObj;
                    });
                    suggestions = newSuggestions;
                }               
            })
        })
        .catch(function(error){
            console.log('Request for suggestions failed', error)
        })
    };
    const handleSubmit = () => { 
        //Cannot call the prop directly, it seems to cause handleBasicSearchSubmit()
        //to be called repeatedly
        props.handleBasicSearchSubmit(state.single)
    }
    const autosuggestProps = {
        renderInputComponent,
        suggestions: stateSuggestions,
        onSuggestionsFetchRequested: handleSuggestionsFetchRequested,
        onSuggestionsClearRequested: handleSuggestionsClearRequested,
        getSuggestionValue,
        renderSuggestion,
    };
    return (
        <div className={classes.root}>
            <Typography variant='h5' align='center' className={titleStyle.root}>Start your search</Typography>
            <div className={classes.content}>
                <Autosuggest
                    {...autosuggestProps}
                    inputProps={{
                        classes,
                        id: 'react-autosuggest-simple',
                        label: 'Title, author, synopsis...', //Floating text above typing area
                        placeholder: '', //Background of <Textfield/>
                        value: state.single,
                        onChange: handleChange('single'),
                    }}
                    theme={{
                        container: classes.container,
                        suggestionsContainerOpen: classes.suggestionsContainerOpen,
                        suggestionsList: classes.suggestionsList,
                        suggestion: classes.suggestion,
                    }}
                    renderSuggestionsContainer={options => (
                        <Paper {...options.containerProps} square>
                            {options.children}
                        </Paper>
                    )}      
                />    
                <div className={classes.buttonBox}>
                    <div className='searchButton' id='basicSearchSubmitButton' onClick={() => {handleSubmit();}}>
                        <Search className={classes.buttonIcon}/>
                    </div>  
                    <div className='advancedButton' onClick={()=>{props.history.push('/AdvancedSearch');}}>
                        <Settings className={classes.buttonIcon}/>
                    </div>  
                </div>
            </div>
        </div>
    );
}

export default withRouter(IntegrationAutosuggest);