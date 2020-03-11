import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import TextField from "@material-ui/core/TextField";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CloseIcon from "@material-ui/icons/Close";
import Slide from "@material-ui/core/Slide";
import FormLabel from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import { Grid } from "@material-ui/core";
import CreatableSelect from 'react-select/creatable';
//import MaterialTable from "material-table";
import {DocumentStatus} from "./constants";
import { setIn } from "formik";

const columns = ["key", "value"];

const useStyles = makeStyles(theme => ({
  postButton: {
    marginLeft: 5
  },
  appBar: {
    position: "relative"
  },
  title: {
    flex: 1,
    marginLeft: 14
  },
  dataContent: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 0
  },
  li: {
    listStyle: "none",
    padding: "5px",
    border: "1px dotted",
    margin: "5px",
    borderRadius: "5px",
    display: "flex",
    flexBasis: "29%",
    justifyContent: "flex-start",
    flexDirection: "column"
  },
  li_div: {
    maxWidth: "100%",
    fontWeight: "bold"
  }
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const serialize = (data, j) => {
  let ret = {};
  data &&
    Object.keys(data).forEach(i => {
      if (typeof data[i] == "object") {
        ret = Object.assign({}, ret, serialize(data[i], i));
      } else {
        ret[(j && j.toTitleCase() || "")+ "-" + i.toTitleCase()] = data[i];
      }
    });
  return ret;
};
const d = (classes, d) => {
  const k = serialize(d);
  return Object.keys(k).map(i => {
    return (
      <li key={i} className={classes.li}>
        <div>{i}</div>
        <div className={classes.li_div}>{k[i]}</div>
      </li>
    );
  });
};
const O = (o, s) => {
  if (typeof s == "string") {
    let k = o;
    s.split(".").map(i => {
      if (k[i]) {
        k = k[i];
      } else {
        k = false;
      }
    });
    return k;
  }
  return false;
};
const downloadObjectAsJson = (exportObj, exportName) => {
  if (
    exportObj &&
    exportObj[0].companyDetails &&
    O(
      exportObj[0],
      "companyDetails.title" || O(exportObj[0], "companyDetails.companyName")
    )
  ) {
    exportName +=
      "_" + O(exportObj[0], "companyDetails.title") ||
      O(exportObj[0], "companyDetails.companyName");
  } else {
    exportName += "_" + String(new Date());
  }
  var dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(JSON.stringify(exportObj));
  var downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", exportName + ".json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};
export default function Preview({
  data,
  show,
  onClose,
  onSave,
  jobList,
  edit,
  isAdmin
}) {
  const classes = useStyles();
  const [submitted, setSubmitted] = React.useState(false);
  const [publish, setPublish] = React.useState(DocumentStatus.VERIFICATION_PENDING);
  const [value, setValue] = React.useState("");
  const [inputValue, setInputValue] = React.useState("");
  React.useEffect(() => {
    setSubmitted(false);
  }, [jobList && jobList.length]);
  const createOption = (label) => ({
    label,
    value: label,
  });
  const handleKeyDown = (event) => {
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        setInputValue("");
        setValue([...value, createOption(inputValue)])
        event.preventDefault();
    }
  };
  const handleInputChange = (inputValue) => {
    setInputValue(inputValue)
  };
  return (
    <div>
      <Dialog
        fullScreen
        open={show}
        onClose={onClose}
        TransitionComponent={Transition}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              Preview -{" "}
              {edit
                ? `Editing Job - ${(data.companyDetails &&
                    data.companyDetails.title) ||
                    "Title not available"} `
                : "New Job"}
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => {
                downloadObjectAsJson([data], "job");
              }}
            >
              Save JSON
            </Button>
            <Button
              disabled={submitted}
              className={classes.postButton}
              autoFocus
              variant="contained"
              color="default"
              onClick={() => {
                setSubmitted(true);
                onSave({
                  _status : publish,
                  _comment : value && value.map(i=>i.value)
                });
                downloadObjectAsJson([data], "job");
              }}
            >
              Post
            </Button>
          </Toolbar>
        </AppBar>
        {isAdmin ? (
         
          <FormControl component="fieldset">
            <FormLabel component="legend">Validation Status</FormLabel>
            <RadioGroup
              aria-label="publishDetails"
              name="publishDetails1"
              value={publish}
              onChange={(e)=>{setPublish(e.target.value);}}
            > <FormControlLabel value={DocumentStatus.VERIFIED} control={<Radio />} label="Publish" />
              <FormControlLabel
                value={DocumentStatus.ERROR}
                control={<Radio />}
                label="Reject"
              />
             
             
            </RadioGroup>
            {publish == DocumentStatus.ERROR ?
            <CreatableSelect
            components={ {
              DropdownIndicator: null,
            }
            }
            inputValue={inputValue}
            isClearable
            isMulti
            menuIsOpen={false}
            onChange={(e)=>{
              setValue(e)
            }}
            placeholder={'Press Tab/Enter to add new comment'}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
            value={value}
          />
           :null}
          </FormControl>
        ) : (
        null
        )}
        <ul className={classes.dataContent}>{d(classes, data)}</ul>
      </Dialog>
    </div>
  );
}
