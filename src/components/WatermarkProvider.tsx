import React, { useEffect, useRef, useState } from "react";
import { createWatermarkText, generateWatermarkPositions, createWatermarkStyle, protectWatermark, enhancePrintWatermark } from "@/lib/watermark-utils";

interface WatermarkProviderProps {
  /** 사용자 이메일 */
  userEmail: string;
  /** 세션 ID */
  sessionId?: string;
  /** 자식 컴포넌트 */
  children: React.ReactNode;
  /** 워터마크 활성화 여부 */
  enabled?: boolean;
  /** 워터마크 밀도 (높을수록 더 많은 워터마크) */
  density?: "low" | "medium" | "high";
}

export const WatermarkProvider: React.FC<WatermarkProviderProps> = ({
  userEmail,
  sessionId,
  children,
  enabled = true,
  density = "medium",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [watermarkText, setWatermarkText] = useState("");
  const [positions, setPositions] = useState<any[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!enabled || !userEmail) return;

    const setupWatermark = async () => {
      const text = await createWatermarkText(userEmail, sessionId);
      setWatermarkText(text);

      // 워터마크 보호 설정
      if (containerRef.current) {
        containerRef.current.dataset.watermark = text;
        containerRef.current.dataset.originalWatermark = text;
        containerRef.current.classList.add("watermark-protected");
        
        const cleanup = protectWatermark(containerRef.current);
        enhancePrintWatermark(containerRef.current, text);
        
        return cleanup;
      }
    };

    setupWatermark();
  }, [userEmail, sessionId, enabled]);

  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    const updatePositions = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      const densityMultiplier = density === "low" ? 1.5 : density === "high" ? 0.7 : 1;
      const spacing = Math.floor(200 * densityMultiplier);
      
      const newPositions = generateWatermarkPositions(rect.width, rect.height);
      setPositions(newPositions);
    };

    updatePositions();
    
    const resizeObserver = new ResizeObserver(updatePositions);
    resizeObserver.observe(containerRef.current);
    
    return () => resizeObserver.disconnect();
  }, [enabled, density]);

  useEffect(() => {
    if (!enabled) return;

    // 워터마크 표시 지연 (콘텐츠 로딩 후)
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, [enabled]);

  if (!enabled) {
    return <>{children}</>;
  }

  return (
    <div ref={containerRef} className="relative watermark-container">
      {children}
      
      {isVisible && positions.length > 0 && (
        <div className="watermark-overlay">
          {positions.map((position, index) => (
            <div
              key={index}
              style={createWatermarkStyle(watermarkText, position)}
              className="watermark-item"
            >
              {watermarkText}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatermarkProvider;
