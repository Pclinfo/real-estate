// src/services/cityApi.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const cityApi = createApi({
  reducerPath: 'cityApi',
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_BASE_URL||'http://localhost:8000/api/' }),
  endpoints: (builder) => ({
    getCities: builder.query({
      query: (address) => `cities?name=${encodeURIComponent(address)}`,
    }),
  }),
});

export const { useGetCitiesQuery } = cityApi;
