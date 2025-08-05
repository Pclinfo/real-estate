import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const messageApi = createApi({
  reducerPath: 'messageApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL||'http://localhost:8000/api/', // ✅ your base
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem('token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  endpoints: (builder) => ({
    sendMessage: builder.mutation({
      query: (formData) => ({
        url: '/send',
        method: 'POST',
        body: formData,
      }),
    }),
    getMessages: builder.query({
      query: ({ userId, partnerId }) => `/${userId}/${partnerId}`,
    }),
  }),
});

export const { useSendMessageMutation, useGetMessagesQuery } = messageApi;
