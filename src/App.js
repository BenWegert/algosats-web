import React, { Component } from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import axios from "axios";
import Cookies from "universal-cookie";
import "bootstrap/dist/css/bootstrap.min.css";

import HomePage from "./pages/HomePage.js";
import AnalyticsPage from "./pages/AnalyticsPage.js";
import TradePage from "./pages/TradePage.js";
import SignalsPage from "./pages/SignalsPage.js";
import ContactUsPage from "./pages/ContactUsPage.js";
import ProfilePage from "./pages/ProfilePage.js";
import Signup from "./pages/Signup.js";
import Login from "./pages/Login.js";
import TradeFundsPage from "./pages/TradeFundsPage.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInStatus: false,
      loggedOutStatus: false,
      user: {},
    };
    this.handleLogin = this.handleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.resetLoggedOut = this.resetLoggedOut.bind(this);
  }

  checkLoginStatus() {
    axios
      .get("/logged_in", {
        withCredentials: true,
      })
      .then((response) => {
        if (response.data.logged_in && !this.state.loggedInStatus) {
          this.setState({
            loggedInStatus: true,
            user: response.data.user,
          });
        } else if (!response.data.logged_in && this.state.loggedInStatus) {
          this.setState({
            loggedInStatus: false,
            user: {},
          });
        }
      })
      .catch((error) => {
        console.log("check login error:", error);
      });
  }

  componentDidMount() {
    this.checkLoginStatus();
  }

  handleLogout(data) {
    const cookies = new Cookies();
    cookies.remove("AuthToken", { path: "/" });
    this.setState({
      loggedInStatus: false,
      loggedOutStatus: true,
      user: {},
    });
  }

  resetLoggedOut() {
    this.setState({ loggedOutStatus: false });
  }

  handleLogin(data) {
    this.setState({
      loggedInStatus: true,
      user: data.user,
    });
  }

  render() {
    return (
      <div className="app">
        <BrowserRouter>
          <Switch>
            <Route
              exact
              path={"/"}
              render={(props) => (
                <HomePage
                  {...props}
                  loggedInStatus={this.state.loggedInStatus}
                  loggedOutStatus={this.state.loggedOutStatus}
                  handleLogout={this.handleLogout}
                  resetLoggedOut={this.resetLoggedOut}
                  user={this.state.user}
                />
              )}
            />
            <Route
              exact
              path={"/analytics"}
              render={(props) =>
                this.state.loggedInStatus ? (
                  <AnalyticsPage
                    {...props}
                    loggedInStatus={this.state.loggedInStatus}
                    loggedOutStatus={this.state.loggedOutStatus}
                    handleLogout={this.handleLogout}
                    resetLoggedOut={this.resetLoggedOut}
                    user={this.state.user}
                  />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                      state: { referrer: "/analytics" },
                    }}
                  />
                )
              }
            />
            <Route
              exact
              path={"/trade"}
              render={(props) =>
                this.state.loggedInStatus ? (
                  <TradePage
                    {...props}
                    loggedInStatus={this.state.loggedInStatus}
                    loggedOutStatus={this.state.loggedOutStatus}
                    handleLogout={this.handleLogout}
                    resetLoggedOut={this.resetLoggedOut}
                    user={this.state.user}
                    active="/trade"
                  />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                      state: { referrer: "/trade" },
                    }}
                  />
                )
              }
            />
            <Route
              exact
              path={"/trade/funds"}
              render={(props) =>
                this.state.loggedInStatus ? (
                  <TradeFundsPage
                    {...props}
                    loggedInStatus={this.state.loggedInStatus}
                    loggedOutStatus={this.state.loggedOutStatus}
                    handleLogout={this.handleLogout}
                    resetLoggedOut={this.resetLoggedOut}
                    user={this.state.user}
                    active="/trade/funds"
                  />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                      state: { referrer: "/trade/funds" },
                    }}
                  />
                )
              }
            />
            <Route
              exact
              path={"/signals"}
              render={(props) =>
                this.state.loggedInStatus ? (
                  <SignalsPage
                    {...props}
                    loggedInStatus={this.state.loggedInStatus}
                    loggedOutStatus={this.state.loggedOutStatus}
                    handleLogout={this.handleLogout}
                    resetLoggedOut={this.resetLoggedOut}
                    user={this.state.user}
                  />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                      state: { referrer: "/signals" },
                    }}
                  />
                )
              }
            />
            <Route
              exact
              path={"/products"}
              render={(props) => (
                <AnalyticsPage
                  {...props}
                  loggedInStatus={this.state.loggedInStatus}
                  loggedOutStatus={this.state.loggedOutStatus}
                  handleLogout={this.handleLogout}
                  resetLoggedOut={this.resetLoggedOut}
                  user={this.state.user}
                />
              )}
            />
            <Route
              exact
              path={"/contactus"}
              render={(props) => (
                <ContactUsPage
                  {...props}
                  loggedInStatus={this.state.loggedInStatus}
                  loggedOutStatus={this.state.loggedOutStatus}
                  handleLogout={this.handleLogout}
                  resetLoggedOut={this.resetLoggedOut}
                  user={this.state.user}
                />
              )}
            />
            <Route
              exact
              path={"/profile"}
              render={(props) =>
                this.state.loggedInStatus ? (
                  <ProfilePage
                    {...props}
                    loggedInStatus={this.state.loggedInStatus}
                    loggedOutStatus={this.state.loggedOutStatus}
                    handleLogout={this.handleLogout}
                    resetLoggedOut={this.resetLoggedOut}
                    user={this.state.user}
                  />
                ) : (
                  <Redirect
                    to={{
                      pathname: "/login",
                      state: { referrer: "/profile" },
                    }}
                  />
                )
              }
            />
            <Route
              exact
              path={"/login"}
              render={(props) => (
                <Login
                  {...props}
                  handleLogin={this.handleLogin}
                  handleLogout={this.handleLogout}
                  loggedInStatus={this.state.loggedInStatus}
                  loggedOutStatus={this.state.loggedOutStatus}
                  resetLoggedOut={this.resetLoggedOut}
                />
              )}
            />
            <Route
              exact
              path={"/signup"}
              render={(props) => (
                <Signup
                  {...props}
                  handleLogin={this.handleLogin}
                  loggedInStatus={this.state.loggedInStatus}
                />
              )}
            />
            {!this.state.loggedInStatus && <Redirect push to="/login" />}
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
