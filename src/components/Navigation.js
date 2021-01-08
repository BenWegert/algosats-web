import React, { Component } from 'react'
import { Link, NavLink} from "react-router-dom";
import { Navbar, Nav, NavDropdown, Button } from 'react-bootstrap';
import HomePage from '../pages/HomePage.js'

export default class Navigation extends Component {

	render(){
		if (this.props.loggedInStatus) {
			return (
				<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
					<Navbar.Brand as={NavLink} to="/">
						<img
							alt=""
							src={'/images/logo.png'}
							width="30"
							height="30"
							className="d-inline-block align-top"
							/>{' '}
						AlgoSats
					</Navbar.Brand>
				  	<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				  	<Navbar.Collapse id="responsive-navbar-nav ">
				  		<Nav>
			  				<Nav.Link as={NavLink} to="/trade">Trade</Nav.Link>
			  				<Nav.Link as={NavLink} to="/analytics">Analytics</Nav.Link>
			  				<Nav.Link as={NavLink} to="/signals">Signals</Nav.Link>
				  		</Nav>
				    	<Nav className="ml-auto">
				    		<NavDropdown title="Products" id="collasible-nav-dropdown">
				        		<NavDropdown.Item as={Link} to="/products#MarketAnalyzer">Market Analyzer</NavDropdown.Item>
				        		<NavDropdown.Item as={Link} to="/products#Terminal">Trading Terminal</NavDropdown.Item>
				        		<NavDropdown.Item as={Link} to="/products#Signals">Crypto Signals</NavDropdown.Item>
				        		<NavDropdown.Item as={Link} to="/products#Bots">Trading Bots</NavDropdown.Item>
					        	<NavDropdown.Divider />
					        	<NavDropdown.Item as={Link} to="/contactus">Customized Products</NavDropdown.Item>
					      	</NavDropdown>
					      	<Nav.Link as={NavLink} to="/contactus">Contact Us</Nav.Link>
					      	<NavDropdown title={this.props.user} id="collasible-nav-dropdown">
				        		<NavDropdown.Item as={Link} to="/profile">Settings</NavDropdown.Item>
					        	<NavDropdown.Divider />
					        	<NavDropdown.Item onClick={this.props.handleLogout} >Logout</NavDropdown.Item>
					      	</NavDropdown>
				    	</Nav>
				  	</Navbar.Collapse>
				</Navbar>
			)
		}
		return (
			<Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
				<Navbar.Brand as={Link} to='/'>
					<img
						alt="AlgoSats Logo"
						src={'/images/logo.png'}
						width="30"
						height="30"
						className="d-inline-block align-top"
					/>{' '}
					AlgoSats
				</Navbar.Brand>
			  	<Navbar.Toggle aria-controls="responsive-navbar-nav" />
			  	<Navbar.Collapse id="responsive-navbar-nav ">
			    	<Nav className="ml-auto">
				    		<NavDropdown title="Products" id="collasible-nav-dropdown">
				        		<NavDropdown.Item as={Link} to="/products#MarketAnalyzer">Market Analyzer</NavDropdown.Item>
				        		<NavDropdown.Item as={Link} to="/products#Terminal">Trading Terminal</NavDropdown.Item>
				        		<NavDropdown.Item as={Link} to="/products#Signals">Crypto Signals</NavDropdown.Item>
				        		<NavDropdown.Item as={Link} to="/products#Bots">Trading Bots</NavDropdown.Item>
					        	<NavDropdown.Divider />
					        	<NavDropdown.Item as={NavLink} to="/contactus">Customized Products</NavDropdown.Item>
					      	</NavDropdown>
					      	<Nav.Link as={NavLink} to="/contactus">Contact Us</Nav.Link>
				      		<Button variant="info" onClick={this.props.resetLoggedOut} className="ml-2" as={NavLink} to='/login'>Login</Button>
				    	</Nav>
			  	</Navbar.Collapse>
			</Navbar>
		)
	}
}
