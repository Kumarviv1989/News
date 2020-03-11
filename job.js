import React from "react";
import { connect } from "react-redux";
import withFirebaseAuth from "react-with-firebase-auth";
import { providers, firebaseAppAuth } from "./firebase";
import { getData } from "@jsonforms/core";
import Grid from "@material-ui/core/Grid";
import withStyles from "@material-ui/styles/withStyles";
import createStyles from "@material-ui/styles/createStyles";
import MaterialTable from "material-table";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import PublicRoundedIcon from "@material-ui/icons/PublicRounded";
import ErrorRoundedIcon from "@material-ui/icons/ErrorRounded";
import UpdateRoundedIcon from "@material-ui/icons/UpdateRounded";
import InfoRoundedIcon from "@material-ui/icons/InfoRounded";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import IconButton from "@material-ui/core/IconButton";
import GetAppRoundedIcon from "@material-ui/icons/GetAppRounded";
import AddCircleRoundedIcon from "@material-ui/icons/AddCircleRounded";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Chip from "@material-ui/core/Chip";
import { JsonFormsDispatch, JsonFormsReduxContext } from "@jsonforms/react";
import { Actions } from "@jsonforms/core";
import {
  fetchToDos,
  addToDo,
  setJobsList,
  setLocations,
  editJob
} from "./actions";
import "./App.css";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import states from "./states.json";
import Preview from "./Preview";
import * as C from "./constants";
import theme from "./theme";
const drawerWidth = 240;
const styles = createStyles({
  title: {
    textAlign: "center",
    padding: "0.25em"
  },
  dataContent: {
    display: "flex",
    justifyContent: "center",
    borderRadius: "0.25em",
    backgroundColor: "#cecece"
  },
  demoform: {
    margin: "auto",
    padding: ".5rem"
  },
  jobsTable: {
    padding: "10px"
  }
});
class Job extends React.Component {
  state = {
    jobs: [],
    el: null,
    states: states,
    alertOpen: true,
    editMode: false,
    editJobID: null
  };
  componentDidUpdate(prevProps) {
    if (this.props.clear !== prevProps.clear && this.props.clear == false) {
      this.props.setSelected({});
    }
  }
  componentDidMount() {
    this.props.fetchToDo();
    this.props.setLocations(this.state.states);
  }

  render() {
    let { classes, dataAsString, data, uploadedJobs, jobList } = this.props;

    const handleClick = e => {
      this.setState({ el: e.currentTarget });
    };
    const handleClose = () => {
      this.setState({ el: null });
    };
    const parseDate = d => {
      if (typeof d == "string") {
        return new Date(d).toString();
      }
      if (d && d.toDate) {
        return d.toDate().toString();
      } else {
        return "NA";
      }
    };
    const statusIcon = status => {
      let element;
      switch (status) {
        case C.DocumentStatus.PUBLISHED:
          element = (
            <Tooltip title={C.DocumentStatus.PUBLISHED}>
              <IconButton>
                <PublicRoundedIcon style={{ color: "blue" }} />
              </IconButton>
            </Tooltip>
          );
          break;
        case C.DocumentStatus.VERIFICATION_PENDING:
          element = (
            <Tooltip title={C.DocumentStatus.VERIFICATION_PENDING}>
              <IconButton>
                <UpdateRoundedIcon style={{ color: "orange" }} />
              </IconButton>
            </Tooltip>
          );
          break;
        case C.DocumentStatus.VERIFIED:
          element = (
            <Tooltip title={C.DocumentStatus.VERIFIED}>
              <IconButton>
                <CheckRoundedIcon style={{ color: "green" }} />
              </IconButton>
            </Tooltip>
          );
          break;
        case C.DocumentStatus.ERROR:
          element = (
            <Tooltip title={C.DocumentStatus.ERROR}>
              <IconButton>
                <CloseRoundedIcon style={{ color: "red" }} />
              </IconButton>
            </Tooltip>
          );
          break;
        case C.DocumentStatus.UPDATED:
          element = (
            <Tooltip title={C.DocumentStatus.UPDATED}>
              <IconButton>
                <PublicRoundedIcon style={{ color: "grey" }} />
              </IconButton>
            </Tooltip>
          );
          break;
        default:
          element = status;
      }
      return element;
    };

    let tableData = [];
    uploadedJobs.map((value, index) => {
      let val = value.data ? value.data : { companyDetails: {} };
      let entry = {
        title: (val.companyDetails && val.companyDetails.title) || "No Title",
        postedDate: parseDate(
          val.companyDetails && val.companyDetails.postedDate
        ),
        status: val._status,
        createdBy: val._createdBy,
        comments: val._comment || [],
        originalObject: value || {}
      };
      tableData.push(entry);
    });
    return (
      <div>
        {this.state.previewOpen ? (
          <Preview
            isAdmin={this.props.isAdmin}
            edit={this.state.editMode}
            show={this.state.previewOpen}
            onClose={() => {
              this.setState({ previewOpen: false });
            }}
            data={data}
            onSave={publishData => {
              this.props.addToDo(
                { ...data, ...publishData },
                this.state.editMode,
                this.state.editJobID
              );
              this.setState({ alertOpen: true, editMode: false });
            }}
          />
        ) : null}
        {!this.props.isAdmin ? (
          <div>
            <Button onClick={handleClick}>Uploaded Jobs</Button>
            <Menu
              anchorEl={this.state.el}
              keepMounted
              dense="true"
              open={Boolean(this.state.el)}
              onClose={handleClose}
            >
              {uploadedJobs.map((e, i) => {
                return (
                  <MenuItem
                    onClick={() => {
                      this.props.editJob(e.data, e.id);
                      this.setState({ editMode: true, editJobID: e.id });
                    }}
                    key={i}
                    data-id={e.id}
                  >
                    {" "}
                    {statusIcon(e.data._status)}
                    {(e &&
                      e.data.companyDetails &&
                      e.data.companyDetails.title) ||
                      `Job added by ${e.data._createdBy}`}
                  </MenuItem>
                );
              })}
            </Menu>

            <Grid container justify={"space-even"} spacing={1}>
              <Grid item xs={12} md={3}>
                <Button
                  variant="contained"
                  onClick={() => {
                    try {
                      var dataStr =
                        "data:text/json;charset=utf-8," +
                        encodeURIComponent(
                          JSON.stringify(
                            uploadedJobs.map(i => {
                              return {
                                ...i.data,
                                _docIdInAdmin: i.id
                              };
                            })
                          )
                        );
                      var downloadAnchorNode = document.createElement("a");
                      downloadAnchorNode.setAttribute("href", dataStr);
                      document.body.appendChild(downloadAnchorNode);
                      downloadAnchorNode.setAttribute(
                        "download",
                        "Backup_AllJobs_" + new Date() + ".json"
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
                  Export All Data{" "}
                </Button>
              </Grid>
              <Grid item xs={12} md={3}>
                <Button variant="contained" component="label">
                  Upload File
                  <input
                    type="file"
                    onChange={async e => {
                      let fr = (await this.props.loadFile(e.target)) || [];
                      if (fr.length) {
                        this.props.setJobsList(fr);
                      }
                    }}
                    style={{ display: "none" }}
                  />
                </Button>
              </Grid>
              <Grid
                item
                xs={12}
                md={3}
                justify="space-between"
                style={{ textAlign: "right" }}
              >
                <Button
                  style={{ width: "40%", marginRight: 10 }}
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    this.setState({ previewOpen: true });
                  }}
                >
                  {this.state.editMode ? "Update Job" : "Add Job"}
                </Button>
                <Button
                  style={{ width: "40%" }}
                  variant="contained"
                  onClick={e => {
                    this.props.setSelected({});
                    this.setState({ editMode: false });
                  }}
                >
                  Clear All
                </Button>
              </Grid>
              <Grid item xs={12} md={12}>
                <List component="aside" aria-label="Jobs">
                  {jobList.map((job, i) => {
                    job = job.data ? job.data : job;
                    return (
                      <ListItem
                        button
                        key={i}
                        onClick={e => {
                          this.props.setSelected(job);
                        }}
                      >
                        {(job &&
                          job.companyDetails &&
                          job.companyDetails.title) ||
                          "Empty"}
                      </ListItem>
                    );
                  })}
                </List>
              </Grid>
            </Grid>
            <Grid container justify={"space-around"} spacing={1}>
              <Grid item xs={12} md={12} style={{ display: "none" }}>
                <Typography variant={"h3"} className={classes.title}>
                  Bound data
                </Typography>
                <div className={classes.dataContent}>
                  <pre id="boundData">{dataAsString}</pre>
                </div>
              </Grid>
              <Grid item xs={12} md={12} lg={12}>
                <div className={classes.demoform} id="form">
                  <JsonFormsReduxContext>
                    <JsonFormsDispatch />
                  </JsonFormsReduxContext>
                </div>
              </Grid>
            </Grid>
          </div>
        ) : null}
        {this.props.isAdmin ? (
          <Grid container justify={"space-around"} spacing={1}>
            <Grid
              container
              direction="column"
              justify="center"
              alignItems="stretch"
              className={classes.jobsTable}
            >
              <MaterialTable
                title="Job Listings"
                columns={[
                  { title: "Title", field: "title" },
                  { title: "Author", field: "createdBy" },
                  {
                    title: "Status",
                    field: "status",
                    render: rowData => {
                      let element;
                      switch (rowData.status) {
                        case C.DocumentStatus.PUBLISHED:
                          element = (
                            <Tooltip title={C.DocumentStatus.PUBLISHED}>
                              <IconButton>
                                <PublicRoundedIcon style={{ color: "blue" }} />
                              </IconButton>
                            </Tooltip>
                          );
                          break;
                        case C.DocumentStatus.VERIFICATION_PENDING:
                          element = (
                            <Tooltip
                              title={C.DocumentStatus.VERIFICATION_PENDING}
                            >
                              <IconButton>
                                <UpdateRoundedIcon
                                  style={{ color: "orange" }}
                                />
                              </IconButton>
                            </Tooltip>
                          );
                          break;
                        case C.DocumentStatus.VERIFIED:
                          element = (
                            <Tooltip title={C.DocumentStatus.VERIFIED}>
                              <IconButton>
                                <CheckRoundedIcon style={{ color: "green" }} />
                              </IconButton>
                            </Tooltip>
                          );
                          break;
                        case C.DocumentStatus.ERROR:
                          element = (
                            <Tooltip title={C.DocumentStatus.ERROR}>
                              <IconButton>
                                <CloseRoundedIcon style={{ color: "red" }} />
                              </IconButton>
                            </Tooltip>
                          );
                          break;
                        case C.DocumentStatus.UPDATED:
                          element = (
                            <Tooltip title={C.DocumentStatus.UPDATED}>
                              <IconButton>
                                <PublicRoundedIcon style={{ color: "grey" }} />
                              </IconButton>
                            </Tooltip>
                          );
                          break;
                        default:
                          element = rowData.status;
                      }
                      return element;
                    }
                  },
                  {
                    title: "Posted date",
                    field: "postedDate",
                    type: "datetime",
                    customSort: (a, b) =>
                      new Date(b.postedDate) - new Date(a.postedDate)
                  },
                  {
                    title: "Comments",
                    field: "comments",
                    render: rowData => {
                      return (
                        <div>
                          {rowData.comments.map((value, index) => (
                            <Chip
                              style={{
                                "margin-right": "5px",
                                "margin-left": "5px"
                              }}
                              variant="outlined"
                              color="secondary"
                              label={value}
                            />
                          ))}
                        </div>
                      );
                    }
                  }
                ]}
                data={tableData}
                actions={[
                  {
                    icon: () => <AddCircleRoundedIcon color="primary" />,
                    tooltip: "More info",

                    onClick: (event, rowData) => {
                      let e = rowData.originalObject;
                      this.props.editJob(e.data, e.id);
                      this.setState({
                        editMode: true,
                        editJobID: e.id,
                        previewOpen: true
                      });
                    }
                  },
                  {
                    icon: () => (
                      <GetAppRoundedIcon fontSize="large" color="primary" />
                    ),
                    tooltip: "Export",
                    isFreeAction: true,
                    onClick: () => {
                      try {
                        var dataStr =
                          "data:text/json;charset=utf-8," +
                          encodeURIComponent(JSON.stringify(uploadedJobs));
                        var downloadAnchorNode = document.createElement("a");
                        downloadAnchorNode.setAttribute("href", dataStr);
                        document.body.appendChild(downloadAnchorNode);
                        downloadAnchorNode.setAttribute(
                          "download",
                          "Backup_AllJobs_" + new Date() + ".json"
                        );
                        downloadAnchorNode.click();
                        downloadAnchorNode.remove();
                      } catch (error) {
                        console.log(
                          "Error @downloadAdminJobsAsJson",
                          error.message
                        );
                      }
                    }
                  }
                ]}
                options={{
                  pageSize: 10,
                  pageSizeOptions: [10, 15, 25]
                }}
              />
            </Grid>
          </Grid>
        ) : null}
      </div>
    );
  }
}
const mapStateToProps = state => {
  return {
    dataAsString: JSON.stringify(getData(state), null, 2),
    data: getData(state),
    uploadedJobs: state.uploadedJobs,
    jobList: state.jobList
  };
};
function loadFile(target) {
  var input,
    file,
    fr,
    data = [];

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
        resolve(data);
      };
      fr.readAsText(file);
    });
  }

  function receivedText(e) {
    let lines = e.target.result;
    try {
      let newArr = JSON.parse(lines);
      return newArr;
    } catch (e) {
      return null;
    }
  }
}

const mapDispatchToProps = dispatch => {
  return {
    async loadFile(target) {
      return loadFile(target);
    },
    editJob(e) {
      dispatch(
        Actions.update("", () => {
          return e;
        })
      );
    },
    saveState(e) {
      dispatch(
        Actions.update("", () => {
          return e;
        })
      );
    },
    setSelected(e) {
      console.log(e);
      dispatch(
        Actions.update("", () => {
          return e;
        })
      );
    },
    setLocations(s) {
      dispatch(setLocations(s));
    },
    setJobsList(list) {
      dispatch(setJobsList(list));
    },
    fetchToDo() {
      dispatch(fetchToDos());
    },
    addToDo(data, edit, jobID) {
      if (edit) {
        dispatch(editJob(jobID, data));
      } else {
        dispatch(addToDo(data));
      }
    }
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withStyles(styles)(withFirebaseAuth({ providers, firebaseAppAuth })(Job)));
