import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { roomId, name, message, timestamp } = req.body;

    if (!roomId || !message)
      return res.status(400).json({ error: "Missing roomId or message" });

    const comment = {
      id: Date.now(),
      name: name || "کاربر ناشناس",
      message,
      timestamp: timestamp || new Date().toISOString(),
    };

    await redis.lpush(`comments:${roomId}`, JSON.stringify(comment));
    return res.status(200).json({ success: true, comment });
  } catch (err) {
    console.error("Add Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
