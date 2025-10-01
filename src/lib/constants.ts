export const OTP_LENGTH = 6;
export const OTP_EXPIRY_SECONDS = 5 * 60; // 5분
export const OTP_RATE_LIMIT_MAX = 5;
export const OTP_RATE_LIMIT_WINDOW = 60 * 60; // 1시간

export const CHALLENGE_PASS_COUNT = 2;
export const CHALLENGE_QUESTIONS_COUNT = 3;
export const ENTITLEMENT_DURATION_DAYS = 90;

// 개발/테스트 모드 설정
// 테스트 중이므로 인증을 우회합니다
export const DEV_MODE = true; // 실제 배포 시 false로 변경
export const SKIP_AUTH_IN_DEV = true; // 테스트 시 true로 설정하면 인증 우회