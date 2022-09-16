import { apiSlice } from "../api/apiSlice";
import { userLoggedIn } from "./authSlice";

const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation({
      query: (data) => ({
        url: "/register",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("Auth", JSON.stringify({ accessToken: data.accessToken, user: data.user }));
          dispatch(userLoggedIn({ accessToken: data.accessToken, user: data.user }));
        } catch (err) {}
      },
    }),
    login: builder.mutation({
      query: (data) => ({
        url: "/login",
        method: "POST",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const log = await queryFulfilled;
          console.log(log);
          const { data } = log;
          localStorage.setItem("Auth", JSON.stringify({ accessToken: data.accessToken, user: data.user }));
          dispatch(userLoggedIn({ accessToken: data.accessToken, user: data.user }));
        } catch (err) {}
      },
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation } = authApi;
