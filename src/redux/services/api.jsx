import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API instance
export const base = import.meta.env.VITE_BASE_URL;
const baseQueryWith401Handling = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);
  
  if ((result?.error?.status === 401 || result?.error?.status ===403) && (window.location.pathname !== "/" && window.location.pathname !=='/admin-login')) {
    // ✅ Clear storage
    localStorage.clear();
    sessionStorage.clear();

    // ✅ Redirect to login
    window.location.replace("/");
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api', 
  baseQuery:baseQueryWith401Handling,
  tagTypes: ['Auth', 'User', 'Admin', 'Vendor'],
  endpoints: () => ({}), // endpoints will be injected
});


const rawBaseQuery = fetchBaseQuery({
  baseUrl: base,
  credentials: "include",
});


