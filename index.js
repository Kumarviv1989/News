import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import { combineReducers, createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import {
  materialCells,
  materialRenderers
} from "@jsonforms/material-renderers";
import App from "./App";
import { Provider } from "react-redux";
import schema from "./schema.json";
import uischema from "./uischema.json";
import createAjv from "ajv";
import { Actions, jsonformsReducer } from "@jsonforms/core";
import {
  MuiThemeProvider,
  createMuiTheme,
  responsiveFontSizes
} from "@material-ui/core/styles";
import LocationControl from "./location/LocationControl";
import locationControlTester from "./location/locationControlTester";
import CategoriesControl from "./categories/CategoriesControl";
import categoriesControlTester from "./categories/CatagoriesControlTester";
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import { loadState, saveState } from "./lstorage";
import { jobCategories } from "./common/categories";
import auth from "./reducers";
import { verifyAuth } from "./actions/auth";
const data = {};
const initState = {
  jsonforms: {
    cells: materialCells,
    renderers: materialRenderers
  }
};
export const selectedJob = (state = -1, action) => {
  if (action.type == "SELECTED_JOB") {
    state = [...action.payload];
  }
  return state;
};
export const locations = (state = {}, action) => {
  if (action.type == "LOCATIONS") {
    state = { ...action.payload };
  }
  return state;
};
export const message = (state = {}, action) => {
  if (action.type == "ENTRY_UPDATE_FAILED") {
    state = {
      hasError: true,
      msg: "Uploaded by is empty",
      ...action.payload,
      type: action.type
    };
  }
  if (action.type == "ENTRY_EDIT_SUCCESS") {
    state = {
      hasError: false,
      msg: `Edited Successfuly ${action.payload}`,
      type: action.type
    };
  }
  if (action.type == "ENTRY_UPDATE_SUCCESS") {
    state = {
      hasError: false,
      msg: `Added Successfuly ${action.payload}`,
      type: action.type
    };
  }
  return state;
};

const dchangeCategories = d => {
  d = d.data;
  if (d.categories) {
    d.categories = jobCategories
      .filter(e => d.categories.includes(e.id))
      .map(e => {
        return { value: e.id, label: e.name };
      });
  }
};
const deNormalizeData = jobs => {
  jobs.map(job => {
    dchangeCategories(job);
  });

  return jobs;
};
export const jobList = (state = [], action) => {
  if (action.type == "SET_JOBS") {
    state = action.payload;
  }
  return state;
};
const ajv = createAjv({
  useDefaults: true
});

export const admitCards = (state = [], action) => {
  if (action.type == "FETCH_ADMITCARDS") {
    return action.payload;
  }
  return state;
};

export const results = (state = [], action) => {
  if (action.type == "FETCH_RESULTS") {
    return action.payload;
  }
  return state;
};

export const uploadedJobs = (state = [], action) => {
  if (action.type == "FETCH_JOBS") {
    return deNormalizeData(action.payload);
  }
  return state;
};
const customizeSchema = schema => {
  if (auth.isAdmin) {
    schema.properties.status.enum = ["VERIFED", "ERROR"];
  }
  return schema;
};
const consoleMessages = store => next => action => {
  let result;

  //console.groupCollapsed(`dispatching action => ${action.type}`)
  result = next(action);

  let data = store.getState();
  console.log(data);

  //console.groupEnd()
  saveState(data);
  return result;
};
const savedState = loadState() || initState;
const rootReducer = combineReducers({
  jsonforms: jsonformsReducer(),
  admitCards,
  results,
  uploadedJobs,
  auth,
  message,
  jobList,
  selectedJob,
  locations
});
// const store = createStore(rootReducer)// applyMiddleware(thunk)(createStore)(rootReducer, savedState)
const store = createStore(
  rootReducer,
  initState,
  applyMiddleware(thunk, consoleMessages)
);
store.dispatch(verifyAuth());
store.dispatch(
  Actions.init(data, customizeSchema(schema), uischema, {
    ajv
  })
);

// Uncomment this line (and respective import) to register our custom renderer
store.dispatch(
  Actions.registerRenderer(locationControlTester, LocationControl)
);
store.dispatch(
  Actions.registerRenderer(categoriesControlTester, CategoriesControl)
);

let theme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#80CBC4"
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      main: "#4DB6AC"
    }
    // error: will use the default color
  },
  typography: {
    useNextVariants: true,
    // Tell Material-UI what's the font-size on the html element is.
    fontSize: 8,
    htmlFontSize: 10,
    fontFamily: ["Roboto", "sans-serif"].join(",")
  }
});
theme = responsiveFontSizes(theme);
ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <Router>
        <App />
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById("root")
);
registerServiceWorker();

String.prototype.toTitleCase = function() {
  var i, j, str, lowers, uppers;
  str = this.replace(/([^\W_]+[^\s-]*) */g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

  // Certain minor words should be left lowercase unless
  // they are the first or last words in the string
  lowers = [
    "A",
    "An",
    "The",
    "And",
    "But",
    "Or",
    "For",
    "Nor",
    "As",
    "At",
    "By",
    "For",
    "From",
    "In",
    "Into",
    "Near",
    "Of",
    "On",
    "Onto",
    "To",
    "With"
  ];
  for (i = 0, j = lowers.length; i < j; i++)
    str = str.replace(new RegExp("\\s" + lowers[i] + "\\s", "g"), function(
      txt
    ) {
      return txt.toLowerCase();
    });

  // Certain words such as initialisms or acronyms should be left uppercase
  uppers = ["Id", "Tv"];
  for (i = 0, j = uppers.length; i < j; i++)
    str = str.replace(
      new RegExp("\\b" + uppers[i] + "\\b", "g"),
      uppers[i].toUpperCase()
    );

  return str;
};
