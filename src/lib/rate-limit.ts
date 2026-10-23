/**
 * Small in-memory limiter for login and signup. Each server instance counts on its own, so it slows down
 * password guessing rather than stopping a distributed attack.
 */
const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    if (buckets.size > 10000) {
      buckets.forEach((b, k) => { if (b.resetAt <= now) buckets.delete(k); });
    }
    return true;
  }
  bucket.count += 1;
  return bucket.count <= limit;
}

export function clientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0].trim() || request.headers.get('x-real-ip') || 'local';
}
