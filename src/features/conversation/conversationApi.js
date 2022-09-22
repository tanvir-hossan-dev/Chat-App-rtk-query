import { apiSlice } from "../api/apiSlice";

const conversationApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (email) => `conversations?participants_like=${email}&_sort=timestamp&_order=desce&_page=1&_limit=5`,
    }),
    getConversation: builder.query({
      query: ({ userEmail, participentEmail }) =>
        `conversations?participants_like=${userEmail}-${participentEmail}
        &&participants_like=${participentEmail}-${userEmail}`,
    }),
    addConversation: builder.mutation({
      query: (data) => ({
        url: "/conversations",
        method: "POST",
        body: data,
      }),
    }),
    editConversation: builder.mutation({
      query: ({ data, id }) => ({
        url: `/conversations/${id}`,
        method: "PATCH",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useGetConversationQuery,
  useAddConversationMutation,
  useEditConversationMutation,
} = conversationApi;

export default conversationApi;
