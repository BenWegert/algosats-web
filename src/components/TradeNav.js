import React, { Component } from 'react'
import { Button, Form, ButtonToolbar, InputGroup, ButtonGroup, FormControl, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { Link, NavLink} from "react-router-dom";

export default class TradeNav extends Component {
	constructor(props) {
		super(props)
	}
	render() {
		return (
			<ButtonGroup className="bottom mobile bottom">
				<Button active={this.props.active === "/trade" ? true : false} 
					as={Link} to="/trade" variant="info">Chart
				</Button>
				<Button active={this.props.active === "/trade/order" ? true : false} 
					as={Link} to="/trade/order" variant="info">Buy/Sell
				</Button>
				<Button active={this.props.active === "/trade/funds" ? true : false} 
					as={Link} to="/trade/funds" variant="info">Funds
				</Button>
			</ButtonGroup>
		)
	}
}