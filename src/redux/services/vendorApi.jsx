import { api } from './api';

export const vendorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllUserByVendor: builder.query({
      query: ({ page, pageSize, search, filterNationality, filterResidence }) => ({
        url: `/vendor/candidates?search=${search}&nationality=${filterNationality}&country_of_residence=${filterResidence}&page=${page}&limit=${pageSize}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: ['Vendor'],
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }),
    addVendor: builder.mutation({
      query: (vendor) => ({
        url: '/vendor/add_candidate',
        method: 'POST',
        body: vendor,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }),
      invalidatesTags: ['Vendor'],
    }),
    importVendor: builder.mutation({
      query: (vendor) => ({
        url: '/vendor/import_candidates',
        method: 'POST',
        body: vendor,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }),
      invalidatesTags: ['Vendor'],
    }),
    sendTestLinkToUser : builder.mutation({
      query:(data) => (
        {
          url:'/vendor/send_candidate_test',
          method:"POST",
          body:data,
          headers:{
            Authorization : `Bearer ${localStorage.getItem('token')}`,
          }
        }
      )
    })
  }),
});

export const { useGetAllUserByVendorQuery, useAddVendorMutation, useSendTestLinkToUserMutation ,useImportVendorMutation } = vendorApi;
