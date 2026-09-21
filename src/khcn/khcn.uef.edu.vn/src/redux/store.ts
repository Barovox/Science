import { combineReducers, configureStore } from "@reduxjs/toolkit";

import filterReducer from "./slice/filterSlice";
import publishProfileReducer from "./slice/publishProfileSlice";

const rootReducer = combineReducers({
  filter: filterReducer,
  publishProfile: publishProfileReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
