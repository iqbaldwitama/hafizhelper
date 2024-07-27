import { configureStore } from "@reduxjs/toolkit";
import verseReducer from "./verseSlice";
import verseMadinahReducer from "./verseMadinahSlice";
import logger from "redux-logger";

const store = configureStore({
  reducer: {
    verse: verseReducer,
    verseMadinah: verseMadinahReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
