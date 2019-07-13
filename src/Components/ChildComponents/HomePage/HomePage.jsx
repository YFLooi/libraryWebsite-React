import React from 'react';
import "./HomePage.css";
import TypoGraphy from '@material-ui/core/Typography'
import BasicSearch from '../BasicSearch/BasicSearch.jsx';
import Carousel from './Carousel.jsx'

export default class HomePage extends React.Component {
    render() {
		return (
            <div className="homepage">    
                <BasicSearch
                    basicInput={this.props.basicInput}
                    
                    borrowCart={this.props.borrowCart}
                    searchResults={this.props.searchResults}
                    isNewResultsLoaded={this.props.isNewResultsLoaded}

                    stateUpdater={this.props.stateUpdater}
                />
                <Carousel
                    borrowCart={this.props.borrowCart}
                    stateUpdater={this.props.stateUpdater}
                />
                <div>
                    <TypoGraphy variant="h5" color="inherit">Announcements</TypoGraphy>
                    <ul>
                        <li>
                            <TypoGraphy variant="body1" color="inherit"> 
                                Good news readers! New books have arrived! Check them out on the carousel above
                            </TypoGraphy>    
                        </li>
                        <li>
                            <TypoGraphy variant="body1" color="inherit"> 
                                Tip: Need a faster way to find exact books? Try the 'Advanced Search' by clicking on the Gear icon
                                or checking the menu bar
                            </TypoGraphy>    
                        </li>
                        <li>
                            <TypoGraphy variant="body1" color="inherit"> 
                                Did you know this site looks great on mobile? Try it today!
                            </TypoGraphy>    
                        </li>
                    </ul>
                </div>
            </div>
		);
	}
}
