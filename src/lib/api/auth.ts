import { api } from "./client";

export interface RequestOtpResponse {
  ok: true;
  message: string;
}

export interface VerifyOtpResponse {
  ok: true;
  redirect: string;
}

export interface SessionResponse {
  authenticated: boolean;
  email?: string;
}

export const requestOtp = (email: string, token: string) =>
  api.post("auth/otp/request", { json: { email, token } }).json<RequestOtpResponse>();

export const verifyOtp = (email: string, otp: string, token: string) =>
  api.post("auth/otp/verify", { json: { email, otp, token } }).json<VerifyOtpResponse>();

export const getSession = () => api.get("auth/session").json<SessionResponse>();
