import React, { useEffect } from 'react';
import { makeStyles} from '@material-ui/core/styles';
import { Grid } from "@material-ui/core";
import Typography from '@material-ui/core/Typography'
import { ExpandMore } from "@material-ui/icons/";
import { Card, CardActions, CardContent, CardHeader, Avatar}  from "@material-ui/core";
import { List, ListItem, ListItemText} from '@material-ui/core';
import Button from "@material-ui/core/Button";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core/';

const useStyles = makeStyles(theme => ({ 
    pageHeader:{
        marginTop: 5, 
        marginBottom: 5,
    },
    //Width of 155px ensures 2 cards per row on a standard iPhone 
    card:{
        minWidth: 350,
        maxWidth: 350,
    },
    cardAvatar: {
        backgroundColor: 'purple',
    },
    cardHeaderTitle: {
        fontSize: 'medium'
    },
    cardHeaderSubheader: {
        fontSize: 'medium'
    },
    bookListItem:{

    },
    bookListItemImg:{
        minWidth: 54, 
        height: 72, 
        marginRight: 3,
    },
    bookListItemDesc:{

    },
    borrowingsDisplay:{
        marginTop: 10, 
        marginBottom: '15%',
        padding: 4, 
        display: 'block',
    },
    borrowingsEmptyDisplay:{
        marginTop: 10, 
        marginBottom: '15%',
        display: 'none'
    }
}))

export default function BorrowingsRender(props){
    const classes = useStyles();
    
    //One state Hook per state, otherwise they can add weirdly when mixed
    //Use 'let', not 'const'. State is always manipulated
    let [cards, setCards] = React.useState([]); //Place initial state value on pg refresh on right side

    //The Hook equivalent of componentDidMount()
    useEffect(() => {
        const GETReqInit = {
            method:"GET", 
            cache:"no-cache",
            redirect: "error",
        }
        /**Both parameters are initialised with blanks */
        fetch("/Check-Borrowings", GETReqInit)
            .then(function(response){
                //pg automatically calls JSON.parse()
                return response.json()
                .then(function(data){
                    //Sending data straight to rendering function instead of state first prevents page for 
                    //zero results from showing first before page of data
                    cardRender(data);
                    //For handleBorrowingsCancel()
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
                    <Typography variant="body1" component="div" noWrap={false}>
                        No borrowings recorded
                    </Typography>
                </div>
            ]

            cards.splice(0, cards.length); //Immutably clears [cards]
            cards = [...noBorrowingsCard];
        }else {
            //Immutably clears state
            cards.splice(0, cards.length);
            let newCards = [];
            newCards.splice(0, newCards.length);

            //Operates on only 1 element of borrowingsRecord at a time
            for(let i=0; i<borrowingsRecord.length; i++){
                //Cannot place JS here. Maybe outsource all JS that renders JSX to functions, like for RenderResults.jsx?
                //toDateString() turns new Date() into "day-of-week month-day-year"
                let borrowDate = borrowingsRecord[i].borrowdate;
                let returnDue = borrowingsRecord[i].returndue;
                let currentDate = new Date().getTime();
                
                //Months start from zero in JS
                /* 
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
                
                let booksBorrowed = JSON.parse(borrowingsRecord[i].books);
                let booksList = booksListRender(booksBorrowed, i); //1 call made to bookListRender() for each item in borrowingsRecord
                let newCard = [
                    <Grid item key={'card.'+i} id={'borrowingsCard.'+i} href={borrowingsRecord[i].borrowerid}>
                        <Card classes={{root: classes.card}}>
                            <CardHeader
                                avatar = {
                                    <Avatar aria-label="id first letter" className={classes.cardAvatar}>
                                        {borrowingsRecord[i].borrowerid.substring(0,1)}
                                    </Avatar>
                                }
                                title = {borrowingsRecord[i].borrowerid}
                                subheader = {`Fine due: MYR ${lateFine}`}
                                classes = {{title: classes.cardHeaderTitle, subheader: classes.cardHeaderSubheader}}
                            />
                            <CardContent>
                                <Typography variant="body1" component="div" noWrap={true}>
                                    Days late: {currentDaysLate}
                                </Typography>
                                <Typography variant="body1" component="div" noWrap={true}>
                                    Date borrowed: {borrowDateString}
                                </Typography>
                                <Typography variant="body1" component="div" noWrap={true}>
                                    Due date: {returnDueString}
                                </Typography>
                            </CardContent>
                            <ExpansionPanel>
                                {/**ExpansionPanel automatically rotates <ExpandMore/> by 180 deg onClick*/}
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMore/>}
                                    aria-controls={'card.'+i+'-book-list'}
                                    id={'card.'+i+'-book-list-header'}
                                >
                                    <Typography className={classes.heading}>{'Books borrowed ('+booksBorrowed.length+')'}</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <List component="div" disablePadding>
                                        {booksList}
                                    </List>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                            <CardActions>
                                {/*Need to wrap functions with property passed like this. 
                                Otherwise, it runs on ComponentDidMount*/}
                                <Button size="small" color="primary" onClick={()=>{props.handleBorrowingsCancel(i,borrowingsRecord[i].borrowdate);}}>
                                    Return
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ]

                newCards = [...newCards, ...newCard]
            }   
            //For some reason, putting this inside the for loop only causes the last card
            //to be set to state
            setCards([...newCards]) 
        }
    }
    const booksListRender = (books, index) => { 
        let borrowersBooks = books;
        let cardIndex = index
        
        //One <ListItem/> generated per book borrowed
        let list = Array(borrowersBooks.length).fill().map((item, j) =>
            <ListItem key={'card.'+cardIndex+'book-list-item.'+j} className={classes.bookListItem}>
                <img alt='front cover' className={classes.bookListItemImg} src={borrowersBooks[j].coverimg}/>
                <ListItemText 
                    primary= {borrowersBooks[j].title} 
                    secondary={
                        <React.Fragment>
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.bookListItemDesc}
                                color="textPrimary"
                            >
                                {`${borrowersBooks[j].year} (id: ${borrowersBooks[j].id})`}
                            </Typography>
                            <br/> 
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.bookListItemDesc}
                                color="textPrimary"
                            >
                                {borrowersBooks[j].author}
                            </Typography>
                            <br/> 
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.bookListItemDesc}
                                color="textPrimary"
                            >
                                {borrowersBooks[j].publisher}
                            </Typography>
                        </React.Fragment>
                    }
                />
            </ListItem>
        )

        return list
    }

    //Always the last to run. Waits for all functions above it first
    return(   
        <React.Fragment>
            <Typography variant="h4" noWrap={false} classes={{root: classes.pageHeader}}>Borrowings recorded</Typography>
            <Typography variant="body1" component="div" noWrap={false}>Standard borrowing period is 14 days</Typography>
            <Typography variant="body1" component="div" noWrap={false}>Late fine set to MYR 0.50 per day</Typography>
            <div id='borrowingsDisplay' className={classes.borrowingsDisplay}>
                <Grid container spacing={4} justify="center">         
                    {cards} {/**The array's elements render one by one! No array.map() required*/}
                </Grid>
            </div>
            <div id="borrowingsEmptyDisplay" className={classes.borrowingsEmptyDisplay}>
                <Typography variant="body1" component="div" noWrap={false}>
                    All recorded borrowings cleared
                </Typography>
            </div>
        </React.Fragment>    
    )
}