import { api } from './api';

export const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllVendor: builder.query({
      query: ({search,status,page,limit}) => (
        {
          url: `/admin/vendors?search=${search}&status=${status}&page=${page}&limit=${limit}`,
          headers:{
            Authorization:`Bearer ${localStorage.getItem('token')}`
          }
        }
      ),
      providesTags:["Admin"]
      
    }),
    deleteUser: builder.mutation({
      query: (id) => ({
        url: `/admin/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Admin'],
    }),
  }),
});

export const { useGetAllUsersQuery, useDeleteUserMutation } = adminApi;
