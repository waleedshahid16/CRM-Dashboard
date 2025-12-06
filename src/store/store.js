import { configureStore } from "@reduxjs/toolkit";
import clientsReducer from "./slices/clientsSlice";
import companiesReducer from "./slices/companiesSlice";
import dealsReducer from "./slices/dealsSlice";
import tasksReducer from "./slices/tasksSlice";
import uiReducer from "./slices/uiSlice";

const store = configureStore({
  reducer: {
    clients: clientsReducer,
    companies: companiesReducer,
    deals: dealsReducer,
    tasks: tasksReducer,
    ui: uiReducer,
  },
});
export default store;
