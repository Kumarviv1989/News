import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/styles";

import { Formik, Field, Form } from "formik";
import { addAdmitCard, fetchAdmitCards } from "./actions";
import { connect } from "react-redux";
import { DocumentStatus} from './constants'
import { TextField, Checkbox } from "formik-material-ui";
import {
  Button,
  LinearProgress,
  Grid,
  Paper,
  FormControlLabel,
  CardHeader,
  CardContent
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  }
}));


function AdmitCard(props) {
  const { onOpen, addAdmitCard, admitCards,fetchAdmitCards } = props;
  const classes = useStyles();
  useEffect(() => {
    fetchAdmitCards();
  }, []);

  return (
    <Formik
      initialValues={{
        title: "",
        link: "",
        admitCardDeclared: false,
        examDate: ""
      }}
      validate={values => {
        const errors = {};
        if (!values.title) {
          errors.title = "Required";
        }
        return errors;
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          setSubmitting(false);
          alert(JSON.stringify(values, null, 2));
        }, 500);
        addAdmitCard({...values,_status:DocumentStatus.VERIFIED});
      }}
    >
      {({ submitForm, isSubmitting, values, setFieldValue }) => (
        <Grid container justify={"center"} spacing={2}>
          <Grid item xs={12}>
            <Form>
              <Paper>
             
                <CardHeader  title="Post an Admit card"></CardHeader>
                <CardContent>
                <label htmlFor="contained-button-file">
            <Button
              variant="contained"
              color="primary"
              component="span"
              style={{marginLeft: "1180px", marginTop: "-70px"  }}
              onClick={()=>{
                
                try {
                  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(admitCards));
                  var downloadAnchorNode = document.createElement('a');
                  downloadAnchorNode.setAttribute("href", dataStr);
                  document.body.appendChild(downloadAnchorNode);
                  downloadAnchorNode.setAttribute("download", "Backup_AllAdmitCards_"+ new Date()+".json");
                  downloadAnchorNode.click();
                  downloadAnchorNode.remove();
                } catch (error) {
                  console.log('Error @downloadAdminJobsAsJson', error.message);
                }
            }} >
              Export
            </Button>
          </label>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Field
                        name="title"
                        type="text"
                        label="Title"
                        fullWidth
                        component={TextField}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Field
                        type="text"
                        label="Link"
                        name="link"
                        fullWidth
                        component={TextField}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Field
                            label="Admit Card Declared"
                            name="admitCardDeclared"
                            component={Checkbox}
                          />
                        }
                        label="Admit Card Declared"
                      />
                    </Grid>

                    <Grid item xs={6}>
                      <Field
                        type="date"
                        label="Exam Date"
                        name="examDate"
                        fullWidth
                        component={props => (
                          <TextField
                            InputLabelProps={{
                              shrink: true
                            }}
                            {...props}
                          />
                        )}
                      />
                    </Grid>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={8} md={10} lg={11}></Grid>
                    <Grid item xs={1}>
                      {isSubmitting && <LinearProgress />}
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        onClick={submitForm}
                      >
                        Submit
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>{" "}
              </Paper>
            </Form>
          </Grid>
        </Grid>
      )}
    </Formik>
  );
}
const mapStateToProps = state => {
  return {
    dataAsString: "D",
    data: {},
    t: state.d,
    admitCards: state.admitCards,
    locations: state.locations,
    jobList: state.jobList,
    message: state.message
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addAdmitCard(data) {
      dispatch(addAdmitCard(data));
    },
    fetchAdmitCards() {
      dispatch(fetchAdmitCards());
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(AdmitCard);
