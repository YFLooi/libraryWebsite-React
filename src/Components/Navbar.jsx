import React from 'react';
import {
    withRouter,
} from "react-router-dom";

//Imports for the AppBar (menu bar)
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

//Allows side-swiping menus
import Drawer from '@material-ui/core/Drawer';

//The Material UI answer to <ul/>
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
//Boxes to display Icons and Text as part of a <List/>
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import { makeStyles} from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';

//Material UI icon imports
import { Menu, Home, Settings, AccountBox, ShoppingCart } from '@material-ui/icons'
//Custom icon imports
import logo from './icons/logo.png';

//The MaterialUI way of modding styles
const useStyles = makeStyles(theme => ({
    AppBar: {
        backgroundColor: 'gray',
        width: '100%',
        height: 56,
        position: 'relative',
    },
    //For menu drawer
    list: {
        width: 250,
        zIndex: 2,
      },
    //For menu drawer
    fullList: {
        width: 'auto',
    },
    menuButton: {
        width: 48,
        height: 48,

        top: '5%',
        bottom: '5%',
        left: '3.5%',
        position: 'absolute',
    },
    logo: {
        backgroundImage: `url(${logo})`,
        height: '80%', //Keeps logo from reaching edges of container
        width: 60, //Need to, or else defaults to zero
        cursor: 'pointer',

        //Centres logo
        position: 'absolute',
        left: '45%',
        right: '45%',
        top: '5%',
        bottom: '5%',

        backgroundPositionX: '50%',
        backgroundPositionY: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'scroll',
        backgroundSize: '45px',
    },
    cartButtonBox: {
        width: 48,
        height: 48,
        
        top: '5%',
        bottom: '5%',
        right: '3.5%',
        position: 'absolute',
    },
    cartButton: {
        width: 32,
        height: 32,
    },
    cartCounter: {
        backgroundColor: 'purple',
        color: 'white',
        textAlign: 'center',

        position: 'absolute',
        zIndex: 0,//Combined with absolute position, allows stacking over other DOM elements
        fontSize: 15,
        right: 30,
        top: 20,
        width: 18,
        height: 18,
        borderRadius: '50%',
    },
}));

/**Contains the items for <Toolbar/>*/
function Navbar(props) {
    const classes = useStyles();

    //Code for Drawer
    const [state, setState] = React.useState({
        left: false,
    });
    //The on/off switch that opens and closes <Drawer/>
    //Takes in 2 values: A string (side: left/right/etc) and a boolean (open)
    const toggleDrawer = (side, open) => event => {
        //Check that prevents drawer from opening
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
    
        setState({ ...state, [side]: open });
    };
    //Triggered by <Drawer/>, possibly with a listener, when state.left === true
    const sideList = side => (
        <div
            className={classes.list}
            role="presentation"
            //Closes drawer when the <Drawer/> or its overlay <div/> are clicked
            onClick={toggleDrawer(side, false)} 
            //Closes <Drawer/> when any of its buttons are clicked
            onKeyDown={toggleDrawer(side, false)} 
        >
            <List>
                <ListItem>
                    <ListItemText primary='Menu' />
                </ListItem>
                <ListItem button key='home' onClick={() => {props.history.push('/')}}>
                    <ListItemIcon><Home/></ListItemIcon>
                    <ListItemText primary='Home' />
                </ListItem>
                <ListItem button key='advancedSearch' onClick={() => {props.history.push('/AdvancedSearch')}}>
                    <ListItemIcon><Settings/></ListItemIcon>
                    <ListItemText primary='Advanced Search'/>
                </ListItem>
                <ListItem button key='librarianAccess' onClick={() => {props.history.push('/Borrowings')}}>
                    <ListItemIcon><AccountBox/></ListItemIcon>
                    <ListItemText primary='Librarian access' />
                </ListItem>                
            </List>
        </div>
    );
    return (
        /**The component's prop value here determines which HTML
         * element it renders to. "nav" = <nav/> and "div" = <div/>*/
        <React.Fragment>
            <AppBar position="static" className={classes.AppBar}>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="Menu" onClick={toggleDrawer('left', true)}>
                        <Menu/>
                    </IconButton>
                    <div id='logo' className={classes.logo} onClick={() => {props.history.push('/')}}></div>
                    <IconButton className={classes.cartButtonBox} disableRipple={false} color="inherit" onClick={() => {props.history.push('/Cart')}}>
                        <ShoppingCart className={classes.cartButton}/>
                        <div id="cartCounter" className={classes.cartCounter}>0</div>
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer open={state.left} onClose={toggleDrawer('left', false)}>
                {sideList('left')}
            </Drawer>
        </React.Fragment>
    )
}


export default withRouter(Navbar);