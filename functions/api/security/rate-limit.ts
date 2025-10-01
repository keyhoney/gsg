import { Hono } from "hono";
import type { Env } from "@env";

const app = new Hono<{ Bindings: Env }>();

interface RateLimitInfo {
  count: number;
  resetTime: number;
  blocked: boolean;
}

export const onRequest = app.post("/check", async (c) => {
  const { ip, userAgent, endpoint } = await c.req.json();
  
  if (!ip || !userAgent || !endpoint) {
    return c.json({ error: "Missing required fields" }, 400);
  }

  const kv = c.env.RATE_LIMIT_KV || c.env.OTP_KV;
  const key = `rate_limit:${ip}:${endpoint}`;
  const windowMs = 15 * 60 * 1000; // 15분
  const maxRequests = 100; // 최대 요청 수
  
  try {
    // 현재 요청 정보 조회
    const existing = await kv.get(key);
    const now = Date.now();
    
    let rateLimitInfo: RateLimitInfo;
    
    if (existing) {
      rateLimitInfo = JSON.parse(existing);
      
      // 윈도우가 리셋되었는지 확인
      if (now > rateLimitInfo.resetTime) {
        rateLimitInfo = {
          count: 1,
          resetTime: now + windowMs,
          blocked: false,
        };
      } else {
        rateLimitInfo.count++;
        
        // 요청 한도 초과 확인
        if (rateLimitInfo.count > maxRequests) {
          rateLimitInfo.blocked = true;
        }
      }
    } else {
      rateLimitInfo = {
        count: 1,
        resetTime: now + windowMs,
        blocked: false,
      };
    }
    
    // KV에 저장
    await kv.put(key, JSON.stringify(rateLimitInfo), {
      expirationTtl: Math.ceil(windowMs / 1000),
    });
    
    // 봇 감지 로직
    const isBot = detectBot(userAgent, ip);
    
    if (isBot) {
      return c.json({
        allowed: false,
        reason: "bot_detected",
        message: "봇으로 감지되었습니다.",
      }, 403);
    }
    
    if (rateLimitInfo.blocked) {
      return c.json({
        allowed: false,
        reason: "rate_limit_exceeded",
        message: "요청 한도를 초과했습니다.",
        resetTime: rateLimitInfo.resetTime,
      }, 429);
    }
    
    return c.json({
      allowed: true,
      remaining: maxRequests - rateLimitInfo.count,
      resetTime: rateLimitInfo.resetTime,
    });
    
  } catch (error) {
    console.error("Rate limit check failed:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
}).fetch;

// 봇 감지 함수
function detectBot(userAgent: string, ip: string): boolean {
  const botPatterns = [
    /bot/i,
    /crawler/i,
    /spider/i,
    /scraper/i,
    /curl/i,
    /wget/i,
    /python/i,
    /java/i,
    /php/i,
    /go-http/i,
    /okhttp/i,
    /axios/i,
    /request/i,
    /urllib/i,
    /httpx/i,
    /aiohttp/i,
    /requests/i,
    /mechanize/i,
    /selenium/i,
    /puppeteer/i,
    /playwright/i,
    /headless/i,
    /phantom/i,
    /chrome-lighthouse/i,
    /googlebot/i,
    /bingbot/i,
    /slurp/i,
    /duckduckbot/i,
    /baiduspider/i,
    /yandexbot/i,
    /facebookexternalhit/i,
    /twitterbot/i,
    /linkedinbot/i,
    /whatsapp/i,
    /telegrambot/i,
    /discordbot/i,
    /slackbot/i,
    /skypebot/i,
    /applebot/i,
    /ia_archiver/i,
    /archive\.org_bot/i,
    /wayback/i,
    /webarchive/i,
    /archive\.org/i,
    /wayback_machine/i,
    /web\.archive\.org/i,
    /archive\.today/i,
    /archive\.is/i,
    /archive\.ph/i,
    /archive\.fo/i,
    /archive\.li/i,
    /archive\.md/i,
    /archive\.vg/i,
    /archive\.vu/i,
    /archive\.ws/i,
    /archive\.yt/i,
    /archive\.za/i,
    /archive\.zm/i,
    /archive\.zw/i,
  ];
  
  // User-Agent 기반 봇 감지
  if (botPatterns.some(pattern => pattern.test(userAgent))) {
    return true;
  }
  
  // 빈 User-Agent
  if (!userAgent || userAgent.trim() === "") {
    return true;
  }
  
  // 매우 짧은 User-Agent
  if (userAgent.length < 10) {
    return true;
  }
  
  // 일반적인 브라우저 패턴이 없는 경우
  const browserPatterns = [
    /mozilla/i,
    /chrome/i,
    /safari/i,
    /firefox/i,
    /edge/i,
    /opera/i,
    /ie/i,
    /netscape/i,
  ];
  
  if (!browserPatterns.some(pattern => pattern.test(userAgent))) {
    return true;
  }
  
  return false;
}
