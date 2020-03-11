import * as C from "../constants"

export default  (
    state = {
      isLoggingIn: false,
      isLoggingOut: false,
      isVerifying: false,
      loginError: false,
      logoutError: false,
      isAuthenticated: false,
      user: {},
      companyInfo: {
        "description": "",
        "name": "",
        "id": ""
      },
      companyOperationSuccess: null,
      companyOperationMessage: null,
      companyOperationUpload: false,
      companyPageProgress: false,
      companiesNames: [],
      isAdmin:false,      
      user: {}
    },
    action
  ) => {
    switch (action.type) {
      case C.LOGIN_REQUEST:
        return {
          ...state,
          isLoggingIn: true,
          loginError: false
        };
      case C.LOGIN_SUCCESS:
        return {
          ...state,
          isLoggingIn: false,
          isAuthenticated: true,
          user: action.user,
          isAdmin :(action.user.email.indexOf("admin")>-1)
        };
      case C.LOGIN_FAILURE:
        return {
          ...state,
          isLoggingIn: false,
          isAuthenticated: false,
          loginError: true
        };
      case C.LOGOUT_REQUEST:
        return {
          ...state,
          isLoggingOut: true,
          logoutError: false
        };
      case C.LOGOUT_SUCCESS:
        return {
          ...state,
          isLoggingOut: false,
          isAuthenticated: false,
          user: {}
        };
      case C.LOGOUT_FAILURE:
        return {
          ...state,
          isLoggingOut: false,
          logoutError: true
        };
      case C.VERIFY_REQUEST:
        return {
          ...state,
          isVerifying: true,
          verifyingError: false
        };
      case C.VERIFY_SUCCESS:
        return {
          ...state,
          isVerifying: false
        };
      case C.COMPANY_OPERATION_SUCCESS:
        return {
          ...state,
          companyOperationSuccess: true,
          companyPageProgress: false,
          companyOperationMessage: action.payload.message
        };

        case C.NEW_ADDED_SUCCESS:
          return {
            ...state,
            NewStatus:action.payload.message,

          };

      case C.COMPANY_OPERATION_FAILED:
        return {
          ...state,
          companyOperationSuccess: false,
          companyPageProgress: false,
          companyOperationMessage: action.payload.message
        }; 
      case C.RESET_COMPANY_RELATED_STATES:
        return {
          ...state,
          companyOperationSuccess: null,
          companyPageProgress: false,
          companyOperationMessage: null
        };
      case C.COMPANY_DETAILS_RECEIVED:
        return {
          ...state,
          companyOperationSuccess: true,
          companyPageProgress: false,
          companyInfo: action.payload,
        };
      case C.START_COMPANY_PAGE_PROGRESS:
        return {
          ...state,
          companyPageProgress: true
        };
      case C.RECEIVED_ALL_COMPANIES_NAMES:
        return{
          ...state,
          companyOperationSuccess: true,
          companyPageProgress: false,
          companiesNames: action.payload.companiesName
        };
      case C.EDIT_COMPANY_DESCRIPTION:
        return{
          ...state,
          companyInfo: {...state.companyInfo,description: action.payload.description}
        }
      case C.EDIT_COMPANY_NAME:
        return{
          ...state,
          companyInfo: {...state.companyInfo,name: action.payload.name}
        }
      case C.REMOVE_COMPANY_INFO:
        return{
          ...state,
          companyInfo: {
            "description": "",
            "name": "",
            "id": ""
          }
        }
      default:
        return state;
    }
  };
  