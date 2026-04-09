import { api } from './api';

export const SubvendorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    employeeLogin: builder.mutation({
      query: (data) => ({
        url: "/subvendor/login",
        method: "POST",
        body: data,
      }),
    }),
    getOrganisationDetail: builder.query({
      query: () => ({
        url: `/subvendor/organizations`,
        method: "GET",
      }),
    }),
    subVendorResetPassword: builder.mutation({
      query: (data) => ({
        url: `/subvendor/request-password-reset`,
        method: "POST",
        body: data
      })
    }),
    subVendorChangePassword: builder.mutation({
      query: (data) => ({
        url: `/subvendor/change-password`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
    }),
    subVendorResetPasswordApprove: builder.mutation({
      query: (data) => ({
        url: `/subvendor/reset-password`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      })
    }),
    addCandidateBySubVendor: builder.mutation({
      query: (vendor) => ({
        url: '/subvendor/add_candidate',
        method: 'POST',
        body: vendor,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }),
      invalidatesTags: ['Candidates'],
    }),
    importCandidateBySubVendor: builder.mutation({
      query: (vendor) => ({
        url: '/subvendor/import_candidates',
        method: 'POST',
        body: vendor,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        }
      }),
      invalidatesTags: ['Candidates'],
    }),
    getAllCandidatesBySubVendor: builder.query({
      query: ({ page, pageSize, search, filterNationality, filterResidence }) => ({
        url: `/subvendor/candidates?search=${search}&nationality=${filterNationality}&country_of_residence=${filterResidence}&page=${page}&limit=${pageSize}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }),
      providesTags: ['Candidates'],
      keepUnusedDataFor: 300,
      refetchOnMountOrArgChange: false,
      refetchOnFocus: false,
      refetchOnReconnect: false,
    }),
    sendTestLinkToCandidates: builder.mutation({
      query: (data) => (
        {
          url: '/subvendor/send_candidate_test',
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      ),
      invalidatesTags:["Candidates"]

    }),
    resultManagementDetailBySubVendor: builder.query({
      query: (
        {
          limit = 10,
          page = 1,
          search = '',
          minScore = '',
          maxScore = '',
          country = '',
          fromDate = '',
          toDate = '',
        }
      ) => ({
        url: `/subvendor/results`,
        method: "GET",
        params: {
          limit,
          page,
          search,
          min_score: minScore,
          max_score: maxScore,
          country_of_residence: country,
          from_date: fromDate,
          to_date: toDate,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    }),
    viewResultByUserIdBySubVendor: builder.query({
      query: ({ resultId, candidateId }) => ({
        url: `/subvendor/result/specific?result_id=${resultId}&candidate_id=${candidateId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
    }),
    subvendorDashboardApi: builder.query({
      query: () => ({
        url: `/subvendor/dashboard`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        method: "GET"
      })
    }),
    subvendorProfile: builder.query({
      query: () => ({
        url: `/subvendor/profile`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        method: "GET"
      })
    }),
    subVendorLogout:builder.mutation({
      query:() =>({
        url:`/subvendor/logout`,
        method:"POST",
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      })
    })
  })
})

export const { useSubvendorDashboardApiQuery, useResultManagementDetailBySubVendorQuery,useViewResultByUserIdBySubVendorQuery, useEmployeeLoginMutation,useSendTestLinkToCandidatesMutation, useImportCandidateBySubVendorMutation, useAddCandidateBySubVendorMutation, useGetAllCandidatesBySubVendorQuery,
  useSubVendorChangePasswordMutation, useSubVendorResetPasswordMutation,useSubVendorLogoutMutation,useSubVendorResetPasswordApproveMutation,
  useGetOrganisationDetailQuery,useSubvendorProfileQuery, } = SubvendorApi