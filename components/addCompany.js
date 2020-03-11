import React, {useState,useEffect}  from 'react';
import ReactDOM from "react-dom";
import { connect } from 'react-redux';
import withFirebaseAuth from 'react-with-firebase-auth'
import {providers,firebaseAppAuth} from '../firebase'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import { createCompany,readCompany,editCompany,resetCompanyStates } from '../actions';

const useStyles = makeStyles({
    customTextField: {marginTop:'10px',marginLeft:'15px',marginRight: '15px'}
});

const mapStateToProps = (state) => {
    return {
        companyInfo: state.auth.companyInfo,
        companyOperationSuccess: state.auth.companyOperationSuccess,
        companyOperationMessage: state.auth.companyOperationMessage,
        companyPageProgress: state.auth.companyPageProgress
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        createCompany: (company) => {
            dispatch(createCompany(company))
        },
        readCompany: (companyID) => {
            dispatch(readCompany(companyID))
        },
        editCompany: (company) => {
            dispatch(editCompany(company))
        },
        resetCompanyStates: () => {
            dispatch(resetCompanyStates())
        }
    }
};

function AddCompany(props){
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const classes = useStyles();

    function handleCompanyName(event){
        props.resetCompanyStates();
        setName(
            event.target.value
        )
    }
    function handleCompanyDescription(event){
        props.resetCompanyStates();
        setDescription(
            event.target.value
        )
    }
    function handleSubmit(){ 
        props.resetCompanyStates();
        if(name != ""){
            props.createCompany({name: name, description: description})
        }
    }
    useEffect(() => {
        props.resetCompanyStates();
      }, []);
    return(
        <div> 
            <Grid container direction="column" justify="center" alignItems="stretch">
                <TextField label="Company Name" type="text" size="100" className={classes.customTextField}   onChange={(e) => handleCompanyName(e) }/>
                <TextField label="Description" type="text" size="100" className={classes.customTextField} onChange={(e) => handleCompanyDescription(e)}/>
                <br/>
            </Grid>
            <Grid container direction="column" justify="center" alignItems="flex-start">
                <Button variant="contained" color="primary" style={{marginLeft: '10px',marginBottom: '10px'}} onClick={()=>{handleSubmit()}}>Submit</Button>
            </Grid>
            <Grid container direction="column" justify="center" alignItems="stretch">
                {props.companyPageProgress ? <div style={{display: "block",margin: "10px"}}><LinearProgress /></div> : <div style={{display: "none"}}><LinearProgress /></div>}
            </Grid>
            <Grid container direction="column" justify="center" alignItems="flex-start">
                {props.companyOperationMessage != null && <Typography variant="h5" component="h3" style={{paddingTop: "10px",marginLeft: "10px",marginBottom: "10px"}}>Status: {props.companyOperationMessage}</Typography> }
            </Grid>
        </div>
    );
};

export default connect(mapStateToProps, mapDispatchToProps)(withFirebaseAuth({providers,firebaseAppAuth})(AddCompany));