import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
    withRouter,
} from "react-router-dom";
import TypoGraphy from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
    root: {
      display: 'flex',
    },
}));

function Explore(props){  
    const classes = useStyles();
    return (
        <div>Redirecting...</div>
    )
}

//Allows this child class to interface with <Hashrouter/> in parent class MainPage()
export default withRouter(Explore);
