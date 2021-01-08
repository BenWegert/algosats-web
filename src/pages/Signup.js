import React, {Component} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Button, Form, Card } from 'react-bootstrap';

export default class Signup extends Component {
	constructor(props) {
		super(props)

		this.state = {
			email: "",
			password: "",
			password_confirmation: "",
			password_error: "",
			email_error: ""
		}
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChange = this.handleChange.bind(this)
	}

	handleChange(event) {
		this.setState({[event.target.name]: event.target.value})
	}

	handleSubmit(event) {
		const {email, password, password_confirmation} = this.state

		axios.post("/signup",
				{
					user: {
						email: email,
						password: password,
						password_confirmation: password_confirmation
					}
				},
				{ withCredentials: true}
			)
			.then(response => {
				if (response.data.status === "created") {
					this.props.handleLogin(response.data);
				}
				const { password_error, email_error } = response.data.error
				this.setState({
					password_error: password_error,
					email_error: email_error
				})
			})
			.catch(error => {
				console.log("signup error: ", error)
			})
			event.preventDefault()
	}

	render() {
		if(this.props.loggedInStatus) {
			if (this.props.location.state != null)
        		this.props.history.push(this.props.location.state.referrer);
        	else
        		this.props.history.push('/');
    	}
		return (
			<div className="card-center">
				<Card>
					<Card.Header> 
						<div className="float-left h3"> | Sign up 
							<Button className="float-left" variant="link" as={Link} to='/login'>
								Login
							</Button>
						</div>
						<Button className='float-right' variant="outline-info" as={Link} to='/'>x</Button>
					</Card.Header>
					<Card.Body>
						<Form onSubmit={this.handleSubmit}>
							<Form.Group controlId="email">
								<Form.Label>Email address</Form.Label>
								<Form.Control required name="email" onChange={this.handleChange} type="email" placeholder="Enter email" />
								<Form.Text id="email_error" className="error">
									{this.state.email_error}
								</Form.Text>
							</Form.Group>
							<Form.Group controlId="password">
								<Form.Label>Password</Form.Label>
								<Form.Control required name="password" onChange={this.handleChange} type="password" placeholder="Password" />
							</Form.Group>
							<Form.Group controlId="password_confirmation">
								<Form.Label>Confirm password</Form.Label>
								<Form.Control required name="password_confirmation" onChange={this.handleChange} type="password" placeholder="Password" />
								<Form.Text id="password_error" className="error">
									{this.state.password_error}
								</Form.Text>
							</Form.Group>
							<Form.Group controlId="formBasicCheckbox">
								<Form.Check type="checkbox" label="Remember me" />
							</Form.Group>
							<Button variant="info" type="submit">
								Sign up
							</Button>
						</Form>
					</Card.Body>
				</Card>
			</div>
		)
	}
}