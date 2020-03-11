import {
  todosRef,
  getLastRecordRef,
  Timestamp,
  resultsRef,
  admitCardsRef,
  firebaseAppAuth,
  companiesRef,
  newsRef
} from "../firebase";
import { DocumentStatus, ENV, COLLECTIONS } from "../constants";
import { createDb } from "../ImportFiles";
import { updateJobSEO } from "./seo";
import * as C from "../constants";

const FETCH_JOBS = "FETCH_JOBS";
const FETCH_ADMITCARDS = "FETCH_ADMITCARDS";
const FETCH_RESULTS = "FETCH_RESULTS";

const changeCategories = d => {
  if (d.categories) {
    d.categories = d.categories.map(i => i.value);
  }
};

const normalizeDate = doc => {
  try {
    Object.keys(doc).map(i => {
      var k = doc[i];
      if (/date/gi.test(i)) {
        if (typeof k == "string") {
          doc[i] = new Date(k).toISOString();
        }
      }
      if (typeof k == "object") {
        if (k.toDate && i !== "_createdDate") {
          doc[i] = k.toDate().toISOString();
        } else {
          normalizeDate(k);
        }
      }
    });
  } catch (e) {
    console.log("error @ date parsing", e);
  }

  return doc;
};

const normalizeData = job => {
  changeCategories(job);
  // updateJobSEO(job);
  normalizeDate(job);
  return job;
};
const updateVacancies = job => {
  let vacancies = job.vacancyDetail || [];
  job.vacancyDetail = vacancies.map((i, j) => {
    return {
      ...i,
      _id: j + 1
    };
  });
  return job;
};
const updateDocId = async (document, collectionName) => {
  let doc = await getLastRecordRef(collectionName).get();
  if (doc.size) {
    return { ...document, _id: ++doc.docs[0].data()._id };
  }
  return { ...document, _id: 1 };
};
export const addToDo = newToDo => async dispatch => {
  if (!newToDo) {
    dispatch({
      type: "ENTRY_UPDATE_FAILED",
      payload: newToDo
    });
    return;
  } else {
    let job = await updateDocId(newToDo, COLLECTIONS.JOBS);

    todosRef
      .add({
        ...normalizeData(updateVacancies(job)),
        _createdBy: firebaseAppAuth.currentUser.email,
        _createdDate: Timestamp()
      })
      .then(i => {
        createDb({ envName: ENV.PREVIEW, collectionName: COLLECTIONS.JOBS });
        dispatch({
          type: "ENTRY_UPDATE_SUCCESS",
          payload: i.id
        });
      });
  }
};
export const resetCompanyStates = () => dispatch => {
  dispatch({
    type: C.RESET_COMPANY_RELATED_STATES
  });
};
export const createCompany = company => async dispatch => {
  dispatch({
    type: C.START_COMPANY_PAGE_PROGRESS
  });
  var docRef = companiesRef.where("name", "==", company.name);
  docRef
    .get()
    .then(function(snapshot) {
      if (snapshot.empty) {
        companiesRef
          .add(company)
          .then(function() {
            dispatch({
              type: C.COMPANY_OPERATION_SUCCESS,
              payload: {
                message: "COMPANY_ADDED"
              }
            });
          })
          .catch(function(error) {
            dispatch({
              type: C.COMPANY_OPERATION_FAILED,
              payload: { message: error }
            });
          });
      } else {
        dispatch({
          type: C.COMPANY_OPERATION_FAILED,
          payload: {
            message: "COMPANY_ALREADY_EXISTS"
          }
        });
      }
    })
    .catch(function(error) {
      dispatch({
        type: C.COMPANY_OPERATION_FAILED,
        payload: { message: error }
      });
    });
};

export const addNew = New => async dispatch => {
  dispatch({
    type: C.START_COMPANY_PAGE_PROGRESS
  });
  // var docRef = newsRef.where("ne", "==", company.name);
  var docRef = newsRef;
  docRef
    .add({
      New,
      // _createdBy: firebaseAppAuth.currentUser.email,
      _createdDate: Timestamp()
    }) .then(function() {
      dispatch({
        type: C.NEW_ADDED_SUCCESS,
        payload: {
          message: "NEWS_ADDED"
        }
      });
})
}

// export const addNew = New => async dispatch => {
//   dispatch({
//     type: C.START_COMPANY_PAGE_PROGRESS
//   });
//   var docRef = newsRef.where("name", "==", New.name);
//   docRef.get().then(function(document) {
//     if (document.exists) {
//       docRef.update(New).then(function() {});
//     } else {
//       docRef
//         .add({
//           New,
//           // _createdBy: firebaseAppAuth.currentUser.email,
//           _createdDate: Timestamp()
//         })
//         .then(function() {
//           dispatch({
//             type: C.NEW_ADDED_SUCCESS,
//             payload: {
//               message: "NEWS_ADDED"
//             }
//           });
//         });
//     }
//   });
//   // var docRef = newsRef;
// };

export const readCompany = companyName => dispatch => {
  dispatch({
    type: C.START_COMPANY_PAGE_PROGRESS
  });
  var docRef = companiesRef.where("name", "==", companyName);
  docRef
    .get()
    .then(function(snapshot) {
      if (snapshot.empty) {
        dispatch({
          type: C.COMPANY_OPERATION_FAILED,
          payload: { message: "COMPANY_NOT_FOUND" }
        });
      } else {
        let payload = {
          id: snapshot.docs[0].id,
          name: snapshot.docs[0].data().name,
          description: snapshot.docs[0].data().description
        };
        dispatch({
          type: C.COMPANY_DETAILS_RECEIVED,
          payload: payload
        });
      }
    })
    .catch(function(error) {
      dispatch({
        type: C.COMPANY_OPERATION_FAILED,
        payload: { message: error }
      });
    });
};
export const getAllCompanies = () => dispatch => {
  dispatch({
    type: C.START_COMPANY_PAGE_PROGRESS
  });
  companiesRef
    .get()
    .then(function(snapshot) {
      let companiesName = [];
      snapshot.forEach(doc => {
        companiesName.push({ value: doc.data().name, label: doc.data().name });
      });
      dispatch({
        type: C.RECEIVED_ALL_COMPANIES_NAMES,
        payload: { companiesName: companiesName }
      });
    })
    .catch(function(error) {
      dispatch({
        type: C.COMPANY_OPERATION_FAILED,
        payload: { message: error }
      });
    });
};
export const editCompany = company => dispatch => {
  dispatch({
    type: C.START_COMPANY_PAGE_PROGRESS
  });
  var docRef = companiesRef.doc(company.id);
  docRef
    .get()
    .then(function(document) {
      if (document.exists) {
        let editedCompany = {
          name: company.name,
          description: company.description
        };
        docRef
          .update(editedCompany)
          .then(function() {
            dispatch({
              type: C.COMPANY_OPERATION_SUCCESS,
              payload: { message: "COMPANY_DETAILS_EDITED" }
            });
          })
          .catch(function(error) {
            dispatch({
              type: C.COMPANY_OPERATION_FAILED,
              payload: { message: error }
            });
          });
      } else {
        dispatch({
          type: C.COMPANY_OPERATION_FAILED,
          payload: { message: "COMPANY_NOT_FOUND" }
        });
      }
    })
    .catch(function(error) {
      dispatch({
        type: C.COMPANY_OPERATION_FAILED,
        payload: { message: error }
      });
    });
};
export const editCompanyDescription = description => dispatch => {
  dispatch({
    type: C.EDIT_COMPANY_DESCRIPTION,
    payload: { description: description }
  });
};
export const editCompanyName = name => dispatch => {
  dispatch({
    type: C.EDIT_COMPANY_NAME,
    payload: { name: name }
  });
};
export const removeCompanyInfo = () => dispatch => {
  dispatch({
    type: C.REMOVE_COMPANY_INFO
  });
};
export const addAdmitCard = newAdmitCard => async dispatch => {
  let admitCard = await updateDocId(newAdmitCard, COLLECTIONS.ADMITCARD);
  admitCardsRef
    .add({
      ...normalizeDate(admitCard),
      _createdBy: firebaseAppAuth.currentUser.email,
      _createdDate: Timestamp()
    })
    .then(i => {
      createDb({ envName: ENV.PREVIEW, collectionName: COLLECTIONS.ADMITCARD });
      dispatch({
        type: "ENTRY_UPDATE_SUCCESS",
        payload: i.id
      });
    });
};
export const addResult = newRes => async dispatch => {
  let result = await updateDocId(newRes, COLLECTIONS.RESULT);

  resultsRef
    .add({
      ...normalizeDate(result),
      _createdBy: firebaseAppAuth.currentUser.email,
      _createdDate: Timestamp()
    })
    .then(i => {
      createDb({ envName: ENV.PREVIEW, collectionName: COLLECTIONS.RESULT });
      dispatch({
        type: "ENTRY_UPDATE_SUCCESS",
        payload: i.id
      });
    });
};
export const completeToDo = completeToDo => async dispatch => {
  todosRef.child(completeToDo).remove();
};
export const setSelected = index => dispatch => {
  dispatch({
    type: "SELECTED_JOB",
    payload: index
  });
};
export const setLocations = index => dispatch => {
  dispatch({
    type: "LOCATIONS",
    payload: index
  });
};
export const setJobsList = list => dispatch => {
  dispatch({
    type: "SET_JOBS",
    payload: list
  });
};

export const editJob = (jobid, data) => dispatch => {
  todosRef
    .doc(jobid)
    .update(normalizeData(data))
    .then(i => {
      dispatch({
        type: "ENTRY_EDIT_SUCCESS",
        payload: jobid
      });
    });
};
export const fetchToDos = () => (dispatch, getState) => {
  const isAdmin = getState().auth.isAdmin;
  const filter = isAdmin
    ? [
        DocumentStatus.VERIFICATION_PENDING,
        DocumentStatus.PUBLISHED,
        DocumentStatus.NONE,
        DocumentStatus.VERIFIED,
        DocumentStatus.ERROR
      ]
    : [
        DocumentStatus.VERIFICATION_PENDING,
        DocumentStatus.NONE,
        DocumentStatus.ERROR
      ];

  todosRef.onSnapshot(querySnapshot => {
    onFetchCollectionUpdate(querySnapshot, dispatch, FETCH_JOBS);
  });
};

//get All the Admit Cards
export const fetchAdmitCards = () => dispatch => {
  admitCardsRef.onSnapshot(querySnapshot => {
    onFetchCollectionUpdate(querySnapshot, dispatch, FETCH_ADMITCARDS);
  });
};

//get All the Results
export const fetchAllResults = () => dispatch => {
  resultsRef.onSnapshot(querySnapshot => {
    onFetchCollectionUpdate(querySnapshot, dispatch, FETCH_RESULTS);
  });
};

const onFetchCollectionUpdate = (querySnapshot, dispatch, action) => {
  let collection = [];

  querySnapshot.forEach(doc => {
    collection.push({ id: doc.id, data: doc.data() });
  });
  dispatch({
    type: action,
    payload: collection
  });
};

export * from "./auth";
