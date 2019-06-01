import React from 'react';

export default class CartDisplay extends React.Component {
    render() {
		return (
            <div id="cartDisplay-page" style={{display: "none"}}>
                <h1>Cart contents:</h1>
                <div id="cartDisplay"></div>
                {/**checkoutButton only display if items are present in cart*/}
                <button id="checkoutButton" style={{display: "none"}} onClick={this.props.handleCartCheckout}>Checkout</button>
            </div>
		);
	}
}
