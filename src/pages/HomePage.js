import React, {Component} from 'react';
import { Link } from "react-router-dom";
import { Button, Form } from 'react-bootstrap';

import Navigation from '../components/Navigation.js'

export default class HomePage extends Component {
	render() {
		return (
			<div>
				<Navigation 
					loggedInStatus={this.props.loggedInStatus}
					loggedOutStatus={this.props.loggedOutStatus}
					handleLogout={this.props.handleLogout}
					user={this.props.user}
					resetLoggedOut={this.props.resetLoggedOut}
				/>
				<section id="banner">
					<div className="inner">
						<header>
							<h1>Market Analytics, trade automation, signals and more!</h1>
						</header>
						<div className="flex">
							<div className="flexbox33">
								<span className="icon fa-bar-chart"></span>
								<h3>Market Analytics</h3>
								<p>Get market insight using exchange activity, network transactions, sentiment and more.</p>
							</div>
							<div className="flexbox33">
								<span className="icon">
									<i className="fas fa-robot"></i>
								</span>
								<h3>Trade Automation</h3>
								<p>Use our automated strategies available for most major exchanges</p>
							</div>
							<div className="flexbox33">
								<span className="icon">
									<i className="fas fa-ellipsis-h"></i>
								</span>
								<h3>Signals & More!</h3>
								<p>Receive real-time signals and news. Check out the Products tab for more.</p>
							</div>
						</div>
						<footer>
							<Button variant="info" as={Link} to="#">Get Started</Button>
						</footer>
					</div>
				</section>
				<section className="wrapper align-center" id="three">
					<div className="inner">
						<div className="flex flex-2">
							<article>
								<div className="image round">
									<img src='/images/orderbook.jpg' alt="pic01" width="150px" height="150px"></img>
								</div>
								<header>
									<h3>Need more liquidity with faster and cheaper order execution?</h3>
									<p>Using our Trading Terminal you will be able to connect to most major exchanges and our system will aggregate their orderbooks</p>
									<footer>
										<Button variant="outline-info">
											Learn More
										</Button>
									</footer>
								</header>
							</article>
							<article>
								<i className="icon-big far fa-question-circle"></i>
								<header>
									<h3>Interested in customization?</h3>
									<p>We provide system customizations ranging from slight changes to completely building a system from scratch.</p>
									<footer>
										<Button variant="outline-info">
											Learn More
										</Button>
									</footer>
								</header>
							</article>
						</div>							
					</div>
				</section>
				<footer id="footer">
					<div className="inner">
						<h3>Get in touch</h3>
						<Form>
							<Form.Group controlId="exampleForm.ControlInput1" className="field first half">
								<Form.Label>Name</Form.Label>
								<Form.Control type="text" placeholder="Name" />
							</Form.Group>
							<Form.Group controlId="exampleForm.ControlInput1" className="field half">
								<Form.Label>Email address</Form.Label>
								<Form.Control type="email" placeholder="name@example.com" />
							</Form.Group>
							<Form.Group controlId="exampleForm.ControlTextarea1">
								<Form.Label>Message</Form.Label>
								<Form.Control as="textarea" rows="6" placeholder="What can we do for you?" />
							</Form.Group>
							<Button variant="light" type="submit">
								Send message
							</Button>
						</Form>
					</div>
				</footer>
			</div>
		);
	}
}