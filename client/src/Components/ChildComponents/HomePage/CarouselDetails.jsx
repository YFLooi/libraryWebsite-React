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
        marginLeft: 10,
    }
}))

export default function CarouselDetails(props){
    const classes = useStyles();

    const [storedDetailsCard, setStoredDetailsCard] = useState([]);

    //Serves as the trigger to render Details card
    //Necessary because parent component cannot reach here to run the renderDetails() function
    useEffect(() => {
        if (props.targetBookId === null || props.targetBookId === '-1'){
            console.log('Details card not rendered. No book ID sent to state.targetBookId');
        } else {
            renderDetails(props.targetBookId);
        }
    }, [props.targetBookId]); //Change in this prop effects the above actions

    const renderDetails = (bookId) => {
        let detailsOverlay = document.getElementById(`detailsOverlay`);
        
        let targetIndex = props.newArrivals.findIndex(item => item.id === bookId);
        let bookDetails = props.newArrivals[targetIndex];

        let parsedBookComments = JSON.parse(bookDetails.comments);
            
        let detailsCard = [
            <Card classes={{root: classes.detailsCard}} key='detailsCard'>
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
                    <form id={`newCommentInput_commentBox`}
                    onSubmit={(event) => {event.preventDefault(); handleCommentSubmit('newCommentInput_commentBox', bookId,'', '');}} > 
                        <TextField
                            id='newCommentInput_commentBox_comment' type='text' autoComplete='off'
                            label=''
                            InputLabelProps={{
                                //Stops the animation where label shrinks and moves to the top of 
                                //<TextField>
                                shrink: true,
                            }}
                            placeholder='Add public comment...'
                            classes={{root: classes.commentBox_comment}}
                            margin="normal"
                            onClick={() => {
                                document.getElementById(`newCommentInput_commentBox_actions`).style.display = 'block'
                            }}
                        />
                        <div id={`newCommentInput_commentBox_actions`} style={{display: 'none'}}>
                            <TextField
                                id='newCommentInput_commentBox_userid' type='text' autoComplete='off'
                                label="Username (required)"
                                classes={{root: classes.commentBox_userName}}
                                margin="normal"
                            />
                            <Button variant='contained' color='inherit'
                            onClick={() => {
                                document.getElementById('newCommentInput_commentBox_actions').style.display = 'none'
                            }}>
                                Cancel
                            </Button>
                            {/*Necessary to allow submitting on Enter key*/}
                            <Button variant='contained' color='secondary' type='submit'
                            id='newCommentInput_commentBox_submitButton'
                            classes={{root: classes.commentBox_submitButton}}>
                                Submit
                            </Button>
                        </div>
                    </form>
                    <List>
                        {renderCommentsList(bookId, parsedBookComments)}
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
        if (bookComments.length === 0){
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
                //To clear replies to previous comment
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
                            <form id={`comment.${i}_commentBox`} style={{display:'none'}}
                            onSubmit={(event) => {event.preventDefault(); handleCommentSubmit(`comment.${i}_commentBox`, bookId, bookComments[i].userid, `comment.${i}_commentButton`);}} > 
                                <TextField
                                    id={`comment.${i}_commentBox_comment`} type='text' autoComplete='off'
                                    label=''
                                    InputLabelProps={{
                                        //Stops the animation where label shrinks and moves to 
                                        //the top of <TextField>
                                        shrink: true,
                                    }}
                                    placeholder='Add public comment...'
                                    classes={{root: classes.commentBox_comment}}
                                    margin="normal"
                                />
                                <div id={`comment.${i}_commentBox_actions`}>
                                    <TextField
                                        id={`comment.${i}_commentBox_userid`} type='text' autoComplete='off'
                                        label="Username (required)"
                                        classes={{root: classes.commentBox_userName}}
                                        margin="normal"
                                    />
                                    <Button variant='contained' color='inherit'
                                    onClick={() => {
                                        document.getElementById(`comment.${i}_commentBox`).style.display = 'none'
                                        document.getElementById(`comment.${i}_commentButton`).style.display = 'block'
                                    }}>
                                        Cancel
                                    </Button>
                                    {/*Necessary to allow submitting on Enter key*/}
                                    <Button variant='contained' color='secondary' type='submit'
                                    classes={{root: classes.commentBox_submitButton}} >
                                        Submit
                                    </Button>
                                </div>
                            </form>
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
    const handleCommentSubmit = (boxId, bookId, commentUserId, replyButtonId) => {
        let targetBookIndex = props.newArrivals.findIndex(item => item.id === bookId);
        let bookDetails = props.newArrivals[targetBookIndex];

        let bookComments = JSON.parse(bookDetails.comments);
        console.log('Comments submitted for box '+boxId);

        const commentBoxUserId = document.getElementById(`${boxId}_userid`).value;
        const commentBoxComment = document.getElementById(`${boxId}_comment`).value;

        //Need to add check to block submitting comments/replies if no userid supplied
        //and in the case of blank comment
        console.log(`Id of submitting user: ${commentBoxUserId}`);
        console.log(`Comment by submitting user: ${commentBoxComment}`);
 
        //Clears <TextField> boxes on submit
        document.getElementById(`${boxId}_userid`).value = '';
        document.getElementById(`${boxId}_comment`).value = '';

        if(boxId === 'newCommentInput_commentBox' && commentBoxUserId.length !== 0 && 
        commentBoxComment.length !== 0){
            //Handles new comments
            const newComment = [{userid: commentBoxUserId, comment: commentBoxComment, replies: []}];
            let newBookComments = []

            if (bookComments.length === 0){
                //Catch ensures that if this is first comment, no blank user/comment object is added 
                //to the end of newBookComments
                newBookComments = [...newComment];
            } else{
                //Adds the new comments to the start of the array so that it appears first
                //on render
                newBookComments= [...newComment, ...bookComments];
            }
            console.log(newBookComments)
            
            //Placing this here ensures the comment box will only hide if a valid comment+username
            //combination is supplied. 'Hiding' indicates 'Comment submitted'
            document.getElementById(`newCommentInput_commentBox_actions`).style.display = 'none';

            //renderDetails pulls book comment data from state instead of db to prevent delay from 
            //call to db on each re-render after a new comment/reply 
            //Need to update otherwise the new comment will overwrite the previous one
            let updatedNewArrivals = props.newArrivals;
            updatedNewArrivals[targetBookIndex].comments = JSON.stringify(newBookComments);
            props.carouselStateUpdater('newArrivals', updatedNewArrivals);

            //Re-render comments list to update with new changes
            //Need to stringify. renderDetails expects a JSON array straight from the db
            renderDetails(bookId);

            const POSTCommentInit = {
                method:"POST", 
                cache:"no-cache",
                headers:{
                    "Content-Type": "application/json",
                },
                redirect: "error",
                //Contains data to send. Need to JSON.stringify, pg's auto-convert bugged 
                //and pg only accepts arrays as JSON, since PSQL does the same
                body: JSON.stringify(newBookComments) 
            }
            //Both parameters are initialised with blanks
            fetch('/Post-CommentReply/'+bookId, POSTCommentInit)
                .then(function(response){
                    return response.json()
                    .then(function(data){
                        //Returns confirmation of record deleted for borrowerid = x                
                        console.log(data)
                    })
                })  
                .catch(function(error){
                    console.log('Request failed', error)
                })

        }else if(boxId !== 'newCommentInput_commentBox' && commentBoxUserId.length !== 0 && 
        commentBoxComment.length !== 0) {
            //Handles replies to comments
            const newReply = [{userid: commentBoxUserId, comment: commentBoxComment}]

            const targetCommentIndex = bookComments.findIndex(user => user.userid === commentUserId);
            console.log("Index of target comment for newReply: "+targetCommentIndex);

            let newReplies = [];
            if (bookComments[targetCommentIndex].replies.length === 0){
                //Catch ensures that if this is first reply, no blank user/comment object is added 
                //to the end of newBookComments
                newReplies = [...newReply];
            } else{
                //Adds the new replies to the end ofthe array so that it appears last on render
                //It gives the effect of continuing a conversation with the Comment
                newReplies = [...bookComments[targetCommentIndex].replies, ...newReply];
            }
            console.log(newReplies);
            let newBookComments = [...bookComments];
            newBookComments[targetCommentIndex].replies = newReplies
            console.log(newBookComments);

            //Placing this here ensures the comment box will only hide if a valid comment+username
            //combination is supplied. 'Hiding' indicates 'Comment submitted'
            document.getElementById(boxId).style.display = 'none'
            document.getElementById(replyButtonId).style.display = 'block'
            
            //renderDetails pulls book comment data from state instead of db to prevent delay from 
            //call to db on each re-render after a new comment/reply 
            //Need to update otherwise the new comment will overwrite the previous one
            let updatedNewArrivals = props.newArrivals;
            updatedNewArrivals[targetBookIndex].comments = JSON.stringify(newBookComments);
            props.carouselStateUpdater('newArrivals', updatedNewArrivals);

            //Re-render comments list to update with new changes
            //Need to stringify. renderDetails expects a JSON array straight from the db
            renderDetails(bookId);

            const POSTCommentInit = {
                method:"POST", 
                cache:"no-cache",
                headers:{
                    "Content-Type": "application/json",
                },
                redirect: "error",
                //Contains data to send. Need to JSON.stringify, pg's auto-convert bugged 
                //and pg only accepts arrays as JSON, since PSQL does the same
                body: JSON.stringify(newBookComments) 
            }
            //Both parameters are initialised with blanks
            fetch('/Post-CommentReply/'+bookId, POSTCommentInit)
                .then(function(response){
                    return response.json()
                    .then(function(data){
                        //Returns confirmation of record deleted for borrowerid = x                
                        console.log(data)
                    })
                })  
                .catch(function(error){
                    console.log('Request failed', error)
                })
        } else {
            console.log('Empty userid or empty comment/reply detected. No comment/reply submitted to db.');
            //alert('No userid/comment entered. Comment not recorded')
        }

        /** 
        //Time to build fetch request here to replace comment for bookId 'x' with the new one built above
        const DELETEReqInit = {
            method:"DELETE", 
            cache:"no-cache",
            headers:{
                "Content-Type": "application/json",
            },
            redirect: "error",
            //Contains data to send. Need to JSON.stringify, pg's auto-convert bugged 
            //and pg only accepts arrays as JSON, since PSQL does the same
            body: JSON.stringify(deleteTarget) 
        }
        //Both parameters are initialised with blanks
        fetch("/Delete-Borrowings", DELETEReqInit)
            .then(function(response){
                return response.json()
                .then(function(data){
                    //Returns confirmation of record deleted for borrowerid = x                
                    console.log(data)
                })
            })  
            .catch(function(error){
                console.log('Request failed', error)
            })
        */
    }
    const hideDetailsCard = () => {
        //Should not keep appended Details card. Otherwise, async will not trigger borrowButtonRender
        //resulting in button innerHTML left in 'Cancel' for next detailsCard rendered
        document.getElementById(`detailsOverlay`).style.display = 'none';

        //Odd how doing this the immutable way (with splice) does not trigger borrowButtonRender
        //to set the button innerHTML
        //state.storedDetailsCard.splice(0, state.storedDetailsCard.length);
        setStoredDetailsCard([]);

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
