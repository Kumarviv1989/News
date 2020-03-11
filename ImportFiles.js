import React, { useState } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import FormHelperText from "@material-ui/core/FormHelperText";

import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";
import * as firebase from "firebase";
import {fbInstances,dbPreview} from "./common/FirebaseConfiguration";
import { DocumentStatus, ENV, COLLECTIONS } from "./constants";

const {dbMaster, dbAdmin, dbProd} = fbInstances;
const collectionSize = 150;
let CURRENTENV = ENV.PREVIEW;
export const createDb = async ({ envName = ENV.PREVIEW, collectionName }) => {
  try {
    CURRENTENV = envName;
    let unPublishedDocs = await getUnPublishedContentFromAdminDb({
      collectionName,
      status:
        envName == ENV.MASTER ? DocumentStatus.VERIFIED : DocumentStatus.NONE
    });
    if (!unPublishedDocs.length) {
      console.log("no documents to Publish");
      return;
    }
    const publishedDocs = await publishToDb({
      unPublishedDocs,
      collectionName
    });
    
    if (publishedDocs) {
      console.log(
        `${collectionName} published successfully - ${publishedDocs} documents published`
      );
      if (envName == ENV.MASTER) {
        updateCollectionInAdminDb({ collectionName, publishedDocs });
      }
      console.log("End createMasterDb");
    }
  } catch (error) {
    console.error(error.message);
  }
};

const updateCollectionInAdminDb = ({ collectionName, publishedDocs }) => {
  try {
    publishedDocs.forEach(data => {
      dbAdmin
        .collection(collectionName)
        .doc(data._docIdInAdmin)
        .set(data);
    });
  } catch (error) {
    console.log("Error @updateCollectionInAdminDb", error.message);
  }
};

const getUnPublishedContentFromAdminDb = async ({
  collectionName,
  status = DocumentStatus.NONE
}) => {
  try {
    const unPublishedDocs = [];

    let collRef = dbAdmin.collection(collectionName);
    if (status != DocumentStatus.NONE) {
      collRef = collRef.where("_status", "==", status);
    }
    await collRef
      .orderBy("_createdDate", "asc")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const docData = { ...doc.data(), _docIdInAdmin: doc.id };
          unPublishedDocs.push(docData);
        });
      })
      .catch(error => {
        console.error(
          `error fetching collection ${collectionName}`,
          error.message
        );
      });

    return unPublishedDocs;
  } catch (e) {
    console.log(e.message);
  }
};

const publishToDb = async ({ unPublishedDocs, collectionName }) => {
  try {
    let documentId;
    //  1. check if collectionName  exist
    //  2. get master last document details using isLatest
    //  3. if no document then create fresh DB
    //  4. if document id is returned, then insert data in that document or next if required
    //  5. update unPublishedDocs array and return

    //  1. check if collectionName  exist

    let publishedDocs = [];
    const latestDocDetails = await getLatestDocumentDetails(collectionName);
    if (!latestDocDetails["documentIndex"]) {
      console.warn(
        `No ${collectionName} collection exist. Trying to create fresh collection`
      );
      // create fresh collection
      publishedDocs = createNewDocument(unPublishedDocs, null, collectionName);
    } else {
      publishedDocs = updateCollection(
        latestDocDetails,
        unPublishedDocs,
        collectionName
      );
    }

    console.log("document id", latestDocDetails);

    return publishedDocs;
  } catch (error) {
    console.log("Error @publishToDb", error.message);
  }
};

const getLatestDocumentDetails = async collectionName => {
  try {
    let latestDocDetails = {};
    await dbMaster
      .collection(collectionName)
      .where("_isLatest", "==", true)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const docData = doc.data();
          latestDocDetails = {
            _docCount: docData._docCount,
            documentIndex: doc.id.split("-")[1],
            existingRecords: docData.records
          };
        });
      });

    return latestDocDetails;
  } catch (error) {
    console.log("Error @getLatestDocumentDetails", error.message);
  }
};

const createNewDocument = (unPublishedDocs, documentIndex, collectionName) => {
  try {
    let publishedDocs = [];
    let docIndex = documentIndex || 0;
    while (unPublishedDocs.length) {
      let newDocs = unPublishedDocs.splice(0, collectionSize);
      let documentId = getDocumentId(docIndex++);

      const isLatestDocument = unPublishedDocs.length <= collectionSize;
      newDocs = updateDocDetails(newDocs, documentId, []);
      insertToDb({
        newDocs,
        existingRecordsInDocument: [],
        documentId,
        isLatestDocument,
        isNewDocument: true,
        collectionName
      });
      publishedDocs.push(...newDocs);
    }

    return publishedDocs;
  } catch (error) {
    console.error("Error @createNewCollection", error.message);
  }
};

const getDocumentId = documentIndex => {
  return "doc-" + documentIndex++;
};

const updateDocDetails = (docs, documentId) => {
  try {
    return docs.map((doc, idx) => {
      return {
        ...doc,
        _masterDocId: {
          docId: documentId
        },
        _status: DocumentStatus.PUBLISHED
      };
    });
  } catch (error) {
    console.error("Error @updateDocDetails", error.message);
  }
};

const insertToDb = ({
  newDocs,
  existingRecordsInDocument,
  documentId,
  isLatestDocument,
  isNewDocument,
  collectionName
}) => {
  try {
    let doc = {
      _lastModifiedDate: firebase.firestore.FieldValue.serverTimestamp(),
      _docCount: newDocs.length + existingRecordsInDocument.length,
      _isExpired: false,
      _isLatest: isLatestDocument,
      records: [...existingRecordsInDocument, ...newDocs]
    };

    if (isNewDocument) {
      doc["_createdDate"] = firebase.firestore.FieldValue.serverTimestamp();
    }
    if (CURRENTENV === ENV.PREVIEW) {
      dbPreview
        .collection(collectionName)
        .doc(documentId)
        .set(doc, { merge: true });
    } else {
      dbMaster
        .collection(collectionName)
        .doc(documentId)
        .set(doc, { merge: true });
      dbProd
        .collection(collectionName)
        .doc(documentId)
        .set(doc, { merge: true });
    }
  } catch (error) {
    console.error("Error @insertToDb", error.message);
  }
};

const updateCollection = (
  latestDocDetails,
  unPublishedDocs,
  collectionName
) => {
  try {
    let publishedDocs = [];
    console.log("latestDocDetails", latestDocDetails);
    let remainingDocsInCurrentAppDoc =
      collectionSize - latestDocDetails._docCount;

    if (unPublishedDocs.length <= remainingDocsInCurrentAppDoc) {
      const isLatestDocument =
        unPublishedDocs.length <= remainingDocsInCurrentAppDoc;
      unPublishedDocs = updateDocDetails(
        unPublishedDocs,
        latestDocDetails.documentIndex,
        latestDocDetails._docCount
      );
      let documentId = getDocumentId(
        latestDocDetails.documentIndex,
        collectionName
      );
      insertToDb({
        newDocs:unPublishedDocs,
        existingRecordsInDocument: latestDocDetails.existingRecords,
        documentId,
        isLatestDocument,
        isNewDocument: false,
        collectionName
      });
      publishedDocs.push(...unPublishedDocs);
    } else {
      let newDocs = unPublishedDocs.splice(0, remainingDocsInCurrentAppDoc);
      let documentId = getDocumentId(
        latestDocDetails.documentIndex,
        collectionName
      );
      newDocs = updateDocDetails(
        newDocs,
        documentId,
        latestDocDetails._docCount
      );
      publishedDocs.push(...newDocs);
      insertToDb({
        newDocs,
        existingRecordsInDocument: latestDocDetails.existingRecords,
        documentId,
        isLatestDocument: false,
        isNewDocument: false,
        collectionName
      });
      newDocs = createNewDocument(
        unPublishedDocs,
        ++latestDocDetails.documentIndex,
        collectionName
      );
      publishedDocs.push(...newDocs);
    }
    return publishedDocs;
  } catch (error) {
    console.log("Error @updateMasterDb", error.message);
  }
};

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex"
  },
  formControl: {
    margin: theme.spacing(3)
  }
}));
export default function ImportFile() {
  const classes = useStyles();

  const handleChange = name => event => {
    setState({ ...state, [name]: event.target.checked });
  };

  const [state, setState] = React.useState({
    jobs: true,
    admitCards: false,
    results: false
  });
  const { jobs, admitCards, results } = state;

  return (
    <Paper>
      <Typography
        variant="h5"
        component="h3"
        style={{ paddingTop: "10px", marginLeft: "10px" }}
      >
        Publish Data
      </Typography>
      <Grid
        container
        direction="column"
        justify="center"
        alignItems="flex-start"
      >
        <Grid item xs={6}>
          <FormControl component="fieldset" className={classes.formControl}>
            <FormLabel component="legend">Collections to publish</FormLabel>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={jobs}
                    onChange={handleChange(COLLECTIONS.JOBS)}
                    value={COLLECTIONS.JOBS}
                  />
                }
                label="Jobs"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={admitCards}
                    onChange={handleChange(COLLECTIONS.ADMITCARD)}
                    value={COLLECTIONS.ADMITCARD}
                  />
                }
                label="Admit Cards"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={results}
                    onChange={handleChange(COLLECTIONS.RESULT)}
                    value={COLLECTIONS.RESULT}
                  />
                }
                label="Results"
              />
            </FormGroup>
            <FormHelperText error>
              Dear Publisher Mahashay! Be careful. You are modifiyng Live Data
            </FormHelperText>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            disabled={!Object.keys(state).filter(i => state[i]).length}
            style={{ marginLeft: "10px", marginTop: "10px" }}
            onClick={() => {
              Object.keys(state).filter(i => {
                if (state[i]) {
                  createDb({
                    envName: ENV.MASTER,
                    collectionName: i
                  });
                }
              });
            }}
          >
            Publish
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
