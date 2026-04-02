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
    adminForgotPassword: builder.mutation({
      query: (data) => (
        {
          url: "/admin/request-password-reset",
          method: "POST",
          body: data,
        }
      )
    }),
    adminResetAccessCode: builder.mutation({
      query: (data) => (
        {
          url: "/admin/verify-otp",
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

    adminResetPassword: builder.mutation({
      query: (data) => (
        {
          url: "/admin/reset-password",
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
    adminResendOtp: builder.mutation({
      query: (data) => ({
        url: "/admin/resend-password-reset-otp",
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
  }),
});

export const {
  useSignupMutation,
  useAdminResendOtpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetAccessCodeMutation,
  useResetPasswordMutation,
  useLoginMutation,
  useAdminForgotPasswordMutation,
  useAdminResetAccessCodeMutation,
  useAdminResetPasswordMutation
} = authApi;
