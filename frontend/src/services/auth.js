import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "http://localhost:8000/api/auth",
    baseUrl:import.meta.env.VITE_API_BASE_URL|| "http://localhost:8000/api/auth",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().user.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    sendOtp: builder.mutation({
      query: (data) => ({
        url: "otp/send",
        method: "POST",
        body: data,
        headers: { "Content-Type": "application/json" },
      }),
    }),
    verifyOtp: builder.mutation({
      query: ({ phone, otp }) => ({
        url: "otp/verify",
        method: "POST",
        body: { phone, otp },
        headers: { "Content-Type": "application/json" },
      }),
    }),
    signup: builder.mutation({
      query: (userData) => ({
        url: "signup",
        method: "POST",
        body: userData,
      }),
    }),
    login: builder.mutation({
      query: (credentials) => ({
        url: "login",
        method: "POST",
        body: credentials,
      }),
    }),
     loginAdmin: builder.mutation({
      query: (data) => ({
        url: "admin-login",
        method: "POST",
        body: data,
      }),
    }),
    loginSuperAdmin: builder.mutation({
      query: (data) => ({
        url: "superadmin-login",
        method: "POST",
        body: data,
      }),
    }),
    updateProfile: builder.mutation({
      query: (formData) => ({
        url: `update`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["User"],
    }),
    getProfile: builder.query({
      query: () => "/profile/getprofile",
      providesTags: ["User"],
    }),
     sendOtpResetPassword: builder.mutation({
      query: (data) => ({
        url: "password-reset/send-otp",
        method: "POST",
        body: data, // { email, role }
      }),}),
      resetPassword: builder.mutation({
      query: (data) => ({
        url: "password-reset/reset-password",
        method: "POST",
        body: data, // { email, role, otp, newPassword }
      }),
    }),
  }),
});

export const {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useSignupMutation,
  useLoginMutation,
  useUpdateProfileMutation,
  useGetProfileQuery,
  useLoginSuperAdminMutation,
  useLoginAdminMutation ,
  useResetPasswordMutation,
  useSendOtpResetPasswordMutation
} = authApi;
