import React from 'react';
import clsx from 'clsx';
import { makeStyles} from '@material-ui/core/styles';
import { Grid, Typography } from "@material-ui/core";
import { IconButton, Collapse } from "@material-ui/core";
import { ExpandMoreIcon } from "@material-ui/core/icons";
import { Card, CardActionArea, CardActions, CardContent, CardMedia}  from "@material-ui/core";
import {ListSubheader, List, ListItem, ListItemIcon, ListItemText} from '@material-ui/core';
import Button from "@material-ui/core/Button";

const useStyles = makeStyles(theme => ({ 
    //Width of 155px ensures 2 cards per row on a standard iPhone 
    card:{
        maxWidth: 155,
    },
    cardImage:{
        maxWidth: 155,
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
}))

export default function BorrowingsRender(props){
    const borrowingsRecord= props.borrowingsRecord;
    const classes = useStyles();
    
    //Removes password stored in this.state.passwordInput
    //Also clears the password input box because its value is set to this.state.passwordInput
    this.props.stateUpdater('passwordInput','')

    const booksBorrowed = (i) => {
        let borrowersBooks = borrowingsRecord[i].books;

        /** 
        return (
            <List component="div" disablePadding>
                {borrowersBooks.map(function(result,j) {                
                    <ListItem className={classes.nested}>
                        <ListItemIcon>
                            <img src={result.coverimg}/>
                        </ListItemIcon>
                        <ListItemText primary={result.id} />
                        <ListItemText primary={result.title} />
                        <ListItemText primary={result.year} />
                        <ListItemText primary={result.publisher} />
                    </ListItem>
                })}
            </List>
        )
        */
    }

    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    }

    if (borrowingsRecord.length === 0){
        return(
            <div id="borrowingsEmptyDisplay">
                <Typography variant="body1" component="div" noWrap={false}>
                    No borrowings recorded
                </Typography>
            </div>
        )
    } else {
        return(   
            <div id='borrowingsDisplay' style={{ marginTop: 20, padding: 4,}}>
                <Grid container spacing={1} justify="center">
                    {/**post.map generates one card for each element in const posts*/}
                    {borrowingsRecord.map(function(result,i) {
                        //Cannot place JS here. Maybe outsource all JS that renders JSX to functions, like for RenderResults.jsx?
                         //toDateString() turns new Date() into "day-of-week month-day-year"
                        let borrowDate = borrowingsRecord[i].borrowDate;
                        let returnDue = borrowingsRecord[i].returnDue;
                        let currentDate = new Date().getTime();
                        
                        //Months start from zero in JS
                        //let testCurrentDate = new Date(2019, 5, 29, 7, 30, 0, 0).getTime();
                        
                        /* toFixed(1) fixes the equation's output to 1 decimal place by turning 
                            * it into a string, so do the math before invoking this method!*/
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
                        return(
                            <Grid item key={result.title} id={'borrowingsCard.'+i} href={result.borrowerId}>
                                <Card classes={{root: classes.card}}>
                                    <CardActionArea>
                                        <CardMedia
                                            component="img"
                                            alt={result.title}
                                            height="210"
                                            src={result.coverimg}
                                            title="Contemplative Reptile"
                                            classes= {{media: classes.cardImage}}
                                        />
                                        <CardContent>
                                            <Typography variant="body1" component="div" noWrap={false}>
                                                <b>{result.borrowerId}</b>
                                            </Typography>
                                            <Typography variant="body1" component="div" noWrap={true}>
                                                {borrowDateString}
                                            </Typography>
                                            <Typography variant="body1" component="div" noWrap={true}>
                                                {returnDueString}
                                            </Typography>
                                            <Typography variant="body1" component="div" noWrap={true}>
                                                {currentDaysLate}
                                            </Typography>
                                            <Typography variant="body1" component="div" noWrap={true}>
                                                {lateFine}
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                    <CardActions>
                                        {/**Need to wrap functions with property passed like this. 
                                        Otherwise, it runs on ComponentDidMount*/}
                                        <Button size="small" color="primary" onClick={()=>{props.handleBorrowingsCancel(i);}}>
                                            Return
                                        </Button>
                                    </CardActions>
                                    <CardContent onClick={handleExpandClick}>
                                        <Typography variant="body1" component="div" noWrap={true}>
                                            Books borrowed (click to expand)
                                        </Typography>
                                        <IconButton
                                                className={clsx(classes.expand, {
                                                    [classes.expandOpen]: expanded,
                                                })}
                                                aria-expanded={expanded}
                                                aria-label="Show more"
                                            >
                                                <ExpandMoreIcon />
                                        </IconButton>
                                    </CardContent>
                                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                                        {/*() => {booksBorrowed(i)}*/}
                                    </Collapse>
                                </Card>
                            </Grid>
                        )
                    })}
                </Grid>
            </div>              
        )      
    } 
}