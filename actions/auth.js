import { myFirebase } from "../firebase";

import * as C from "../constants"

const requestLogin = () => {
  return {
    type: C.LOGIN_REQUEST
  };
};

const receiveLogin = user => {
  return {
    type: C.LOGIN_SUCCESS,
    user
  };
};

const loginError = () => {
  return {
    type: C.LOGIN_FAILURE
  };
};

const requestLogout = () => {
  return {
    type: C.LOGOUT_REQUEST
  };
};

const receiveLogout = () => {
  return {
    type: C.LOGOUT_SUCCESS
  };
};

const logoutError = () => {
  return {
    type: C.LOGOUT_FAILURE
  };
};

const verifyRequest = () => {
  return {
    type: C.VERIFY_REQUEST
  };
};

const verifySuccess = () => {
  return {
    type: C.VERIFY_SUCCESS
  };
};

export const loginUser = (email, password) => dispatch => {
  dispatch(requestLogin());
  myFirebase
    .auth()
    .signInWithEmailAndPassword(email, password)
    .then(user => {
      dispatch(receiveLogin(user));
    })
    .catch(error => {
      //Do something with the error if you want!
      dispatch(loginError());
    });
};

export const logoutUser = () => dispatch => {
  dispatch(requestLogout());
  myFirebase
    .auth()
    .signOut()
    .then(() => {
      dispatch(receiveLogout());
    })
    .catch(error => {
      //Do something with the error if you want!
      dispatch(logoutError());
    });
};

export const verifyAuth = () => dispatch => {
  dispatch(verifyRequest());
  myFirebase
    .auth()
    .onAuthStateChanged(user => {
      if (user !== null) {
        dispatch(receiveLogin(user));
      }
      dispatch(verifySuccess());
    });
};

