import React from "react";
import firebase from "firebase/app";
import FileUploader from "react-firebase-file-uploader";
import { logos } from "../firebase";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import ReactDOM from "react-dom";

class Search extends React.Component {
  state = {
    filename: "",
    downloadURL: "",
    isUploading: false,
    uploadProgress: 0,
    companyName: "",
    progressStyle: { display: "none" },
    firebaseURLStyle: { display: "none" }
  };

  GetCompnayName = event => {
    this.setState({ companyName: event.target.value });
  };

  handleCompanyName = event => {
    this.setState({
      filename: event.target.value
    });
  };
  handleUploadStart = () =>
    this.setState({
      isUploading: true,
      uploadProgress: 0,
      progressStyle: {
        display: "block",
        marginLeft: "10px",
        marginRight: "10px",
        marginBottom: "10px"
      },
      firebaseURLStyle: { display: "none" }
    });

  handleProgress = progress =>
    this.setState({
      uploadProgress: progress
    });

  handleUploadError = error => {
    this.setState({
      isUploading: false,
      progressStyle: { display: "none" }
      // Todo: handle error
    });
    console.error(error);
  };

  handleUploadSuccess = async filename => {
    console.log(filename);
    const downloadURL = await logos.child(this.state.filename).getDownloadURL();

    this.setState(oldState => ({
      downloadURL: downloadURL,
      uploadProgress: 100,
      isUploading: false,
      progressStyle: { display: "none" },
      firebaseURLStyle: { display: "block", margin: "10px" }
    }));
    //  this.setState({downloadURL: downloadURL})
    // console.log(downloadURL);
  };

  handleUploadImage = event => {
    let file = event.target.files[0];
    let filename = this.state.filename;
    if (this.state.filename == "") {
      console.log("inside if");
      return null;
    }
    console.log(event);
    let uploadTask = logos.child(filename).put(file);
    uploadTask.on(
      "state_changed",
      snapshot => {
        if (snapshot.state == "running") {
          this.handleUploadStart();
        }
        let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        this.handleProgress(progress);
      },
      error => {
        this.handleUploadError(error);
      },
      filename => {
        console.log("upload success");
        this.handleUploadSuccess(filename);
      }
    );
  };

  render() {
    return (
      <Paper>
        <Typography
          variant="h5"
          component="h3"
          style={{ paddingTop: "10px", marginLeft: "10px" }}
        >
          Upload Logo
        </Typography>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="stretch"
        >
          <TextField
            label="Company"
            type="text"
            size="100"
            style={{
              marginTop: "10px",
              marginLeft: "15px",
              marginRight: "15px"
            }}
            onChange={this.handleCompanyName}
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
            onChange={e => this.handleUploadImage(e)}
          />
          <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              color="primary"
              component="span"
              style={{ marginLeft: "10px", marginBottom: "10px" }}
            >
              Upload
            </Button>
          </label>
        </Grid>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="stretch"
        >
          <p style={this.state.progressStyle}>
            Uploading {this.state.filename} ...
          </p>
          <LinearProgress
            variant="determinate"
            value={this.state.uploadProgress}
            style={this.state.progressStyle}
          />
          <p style={this.state.firebaseURLStyle}>
            Firebase URL: {this.state.downloadURL}
          </p>
        </Grid>
      </Paper>
    );
  }
}

export default Search;
