import React, { Component } from "react";
import Chart from "../components/Chart.js";
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

var jsonDates = {
  dtrx2: /\d{4}-\d{2}-\d{2}/,
  parse: function (obj) {
    var parsedObj = JSON.parse(obj);
    return this.parseDates(parsedObj);
  },
  parseDates: function (obj) {
    // iterate properties
    for (var pName in obj) {
      // make sure the property is 'truthy'
      if (obj[pName]) {
        var value = obj[pName];
        // determine if the property is an array
        if (Array.isArray(value)) {
          for (var ii = 0; ii < value.length; ii++) {
            this.parseDates(value[ii]);
          }
        }
        // determine if the property is an object
        else if (typeof value == "object") {
          this.parseDates(value);
        }
        // determine if the property is a string containing a date
        else if (typeof value == "string" && this.dtrx2.test(value)) {
          // parse and replace
          obj[pName] = new Date(obj[pName]);
        }
      }
    }
    return obj;
  },
};

export default class TradePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      req: {
        type: "get",
        symbol: "BTCUSDT",
        interval: "5m",
        limit: 1000,
        start: 0,
        end: Date.now() + 100,
      },
      length: 200,
      from: "binance",
    };
    this.handleLoading = this.handleLoading.bind(this);
    this.handleInterval = this.handleInterval.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  handleLoading(data) {
    console.log(data);
    this.setState({ data: data });
  }
  handleInterval(interval) {
    var msg = this.state.req;
    msg["interval"] = interval;
    msg["type"] = "get";
    this.setState({ req: msg });
    this.history.send(JSON.stringify(this.state.req));
  }
  handleSubmit(event) {
    event.preventDefault();
    this.history.send(JSON.stringify(this.state.req));
    this.pusher.close(1000);
    this.price.close(1000);
    delete this.price;
    delete this.pusher;
    this.pusher = new WebSocket(
      "wss://stream.binance.com:9443/ws/" +
        this.state.req.symbol.toLowerCase() +
        "@kline_" +
        this.state.req.interval
    );
    this.price = new WebSocket(
      "wss://stream.binance.com:9443/ws/" +
        this.state.req.symbol.toLowerCase() +
        "@trade"
    );

    this.price.onopen = () => {
      console.log("price connected");
    };

    this.pusher.onopen = () => {
      console.log("pusher connected");
    };

    this.price.onclose = () => {};
    this.pusher.onclose = () => {};

    this.price.onmessage = (evt) => {
      var data = JSON.parse(evt.data);
      var candle = this.state.data;
      if (data.p > candle[candle.length - 1]["high"])
        candle[candle.length - 1]["high"] = data.p;
      if (data.p < candle[candle.length - 1]["low"])
        candle[candle.length - 1]["low"] = data.p;
      candle[candle.length - 1]["close"] = data.p;
      candle[candle.length - 1]["volume"] += parseFloat(data.q);
      this.setState({
        data: candle,
      });
    };

    this.pusher.onmessage = (evt) => {
      var data = JSON.parse(evt.data);
      if (this.state.last == true) {
        var candle = {
          date: new Date(data.k.t),
          open: parseFloat(data.k.o),
          high: parseFloat(data.k.h),
          low: parseFloat(data.k.l),
          close: parseFloat(data.k.c),
          volume: parseFloat(data.k.v),
          split: "",
          dividend: "",
          absoluteChange: "",
          percentChange: "",
        };
        var arr = this.state.data;
        arr.push(candle);
        this.setState({
          data: arr,
        });
        this.setState({ last: false });
      }
      if (data.k.x == true) this.setState({ last: true });
    };
  }
  handleChange(event) {
    var msg = this.state.req;
    msg["symbol"] = event.target.value;
    msg["type"] = "get";
    this.setState({ req: msg });
  }
  componentDidMount() {
    this.history = new WebSocket(process.env.REACT_APP_WS);
    this.pusher = new WebSocket(
      "wss://stream.binance.com:9443/ws/btcusdt@kline_1m"
    );
    this.price = new WebSocket(
      "wss://stream.binance.com:9443/ws/btcusdt@trade"
    );

    this.history.onopen = () => {
      console.log("history connected");
      var req = {
        type: "get",
        from: "binance",
        symbol: "BTCUSDT",
        interval: "1m",
        start: 1582431580582,
        end: 1599441580582,
      };
      this.history.send(JSON.stringify(req));
    };

    this.history.onmessage = (data) => {
      data = jsonDates.parse(data.data);
      this.handleLoading(data);
    };
    this.price.onopen = () => {
      console.log("price connected");
    };

    this.pusher.onopen = () => {
      console.log("pusher connected");
    };

    this.price.onclose = () => {};
    this.pusher.onclose = () => {};

    this.price.onmessage = (evt) => {
      var data = JSON.parse(evt.data);
      var candle = this.state.data;

      if (candle) {
        if (data.p > candle[candle.length - 1]["high"])
          candle[candle.length - 1]["high"] = data.p;
        if (data.p < candle[candle.length - 1]["low"])
          candle[candle.length - 1]["low"] = data.p;
        candle[candle.length - 1]["close"] = data.p;
        candle[candle.length - 1]["volume"] += parseFloat(data.q);
        this.setState({
          data: candle,
        });
      }
    };

    this.pusher.onmessage = (evt) => {
      var data = JSON.parse(evt.data);
      if (this.state.last == true) {
        var candle = {
          date: new Date(data.k.t),
          open: parseFloat(data.k.o),
          high: parseFloat(data.k.h),
          low: parseFloat(data.k.l),
          close: parseFloat(data.k.c),
          volume: parseFloat(data.k.v),
          split: "",
          dividend: "",
          absoluteChange: "",
          percentChange: "",
        };
        var arr = this.state.data;
        arr.push(candle);
        this.setState({
          data: arr,
        });
        this.setState({ last: false });
      }
      if (data.k.x == true) this.setState({ last: true });
    };
  }
  componentWillUnmount() {
    if (this.interval) clearInterval(this.interval);
    delete this.price;
    delete this.pusher;
    delete this.history;
  }
  render() {
    if (!this.state.hasOwnProperty("data")) {
      return (
        <div id="wrapper">
          <Navigation
            loggedInStatus={this.props.loggedInStatus}
            loggedOutStatus={this.props.loggedOutStatus}
            handleLogout={this.props.handleLogout}
            user={this.props.user}
            resetLoggedOut={this.props.resetLoggedOut}
          />
          <div className="trade-inner">
            <div>
              <ButtonToolbar className="mb-2" aria-label="Intervals">
                <ButtonGroup className="mr-2" aria-label="First group">
                  <Button
                    variant="secondary"
                    onClick={() => this.handleInterval("1m")}
                  >
                    1m
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => this.handleInterval("15m")}
                  >
                    15m
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => this.handleInterval("1h")}
                  >
                    1h
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => this.handleInterval("1d")}
                  >
                    1d
                  </Button>
                </ButtonGroup>
                <Form className="mb-0" onSubmit={this.handleSubmit}>
                  <InputGroup>
                    <FormControl
                      type="text"
                      name="symbol"
                      onChange={this.handleChange}
                      placeholder="Symbol (e.g. BTCUSDT)"
                      aria-label="Symbol input"
                      aria-describedby="btnGroupAddon"
                    />
                    <Button type="submit" variant="secondary">
                      Go
                    </Button>
                  </InputGroup>
                </Form>
              </ButtonToolbar>
            </div>
            <div className="chart">Loading...</div>
            <TradeNav active={this.props.active} />
          </div>
        </div>
      );
    }
    return (
      <div id="wrapper">
        <Navigation
          loggedInStatus={this.props.loggedInStatus}
          loggedOutStatus={this.props.loggedOutStatus}
          handleLogout={this.props.handleLogout}
          user={this.props.user}
          resetLoggedOut={this.props.resetLoggedOut}
        />
        <div className="trade-inner">
          <div>
            <ButtonToolbar className="mb-2" aria-label="Intervals">
              <ButtonGroup className="mr-2" aria-label="First group">
                <Button
                  variant="secondary"
                  onClick={() => this.handleInterval("1m")}
                >
                  1m
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => this.handleInterval("15m")}
                >
                  15m
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => this.handleInterval("1h")}
                >
                  1h
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => this.handleInterval("1d")}
                >
                  1d
                </Button>
              </ButtonGroup>
              <Form className="mb-0" onSubmit={this.handleSubmit}>
                <InputGroup>
                  <FormControl
                    type="text"
                    name="symbol"
                    onChange={this.handleChange}
                    placeholder="Symbol (e.g. BTCUSDT)"
                    aria-label="Symbol input"
                    aria-describedby="btnGroupAddon"
                  />
                  <Button type="submit" variant="secondary">
                    Go
                  </Button>
                </InputGroup>
              </Form>
            </ButtonToolbar>
          </div>
          <div className="chart">
            <Chart data={this.state.data} />
          </div>
          <TradeNav active={this.props.active} />
        </div>
      </div>
    );
  }
}
