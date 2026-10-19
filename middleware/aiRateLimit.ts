import { Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redis } from "../utils/redis";

// 1) Burst limiter: 10 requests / minute per user
export const aiBurstLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: (req: any) => req.user._id.toString(),
  store: new RedisStore({
    sendCommand: (...args: string[]) => redis.call(...(args as [string, ...string[]])) as any,
  }),
  message: {
    code: "RATE_LIMITED",
    error: "You're sending messages too fast. Please wait a moment.",
  },
});

// 2) Daily quota: 10 messages / day per user
const DAILY_LIMIT = 10;

const secondsUntilUtcMidnight = () => {
  const now = new Date();
  const midnight = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);
  return Math.ceil((midnight - now.getTime()) / 1000);
};

export const aiDailyQuota = async (req: any, res: Response, next: NextFunction) => {
  try {
    const userId = req.user._id.toString();
    const today = new Date().toISOString().slice(0, 10); // UTC day
    const key = `ai:quota:${userId}:${today}`;
    const resetInSeconds = secondsUntilUtcMidnight();

    // INCR + EXPIRE in one atomic transaction (removes the race)
    const results = await redis.multi().incr(key).expire(key, resetInSeconds + 60).exec();
    const count = Number(results?.[0]?.[1]);

    res.setHeader("X-Quota-Limit", DAILY_LIMIT);
    res.setHeader("X-Quota-Remaining", Math.max(DAILY_LIMIT - count, 0));

    if (count > DAILY_LIMIT) {
      res.setHeader("Retry-After", resetInSeconds);
      return res.status(429).json({
        code: "DAILY_LIMIT_REACHED",
        error: "You've finished your daily chat limit. Please come back tomorrow.",
        limit: DAILY_LIMIT,
        resetInSeconds,
      });
    }

    next();
  } catch (err) {
    console.error("Quota check failed", err);
    res.status(503).json({ error: "Service temporarily unavailable" });
  }
};