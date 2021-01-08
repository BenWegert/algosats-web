import React, {Component} from 'react';
import axios from 'axios'
import { Link } from 'react-router-dom';
import { Button, Form, Card } from 'react-bootstrap';

export default class Login extends Component {

	constructor(props) {
		super(props)
		this.state = {
			email: "",
			password: "",
			password_error: "",
		}
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event) {
		this.setState({[event.target.name]: event.target.value})
	}

	handleSubmit(event) {
		event.preventDefault()
		const {email, password} = this.state

		axios
			.post("/login",
				{
					user: {
						email: email,
						password: password
					}
				},
				{ withCredentials: true}
			)
			.then(response => {
				if (response.data.status === "created") {
					this.props.handleLogin(response.data);
				}
				const { password_error } = response.data.error
				this.setState({
					password_error: password_error,
				})
			})
			.catch(error => {
				console.log("login error: ", error)
			})
	}

	render() {
		if(this.props.loggedInStatus) {
			if (this.props.location.state != null)
        		this.props.history.push(this.props.location.state.referrer);
        	else
        		this.props.history.push('/');
    	}
    	if(this.props.loggedOutStatus) {
    		this.props.history.push('/');
    		this.props.resetLoggedOut();
    	}
		return (
			<div className="card-center">
				<Card>
					<Card.Header> 
						<div className="float-left h3">Login |
							<Button className="float-right" variant="link" as={Link} to='/signup'>
								Sign Up
							</Button>
						</div>
						<Button className='float-right' variant="outline-info" as={Link} to='/'>x</Button>
					</Card.Header>
					<Card.Body>
						<Form onSubmit={this.handleSubmit}>
							<Form.Group controlId="formBasicEmail">
								<Form.Label>Email address</Form.Label>
								<Form.Control name="email" onChange={this.handleChange} type="email" placeholder="Enter email" />
							</Form.Group>
							<Form.Group controlId="formBasicPassword">
								<Form.Label>Password</Form.Label>
								<Form.Control name="password" onChange={this.handleChange} type="password" placeholder="Password" />
								<Form.Text id="password_error" className="error">
									{this.state.password_error}
								</Form.Text>
							</Form.Group>
							<Form.Group controlId="formBasicCheckbox">
								<Form.Check type="checkbox" label="Remember me" />
							</Form.Group>
							<Button variant="info" type="submit">
								Log in
							</Button>
						</Form>
					</Card.Body>
				</Card>
			</div>
		)
	}
}