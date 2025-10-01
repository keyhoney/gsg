import React, { useEffect, useRef, useState } from "react";
import { createWatermarkText } from "@/lib/watermark-utils";

interface DynamicWatermarkProps {
  /** 사용자 이메일 */
  userEmail: string;
  /** 세션 ID */
  sessionId?: string;
  /** 워터마크 업데이트 간격 (ms) */
  updateInterval?: number;
  /** 워터마크 위치 변경 간격 (ms) */
  positionInterval?: number;
}

export const DynamicWatermark: React.FC<DynamicWatermarkProps> = ({
  userEmail,
  sessionId,
  updateInterval = 30000, // 30초
  positionInterval = 60000, // 1분
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [watermarkText, setWatermarkText] = useState("");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!userEmail) return;

    const updateWatermark = async () => {
      const text = await createWatermarkText(userEmail, sessionId);
      setWatermarkText(text);
    };

    updateWatermark();
    const interval = setInterval(updateWatermark, updateInterval);
    
    return () => clearInterval(interval);
  }, [userEmail, sessionId, updateInterval]);

  useEffect(() => {
    if (!canvasRef.current || !watermarkText) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const drawWatermark = () => {
      // 캔버스 크기 설정
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // 배경 투명
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 워터마크 설정
      ctx.font = "12px monospace";
      ctx.fillStyle = "rgba(102, 102, 102, 0.1)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // 워터마크 그리기
      const spacing = 200;
      for (let x = 0; x < canvas.width; x += spacing) {
        for (let y = 0; y < canvas.height; y += spacing) {
          const angle = Math.random() * 360;
          ctx.save();
          ctx.translate(x + spacing / 2, y + spacing / 2);
          ctx.rotate((angle * Math.PI) / 180);
          ctx.fillText(watermarkText, 0, 0);
          ctx.restore();
        }
      }
    };

    drawWatermark();
    setIsActive(true);

    // 위치 변경
    const positionIntervalId = setInterval(drawWatermark, positionInterval);
    
    // 리사이즈 이벤트
    const handleResize = () => drawWatermark();
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(positionIntervalId);
      window.removeEventListener("resize", handleResize);
    };
  }, [watermarkText, positionInterval]);

  if (!isActive) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9998] watermark-canvas"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 9998,
      }}
    />
  );
};

export default DynamicWatermark;
