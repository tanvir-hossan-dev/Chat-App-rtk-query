import { apiSlice } from "../api/apiSlice";

const messageApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getmessages: builder.query({
      query: (id) => `messages?conversationId=${id}&_sort=timestamp&_order=desce&_page=1&_limit=5`,
    }),
    addMessage: builder.mutation({
      query: (data) => ({
        url: "/messages",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { useGetmessagesQuery, useAddMessageMutation } = messageApi;

// getConversation: builder.query({
//   query: ({ userEmail, participentEmail }) =>
//     `conversations?participants_like=${userEmail}-${participentEmail}
//     &&participants_like=${participentEmail}-${userEmail}`,
// }),
// addConversation: builder.mutation({
//   query: (data) => ({
//     url: "/conversations",
//     method: "POST",
//     body: data,
//   }),
// }),
// editConversation: builder.mutation({
//   query: ({ data, id }) => ({
//     url: `/conversations/${id}`,
//     method: "PATCH",
//     body: data,
//   }),
// }),
