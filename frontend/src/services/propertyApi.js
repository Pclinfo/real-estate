// src/features/api/propertyApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const propertyApi = createApi({
  reducerPath: 'propertyApi',
  baseQuery: fetchBaseQuery({
    // baseUrl: 'http://localhost:8000/api',
    baseUrl:import.meta.env.VITE_API_BASE_URL_PROPERTIES||'http://localhost:8000/api',
    prepareHeaders: (headers, { getState }) => {
  const state = getState();
  const token = state.user.token // safe access

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  return headers;
}
  }),
  endpoints: (builder) => ({
    createProperty: builder.mutation({
      query: (formData) => ({
        url: '/properties',
        method: 'POST',
        body: formData
      })
    }),
     
   getFilteredProperties: builder.query({
  query: (params) => {
    const searchParams = new URLSearchParams(params).toString();
    return `/properties/filter?${searchParams}`;
  },
  providesTags: ["Property"]
}),
  toggleLikeProperty: builder.mutation({
  query: ({ propertyId, userId }) => ({
    url: `/properties/${propertyId}/like`,
    method: "PUT",
    body: { user_id: userId },
  }),
  invalidatesTags: ["Property"],
}),
    
  })
});

export const { useCreatePropertyMutation ,useGetFilteredPropertiesQuery ,useToggleLikePropertyMutation } = propertyApi;
 