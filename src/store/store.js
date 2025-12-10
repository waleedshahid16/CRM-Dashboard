import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

// Reducers
import clientsReducer from "./slices/clientsSlice";
import companiesReducer from "./slices/companiesSlice";
import dealsReducer from "./slices/dealsSlice";
import tasksReducer from "./slices/tasksSlice";
import uiReducer from "./slices/uiSlice";

// Persist config
const persistConfig = {
  key: "root",
  version: 1,
  storage,
  whitelist: ["ui"],
};

const rootReducer = combineReducers({
  clients: clientsReducer,
  companies: companiesReducer,
  deals: dealsReducer,
  tasks: tasksReducer,
  ui: uiReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure store
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
