import React,{useState} from 'react';
import ReactDOM from "react-dom";
import AddCompany from './components/addCompany';
import EditCompany from './components/editCompany';
import { makeStyles } from '@material-ui/core/styles';
import Search1 from './components/Search1';
import Select from 'react-select';
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import { Container } from '@material-ui/core';
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles({
  customSelect: {marginTop:'10px',marginLeft:'15px',marginRight: '15px',width: '15%'}
});

function Company() {
  const [mode,selectMode] = useState({value: "Add",label: "Add"});
  let options = [
    {value: "Add",label: "Add"},
    {value: "Edit",label: "Edit"}
  ]
  let isSearchable = false;
  let handleModeSelection = selectedOption => {
    selectMode(selectedOption);
  };
  const classes = useStyles();
  return (
    <Container>
      <Paper>
        <Grid container direction="row" justify="flex-start" alignItems="center">
          <Select className={classes.customSelect} value={mode} onChange={handleModeSelection} options={options} isSearchable={isSearchable}/>
          <Typography variant="h5" component="h3" style={{paddingTop: "10px"}}> a company</Typography>
        </Grid>
        { mode.value == "Add" ? <AddCompany /> : <EditCompany />}
      </Paper>
    </Container>
  );
}

export default Company;