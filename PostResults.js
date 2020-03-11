import React, { useEffect } from "react";
import { makeStyles } from "@material-ui/styles";
import { DocumentStatus } from "./constants";
import { Formik, Field, Form } from "formik";
import { addResult, fetchAllResults } from "./actions";
import { connect } from "react-redux";

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
function PostResult(props) {
  const { onOpen, addResult, results, fetchAllResults } = props;
  //const { onOpen, addAdmitCard, admitCards,fetchAdmitCards } = props;
  const classes = useStyles();
  useEffect(() => {
    fetchAllResults();
  }, []);
  return (
    <Formik
      initialValues={{
        title: "",
        link: "",
        resultDeclared: false,
        resultDate: "",
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
        addResult({ ...values, _status: DocumentStatus.VERIFIED });
      }}
    >
      {({ submitForm, isSubmitting, values, setFieldValue }) => (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Form>
              <Paper>
                <CardHeader title="Post a Result" subheader=""></CardHeader>
                <CardContent>
                  <label htmlFor="contained-button-file">
                    <Button
                      variant="contained"
                      color="primary"
                      component="span"
                      style={{ marginLeft: "1175px", marginTop: "-70px" }}
                      onClick={() => {
                        try {
                          var dataStr =
                            "data:text/json;charset=utf-8," +
                            encodeURIComponent(JSON.stringify(results));
                          var downloadAnchorNode = document.createElement("a");
                          downloadAnchorNode.setAttribute("href", dataStr);
                          document.body.appendChild(downloadAnchorNode);
                          downloadAnchorNode.setAttribute(
                            "download",
                            "Backup_AllResult_" + new Date() + ".json"
                          );
                          downloadAnchorNode.click();
                          downloadAnchorNode.remove();
                        } catch (error) {
                          console.log(
                            "Error @downloadAdminJobsAsJson",
                            error.message
                          );
                        }
                      }}
                    >
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
                            label="Result Declared"
                            name="resultDeclared"
                            component={Checkbox}
                          />
                        }
                        label="Result Declared"
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
                    <Grid item xs={6}>
                      <Field
                        type="date"
                        label="Result Date"
                        name="resultDate"
                        fullWidth
                        InputLabelProps={{
                          shrink: true
                        }}
                        component={TextField}
                      />
                    </Grid>
                    <Grid item xs={6}></Grid>
                    <Grid item xs={8} md={10} lg={11}></Grid>
                    <Grid item xs={1}>
                      {isSubmitting && <LinearProgress />}
                      <br />
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
                </CardContent>
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
    results: state.results,
    locations: state.locations,
    jobList: state.jobList,
    message: state.message
  };
};

const mapDispatchToProps = dispatch => {
  return {
    addResult(data) {
      dispatch(addResult(data));
    },
    fetchAllResults() {
      dispatch(fetchAllResults());
    }
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(PostResult);
