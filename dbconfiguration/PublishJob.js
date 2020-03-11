import React, { Component } from "react";
import firebase from "firebase/app";
import FileUploader from "react-firebase-file-uploader";
import { logos } from "../firebase";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import ReactDOM from "react-dom";

import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import {createMasterDb,reCreateAdminDb} from '../db_feature/CreateDB';

function StyledRadio(props) {
  
    return (
      <Radio
        disableRipple
        color="default"
        {...props}
      />
    );
  }

class PublishJobs extends React.Component
{
    handleChange = ev => {
        console.log(ev.target.value);
       // this.setState({ selected: ev.target.value });
      };
    
      onChange=(e)=>{
          console.log(e.target.files);
      }
    render(){
        return(
            <Paper>
             <Typography
          variant="h5"
          component="h3"
          style={{ paddingTop: "20px",paddingbottom: "25px", marginLeft: "10px" }}
        >
           Publish jobs from Admin <br/>
           <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "0px",paddingbottom: "25px", marginTop: "20px" }}
            onClick={() => {
              try{
              createMasterDb();
              this.props.onSubmit("Successfully uploaded");
              }
              catch(error){
                this.props.onSubmit('Error: ' + error.message);
              }
            }}
          >


            Publish
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ marginLeft: "10px", marginTop: "20px" }}
            onClick={() => {
              try{
              reCreateAdminDb();
              this.props.onSubmit("Successfully uploaded");
              }
              catch(error){
                this.props.onSubmit('Error: '+ error.message);
              }
            }}
          >
            Create DB
          </Button>
        </Typography>   
        </Paper>
        );
    }
}

export default  PublishJobs;