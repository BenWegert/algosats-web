import React, { Component } from 'react'
import { Tabs, Tab, Form, Button, Table } from 'react-bootstrap';
import axios from 'axios'

import Navigation from '../components/Navigation.js'

export default class ProfilePage extends Component {
	constructor(props) {
		super(props)
		this.state = {
			key: '',
			secret: '',
			exchange: 'Binance',
			exchanges: [],
			settings: {}
		}

		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleChange = this.handleChange.bind(this)
		this.toggleEnabled = this.toggleEnabled.bind(this)
		this.deleteConnection = this.deleteConnection.bind(this)
	}

	toggleEnabled(exchange) {
		var settings = this.state.settings
			settings[exchange] = !settings[exchange]
		axios
		.post("/connection", 
			{
				api: {
					action: (settings[exchange] == true ? 'Connected' : 'Disconnected'),
					exchange: exchange
				}
			}
		)
		.then(response => {
			this.setState({settings: settings})
			this.componentDidMount()
		})
	}

	deleteConnection(exchange) {
		axios
		.post("/connection", 
			{
				api: {
					action: 'delete',
					exchange: exchange
				}
			}
		)
		.then(response => {
			this.componentDidMount()
		})
	}

	handleSubmit(event) {
		event.preventDefault()
		const { key, secret, exchange } = this.state

		axios
			.post("/connect",
				{
					api: {
						exchange: exchange,
						key: key,
						secret: secret
					}
				}
			)
			.then(response => {
				if (response.data.status === "created") {
					this.props.handleLogin(response.data);
				}
				const { msg } = response.data
				this.componentDidMount()
			})
			.catch(error => {
				console.log("login error: ", error)
			})
	}

	handleChange(event) {
		this.setState({[event.target.name]: event.target.value})
	}

	componentDidMount() {
		axios
		.post("/connections")
		.then(response => {
			var { exchanges } = response.data
			this.setState({exchanges: exchanges})
			var settings = this.state.settings
			exchanges.forEach(row => {
				settings[row.exchange] = (row.status == "Connected" ? true : false)
			})
			this.setState({settings: settings})
		})
	}


	render() {
		let table = this.state.exchanges.map(array =>
			<tr key={array.exchange}>
				<td>{array.exchange}</td>
				<td>{array.status}
					<Form.Check
						className="pull-right" 
						id={array.exchange}
						type="switch"
						checked={this.state.settings[array.exchange]}
						label=""
						onChange={() => this.toggleEnabled(array.exchange)}
					/>
				</td>
				<td>
					<Button size="sm" variant="info" onClick={() => this.deleteConnection(array.exchange)}>
						x
					</Button>
				</td>
			</tr>
		);
		return (
			<div>
				<Navigation 
					loggedInStatus={this.props.loggedInStatus}
					loggedOutStatus={this.props.loggedOutStatus}
					handleLogout={this.props.handleLogout}
					user={this.props.user}
					resetLoggedOut={this.props.resetLoggedOut}
				/>
				<Tabs defaultActiveKey="general" id="uncontrolled-tab-example">
					<Tab eventKey="general" title="General">
						hi
					</Tab>
					<Tab eventKey="trade" title="Trade">
						<Form onSubmit={this.handleSubmit} className="card-center">
							<h4>Connected exchanges</h4>
							<Table striped bordered hover>
								<tbody>
									{table}
								</tbody>	
							</Table>
							<h4>Connect to exchanges</h4>
							<Form.Control as="select" className="mb-3" name="exchange" onChange={this.handleChange}>
								<option>Binance</option>
								<option>Bittrex</option>
								<option>Poloniex</option>
								<option>Coinbase</option>
								<option>Kraken</option>
								<option>Bitfinex</option>
								<option>Bitstamp</option>
								<option>HitBTC</option>
								<option>Gemini</option>
								<option>KuCoin</option>
							</Form.Control>
							<Form.Group controlId="exampleForm.ControlInput1">
								<Form.Label>API Key</Form.Label>
								<Form.Control type="text" name="key" onChange={this.handleChange} placeholder="qzuXkAydaUKvnZmysbfxBJaMMFsWC1LTJf5gnlWkYpcNSaNyEg8rQXhfpWaNUVKR" />
							</Form.Group>
							<Form.Group controlId="exampleForm.ControlInput1">
								<Form.Label>Secret Key</Form.Label>
								<Form.Control type="text" name="secret" onChange={this.handleChange} placeholder="DAcrPbsTOhIgussk2NtqG8vGOHrDQhSaNG2ORDYESSzXxwdufhVa9uNbaXD88YsK" />
							</Form.Group>
							<Button variant="info" type="submit">
								Connect
							</Button>
							<Form.Text className="success">
								{this.state.msg}
							</Form.Text>
						</Form>
					</Tab>
					<Tab eventKey="analytics" title="Analytics">
						hi2
					</Tab>
					<Tab eventKey="bots" title="Bots">
						hi3
					</Tab>
					<Tab eventKey="signals" title="Signals">
						Signa
					</Tab>
				</Tabs>
			</div>
		)
	}
}