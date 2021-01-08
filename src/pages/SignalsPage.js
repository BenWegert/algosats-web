import React, { Component } from 'react'

import Navigation from '../components/Navigation.js'

export default class SignalsPage extends Component {
	constructor(props) {
		super(props)
	}
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
				<h3>Signals Page</h3>
			</div>
		)
	}
}