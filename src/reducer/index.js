import { authReducer } from "./auth";
import { combineReducers } from "redux";

const allReducer = combineReducers({
  authReducer: authReducer,
});

export default allReducer;
