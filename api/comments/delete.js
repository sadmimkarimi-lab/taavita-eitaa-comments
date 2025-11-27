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

    const { roomId, id } = req.body;
    if (!roomId || !id)
      return res.status(400).json({ error: "Missing roomId or id" });

    const data = await redis.lrange(`comments:${roomId}`, 0, -1);
    const updated = data.filter((c) => JSON.parse(c).id !== id);
    await redis.del(`comments:${roomId}`);
    if (updated.length > 0)
      await redis.rpush(`comments:${roomId}`, ...updated);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Delete Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
