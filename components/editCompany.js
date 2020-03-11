import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { connect } from "react-redux";
import withFirebaseAuth from "react-with-firebase-auth";
import { providers, firebaseAppAuth } from "../firebase";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import Select from 'react-select';
import { readCompany, editCompany, resetCompanyStates, getAllCompanies, editCompanyDescription, editCompanyName, removeCompanyInfo } from "../actions";

const useStyles = makeStyles({
  customTextField: {
    marginTop: "10px",
    marginLeft: "15px",
    marginRight: "15px"
  }
});

const mapStateToProps = state => {
  return {
    companyInfo: state.auth.companyInfo,
    companyOperationSuccess: state.auth.companyOperationSuccess,
    companyOperationMessage: state.auth.companyOperationMessage,
    companyPageProgress: state.auth.companyPageProgress,
    companiesNames: state.auth.companiesNames
  };
};

const mapDispatchToProps = dispatch => {
  return {
    readCompany: company => {
        dispatch(readCompany(company));
    },
    editCompany: company => {
      dispatch(editCompany(company));
    },
    resetCompanyStates: () => {
      dispatch(resetCompanyStates());
    },
    getAllCompanies: () => {
      dispatch(getAllCompanies());
    },
    editCompanyDescription: (e) => {
        dispatch(editCompanyDescription(e));
    },
    editCompanyName: (e) => {
        dispatch(editCompanyName(e));
    },
    removeCompanyInfo: () => {
        dispatch(removeCompanyInfo());
    }
  };
};

function EditCompany(props) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [companyState,setCompanyState] = useState(0);
  const classes = useStyles();
    
  function handleCompanyDescription(event) {
    props.resetCompanyStates();
    props.editCompanyDescription(event.target.value);
  }

  function handleCompanyName(event) {
    props.resetCompanyStates();
    props.editCompanyName(event.target.value);
  }

  function handleSubmit() {
    setCompanyState(1);
    props.resetCompanyStates();
    if (props.companyInfo.name != "") {
      props.editCompany(
        props.companyInfo
      );
      setTimeout(() => {
        props.getAllCompanies();
      },3000)
    }
  }
  const [company, selectCompany] = useState(null);
  let options = props.companiesNames;
  let handleCompanySelection = selectedOption => {
    selectCompany(selectedOption);
    props.readCompany(selectedOption.value);
  };
  useEffect(() => {
    props.resetCompanyStates();
    props.removeCompanyInfo();
    props.getAllCompanies();
  }, []);
  return (
    <div>
      <Grid container direction="column" justify="center" alignItems="stretch">
        <Select
          className={classes.customTextField}
          value={company}
          onChange={handleCompanySelection}
          options={props.companiesNames}
          menuPortalTarget={document.body}
        />
        <TextField
          label="Company"
          value={props.companyInfo.name}
          type="text"
          size="100"
          className={classes.customTextField}
          onChange={e => handleCompanyName(e)}
        />
        <TextField
          label="Description"
          value={props.companyInfo.description}
          type="text"
          size="100"
          className={classes.customTextField}
          onChange={e => handleCompanyDescription(e)}
        />
        <br />
      </Grid>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="flex-start"
      >
        <Button
          variant="contained"
          color="primary"
          style={{ marginLeft: "10px", marginBottom: "10px" }}
          onClick={() => {
            handleSubmit();
          }}
        >
          Submit
        </Button>
      </Grid>
      <Grid container direction="column" justify="center" alignItems="stretch">
        {props.companyPageProgress ? (
          <div style={{ display: "block", margin: "10px" }}>
            <LinearProgress />
          </div>
        ) : (
          <div style={{ display: "none" }}>
            <LinearProgress />
          </div>
        )}
      </Grid>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="flex-start"
      >
        {props.companyOperationMessage != null && (
          <Typography
            variant="h5"
            component="h3"
            style={{
              paddingTop: "10px",
              marginLeft: "10px",
              marginBottom: "10px"
            }}
          >
            Status: {props.companyOperationMessage}
          </Typography>
        )}
      </Grid>
    </div>
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withFirebaseAuth({ providers, firebaseAppAuth })(EditCompany));
