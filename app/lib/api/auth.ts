export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  confirmPassword: string;
}

export const authApi = {
  forgotPassword: (data: ForgotPasswordRequest) => {
    return $api("/auth/forgot-password", {
      method: "POST",
      body: data,
    });
  },
  resetPassword: (data: ResetPasswordRequest) => {
    return $api("/auth/reset-password", {
      method: "POST",
      body: data,
    });
  },
};
