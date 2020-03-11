export const LOGIN_REQUEST = "LOGIN_REQUEST";
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAILURE = "LOGIN_FAILURE";
export const LOGOUT_REQUEST = "LOGOUT_REQUEST";
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS";
export const LOGOUT_FAILURE = "LOGOUT_FAILURE";
export const VERIFY_REQUEST = "VERIFY_REQUEST";
export const VERIFY_SUCCESS = "VERIFY_SUCCESS";
export const RESET_COMPANY_RELATED_STATES = "RESET_COMPANY_RELATED_STATES";
export const COMPANY_OPERATION_SUCCESS = "COMPANY_OPERATION_SUCCESS";
export const NEW_ADDED_SUCCESS = "NEW_ADDED_SUCCESS"
export const COMPANY_OPERATION_FAILED = "COMPANY_OPERATION_FAILED";
export const COMPANY_DETAILS_RECEIVED = "COMPANY_DETAILS_RECEIVED";
export const START_COMPANY_PAGE_PROGRESS = "START_COMPANY_PAGE_PROGRESS";
export const RECEIVED_ALL_COMPANIES_NAMES = "RECEIVED_ALL_COMPANIES_NAMES";
export const EDIT_COMPANY_DESCRIPTION = "EDIT_COMPANY_DESCRIPTION";
export const EDIT_COMPANY_NAME = "EDIT_COMPANY_NAME";
export const REMOVE_COMPANY_INFO = "REMOVE_COMPANY_INFO";
export const DocumentStatus = {
    NONE : 'none',
    VERIFICATION_PENDING : 'verification-pending',
    VERIFIED : 'verified',
    ERROR : 'error',
    PUBLISHED : 'published',
    UPDATED : 'updated', //To be used in future when we update a job. E.g. result update
  }

  export const ENV = {
    ADMIN:"admin",
    MASTER:"master",
    DEV:"dev",
    PREVIEW:"preview",
    STAGING:"staging",
    PROD:"prod"
  }

  export const COLLECTIONS = {
   JOBS:"jobs",
   ADMITCARD:"admitCards",
   RESULT:"results",
   CATEGORIES:"categories",
   COMPANIES:"companies",
   LOGOS:"logos"
  }