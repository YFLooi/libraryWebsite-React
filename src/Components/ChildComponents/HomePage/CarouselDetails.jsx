import React, { useEffect, useState } from 'react';
import { makeStyles} from '@material-ui/core/styles';
import { Card, CardHeader, CardMedia, CardActions, CardContent, } from "@material-ui/core/";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

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
        margin: '30% auto', /*Centers the card*/
        width: '90%',
        padding: '5px 5px 5px 5px',
        height: '210', 
        cursor: 'pointer',
    },
    infoBox:{
        display: 'flex',
        flexDirection: 'row',
        padding: '3%',
    },
    detailsCardImage: {
        display: 'flex',
        maxWidth: 155,
        maxHeight: 465,
    },
    infoAndActions:{
        display: 'flex',
        flexDirection: 'column', //So that <CardActions/> appear below text
    },
    bookInfo: {
        display: 'flex',
    },
    cardActions:{
        display: 'flex',
        justifyContent: 'flex-start',
        flexWrap: 'nowrap',
        padding: '0 0 0 20',
    },
}))

export default function CarouselDetails(props){
    const classes = useStyles();

    let [state, setState] = useState({
        storedDetailsCard: [],
    });

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
        
        let detailsCard = [
            <Card key='bookDetails' classes={{root: classes.detailsCard}}>
                <div className={classes.infoBox}>
                    <CardMedia
                        component='img'
                        alt={`front cover for ${bookDetails.title}`}
                        src={bookDetails.coverimg}
                        classes= {{media: classes.detailsCardImage}}
                    />
                    <div className={classes.infoAndActions}>
                    <CardHeader
                        title = {bookDetails.title}
                        subheader = {
                            <React.Fragment>
                                {bookDetails.author} <br/> 
                                {bookDetails.publisher}
                            </React.Fragment>
                        }
                        classes = {{root: classes.bookInfo, title: classes.detailsCardTitle, subheader: classes.detailsCardSubheader}}
                    />
                    <CardActions classes={{root: classes.cardActions}}>
                        {borrowButtonRender(bookId)}
                        <Button size="small" color="primary" onClick={() => {hideDetails();}}>
                            Close
                        </Button>
                    </CardActions>
                    </div>
                </div>
                <CardContent>
                    <Typography variant="h6" component="div" noWrap={true}>
                        <u>Synopsis</u>
                    </Typography>
                    <Typography variant="body1" component="div" noWrap={false}>
                        {bookDetails.synopsis}
                    </Typography>
                </CardContent>
            </Card>
        ]
        setState({
            storedDetailsCard: [...detailsCard],
        });
        detailsOverlay.style.display= 'block';
    }
    const hideDetails = () => {
        //Should not keep appended Details card. Otherwise, async will not trigger borrowButtonRender
        //resulting in button innerHTML left in 'Cancel' for next detailsCard rendered
        document.getElementById(`detailsOverlay`).style.display = 'none';

        //Odd how doing this the immutable way (with splice) does not trigger borrowButtonRender
        //to set the button innerHTML
        //state.storedDetailsCard.splice(0, state.storedDetailsCard.length);
        setState({
            storedDetailsCard: [],
        });

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
                {state.storedDetailsCard} {/**Must use state here: When state updates, the update is pushed to all calls of that state */}
            </div>
        </React.Fragment>
   )
}
