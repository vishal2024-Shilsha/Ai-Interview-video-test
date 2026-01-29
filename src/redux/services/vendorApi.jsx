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
    sendTestLinkToUser: builder.mutation({
      query: (data) => (
        {
          url: '/vendor/send_candidate_test',
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          }
        }
      )
    }),
    getVendorProfile: builder.query({
      query: () => ({
        url: `/vendor/profile`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      providesTags: ['VendorProfile'],
    }),
    updateVendorProfile: builder.mutation({
      query: (data) => ({
        url: `/vendor/profile`,
        method: "PUT",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      invalidatesTags: ["VendorProfile"]
    }),
    addCompanyProfile: builder.mutation({
      query: (data) => ({
        url: `/vendor/company`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      invalidatesTags: ['VendorProfile'],
    }),
    updateCompanyProfile: builder.mutation({
      query: (data) => ({
        url: `/vendor/company`,
        method: "PUT",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      invalidatesTags: ['VendorProfile'],
    }),
    addBranchDetails: builder.mutation({
      query: (data) => ({
        url: `/vendor/company/branch`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      invalidatesTags: ['VendorProfile'],
    }),
    updateBranchDetails: builder.mutation({
      query: ({ id, formdata }) => ({
        url: `/vendor/company/branch/${id}`,
        method: "PUT",
        body: formdata,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      invalidatesTags: ['VendorProfile'],
    }),
    deleteBranchDetails: builder.mutation({
      query: (id) => ({
        url: `/vendor/company/branch/${id}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      }),
      invalidatesTags: ['VendorProfile'],
    }),
    getSubscriptionDetail: builder.query({
      query: (param) => ({
        url: `/vendor/subscriptions?selection=${param ?? ''}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    }),
    selectVendorSubscription: builder.mutation({
      query: (data) => ({
        url: `/vendor/select_plan`,
        method: "POST",
        body: data,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    }),
    viewSubscriptionList: builder.query({
      query: () => ({
        url: `/vendor/get_plans`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })
    }),
    vendorDashboardApi: builder.query({
      query: () => ({
        url: `/vendor/dashboard`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        method: "GET"
      })
    }),
    // api relted to result-mangement..
    resultManagementData: builder.query({
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
        url: `/vendor/results`,
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
    viewResultByUserId: builder.query({
      query: ({ resultId, candidateId }) => ({
        url: `/vendor/result/specific?result_id=${resultId}&candidate_id=${candidateId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
      })
    }),
    downloadCandidateResult: builder.mutation({
      query: ({ resultId, format = "pdf" }) => ({
        url: `/vendor/result/download?result_id=${resultId}&format=${format}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        responseHandler: async (response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }
          return await response.blob();
        },
      })
    })
  }),
});

export const { useGetAllUserByVendorQuery, useAddVendorMutation,
  useSendTestLinkToUserMutation, useImportVendorMutation,
  useGetVendorProfileQuery, useUpdateVendorProfileMutation, useAddCompanyProfileMutation,
  useUpdateCompanyProfileMutation, useAddBranchDetailsMutation, useDeleteBranchDetailsMutation,
  useUpdateBranchDetailsMutation, useGetSubscriptionDetailQuery, useLazyGetSubscriptionDetailQuery,
  useSelectVendorSubscriptionMutation, useViewSubscriptionListQuery, useVendorDashboardApiQuery,
  useResultManagementDataQuery, useViewResultByUserIdQuery, useDownloadCandidateResultMutation
} = vendorApi;
