import React, { Fragment } from "react";
import { connect } from "react-redux";
import withFirebaseAuth from "react-with-firebase-auth";
import { providers, firebaseAppAuth } from "./firebase";
import withStyles from "@material-ui/styles/withStyles";
import createStyles from "@material-ui/styles/createStyles";
import { ThemeProvider } from "@material-ui/styles";
import { Switch, Route } from "react-router-dom";
import Alert from "./Alert";
import ProtectedRoute from "./components/ProtectedRoute";
import MainFile from './dbconfiguration/MainFile';

import Header from "./AppBar";
import "./App.css";
import clsx from "clsx";
import AdmitCard from "./AdmitCard";
import PostResults from "./PostResults";
import UploadLogos from "./UploadLogos";
import ImportFiles from "./ImportFiles";
import Company from "./Company";
import Job from "./job";
import theme from "./theme";
import Login from "./Login";
import News from "./News";
const drawerWidth = 240;
const styles = createStyles({
  main: {},
  content: {
    padding: ".5em",
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: 64,
    marginTop: 60,
    overflow: "hidden"
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: drawerWidth
  }
});
class App extends React.Component {
  state = {
    alertOpen: true,
    drawerOpen: false
  };

  render() {
    let { classes, message } = this.props;
    const { isAuthenticated, isVerifying } = this.props;

    const onHide = () => {
      this.setState({ alertOpen: false });
    };
    const onDrawerOpen = v => {
      this.setState({ drawerOpen: v });
    };
    return (
      <ThemeProvider theme={theme}>
        <Fragment>
          <Header onOpen={onDrawerOpen} {...this.props} />
          {message.msg && message.msg != "" ? (
            <Alert
              msg={message.msg}
              isError={message.hasError}
              show={this.state.alertOpen}
              onHide={() => {
                onHide();
              }}
            />
          ) : null}

          <main
            className={clsx(classes.content, {
              [classes.contentShift]: this.state.drawerOpen
            })}
          >
            <Switch>
              <ProtectedRoute
                exact
                path="/job"
                component={()=><Job clear={message.hasError} isAdmin={this.props.isAdmin} />}
                isAuthenticated={isAuthenticated}
                isVerifying={isVerifying}
              />
              <ProtectedRoute
                exact
                isAuthenticated={isAuthenticated}
                isVerifying={isVerifying}
                path="/admitcard"
                component={AdmitCard}
              ></ProtectedRoute>
              <ProtectedRoute
                exact
                isAuthenticated={isAuthenticated}
                isVerifying={isVerifying}
                path="/postresult"
                component={PostResults}
              ></ProtectedRoute>
              <ProtectedRoute
                exact
                isAuthenticated={isAuthenticated}
                isVerifying={isVerifying}
                path="/company"
                component={Company}
              ></ProtectedRoute>
              <ProtectedRoute
                exact
                isAuthenticated={isAuthenticated}
                isVerifying={isVerifying}
                path="/logos"
                component={UploadLogos}
              ></ProtectedRoute>
              <ProtectedRoute
                exact
                isAuthenticated={isAuthenticated}
                isVerifying={isVerifying}
                path="/import"
                component={ImportFiles}
              ></ProtectedRoute>
               <ProtectedRoute
                exact
                isAuthenticated={isAuthenticated}
                isVerifying={isVerifying}
                path="/configure"
                component={MainFile}
              ></ProtectedRoute>
               <ProtectedRoute
                exact
                isAuthenticated={isAuthenticated}
                isVerifying={isVerifying}
                path="/New"
                component={News}
              ></ProtectedRoute>
              <Route path="/" component={News} />
            </Switch>
          </main>
        </Fragment>
      </ThemeProvider>
    );
  }
}
const mapStateToProps = state => {
  return {
    message: state.message,
    isAuthenticated: state.auth.isAuthenticated,
    isVerifying: state.auth.isVerifying,
    isAdmin:state.auth.isAdmin
  };
};

export default connect(
  mapStateToProps,
  {}
)(withStyles(styles)(withFirebaseAuth({ providers, firebaseAppAuth })(App)));
