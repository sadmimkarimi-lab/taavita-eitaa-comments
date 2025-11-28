// commentsStore.js
// ذخیره‌ی کامنت‌ها در Upstash Redis

import { Redis } from "@upstash/redis";

// این‌ها رو قبلاً توی Vercel ست کردی
const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// اگر اشتباه تنظیم شده باشن، این لاگ میاد توی لاگ سرور
if (!redisUrl || !redisToken) {
  console.error(
    "❌ متغیرهای محیطی UPSTASH_REDIS_REST_URL یا UPSTASH_REDIS_REST_TOKEN تنظیم نشده‌اند."
  );
}

export const redis =
  redisUrl && redisToken
    ? new Redis({
        url: redisUrl,
        token: redisToken
      })
    : null;

// مدت نگه‌داری کامنت‌ها (۶ ماه)
const COMMENTS_TTL_SECONDS = 60 * 60 * 24 * 180;

/**
 * اضافه کردن یک کامنت جدید به Redis
 */
export async function addComment(comment) {
  if (!redis) {
    throw new Error("Redis تنظیم نشده است");
  }

  const key = `comments:${comment.postKey}`;

  // هر کامنت را به انتهای لیست اضافه می‌کنیم
  await redis.rpush(key, JSON.stringify(comment));

  // هر بار TTL را تمدید می‌کنیم (۶ ماه)
  await redis.expire(key, COMMENTS_TTL_SECONDS);
}

/**
 * گرفتن کامنت‌های مربوط به یک postKey
 */
export async function getCommentsByPostKey(postKey) {
  if (!redis) {
    throw new Error("Redis تنظیم نشده است");
  }

  const key = `comments:${postKey}`;

  // همه‌ی آیتم‌های لیست
  const items = await redis.lrange(key, 0, -1);

  return items
    .map((raw) => {
      try {
        return typeof raw === "string" ? JSON.parse(raw) : raw;
      } catch {
        return null;
      }
    })
    .filter(Boolean);
}
