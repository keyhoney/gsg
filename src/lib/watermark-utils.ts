// Web Crypto API를 사용하여 해시 생성
const createHash = (algorithm: string) => ({
  update: (data: string) => ({
    digest: (encoding: string) => {
      const encoder = new TextEncoder();
      const dataBuffer = encoder.encode(data);
      return crypto.subtle.digest(algorithm, dataBuffer).then(hashBuffer => {
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      });
    }
  })
});

/**
 * 사용자 이메일을 기반으로 워터마크 해시 생성
 */
export const generateUserWatermark = async (email: string): Promise<string> => {
  const timestamp = Math.floor(Date.now() / 1000);
  const data = `${email}-${timestamp}`;
  const hash = await createHash("SHA-256").update(data).digest("hex");
  return hash.substring(0, 16);
};

/**
 * 워터마크 텍스트 생성
 */
export const createWatermarkText = async (email: string, sessionId?: string): Promise<string> => {
  const userHash = await generateUserWatermark(email);
  const timestamp = new Date().toISOString().split("T")[0];
  return `${userHash}@${timestamp}${sessionId ? `-${sessionId.substring(0, 8)}` : ""}`;
};

/**
 * 다중 위치 워터마크 생성
 */
export const generateWatermarkPositions = (containerWidth: number, containerHeight: number) => {
  const positions = [];
  const spacing = 200; // 워터마크 간격
  
  for (let x = 0; x < containerWidth; x += spacing) {
    for (let y = 0; y < containerHeight; y += spacing) {
      positions.push({
        x: x + Math.random() * 50, // 약간의 랜덤 오프셋
        y: y + Math.random() * 50,
        rotation: Math.random() * 360,
        opacity: 0.1 + Math.random() * 0.1, // 0.1 ~ 0.2
      });
    }
  }
  
  return positions;
};

/**
 * 워터마크 스타일 생성
 */
export const createWatermarkStyle = (text: string, position: any) => {
  return {
    position: "absolute" as const,
    left: `${position.x}px`,
    top: `${position.y}px`,
    transform: `rotate(${position.rotation}deg)`,
    opacity: position.opacity,
    fontSize: "12px",
    color: "#666",
    fontFamily: "monospace",
    pointerEvents: "none" as const,
    userSelect: "none" as const,
    zIndex: 1000,
    whiteSpace: "nowrap" as const,
  };
};

/**
 * 워터마크 감지 및 제거 방지
 */
export const protectWatermark = (element: HTMLElement) => {
  // CSS pseudo-element로 워터마크 추가
  const style = document.createElement("style");
  style.textContent = `
    .watermark-protected::before {
      content: "${element.dataset.watermark || ""}";
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9999;
      opacity: 0.05;
      font-size: 14px;
      color: #666;
      font-family: monospace;
      white-space: pre-wrap;
      word-break: break-all;
      user-select: none;
    }
  `;
  document.head.appendChild(style);
  
  // 워터마크 제거 시도 감지
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "attributes" && mutation.attributeName === "data-watermark") {
        // 워터마크가 제거되려고 하면 복원
        if (!element.dataset.watermark) {
          element.dataset.watermark = element.getAttribute("data-original-watermark") || "";
        }
      }
    });
  });
  
  observer.observe(element, { attributes: true });
  
  return () => observer.disconnect();
};

/**
 * 인쇄용 워터마크 강화
 */
export const enhancePrintWatermark = (element: HTMLElement, watermarkText: string) => {
  const printStyle = document.createElement("style");
  printStyle.textContent = `
    @media print {
      .watermark-protected::before {
        opacity: 0.3 !important;
        font-size: 10px !important;
        content: "${watermarkText}" !important;
      }
      
      .watermark-protected::after {
        content: "인쇄일: ${new Date().toLocaleString()}" !important;
        position: fixed !important;
        bottom: 10px !important;
        right: 10px !important;
        font-size: 8px !important;
        color: #999 !important;
        opacity: 0.7 !important;
      }
    }
  `;
  document.head.appendChild(printStyle);
};
