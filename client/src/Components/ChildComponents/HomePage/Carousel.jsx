import React, { Component } from 'react';
import AliceCarousel from 'react-alice-carousel';
import Typography from "@material-ui/core/Typography";
import "./Carousel.css";
import "react-alice-carousel/lib/alice-carousel.css";
import CarouselDetails from './CarouselDetails.jsx'

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
            newArrivals: [],
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
        fetch('/newArrivals', {method:"GET"})
            //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
            .then(function(response){
                return response.json()
                //Examines data in response
                .then(function(data){
                    console.log(data)

                    if(data.length > 0){
                        that.state.newArrivals.splice(0, that.state.newArrivals.length);
                        that.setState({
                            newArrivals: [...data]
                        })
                        //Send data directly to rendering function. This skips use of state for storage
                        that.galleryItems(data);
                    }else{
                        console.log("Render failed: newarrivals.db is empty")
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
        let newArrivals = data;

        //'20' means the array goes from 0-19.
        let newArrivalsArray = Array(20).fill().map((item, i) => 
            <div className='card' onDragStart={this.handleOnDragStart} onClick={() => {this.triggerDetailsRender(newArrivals[i].id)}}>
                <img className='cardImage' src={newArrivals[i].coverimg} alt={`carouselImage.${i}`}/>
                {/**On mobile, it looks really crowded with the text. Maybe enable only on desktop? */}
                <Typography variant='body1' color='inherit' className="cardTitle" noWrap={true}>{newArrivals[i].title}</Typography>
                <Typography variant='subtitle1' color='inherit' className="cardAuthor" noWrap={true}>{newArrivals[i].author}</Typography>
            </div>
        )

        //For retrieval later to generate 'Details' overlay
        this.setState({
            galleryItems: [...newArrivalsArray]
        })
    }
    triggerDetailsRender = (bookId) => {
        this.setState ({
            targetBookId: bookId
        }) //ComponentDidUpdate() in CarouselDetails.jsx detects this change
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
                <div className='title'>
                    <Typography variant="h5" color="inherit">New Arrivals</Typography>
                </div>
                <div className='carousel'> 
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
                    <div className='prevButtonContainer' onClick={this.slidePrevPage}></div>
                    <div className='nextButtonContainer' onClick={this.slideNextPage}></div>
                </div>
                <CarouselDetails
                    targetBookId={this.state.targetBookId}
                    newArrivals={this.state.newArrivals}
                    borrowCart={this.props.borrowCart}
                    stateUpdater={this.props.stateUpdater}
                    carouselStateUpdater={this.carouselStateUpdater}
                />
                <div className='carouselDivider'></div>
            </React.Fragment> 
        ) 
    }
}

export default Carousel;