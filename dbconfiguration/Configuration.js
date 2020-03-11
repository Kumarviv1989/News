import React, { Component } from "react";
import firebase from "firebase/app";
import FileUploader from "react-firebase-file-uploader";
import { logos } from "../firebase";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ReactDOM from "react-dom";

import clsx from "clsx";
import { makeStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import importJobs from "../db_feature/ImportJobs";
import {dbMaster} from "../common/FirebaseConfiguration";
import ImportAdmitCards from "../db_feature/ImportAdmitCard";
import ImportResultData from "../db_feature/ImportResult";

function StyledRadio(props) {
  return <Radio disableRipple color="default" {...props} />;
}

class ImportFileConfig extends React.Component {
  handleChange = ev => {
    console.log(ev.target.value);
    this.setState({ taskType: ev.target.value });
    // this.setState({ selected: ev.target.value });
  };
  state = {
    targets: [],
    importList: [],
    taskType: "Jobs",
    fileValue: null,
    message: ''
  };

  onChange = e => {
    //  (e.target
    this.setState({ fileValue: e.target.files[0].name });
    this.setState({ targets: e.target });
    console.log(e.target.files[0].name);
  };
  loadFile(target) {
    console.log("Vivek");
    var input,
      file,
      fr,
      data = [];
    const receivedText = e => {
      let lines = e.target.result;
      try {
        let newArr = JSON.parse(lines);
        this.setState({ importList: newArr });
        //console.log(this.state.importList);
        //this.setState({importList: newArr })
        console.log(newArr);
        return newArr;
      } catch (e) {
        return null;
      }
    };
    if (typeof window.FileReader !== "function") {
      alert("The file API isn't supported on this browser yet.");
      return;
    }

    input = target;
    if (!input) {
      alert("Um, couldn't find the fileinput element.");
    } else if (!input.files) {
      alert(
        "This browser doesn't seem to support the `files` property of file inputs."
      );
    } else if (!input.files[0]) {
      alert("Please select a file before clicking 'Load'");
    } else {
      return new Promise(resolve => {
        file = input.files[0];
        fr = new FileReader();
        fr.onload = e => {
          data = receivedText(e);
          console.log("MyData" + data);
          resolve(data);
        };
        fr.readAsText(file);
      });
    }
  }

  render() {
    return (
      <Paper>
        <Typography
          variant="h5"
          component="h3"
          style={{ paddingTop: "10px", marginLeft: "10px" }}
        >
          Import file
        </Typography>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="stretch"
        >
        </Grid>
        <Grid>
          <RadioGroup
            onChange={this.handleChange}
            row
            aria-label="Jobs"
            name="customized-radios"
          >
            <FormControlLabel
              p={100}
              value="Jobs"
              class="radio-inline"
              control={<StyledRadio />}
              label="Jobs"
            />
            <FormControlLabel
              padding={10}
              margin={100}
              value="Result"
              class="radio-inline"
              control={<StyledRadio />}
              label="Result"
            />
            <FormControlLabel
              padding={10}
              margin={100}
              value="Admit"
              class="radio-inline"
              control={<StyledRadio />}
              label="Admit"
            />
          </RadioGroup>
        </Grid>
        <Typography
          variant="h5"
          component="h3"
          style={{ paddingTop: "10px", marginLeft: "10px" }}
        >
          <input
            type="file"
            name="file"
            // value={this.state.fileValue}
            onChange={e => this.onChange(e)}
            
          />
          <Button
            //variant="contained"
            variant="outlined"
            color="primary"
            style={{ marginLeft: "10px", marginTop: "20px" }}
            onClick={async e => { 
              try {
                if (this.state.taskType === "Jobs") {
                  console.log("Inside");
                  let fr = (await this.loadFile(this.state.targets)) || [];
                  if (fr.length) {
                     await importJobs(dbMaster, this.state.importList)
                     this.props.onSubmit("Successfully uploaded");
                  }
                } else if (this.state.taskType === "Admit") {
                  let fr = (await this.loadFile(this.state.targets)) || [];
                  if (fr.length) {
                   return ImportAdmitCards(dbMaster, this.state.importList).then(() => {
                     // this.setState({message:'Successfully uploaded'})
                      this.props.onSubmit("Successfully uploaded");
                      })

                   // this.setState({ fileValue: "" });
                  }
                } else if (this.state.taskType === "Result") {
                  let fr = (await this.loadFile(this.state.targets)) || [];
                  if (fr.length) {
                    return  ImportResultData(dbMaster, this.state.importList).then(() => {
                    //this.setState({message:'Successfully uploaded'})
                    this.props.onSubmit("Successfully uploaded");

                    })

                    //this.setState({ fileValue: e.target.files[0] });
                  }
                }
              } catch (error) {
                this.props.onSubmit('Error: '+ error.message);
                this.setState({message:error.message})
                console.log(error.message);
              }
            }
          }
          >
            Publish
          </Button>
        </Typography>
      </Paper>
    );
  }
}

export default ImportFileConfig;
