import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "../features/api/apiSlice";
import authSlice from "../features/auth/authSlice";
import conversationSlice from "../features/conversation/conversationSlice";
import messageSlice from "../features/message/messageSlice";

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: authSlice.reducer,
    coversation: conversationSlice.reducer,
    message: messageSlice.reducer,
  },
  devTools: process.env.NODE_ENV !== "production",
  middleware: (defaultMiddlewares) => defaultMiddlewares().concat(apiSlice.middleware),
});
