import React, { Component } from 'react';
import AliceCarousel from 'react-alice-carousel';
import Typography from "@material-ui/core/Typography";
import "./Carousel.css";
import "react-alice-carousel/lib/alice-carousel.css";
import DetailsCardRender from '../DetailsCardRender/DetailsCardRender.jsx'

//Do not attempt to style with Material UI's withStyle(). It weirds out handleOnSlideChange()
class Carousel extends Component {
    constructor(props){
        super(props);

        this.state ={
            currentIndex: 0,
            itemsInSlide: 1,
            responsive: { 0: { items: 2 }}, //Number of cards shown per section
            galleryItems: [],
            targetBookId: null,
            bookData: [],
        }

        this.galleryItems = this.galleryItems.bind(this);
        this.slidePrevPage = this.slidePrevPage.bind(this);
        this.slideNextPage = this.slideNextPage.bind(this);
        this.handleOnSlideChange = this.handleOnSlideChange.bind(this);
        this.handleOnDragStart = this.handleOnDragStart.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.carouselStateUpdater = this.carouselStateUpdater.bind(this);
    }
    componentDidMount(){
        const that = this; //Prevents 'this' from being undefined
        /*Fetches the data on page load for the New Arrivals slideshow*/
        fetch('/NewArrivals', {method:"GET"})
            //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
            .then(function(response){
                return response.json()
                //Examines data in response
                .then(function(data){
                    console.log('Data on new arrivals:')
                    console.log(data)

                    if(data.length > 0){
                        that.state.bookData.splice(0, that.state.bookData.length);
                        that.setState({
                            bookData: [...data]
                        })
                        //Send data directly to rendering function. This skips use of state for storage
                        that.galleryItems(data);
                    }else{
                        console.log("Render failed: Book data not found")
                    }
                })
            }).catch(function(error){
                console.log('Request failed', error)
            })  

        //Identifies viewport size
        //Component is remounted each time the window is resized. That's why this works in detecting viewport size!
        window.addEventListener('resize', this.updateWindowDimensions);
        this.updateWindowDimensions();
    }
    componentWillUnmount() {
        //Each time the window is resized, the DOM is re-rendered. This ensures event listeners do NOT stack up
        window.removeEventListener('resize', this.updateWindowDimensions);

        document.getElementsByClassName("carouselPlaceholder")[0].style.display = "block";
    }
    carouselStateUpdater(name,data){
        /* [] allows an external variable to define object property "name". In this case, 
        it's parameter "name".*/
        this.setState({
            [name]: data
        })
    }
    updateWindowDimensions() {
        //Sets number of items to display on carousel by screen size
        let cardsToShow = Math.round(window.innerWidth/210); //Need to round else cards partially shown
        this.setState({ 
            responsive: { 0: { items: cardsToShow }}
        });
        console.log('New viewport dimensions: Width: '+window.innerWidth+' Height: '+ window.innerHeight)
    }
    galleryItems(data) {  //Every item to insert into slide
        let bookData = data;

        //'20' means the array goes from 0-19.
        let newArrivalsArray = Array(20).fill().map((item, i) => 
            <div className='card' onDragStart={this.handleOnDragStart}>
                {/**ComponentDidUpdate() in DetailsCardRender.jsx detects the change in this.state,targetBookId to render the Details card*/}
                <img className='cardImage' src={bookData[i].coverimg} alt={`carouselImage.${i}`} onClick={() => {this.carouselStateUpdater('targetBookId', bookData[i].id)}}/>
                {/**On mobile, it looks really crowded with the text. Maybe enable only on desktop? */}
                <Typography variant='body1' color='inherit' className="cardTitle" noWrap={true}>{bookData[i].title}</Typography>
                <Typography variant='subtitle1' color='inherit' className="cardAuthor" noWrap={true}>{bookData[i].author}</Typography>
            </div>
        )

        //For retrieval later to generate 'Details' overlay
        this.setState({
            galleryItems: [...newArrivalsArray]
        })
        document.getElementsByClassName("carouselPlaceholder")[0].style.display = "none";
    }
    slidePrevPage = () => {
        const currentIndex = this.state.currentIndex - this.state.itemsInSlide
        this.setState({ currentIndex })
    }
    slideNextPage = () => {
        const { itemsInSlide, galleryItems: { length }} = this.state
        let currentIndex = this.state.currentIndex + itemsInSlide
        if (currentIndex > length) currentIndex = length

        this.setState({ currentIndex })
    }
    handleOnSlideChange = (event) => {
        const { itemsInSlide, item } = event
        this.setState({ itemsInSlide, currentIndex: item })
    }
    //Handles drag event independently to avoid odd behaviour
    handleOnDragStart = (e)=> {
        e.preventDefault()
    }   
    
    render() {
        const { currentIndex, galleryItems, responsive } = this.state
        
        return (
            <React.Fragment> 
                <div className='title' style={{ marginLeft: '2%',}}>
                    <Typography variant="h5" color="inherit" margin="normal">New Arrivals</Typography>
                </div>
                <div className='carousel'> 
                    <div className="carouselPlaceholder"><Typography variant="h6" color="inherit">Loading</Typography></div>
                    <div className='prevButtonContainer' onClick={this.slidePrevPage}></div>
                    <div className='AliceCarousel'>
                        <AliceCarousel
                            items={galleryItems}
                            slideToIndex={currentIndex}
                            responsive={responsive}
                            onInitialized={this.handleOnSlideChange}
                            onSlideChanged={this.handleOnSlideChange}
                            onResized={this.handleOnSlideChange}
                            buttonsDisabled = {true}
                            mouseDragEnabled = {true}
                            keysControlDisabled = {true}
                        />
                    </div>
                    {/*Using divs as button provider better customisation*/}
                    <div className='nextButtonContainer' onClick={this.slideNextPage}></div>
                </div>
                <DetailsCardRender
                    targetBookId={this.state.targetBookId}
                    bookData={this.state.bookData}
                    borrowCart={this.props.borrowCart}
                    stateUpdater={this.props.stateUpdater}
                    callingComponentStateUpdater={this.carouselStateUpdater}
                />
                <div className='carouselDivider'></div>
            </React.Fragment> 
        ) 
    }
}

export default Carousel;