import React, { Component } from 'react';
import AliceCarousel from 'react-alice-carousel';
import Typography from "@material-ui/core/Typography";
import "./Carousel.css";
import "react-alice-carousel/lib/alice-carousel.css";

//Do not attempt to style with Material UI's withStyle(). It weirds out handleOnSlideChange()
class Carousel extends Component {
    constructor(props){
        super(props);

        this.state ={
            currentIndex: 0,
            itemsInSlide: 1,
            responsive: { 0: { items: 2 }}, //Number of cards shown per section
            galleryItems: [],
        }

        this.galleryItems = this.galleryItems.bind(this);
        this.slidePrevPage = this.slidePrevPage.bind(this);
        this.slideNextPage = this.slideNextPage.bind(this);
        this.handleOnSlideChange = this.handleOnSlideChange.bind(this);
        this.handleOnDragStart = this.handleOnDragStart.bind(this);
    }
    componentDidMount(){
        let that = this; //Prevents 'this' from being undefined
        /*Fetches the data on page load for the New Arrivals slideshow*/
        fetch('http://localhost:3005/newArrivals', {method:"GET", mode:"cors"})
            //Here we chain 2 promise functions: The first fetches data (response), the second examines text in response (data)
            .then(function(response){
                return response.json()
                //Examines data in response
                .then(function(data){
                    console.log(data)

                    if(data.length > 0){
                        //Send data directly to rendering function. This skips use of state for storage
                        that.galleryItems(data);

                        //Sets state to determine whether to render website. 
                    }else{
                        console.log("Render failed: newarrivals.db is empty")
                    }
                })
            }).catch(function(error){
                console.log('Request failed', error)
            })  
    }
    galleryItems(data) {  //Every item to insert into slide
        let newArrivals = data;

        //'20' means the array goes from 0-19.
        let newArrivalsArray = Array(20).fill().map((item, i) => 
            <div className='card' onDragStart={this.handleOnDragStart}>
                <img className='cardImage' src={newArrivals[i].coverimg} alt={`carouselImage.${i}`}/>
                {/**On mobile, it looks really crowded with the text. Maybe enable only on desktop? */}
                <Typography variant='body1' color='inherit' className="cardTitle" noWrap={true}>{newArrivals[i].title}</Typography>
                <Typography variant='subtitle1' color='inherit' className="cardAuthor" noWrap={true}>{newArrivals[i].author}</Typography>
            </div>
        )

        this.setState({
            galleryItems: [...newArrivalsArray]
        })
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
                <div className='carouselDivider'></div>
            </React.Fragment> 
        ) 
    }
}

export default Carousel;