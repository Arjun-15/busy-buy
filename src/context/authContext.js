import {
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { createContext, useContext, useReducer } from "react";

const AuthContext = createContext();

export const useAuthContext = () => {
  const value = useContext(AuthContext);
//   console.log(value);
  return value;
};
// reducer function export default
const AuthReducer = (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        error: false,
        loading: false,
      };
    case LOGOUT:
      return {
        user: null,
        error: false,
        message: action.payload,
        loading: false,
      };
    case LOGIN_FAIL:
      return {
        user: null,
        error: true,
        message: action.payload,
        loading: false,
      };
    case SET_AUTH_USER:
      return {
        ...state,
        user: action.payload,
      };
    case CLEAR_ERROR_MESSAGE:
      return {
        ...state,
        error: false,
        message: "",
      };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        user: action.payload,
        error: false,
        loading: false,
      };
    case SIGNUP_FAIL:
      return {
        ...state,
        error: true,
        message: action.payload,
        loading: false,
      };
    case TOGGLE_LOADING:
      return {
        ...state,
        loading: !state.loading,
      };
    default:
      return state;
  }
};

export const AuthContextProvider = ({ children }) => {
  const auth = getAuth();
  const initialState = {
    user: null,
    error: false,
    message: "",
    loading: false,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  const setAuthUser = (user) => {
    dispatch({ type: SET_AUTH_USER, payload: user });
  };

  const login = async (email, password) => {
    dispatch({ type: TOGGLE_LOADING });
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      console.log(res);
      dispatch({ type: LOGIN_SUCCESS, payload: res.user });
    } catch (error) {
      dispatch({
        type: LOGIN_FAIL,
        payload: error.message.split(": ")[1],
      });
    }
  };

  const signup = async (formData) => {
    dispatch({ type: TOGGLE_LOADING });
    try {
      const { name, email, password } = formData;

      const res = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(auth.currentUser, {
        displayName: name,
      });

      dispatch({ type: SIGNUP_SUCCESS, payload: res.user });
    } catch (error) {
      console.log(error);
      dispatch({
        type: SIGNUP_FAIL,
        payload: error.message.split(": ")[1],
      });
    }
  };
  const logout = async () => {
    try {
      await signOut(auth);
      dispatch({ type: LOGOUT, payload: "Signed out successfully!" });
    } catch (error) {
      dispatch({ type: CLEAR_ERROR_MESSAGE });
    }
  };

  const clearError = () => {
    dispatch({ type: CLEAR_ERROR_MESSAGE });
  };

  const changeLoadingState = () => {
    dispatch({ type: TOGGLE_LOADING });
  };

  const value = {
    user: state.user,
    message: state.message,
    error: state.error,
    loading: state.loading,
    login,
    logout,
    signup,
    clearError,
    setAuthUser,
    changeLoadingState,
  };

  // console.log("AuthContext Value: ", value); // Log the context value

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// auth type
export const LOGIN_SUCCESS = "LOGIN_SUCCESS";
export const LOGIN_FAIL = "LOGIN_FAIL";
export const LOGOUT = "LOGOUT";
export const CLEAR_ERROR_MESSAGE = "CLEAR_ERROR_MESSAGE";
export const SIGNUP_FAIL = "SIGNUP_FAIL";
export const SIGNUP_SUCCESS = "SIGNUP_SUCCESS";
export const TOGGLE_LOADING = "TOGGLE_LOADING";
export const SET_AUTH_USER = "SET_AUTH_USER";
