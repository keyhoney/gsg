import type { KVNamespace } from "@cloudflare/workers-types";

import {
  OTP_EXPIRY_SECONDS,
  OTP_LENGTH,
  OTP_RATE_LIMIT_MAX,
  OTP_RATE_LIMIT_WINDOW,
} from "@/lib/constants";

const OTP_PREFIX = "otp:";
const OTP_RATE_PREFIX = "otp-rate:";

export interface OtpRecord {
  otp: string;
  expiresAt: number;
}

export const generateOtp = () => {
  const min = 10 ** (OTP_LENGTH - 1);
  const max = 10 ** OTP_LENGTH - 1;
  return String(Math.floor(Math.random() * (max - min + 1)) + min);
};

export const storeOtp = async (kv: KVNamespace, email: string, otp: string) => {
  const key = `${OTP_PREFIX}${email}`;
  const record: OtpRecord = {
    otp,
    expiresAt: Math.floor(Date.now() / 1000) + OTP_EXPIRY_SECONDS,
  };
  await kv.put(key, JSON.stringify(record), { expirationTtl: OTP_EXPIRY_SECONDS });
};

const timingSafeEqual = async (a: string, b: string) => {
  const encoder = new TextEncoder();
  const aBytes = encoder.encode(a);
  const bBytes = encoder.encode(b);
  if (aBytes.length !== bBytes.length) return false;

  const hashA = await crypto.subtle.digest("SHA-256", aBytes);
  const hashB = await crypto.subtle.digest("SHA-256", bBytes);
  const aView = new Uint8Array(hashA);
  const bView = new Uint8Array(hashB);

  let diff = 0;
  for (let i = 0; i < aView.length; i++) {
    diff |= aView[i] ^ bView[i];
  }
  return diff === 0;
};

export const validateOtp = async (kv: KVNamespace, email: string, otp: string) => {
  const key = `${OTP_PREFIX}${email}`;
  const raw = await kv.get(key);
  if (!raw) return false;

  const record = JSON.parse(raw) as OtpRecord;
  if (record.expiresAt < Math.floor(Date.now() / 1000)) return false;
  return timingSafeEqual(record.otp, otp);
};

export const clearOtp = (kv: KVNamespace, email: string) => kv.delete(`${OTP_PREFIX}${email}`);

export const isRateLimited = async (kv: KVNamespace, email: string) => {
  const key = `${OTP_RATE_PREFIX}${email}`;
  const count = Number((await kv.get(key)) ?? "0");
  if (count >= OTP_RATE_LIMIT_MAX) return true;
  await kv.put(key, String(count + 1), { expirationTtl: OTP_RATE_LIMIT_WINDOW });
  return false;
};
