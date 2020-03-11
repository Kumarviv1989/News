import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import GetAllCollection from './MoveAlltheRecords';
import  Destination from './FirebaseConfigForPopulateDB';
import {dbMaster} from '../common/FirebaseConfiguration';

function StyledRadio(props) {
  return <Radio disableRipple color="default" {...props} />;
}

export default class PopulateDb extends React.Component {
  state={
    selected:''
  }
  handleChange = ev => {
    console.log(ev.target.value);
    this.setState({ selected: ev.target.value });
  }

  render() {
    return (
      <Paper>
        <Typography
          variant="h5"
          component="h3"
          style={{ paddingTop: "20px", marginLeft: "10px" }}
        >
        <label>Populate DB </label> 
        </Typography>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="stretch"
        ></Grid>
        <Grid>
          <RadioGroup
            onChange={this.handleChange}
            style={{ paddingTop: "20px", marginLeft: "10px" }}
            row
            defaultValue="Dev-env"
            aria-label="Dev-env"
            name="customized-radios"
          >
            <FormControlLabel
              p={100}
              value="Dev-env"
              class="radio-inline"
              control={<StyledRadio />}
              label="Dev-env"
            />
            <FormControlLabel
              padding={10}
              margin={100}
              value="Staging env"
              class="radio-inline"
              control={<StyledRadio />}
              label="Staging env"
            />
          </RadioGroup>
        </Grid>
        <Typography
          variant="h5"
          component="h3"
          style={{ paddingTop: "10px", marginLeft: "10px" }}
        >
          <Button
            variant="contained"
           // variant="outlined"
            color="primary"G
            style={{ marginLeft: "10px", marginTop: "5px" }}
            async onClick={() => {
              try{
              
              if(this.state.selected=='Staging env'){
                GetAllCollection(dbMaster,Destination);
              }
              else if(this.state.selected=='Dev-env'){
                GetAllCollection(dbMaster,Destination);
              }
              else{
                GetAllCollection(dbMaster,Destination);
              }
              this.props.onSubmit("Successfully uploaded");
            }
            catch(error){
              this.props.onSubmit('Error: '+ error.message);
            }

            }}
          >
            Publish
          </Button>
        </Typography>
      </Paper>
    );
  }
}
// export default  PopulateDb;
