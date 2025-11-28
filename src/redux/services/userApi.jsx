import { api } from './api';

export const userApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: ({id,token}) => {
        console.log("Fetching profile for ID:", token);
        return {
          url: `/candidate/details?candidate_id=${id}`,
          method: "GET",
          headers:{
            'X-Custom-Header' : `candidate_session=${token}`
          }
          // credentials: "include", // <-- only getProfile sends cookies
        };
      },
      providesTags: ["User"],
    }),
    verifyUserOtp: builder.mutation({
      query: (data) => ({
        url: '/candidate/verify_otp',
        method: 'POST',
        body: data,
      }),
    }),
    cookiesGenerate: builder.query({
      query: ({ candidate_id, token }) => ({
        url: `/candidate/start_test?candidate_id=${candidate_id}&token=${token}`,
        method: "GET",
        // no credentials here either
      }),
    }),
    uploadTest:builder.mutation({
      query:(data) => ({
        url:`/candidate/upload_test`,
        method:"POST",
        body:data
      })
    })
  }),
});

export const {
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useVerifyUserOtpMutation,
  useCookiesGenerateQuery,
  useUploadTestMutation
} = userApi;
