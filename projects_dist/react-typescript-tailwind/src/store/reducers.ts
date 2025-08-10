import { combineReducers } from "redux";
import { reducer as notificationsReducer } from "./slices/notifications";
import { reducer as userReducer } from "./slices/user";
const appReducer = combineReducers({
  notifications: notificationsReducer,
  user: userReducer,
});
export const rootReducer: typeof appReducer = (state, action) => {
  if (action.type === "USER_LOGOUT") {
    // Resets the store on "USER_LOGOUT" action
    return appReducer(undefined, action);
  }
  return appReducer(state, action);
};

export type RootState = ReturnType<typeof rootReducer>;
