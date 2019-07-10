import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { makeStyles} from '@material-ui/core/styles';
import { Grid } from "@material-ui/core";
import TypoGraphy from '@material-ui/core/Typography'
import { IconButton, Collapse } from "@material-ui/core";
import { ExpandMore, ExpandLess } from "@material-ui/icons/";
import { Card, CardActionArea, CardActions, CardContent, CardMedia}  from "@material-ui/core";
import {ListSubheader, List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({ 
    //Width of 155px ensures 2 cards per row on a standard iPhone 
    card:{
        minWidth: 350,
        maxWidth: 350,
    },
    cardImage:{
        maxWidth: 155,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    expand: {
        transform: 'rotate(0deg)',
        marginLeft: 'auto',
        transition: theme.transitions.create('transform', {
            duration: theme.transitions.duration.shortest,
        }),
      },
    expandOpen: {
        transform: 'rotate(180deg)',
    },
}))

export default function BorrowingsRender(props){
    const classes = useStyles();
    
    let cards = [];
    let borrowDateStringRecord = [];
    let returnDueStringRecord = [];
    let currentDaysLateRecord = [];
    let lateFineRecord = [];
    let bookList = [];

    const [expanded, setExpanded] = React.useState(false);

    //The Hook equivalent of componentDidMount()
    useEffect(() => {
        const GETReqInit = {
            method:"GET",
            mode:"cors",   
            cache:"no-cache",
            credentials:"same-origin",
            redirect: "error",
        }
        /**Both parameters are initialised with blanks */
        fetch("http://localhost:3005/Check-Borrowings", GETReqInit)
            .then(function(response){
                //pg automatically calls JSON.parse()
                return response.json()
                .then(function(data){
                    cardRender(data);
                    props.stateUpdater('borrowingsRecord',[...data]);
                })
            })  
            .catch(function(error){
                console.log('Request failed', error)
            })
    }, []);

    //Need to call on component mount. Use the useEffect React hook for this
    const cardRender = (data) => { 
        const borrowingsRecord = data;
        console.log('Borrowings received for rendering:'); 
        console.log(borrowingsRecord); 

        if (borrowingsRecord.length === 0){
            const noBorrowingsCard = [
                <div id="borrowingsEmptyDisplay">
                    <TypoGraphy variant="body1" component="div" noWrap={false}>
                        No borrowings recorded
                    </TypoGraphy>
                </div>
            ]

            cards.splice(0, cards.length); //Immutably clears [cards]
            cards = [...noBorrowingsCard];
        }else {
            //Immutably clears state
            borrowDateStringRecord.splice(0, borrowDateStringRecord.length)
            returnDueStringRecord.splice(0, returnDueStringRecord.length)
            currentDaysLateRecord.splice(0, currentDaysLateRecord.length)
            lateFineRecord.splice(0, lateFineRecord.length)
            bookList.splice(0, bookList.length)
            
            //Need to modify to operate on only 1 element of borrowingsRecord at a time
            for(let i=0; i<borrowingsRecord.length; i++){
                //Cannot place JS here. Maybe outsource all JS that renders JSX to functions, like for RenderResults.jsx?
                //toDateString() turns new Date() into "day-of-week month-day-year"
                let borrowDate = borrowingsRecord[i].borrowdate;
                let returnDue = borrowingsRecord[i].returndue;
                let currentDate = new Date().getTime();
                
                //Months start from zero in JS
                /** 
                let testCurrentDate = new Date(2019, 4, 2, 7, 30, 0, 0).getTime();
                let testReturnDate = new Date(2019, 4, 16, 7, 30, 0, 0).getTime();
                console.log('Test current date:')
                console.log(testCurrentDate)
                console.log('Test return date:')
                console.log(testReturnDate)
                */

                //toFixed(1) fixes the equation's output to 1 decimal place by turning 
                //it into a string, so do the math before invoking this method!
                let daysLate = ((currentDate - returnDue)/(1000*60*60*24)).toFixed(1);
                //Adds a check that ensure currentDaysLate = 0 if daysLate > 0 (not late)
                let currentDaysLate = "0.00";
                let lateFine = "0.00"
                //Use parseFloat to convert the strings of number-decimals (floats) back into numbers
                if(parseFloat(daysLate) >0){
                    currentDaysLate = daysLate;
                    //Fine rate of 50 sen per day
                    lateFine = (parseFloat(currentDaysLate)*0.5).toFixed(2);
                } else {
                    currentDaysLate = "0.00";
                    lateFine = "0.00";
                }

                let borrowDateString = new Date(parseInt(borrowDate)).toDateString();
                let returnDueString = new Date(parseInt(returnDue)).toDateString();
                
                borrowDateStringRecord.splice(borrowDateStringRecord.length, 0, borrowDateString);
                returnDueStringRecord.splice(returnDueStringRecord.length, 0, returnDueString);
                currentDaysLateRecord.splice(currentDaysLateRecord.length, 0, currentDaysLate);
                lateFineRecord.splice(lateFineRecord.length, 0, lateFine);
            }
            console.log('[borrowDateStringRecord] check');
            console.log(borrowDateStringRecord);
            console.log(returnDueStringRecord);
            console.log(currentDaysLateRecord);
            console.log(lateFineRecord);
            console.log('[bookList] check');
            console.log(bookList);
            const newCardsArrayLength = borrowingsRecord.length
            let newCardsArray = Array(newCardsArrayLength).fill().map((item, i) =>
                <Grid item key={'card.'+i} id={'borrowingsCard.'+i} href={borrowingsRecord[i].borrowerid}>
                    <Card classes={{root: classes.card}}>
                        <CardContent>
                            <TypoGraphy variant="body1" component="div" noWrap={false}>
                                Borrower id: <b>{borrowingsRecord[i].borrowerid}</b>
                            </TypoGraphy>
                            <TypoGraphy variant="body1" component="div" noWrap={true}>
                                Date borrowed: {borrowDateStringRecord[i]}
                            </TypoGraphy>
                            <TypoGraphy variant="body1" component="div" noWrap={true}>
                                Due date: {returnDueStringRecord[i]}
                            </TypoGraphy>
                            <TypoGraphy variant="body1" component="div" noWrap={true}>
                                Days late: {currentDaysLateRecord[i]}
                            </TypoGraphy>
                            <TypoGraphy variant="body1" component="div" noWrap={true}>
                                Fine due: MYR {lateFineRecord[i]}
                            </TypoGraphy>
                        </CardContent>
                        <CardActions>
                            {/*Need to wrap functions with property passed like this. 
                            Otherwise, it runs on ComponentDidMount*/}
                            <Button size="small" color="primary" onClick={()=>{props.handleBorrowingsCancel(i,borrowingsRecord[i].borrowdate);}}>
                                Return
                            </Button>
                        </CardActions>
                        <CardContent>
                            <TypoGraphy variant="body1" component="div" noWrap={true}>
                                Books borrowed (click to expand)
                            </TypoGraphy>
                            <button onClick={handleExpandClick}>Flip</button>
                            {/**2 sets of classes apply here. On click, the icon rotates 180 deg*/}
                            {/*() => {booksBorrowed();} Does not work. Need to think how to get an array of JSX here...*/}
                        </CardContent>
                        {/** */}
                        <IconButton
                            className={clsx(classes.expand, {
                                [classes.expandOpen]: expanded,
                            })}
                            aria-expanded={expanded}
                            aria-label="Show more"
                            >
                            <ExpandMore/>  
                        </IconButton>
                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {/** bookList[i]*/}
                                <div>Cat</div>
                                <div>Dog</div>
                            </List>
                        </Collapse>
                    </Card>
                </Grid>
            )        
            
            //This does not run the return function if it does not set state?
            cards.splice(0, cards.length);
            cards.splice(cards.length, 0, newCardsArray);
            return cards;
        }
    }

    const booksBorrowed = (books) => {
        let borrowersBooks = JSON.parse(books);

        //One <ListItem/> generated per book borrowed
        let bookList = Array(borrowersBooks.length).fill().map((item, i) =>
            <ListItem className={classes.nested}>
                <ListItemIcon>
                    <img alt='front cover' src={borrowersBooks[i].coverimg}/>
                </ListItemIcon>
                <ListItemText primary={borrowersBooks[i].id} />
                <ListItemText primary={borrowersBooks[i].title} />
                <ListItemText primary={borrowersBooks[i].year} />
                <ListItemText primary={borrowersBooks[i].publisher} />
            </ListItem>
        )

        return bookList
    }

    //For <Collapse/>
    //Why can't it change false to true???
    const handleExpandClick = () => {
        setExpanded(!expanded);
        console.log(expanded);

        /** 
        if (props.expandList === false){
            return props.stateUpdater('expandList',true)
        } else if (props.expandList === true) {
            return props.stateUpdater('expandList',false)
        }
        */
    }
    
    const checkState = () => {
        console.log(cards)
    }

    //Always the last to run. Waits for all functions above it first
    return(   
        <React.Fragment>
            <TypoGraphy variant="h5" component="h2" noWrap={false}>Borrowings recorded</TypoGraphy>
            <TypoGraphy variant="body1" component="div" noWrap={false}>Standard loan period is 14 days</TypoGraphy>
            <TypoGraphy variant="body1" component="div" noWrap={false}>Late fine set to MYR0.50 per day</TypoGraphy>
            <div id='borrowingsDisplay' style={{ marginTop: 20, padding: 4,}}>
                <Grid container spacing={1} justify="center">
                    {[cards]} {/**The array's elements render one by one! No array.map() required*/}
                </Grid>
            </div>    
            <button onClick={checkState}>Check [cards]</button>      
        </React.Fragment>    
    )
}