import React from 'react';
import {
    withRouter,
} from "react-router-dom";

class SuggestBooks extends React.Component {   
    render() {
        return (
          <div>Redirecting...</div>
        )
    }
}

//Allows this child class to interface with <Hashrouter/> in parent class MainPage()
export default withRouter(SuggestBooks);
