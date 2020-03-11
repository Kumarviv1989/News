import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import * as firebase from "firebase";
import { todosRef } from "../firebase";
import ImportResultData from "../db_feature/ImportResult";
import importJobs from '../db_feature/ImportJobs';
import ImportAdmitCards from '../db_feature/ImportAdmitCard'; 
import {dbMaster} from '../common/FirebaseConfiguration';
import { DocumentStatus } from "../constants";
const jobsPerDocument = 5;

  const createMasterDb= async function(){
    try {
      let unPublishedJobs = await getUnPublishedJobsFromAdminDb();
      // let unPublishedJobs = [];
      console.log("unPublishedJobs", unPublishedJobs);
      const publishedJobs = await publishJobsToMasterDb(unPublishedJobs);
      if (publishedJobs) {
        console.log("job published successfully");
        console.log("publishedJobs.length ", publishedJobs.length);
        updateJobsInAdminDb(publishedJobs);
        console.log("End createMasterDb");
      }
    } catch (error) {
      console.error(error.message);
    }
  }

function updateJobsInAdminDb(unPublishedJobs) {
    try {
      unPublishedJobs.forEach(job => {
        // dbMaster.collection('jobs_source').doc(job.).set({});
        todosRef.doc(job._docIdInAdmin).set(job);
      });
    } catch (error) {
      console.log("Error @updateJobsInAdminDb", error.message);
    }
  }

     async function getUnPublishedJobsFromAdminDb() {
    try {
      const unPublishedJobs = [];
      console.log(DocumentStatus.VERIFIED);
      // await dbAdmin
      //   .collection("jobs")
      await todosRef
        .where("_status", "==", DocumentStatus.VERIFIED)
        // .orderBy("_addedTS") // TODO: change it to _addedDate
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const newJobData = { ...doc.data(), _docIdInAdmin: doc.id };
            unPublishedJobs.push(newJobData);
            // unPublishedJobs[doc.id] = doc.data();
            // console.log('doc.data ', doc.data());
          });
        })
        .catch(error => {
          console.error("error fetching jobs", error.message);
        });

      return unPublishedJobs;
    } catch (e) {
      console.log(e.message);
    }
  }

   async function publishJobsToMasterDb(unPublishedJobs) {
    try {
      let documentId;
      //  1. check if jobs collection exist
      //  2. get master last document details using isLatest
      //  3. if no document then create fresh DB
      //  4. if document id is returned, then insert data in that document or next if required
      //  5. update unPublishedJobs array and return

      //  1. check if jobs collection exist

      let postedJobs = [];
      const latestDocDetails = await getLatestDocumentDetails();
      if (!latestDocDetails["documentIndex"]) {
        console.warn("No Jobs collection exist. Trying to create fresh DB");
        // create fresh DB
        postedJobs = createFreshMasterDb(unPublishedJobs, null);
      } else {
        postedJobs = updateMasterDb(latestDocDetails, unPublishedJobs);
      }

      console.log("document id", latestDocDetails);

      return postedJobs;
    } catch (error) {
      console.log("Error @publishJobsToMasterDb", error.message);
    }
  }

   async function getLatestDocumentDetails() {
    try {
      let latestDocDetails = {};
      await dbMaster
        .collection("jobs")
        .where("_isLatest", "==", true)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            const docData = doc.data();
            latestDocDetails = {
              _jobCount: docData._jobCount,
              documentIndex: doc.id.split("-")[1],
              existingJobs: docData.jobs
            };
          });
        });

      return latestDocDetails;
    } catch (error) {
      console.log("Error @getLatestDocumentID", error.message);
    }
  }
   async function getJobsFromMasterDb() {
    try {
      let masterDbJobs = [];
      await dbMaster
        .collection("jobs")
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            const jobs = doc.data().jobs;

            masterDbJobs.push(...jobs);
          });
        })
        .catch(function(error) {
          console.log("Error getting documents: ", error);
        });

      return masterDbJobs;
    } catch (error) {
      console.log("Error @getJobsFromMasterDb", error.message);
    }
  }
   const reCreateAdminDb =async function reCreateAdminDb() {
    try {
      let masterDbJobs = await getJobsFromMasterDb();

      console.log("Master Db Jobs Counts", masterDbJobs.length);

      insertJobsToAdminDb(masterDbJobs);
    } catch (error) {
      console.log("Error @reCreateAdminDb", error.message);
    }
  }

  function createFreshMasterDb(unPublishedJobs, documentIndex) {
    try {
      // const aggregatedJobs = this.aggregateJobs(unPublishedJobs, jobsPerDocument);
      // let jobPerDoc = jobsPerDocument;

      // let aggregatedJobs = [];
      let publishedJobs = [];
      let docIndex = documentIndex || 0;
      while (unPublishedJobs.length) {
        let newJobs = unPublishedJobs.splice(0, jobsPerDocument);
        let documentId = getDocumentId(docIndex++);
        // dbMaster.collection('jobs_master')

        const isLatestDocument =
          unPublishedJobs.length + jobsPerDocument <= jobsPerDocument;
        newJobs = updateJobDetails(newJobs, documentId, []);
        insertToDb(newJobs, [], documentId, isLatestDocument, true);
        publishedJobs.push(...newJobs);
      }

      // publishedJobs.forEach(job => {
      //   dbMaster.collection('jobs_source').doc(job._docIdInAdmin).set(job);
      // });

      return publishedJobs;
    } catch (error) {
      console.error("Error @createFreshMasterDb", error.message);
    }
  }

  function insertJobsToAdminDb(masterDbJobs) {
    try {
      masterDbJobs.forEach(job => {
        dbMaster
          .collection("_jobsFromMaster")
          .doc(job._docIdInAdmin)
          .set(job);
      });
    } catch (error) {
      console.log("Error @insertJobsToAdminDb", error.message);
    }
  }

  function getDocumentId(documentIndex) {
    return "jobs-" + documentIndex++;
  }

  function updateJobDetails(jobs, documentId, currentJobsInDocument) {
    try {
      return jobs.map((job, idx) => {
        return {
          ...job,
          _masterJobId: {
            docId: documentId,
            index: currentJobsInDocument + idx
          },
          _status: DocumentStatus.PUBLISHED
        };
      });
    } catch (error) {
      console.error("Error @updateJobDetails", error.message);
    }
  }

  function insertToDb(
    newJobs,
    existingJobsInDocument,
    documentId,
    isLatestDocument,
    isNewDocument
  ) {
    try {
      let job = {
        _lastModifiedDate: firebase.firestore.FieldValue.serverTimestamp(),
        _jobCount: newJobs.length + existingJobsInDocument.length,
        _isExpired: false,
        _isLatest: isLatestDocument,
        jobs: [...existingJobsInDocument, ...newJobs]
      };

      if (isNewDocument) {
        job["_createDate"] = firebase.firestore.FieldValue.serverTimestamp();
      }

      dbMaster
        .collection("jobs")
        .doc(documentId)
        .set(job, { merge: true });
    } catch (error) {
      console.error("Error @insertToDb", error.message);
    }
  }

  function updateMasterDb(latestDocDetails, unPublishedJobs) {
    try {
      let publishedJobs = [];
      console.log("latestDocDetails", latestDocDetails);
      let remainingJobsInCurrentDoc =
        jobsPerDocument - latestDocDetails._jobCount;

      if (unPublishedJobs.length < remainingJobsInCurrentDoc) {
        const isLatestDocument =
          unPublishedJobs.length + jobsPerDocument <= jobsPerDocument;
        unPublishedJobs = updateJobDetails(
          unPublishedJobs,
          latestDocDetails.documentIndex,
          latestDocDetails._count
        );
        let documentId = getDocumentId(latestDocDetails.documentIndex);
        insertToDb(
          unPublishedJobs,
          latestDocDetails.existingJobs,
          documentId,
          isLatestDocument,
          false
        );
        publishedJobs.push(...unPublishedJobs);
      } else {
        let newJobs = unPublishedJobs.splice(0, remainingJobsInCurrentDoc);
        let documentId = getDocumentId(latestDocDetails.documentIndex);
        newJobs = updateJobDetails(
          newJobs,
          documentId,
          latestDocDetails._jobCount
        );
        publishedJobs.push(...newJobs);
        insertToDb(
          newJobs,
          latestDocDetails.existingJobs,
          documentId,
          false,
          false
        );

        // documentId = this.getDocumentId(++latestDocDetails.documentIndex);
        newJobs = createFreshMasterDb(
          unPublishedJobs,
          ++latestDocDetails.documentIndex
        );
        publishedJobs.push(...newJobs);
      }
      return publishedJobs;
    } catch (error) {
      console.log("Error @updateMasterDb", error.message);
    }
  }

  export {createMasterDb,reCreateAdminDb};