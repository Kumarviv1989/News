import React, { useState } from "react";
import ReactDOM from "react-dom";
import AddCompany from "./components/addCompany";
import EditCompany from "./components/editCompany";
import { makeStyles } from "@material-ui/core/styles";
import Search1 from "./components/Search1";
import Select from "react-select";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Container } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import { connect } from "react-redux";
import withFirebaseAuth from "react-with-firebase-auth";
import { providers, firebaseAppAuth, logos } from "./firebase";
import { addNew } from "./actions";

const useStyles = makeStyles({
  customSelect: {
    marginTop: "10px",
    marginLeft: "15px",
    marginRight: "15px",
    width: "15%"
  }
});

const mapDispatchToProps = dispatch => {
  return {
    addNew: company => {
      dispatch(addNew(company));
    }
  };
};

 function GetImage(newImageUrl) {
  return  new Promise((res, rej) => {
    var xhr = new XMLHttpRequest();

    xhr.responseType = "blob";
    xhr.onload = function(event) {
      if (xhr.status == 200) {
        res(xhr.response);
      } else {
        rej(xhr.status);
      }
    };
    xhr.open("GET", newImageUrl);
      // xhr.setRequestHeader("Access-Control-Allow-Origin","*");
    xhr.send();
  });
}

function News(props) {
  const [newTitle, setnewTitle] = useState("");
  const [newDescription, setnewDescription] = useState("");
  const [newImageUrl, setnewImageUrl] = useState("");
   function handleChange(newImageUrl) {
    // setState({progressState: {display: "block",margin: "10px"}});
     GetImage(newImageUrl).then(blob => {
      console.log(blob);
      if (blob) {
        const uploadTask = logos.child(newImageUrl).put(blob);
        uploadTask.on(
          "state_changed",
          snapshot => {},
          error => {
            console.log(error);
          },
          async () => {
            await logos
              .child(newImageUrl)
              .getDownloadURL()
              .then(url => {
                setnewImageUrl(url);
                console.log(url);
                if (newTitle != "") {
                  props.addNew({
                    name: newTitle,
                    description: newDescription,
                    url: url
                  });
                }
              });
          }
        );
        // logos.ref(`image/${event.target.files[0].name}`);
        //console.log(event.target.files[0])
      }
    });
  }

  function clearControl() {
    setnewTitle("");
    setnewImageUrl("");
    setnewDescription("");
  }

  function handleNewsName(event) {
    setnewTitle(event.target.value);
  }
  function handleNewsDescription(event) {
    setnewDescription(event.target.value);
  }

  function handleNewsImageUrl(event) {
    setnewImageUrl(event.target.value);
  }

  async function handleSubmit() {
    const imgFirebaseUrl = await handleChange(newImageUrl);
  }

  const classes = useStyles();
  return (
    <Container>
      <Paper>
        <Typography
          variant="h5"
          component="h3"
          style={{ paddingTop: "10px", marginLeft: "10px" }}
        >
          News And Update
        </Typography>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="stretch"
        >
          <TextField value={newTitle}
            label="Title"
            type="text"
            size="100"
            style={{
              marginTop: "10px",
              marginLeft: "15px",
              marginRight: "15px"
            }}
            className={classes.customTextField}
            onChange={e => handleNewsName(e)}
          />
        </Grid>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="stretch"
        >
          <TextField value={newDescription}
            id="standard-multiline-flexible"
            multiline
            rowsMax="10"
            label="Description"
            type="text"
            size="100"
            style={{
              marginTop: "10px",
              marginLeft: "15px",
              marginRight: "15px"
            }}
            className={classes.customTextField}
            onChange={e => handleNewsDescription(e)}
          />
        </Grid>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="stretch"
        >
          <TextField value={newImageUrl}
            label="Image Url"
            type="text"
            size="100"
            style={{
              marginTop: "10px",
              marginLeft: "15px",
              marginRight: "15px"
            }}
            className={classes.customTextField}
            onChange={e => handleNewsImageUrl(e)}
          />
        </Grid>

        <br />
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="flex-start"
        >
          <input
            hidden
            accept="image/*"
            id="contained-button-file"
            multiple
            type="file"
          />
          <grid>
            <label>
              <Button
                onClick={() => {
                  handleSubmit();
                }}
                variant="contained"
                color="primary"
                component="span"
                style={{ marginLeft: "10px", marginBottom: "10px" }}
              >
                Upload
              </Button>
            </label>

            <label>
              <Button
                onClick={() => {
                  clearControl();
                }}
                variant="contained"
                color="primary"
                component="span"
                style={{ marginLeft: "10px", marginBottom: "10px" }}
                // style={{ marginLeft: "10px", marginBottom: "10px" }}
              >
                Clear
              </Button>
            </label>
          </grid>
        </Grid>

        <Grid
          container
          direction="column"
          justify="center"
          alignItems="stretch"
        ></Grid>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="flex-start"
        >
          {props.NewStatus != null && (
            <Typography
              variant="h5"
              component="h3"
              style={{
                paddingTop: "10px",
                marginLeft: "10px",
                marginBottom: "10px"
              }}
            >
              Status: {props.NewStatus}
            </Typography>
          )}
        </Grid>
      </Paper>
    </Container>
  );
}

const mapStateToProps = state => {
  return {
    // companyInfo: state.auth.companyInfo,
    // companyOperationSuccess: state.auth.companyOperationSuccess,
    NewStatus: state.auth.NewStatus
    // companyPageProgress: state.auth.companyPageProgress
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withFirebaseAuth({ providers, firebaseAppAuth })(News));
