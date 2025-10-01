export const onRequest: PagesFunction[] = [
  async ({ next, request, env }) => {
    const response = await next();

    const headers = new Headers(response.headers);
    
    // 강화된 Content Security Policy
    headers.set(
      "Content-Security-Policy",
      [
        "default-src 'self'",
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com", // KaTeX, React, Turnstile
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com data:",
        "img-src 'self' data: blob:",
        "connect-src 'self'",
        "frame-src https://challenges.cloudflare.com", // Turnstile iframe
        "frame-ancestors 'none'",
        "base-uri 'self'",
        "form-action 'self'",
        "object-src 'none'",
        "media-src 'none'",
        "worker-src 'self'",
        "manifest-src 'self'",
        "upgrade-insecure-requests"
      ].join("; ")
    );
    
    // 보안 헤더 강화
    headers.set("X-Frame-Options", "DENY");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("X-XSS-Protection", "1; mode=block");
    headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    headers.set("Permissions-Policy", [
      "camera=()",
      "microphone=()",
      "geolocation=()",
      "gyroscope=()",
      "magnetometer=()",
      "payment=()",
      "usb=()",
      "accelerometer=()",
      "ambient-light-sensor=()",
      "autoplay=()",
      "battery=()",
      "bluetooth=()",
      "clipboard-read=()",
      "clipboard-write=()",
      "display-capture=()",
      "fullscreen=()",
      "gamepad=()",
      "midi=()",
      "notifications=()",
      "picture-in-picture=()",
      "publickey-credentials-get=()",
      "screen-wake-lock=()",
      "serial=()",
      "speaker-selection=()",
      "sync-xhr=()",
      "web-share=()",
      "xr-spatial-tracking=()"
    ].join(", "));
    
    // HSTS (HTTPS 강제)
    headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
    
    // Cache Control
    if (request.url.includes("/api/")) {
      headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
      headers.set("Pragma", "no-cache");
      headers.set("Expires", "0");
    } else {
      headers.set("Cache-Control", "public, max-age=31536000, immutable");
    }
    
    // CORS 설정
    headers.set("Access-Control-Allow-Origin", "https://your-domain.com");
    headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    headers.set("Access-Control-Allow-Credentials", "true");
    
    // Rate Limiting 헤더
    headers.set("X-RateLimit-Limit", "100");
    headers.set("X-RateLimit-Remaining", "99");
    headers.set("X-RateLimit-Reset", String(Math.floor(Date.now() / 1000) + 3600));
    
    // 보안 모니터링을 위한 커스텀 헤더
    headers.set("X-Content-Security", "enabled");
    headers.set("X-Anti-Bot", "enabled");
    headers.set("X-Protection", "active");

    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
];
