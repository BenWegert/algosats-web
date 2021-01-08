import React, { Component } from "react";
import {
  Button,
  Form,
  ButtonToolbar,
  InputGroup,
  ButtonGroup,
  FormControl,
  Navbar,
  Nav,
  NavDropdown,
} from "react-bootstrap";
import { Link, NavLink } from "react-router-dom";

import Navigation from "../components/Navigation.js";
import TradeNav from "../components/TradeNav.js";

export default class TradeFundsPage extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.user = new WebSocket(process.env.REACT_APP_WS);
  }
  render() {
    return (
      <div id="wrapper">
        <Navigation
          loggedInStatus={this.props.loggedInStatus}
          loggedOutStatus={this.props.loggedOutStatus}
          handleLogout={this.props.handleLogout}
          user={this.props.user}
          resetLoggedOut={this.props.resetLoggedOut}
        />
        <TradeNav active={this.props.active} />
      </div>
    );
  }
}
