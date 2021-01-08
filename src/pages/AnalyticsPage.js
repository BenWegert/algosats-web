import React, { Component } from "react";

import Navigation from "../components/Navigation.js";

export default class AnalyticsPage extends Component {
  componentDidMount() {
    this.ws = new WebSocket(process.env.REACT_APP_WS);

    this.ws.onopen = () => {
      // on connecting, do nothing but log it to the console
      console.log("connected");
    };

    this.ws.onmessage = (evt) => {
      // on receiving a message, add it to the list of messages
      this.setState({ price: evt.data });
    };
  }

  componentWillUnmount() {
    this.ws.close();
  }
  constructor(props) {
    super(props);
    this.state = {
      price: "",
    };
    this.handleMessage = this.handleMessage.bind(this);
  }

  handleMessage(event) {
    this.setState({ price: event });
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
        <section id="banner"></section>
        <p>{this.state.price}</p>
      </div>
    );
  }
}
