import React, { useEffect, useState } from 'react';
import { makeStyles} from '@material-ui/core/styles';
import { Card, CardHeader, CardMedia, CardActions, CardContent, } from "@material-ui/core/";
import { Avatar, List, ListItem, ListItemText} from '@material-ui/core';
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import { ExpandMore } from "@material-ui/icons/";
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core/';
import { TextField } from '@material-ui/core/';

const useStyles = makeStyles(theme => ({ 
    detailsOverlay:{
        position: 'fixed',
        display: 'none',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2, /*Allows the sidebar <div> to stack on top of all other <div>-s. Number = Stack Order*/
        backgroundColor: 'rgba(0,0,0,0.5)', /*Adds a shadow to denote the overlay area to click to exit*/
        
        /*Scolling `takes place in the overlay, NOT the <div> within the overlay*/
        overflowY:'scroll',
        webkitOverflowScrolling:'touch',
    },
    detailsCard:{
        position: 'relative', 
        margin: '100px auto 0 auto', /*Centers the card*/
        width: '90%',
        padding: '5px 5px 5px 5px',
        height: '210', 
        cursor: 'pointer',
    },
    detailsCardInfoBox:{
        display: 'flex',
        flexDirection: 'row',
        padding: '3%',
    },
    detailsCardImage: {
        display: 'flex',
        minWidth: 155,
        minHeight: 205,
        maxWidth: 155,
        maxHeight: 205,
    },
    detailsCardInfoAndActions:{
        display: 'flex',
        flexDirection: 'column', //So that <CardActions/> appear below text
    },
    detailsCardBookInfo: {
        display: 'flex',
    },
    detailsCardActions:{
        display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',
        padding: '0 0 0 20',
    },
    commentContainer: {
        display: 'flex',
        //Causes each <div> container in this flexbox to fill the entire vertical space
        alignItems: 'stretch'
    },
    commentAvatar: {
        backgroundColor: 'purple',
        marginRight: 10,
        top: 20,
    },
    commentReplyButton:{
        left: '0',
        padding: '0',
    },
    commentReplyButtonLabel:{
        display: 'table-cell',
        textAlign: 'left'
    },
    replyAvatar: {
        backgroundColor: 'green',
        marginRight: 10,
        top: 0
    },
    replies_primaryText : {
        fontSize: '15px'
    },
    replies_secondaryText : {
        fontSize: '12px'
    },
    commentBox_userName: {
        width: '90%',
        marginLeft: 10
    },
    commentBox_comment:{
        width: '90%',
        marginLeft: 10
    },
    commentBox_submitButton:{
        marginLeft: 10
    }
}))

export default function CarouselDetails(props){
    const classes = useStyles();

    let [storedDetailsCard, setStoredDetailsCard] = useState([]);

    //Serves as the trigger to render Details card
    //Necessary because parent component cannot reach here to run the renderDetails() function
    useEffect(() => {
        console.log('Target book id: '+props.targetBookId);
        if (props.targetBookId === null || props.targetBookId === '-1'){
            console.log('No book ID sent to state.targetBookId');
        } else {
            renderDetails(props.targetBookId);
        }
    }, [props.targetBookId]); //Change in this prop effects the above actions

    const renderDetails = (bookId) => {
        let detailsOverlay = document.getElementById(`detailsOverlay`);
        let targetIndex = props.newArrivals.findIndex(item => item.id === bookId);
        console.log(`Array position containing target book details: ${targetIndex}`)
        let bookDetails = props.newArrivals[targetIndex];
        let bookComments = JSON.parse(bookDetails.comments);
            
        let detailsCard = [
            <Card classes={{root: classes.detailsCard}}>
                <div className={classes.detailsCardInfoBox}>
                    <CardMedia
                        component='img'
                        alt={`front cover for ${bookDetails.title}`}
                        src={bookDetails.coverimg}
                        classes= {{media: classes.detailsCardImage}}
                    />
                    <div className={classes.detailsCardInfoAndActions}>
                        <CardHeader
                            title = {bookDetails.title}
                            subheader = {
                                <React.Fragment>
                                    {bookDetails.author} <br/> 
                                    {bookDetails.publisher}
                                </React.Fragment>
                            }
                            classes = {{root: classes.detailsCardBookInfo, title: classes.detailsCardTitle, subheader: classes.detailsCardSubheader}}
                        />
                        <CardActions classes={{root: classes.detailsCardActions}}>
                            {borrowButtonRender(bookId)}
                            <Button size="small" color="primary" onClick={() => {hideDetailsCard();}}>
                                Close
                            </Button>
                        </CardActions>
                    </div>
                </div>
                <ExpansionPanel>
                    {/**ExpansionPanel automatically rotates <ExpandMore/> by 180 deg onClick*/}
                    <ExpansionPanelSummary
                        expandIcon={<ExpandMore/>}
                        aria-controls={'bookDetails.'+bookId}
                        id={'bookDetails.'+bookId}
                    >
                        <Typography className={classes.heading}>Synopsis</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <Typography variant="body1" component="div" noWrap={false}>
                            {bookDetails.synopsis}
                        </Typography>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                <CardContent>
                    <Typography variant="body1" component="div" noWrap={false}>
                        Comments
                    </Typography>
                    <form id={`newCommentBox`} onSubmit={handleCommentSubmit} 
                    onClick={() => {
                        document.getElementById(`newCommentBox_Actions`).style.display = 'block'
                    }}>
                        <TextField
                            name='comment' type='text' autoComplete='off'
                            label="Add public comment..."
                            classes={{root: classes.commentBox_comment}}
                            margin="normal"
                        />
                        <div id={`newCommentBox_Actions`} style={{display: 'none'}}>
                            <TextField
                                name='userid' type='text' autoComplete='off'
                                label="Username (required)"
                                classes={{root: classes.commentBox_userName}}
                                margin="normal"
                            />
                            <Button variant='contained' color='inherit'
                            onClick={() => {
                                document.getElementById(`newCommentBox_Actions`).style.display = 'none'
                            }}>
                                Cancel
                            </Button>
                            <Button variant='contained' color='secondary' type='submit'
                            classes={{root: classes.commentBox_submitButton}}>
                                Submit
                            </Button>
                        </div>
                    </form>
                    <List>
                        {renderCommentsList(bookId, bookComments)}
                    </List>
                </CardContent>
            </Card>
        ]
        setStoredDetailsCard([...detailsCard]);
        detailsOverlay.style.display= 'block';
    }
    const renderCommentsList = (bookId, bookComments) => {
        //Only render list of comments if available. Indicated when 1st entry in 'comments' array
        // does not have a blank string for userId. 
        if (bookComments[0].userId === '' || bookComments[0].comment === ''){
            let renderedCommentsList = [
                <React.Fragment>
                    <ListItem key={`noCommentPlaceholder`}>
                        <ListItemText 
                            primary= {`Be the first to comment!`} 
                        />
                    </ListItem>
                </React.Fragment>
            ]
            return renderedCommentsList;
        } else {
            let commentsArray = []

            for(let i=0; i<bookComments.length; i++){
                let repliesList = []
                //To clear replies to last comment
                repliesList.splice(0, repliesList.length)
    
                //Prevents rendering of repliesList if no comment replies present
                if(bookComments[i].replies.length !== 0){
                    repliesList = renderRepliesList(bookId, bookComments[i].replies)
                }
    
                let comment = [
                    <ListItem classes={{root: classes.commentContainer}} key={`comment.${i}`}>
                        <div>
                            <Avatar aria-label="id first letter" classes={{root: classes.commentAvatar}}>
                                {bookComments[i].userid.substring(0,1)}
                            </Avatar>
                        </div>
                        <div>
                            <ListItemText 
                                primary= {bookComments[i].userid} 
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            color="textPrimary"
                                        >
                                            {bookComments[i].comment} 
                                        </Typography>    
                                    </React.Fragment>
                                }
                            />
                            <Button size="small" color="primary" id={`comment.${i}_commentButton`}
                            classes={{root: classes.commentReplyButton, label: classes.commentReplyButtonLabel}}
                            onClick={() => {
                                document.getElementById(`comment.${i}_commentBox`).style.display = 'block'
                                document.getElementById(`comment.${i}_commentButton`).style.display = 'none'
                            }}>
                                Reply
                            </Button> 

                            <div id={`comment.${i}_commentBox`} style={{display:'none'}}>
                                <TextField
                                        label="Add public comment..."
                                        classes={{root: classes.commentBox_comment}}
                                        margin="normal"
                                />
                                <TextField
                                    label="Username (required)"
                                    classes={{root: classes.commentBox_userName}}
                                    type="password"
                                    margin="normal"
                                />
                                <Button variant='contained' color='inherit'
                                onClick={() => {
                                    document.getElementById(`comment.${i}_commentBox`).style.display = 'none'
                                    document.getElementById(`comment.${i}_commentButton`).style.display = 'block'
                                }}>
                                    Cancel
                                </Button>
                                <Button variant='contained' color='secondary' classes={{root: classes.commentBox_submitButton}}>
                                    Submit
                                </Button>
                            </div>
                            <List>
                                {repliesList}
                            </List>
                        </div>
                    </ListItem>
                ]
                
                commentsArray = [...commentsArray, ...comment]
            }
    
            return commentsArray;
        }
    }
    const renderRepliesList = (bookId, commentReplies) => {
        let repliesArray = Array(commentReplies.length).fill().map((item, j) =>
            <ListItem key={`reply.${j}`}>
                <Avatar aria-label="id first letter" classes={{root: classes.replyAvatar}}>
                    {commentReplies[j].userid.substring(0,1)}
                </Avatar>
                <ListItemText 
                    classes={{
                        primary: classes.replies_primaryText , 
                        secondary: classes.replies_secondaryText
                    }}
                    primary= {commentReplies[j].userid} 
                    secondary={
                        <React.Fragment>
                            <Typography
                                component="span"
                                variant="body2"
                                color="textPrimary"
                            >
                                {commentReplies[j].comment} 
                            </Typography>    
                        </React.Fragment>
                    }
                />
            </ListItem>
        )

        return repliesArray;
    }
    const handleCommentSubmit = (event) => {
        event.preventDefault();
        console.log('Comment submitted');
    }
    const hideDetailsCard = () => {
        //Should not keep appended Details card. Otherwise, async will not trigger borrowButtonRender
        //resulting in button innerHTML left in 'Cancel' for next detailsCard rendered
        document.getElementById(`detailsOverlay`).style.display = 'none';

        //Odd how doing this the immutable way (with splice) does not trigger borrowButtonRender
        //to set the button innerHTML
        //state.storedDetailsCard.splice(0, state.storedDetailsCard.length);
        setStoredDetailsCard([])

        //Necessary to allow reopening of clicked book on exit
        //This is because ComponentDidUpdate() will not trigger if the same bookId is setState
        //to this.state.targetBookId
        //Note that this trigger componentDidUpdate() but it will disregard need to render detailsCard
        props.carouselStateUpdater('targetBookId',null)
    }
    const borrowButtonRender = (bookId) => {
        //To change innerHTML of 'borrow' button to "Cancel" if book has been borrowed
        //findIndex() here checks for match between searchResult and cart contents
        //If there is a match (!= -1)), 'borrow' button inner HTML is set to "Cancel" 
        let cartCheck = props.borrowCart.findIndex(cart => cart.id === bookId);
        console.log('Value returned by cartCheck: '+cartCheck)
        
        if (cartCheck === -1){
            return (
                <Button onClick={() => {borrowRequest(bookId);}} id={'borrow.'+bookId} size="small" color="primary">
                    Borrow
                </Button>
            )
        } else {
            return (
                <Button onClick={() => {borrowRequest(bookId);}} id={'borrow.'+bookId} size="small" color="primary">
                    Cancel
                </Button>
            )
        }
    }
    const borrowRequest = (idx) => {
        /*'id' here is the book id. It allows access to other data related to 
        the book */
        console.log('Borrow request made');
        const targetButton = document.getElementById("borrow."+idx)
        //Specify [0] to return the first match to the className
        const buttonText = targetButton.getElementsByClassName('MuiButton-label')[0].innerHTML;
        
        const cart = props.borrowCart;
        const searchResults = props.newArrivals;
    
        if(buttonText === "Borrow"){
            //Retrieves index position in searchResults of object having input book id
            const targetIndex = searchResults.findIndex(searchResult => searchResult.id === idx)
    
            //Obtains the object at the target index position in searchResults 
            const bookData  = searchResults[targetIndex];
    
            //This method adds new book object data to the end of the 
            //existing array immutably
            let updatedBorrowCart = [...cart, bookData]
            props.stateUpdater("borrowCart",updatedBorrowCart)

            //Updates #cartCounter to show number of books in this.props.borrowcart
            //Use updatedBorrowCart instead of this.props.borrowCart because it updates first
            document.getElementById("cartCounter").innerHTML = parseInt(updatedBorrowCart.length,10);
    
            //Changes button to say "Cancel" after being clicked
            //document.querySelector('.borrow.'+idx+'.MuiButton-label').innerHTML = "Cancel";
            targetButton.getElementsByClassName('MuiButton-label')[0].innerHTML = 'Cancel';
        }else if(buttonText === "Cancel"){
            //Find index containing target book id from borrowCart
            const targetIndex = cart.findIndex(x => x.id === idx)
            console.log("Target of removal position: "+targetIndex);
    
            //Condition prevents .splice if id to remove not in cart 
            if(targetIndex !== -1){
                /*Removes item at targetPosition. If we set const new = cart.splice(), 
                "const new" has a value = the removed item*/
                cart.splice(targetIndex,1);  
                let updatedBorrowCart = [...cart] //Keep state immutable with spread syntax!               
                console.log(updatedBorrowCart.length)
                props.stateUpdater("borrowCart",updatedBorrowCart) 

                //Updates #cartCounter to show number of books in this.props.borrowcart
                //Use updatedBorrowCart instead of this.props.borrowCart because it updates first
                document.getElementById("cartCounter").innerHTML = parseInt(updatedBorrowCart.length,10);
            }
            /**Cancelling a borrow request makes book available to "Borrow" again*/
            targetButton.getElementsByClassName('MuiButton-label')[0].innerHTML = "Borrow";       
        }else{
            console.log('buttonText is not "Borrow" nor "Cancel"');
        }
    }

   return(
       <React.Fragment>
            <div id='detailsOverlay' className={classes.detailsOverlay}>
                {storedDetailsCard} {/**Must use state here: When state updates, the update is pushed to all calls of that state */}
            </div>
        </React.Fragment>
   )
}
