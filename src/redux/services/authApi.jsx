import { api } from "./api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (data) => ({
        url: "/vendor/signup",
        method: "POST",
        body: data,
      }),
    }),

    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/vendor/verify-otp",
        method: "POST",
        body: data,
      }),
    }),

    forgotPassword: builder.mutation({
      query: (data) => (
        {
          url: "/vendor/request_password_reset",
          method: "POST",
          body: data,
        }
      )
    }),

    resetAccessCode: builder.mutation({
      query: (data) => (
        {
          url: "/vendor/verify_password_reset_otp",
          method: "POST",
          body: data,
        }
      )
    }),

    resetPassword: builder.mutation({
      query: (data) => (
        {
          url: "/vendor/reset_password",
          method: "POST",
          body: data,
        }
      )
    }),


    resendOtp: builder.mutation({
      query: (data) => ({
        url: "/vendor/resend-otp",
        method: "POST",
        body: data,
      }),
    }),


    login: builder.mutation({
      query: (credentials) => ({
        url: "/vendor/login",
        method: "POST",
        body: credentials,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetAccessCodeMutation,
  useResetPasswordMutation,
  useLoginMutation,
  useLogoutMutation,
} = authApi;
