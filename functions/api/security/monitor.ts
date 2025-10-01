import { Hono } from "hono";
import type { Env } from "@env";

const app = new Hono<{ Bindings: Env }>();

interface SecurityEvent {
  id: string;
  type: "devtools" | "copy" | "print" | "screenshot" | "keyboard" | "suspicious";
  timestamp: number;
  userEmail?: string;
  sessionId?: string;
  ip: string;
  userAgent: string;
  details: Record<string, any>;
  severity: "low" | "medium" | "high" | "critical";
}

export const onRequest = app
  .post("/event", async (c) => {
    const event: Omit<SecurityEvent, "id" | "timestamp"> = await c.req.json();
    
    if (!event.type || !event.ip || !event.userAgent) {
      return c.json({ error: "Missing required fields" }, 400);
    }

    const securityEvent: SecurityEvent = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      ...event,
    };

    try {
      // KV에 이벤트 저장
      const kv = c.env.SECURITY_KV || c.env.OTP_KV;
      const key = `security_event:${securityEvent.id}`;
      await kv.put(key, JSON.stringify(securityEvent), {
        expirationTtl: 7 * 24 * 60 * 60, // 7일
      });

      // 심각한 이벤트의 경우 추가 처리
      if (securityEvent.severity === "critical" || securityEvent.severity === "high") {
        // 관리자에게 알림 (실제 구현에서는 이메일이나 슬랙 등으로 알림)
        console.warn("Critical security event:", securityEvent);
        
        // 사용자 세션 무효화 (필요한 경우)
        if (securityEvent.sessionId) {
          // 세션 무효화 로직 (실제 구현에서는 Lucia 세션 삭제)
          console.log("Invalidating session:", securityEvent.sessionId);
        }
      }

      return c.json({ success: true, eventId: securityEvent.id });
      
    } catch (error) {
      console.error("Security event logging failed:", error);
      return c.json({ error: "Failed to log security event" }, 500);
    }
  })
  .get("/events", async (c) => {
    const { userEmail, limit = 50, severity } = c.req.query();
    
    if (!userEmail) {
      return c.json({ error: "userEmail is required" }, 400);
    }

    try {
      const kv = c.env.SECURITY_KV || c.env.OTP_KV;
      const prefix = "security_event:";
      
      // KV에서 이벤트 조회 (실제 구현에서는 더 효율적인 방법 사용)
      const events: SecurityEvent[] = [];
      
      // 실제 구현에서는 KV의 list 기능을 사용하거나
      // 별도의 데이터베이스에 이벤트를 저장해야 함
      
      return c.json({
        events: events.filter(event => 
          event.userEmail === userEmail &&
          (!severity || event.severity === severity)
        ).slice(0, parseInt(limit.toString())),
        total: events.length,
      });
      
    } catch (error) {
      console.error("Failed to fetch security events:", error);
      return c.json({ error: "Failed to fetch events" }, 500);
    }
  })
  .get("/stats", async (c) => {
    const { userEmail } = c.req.query();
    
    if (!userEmail) {
      return c.json({ error: "userEmail is required" }, 400);
    }

    try {
      // 보안 통계 조회
      const stats = {
        totalEvents: 0,
        criticalEvents: 0,
        highEvents: 0,
        mediumEvents: 0,
        lowEvents: 0,
        lastEventTime: null,
        riskScore: 0,
      };

      // 실제 구현에서는 KV나 데이터베이스에서 통계 계산
      
      return c.json(stats);
      
    } catch (error) {
      console.error("Failed to fetch security stats:", error);
      return c.json({ error: "Failed to fetch stats" }, 500);
    }
  })
  .post("/alert", async (c) => {
    const { userEmail, message, severity = "medium" } = await c.req.json();
    
    if (!userEmail || !message) {
      return c.json({ error: "userEmail and message are required" }, 400);
    }

    try {
      // 보안 알림 생성
      const alert = {
        id: crypto.randomUUID(),
        userEmail,
        message,
        severity,
        timestamp: Date.now(),
        acknowledged: false,
      };

      // 실제 구현에서는 알림 시스템에 전송
      console.log("Security alert:", alert);
      
      return c.json({ success: true, alertId: alert.id });
      
    } catch (error) {
      console.error("Failed to create security alert:", error);
      return c.json({ error: "Failed to create alert" }, 500);
    }
  })
  .fetch;
