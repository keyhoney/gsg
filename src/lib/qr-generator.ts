import QRCode from 'qrcode';

/**
 * 문항별 QR 코드 생성 함수
 * @param bookId 교재 ID
 * @param problemId 문항 ID
 * @param size QR 코드 크기 (기본값: 256px)
 * @returns QR 코드 데이터 URL (Base64)
 */
export const generateProblemQR = async (
  bookId: string,
  problemId: string,
  size: number = 256
): Promise<string> => {
  const url = `${window.location.origin}/problem/${bookId}/${problemId}`;
  return QRCode.toDataURL(url, {
    width: size,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    }
  });
};

/**
 * QR 코드 생성 옵션 인터페이스
 */
export interface QRCodeOptions {
  size?: number;
  margin?: number;
  color?: {
    dark?: string;
    light?: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
}

/**
 * 고급 QR 코드 생성 함수
 * @param bookId 교재 ID
 * @param problemId 문항 ID
 * @param options QR 코드 옵션
 * @returns QR 코드 데이터 URL
 */
export const generateAdvancedQR = async (
  bookId: string,
  problemId: string,
  options: QRCodeOptions = {}
): Promise<string> => {
  const url = `${window.location.origin}/problem/${bookId}/${problemId}`;

  const defaultOptions: QRCodeOptions = {
    size: 256,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#FFFFFF'
    },
    errorCorrectionLevel: 'M'
  };

  const mergedOptions = { ...defaultOptions, ...options };

  return QRCode.toDataURL(url, {
    width: mergedOptions.size,
    margin: mergedOptions.margin,
    color: mergedOptions.color,
    errorCorrectionLevel: mergedOptions.errorCorrectionLevel
  });
};

/**
 * QR 코드 미리보기 생성 (작은 크기)
 * @param bookId 교재 ID
 * @param problemId 문항 ID
 * @returns 작은 QR 코드 데이터 URL
 */
export const generatePreviewQR = async (
  bookId: string,
  problemId: string
): Promise<string> => {
  return generateAdvancedQR(bookId, problemId, {
    size: 128,
    margin: 1
  });
};
