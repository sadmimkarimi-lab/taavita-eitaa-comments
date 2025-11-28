// commentsStore.js
// لایه‌ی دسترسی به دیتابیس (Upstash Redis)

import { Redis } from "@upstash/redis";

// از متغیرهای محیطی UPSTASH_REDIS_REST_URL و UPSTASH_REDIS_REST_TOKEN استفاده می‌کند
export const redis = Redis.fromEnv();

const KEY_PREFIX = "comments:";
const TTL_SECONDS = 60 * 60 * 24 * 180; // حدود ۶ ماه

function makeKey(roomId) {
  return `${KEY_PREFIX}${roomId}`;
}

// افزودن یک کامنت جدید
export async function addCommentToRoom(roomId, name, message) {
  const now = new Date();
  const comment = {
    id: `${now.getTime()}-${Math.random().toString(16).slice(2)}`,
    roomId,
    name: name?.toString().trim().slice(0, 50) || "کاربر",
    message: message?.toString().trim().slice(0, 2000) || "",
    timestamp: now.toISOString()
  };

  const key = makeKey(roomId);

  // هر کامنت را به صورت JSON ذخیره می‌کنیم
  await redis.rpush(key, JSON.stringify(comment));
  // تمدید TTL
  await redis.expire(key, TTL_SECONDS);

  return comment;
}

// گرفتن لیست کامنت‌های یک اتاق
export async function getCommentsOfRoom(roomId) {
  const key = makeKey(roomId);
  const items = await redis.lrange(key, 0, -1); // همه‌ی آیتم‌ها

  if (!items || !items.length) return [];

  const comments = items
    .map((raw) => {
      try {
        return typeof raw === "string" ? JSON.parse(raw) : raw;
      } catch {
        return null;
      }
    })
    .filter(Boolean);

  // مرتب‌سازی از قدیمی به جدید (اگر ترتیب Redis حفظ شد هم مشکلی نیست)
  comments.sort(
    (a, b) =>
      new Date(a.timestamp || 0).getTime() -
      new Date(b.timestamp || 0).getTime()
  );

  return comments;
}

// حذف یک کامنت با id
export async function deleteCommentFromRoom(roomId, commentId) {
  const key = makeKey(roomId);
  const items = await redis.lrange(key, 0, -1);
  if (!items || !items.length) return;

  const kept = [];
  for (const raw of items) {
    try {
      const obj = typeof raw === "string" ? JSON.parse(raw) : raw;
      if (obj.id !== commentId) {
        kept.push(JSON.stringify(obj));
      }
    } catch {
      // اگر خراب است، حذفش می‌کنیم
    }
  }

  // کلید را پاک می‌کنیم و دوباره لیست جدید را می‌ریزیم
  await redis.del(key);
  if (kept.length) {
    await redis.rpush(key, ...kept);
    await redis.expire(key, TTL_SECONDS);
  }
}
