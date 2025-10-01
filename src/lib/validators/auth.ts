import { z } from "zod";

export const emailSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "유효한 이메일 주소를 입력해주세요." })
    .max(255),
  token: z
    .string()
    .trim()
    .min(10, { message: "Turnstile 토큰이 필요합니다." }),
});

export const otpVerifySchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "유효한 이메일 주소를 입력해주세요." })
    .max(255),
  otp: z
    .string()
    .regex(/^[0-9]{6}$/g, { message: "6자리 숫자 OTP를 입력해주세요." }),
  token: z
    .string()
    .trim()
    .min(10, { message: "Turnstile 토큰이 필요합니다." }),
});
