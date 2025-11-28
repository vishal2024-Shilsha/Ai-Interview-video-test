import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API instance
const base = import.meta.env.VITE_BASE_URL;

export const api = createApi({
  reducerPath: 'api', // single slice in store
  baseQuery: fetchBaseQuery({
    baseUrl: `${base}`, 
  }),
  tagTypes: ['Auth', 'User', 'Admin', 'Vendor'],
  endpoints: () => ({}), // endpoints will be injected
});
