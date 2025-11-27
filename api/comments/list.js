import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export default async function handler(req, res) {
  try {
    const { roomId } = req.query;
    if (!roomId) return res.status(400).json({ error: "Missing roomId" });

    const data = await redis.lrange(`comments:${roomId}`, 0, -1);
    const comments = data.map((item) => JSON.parse(item));
    return res.status(200).json({ comments });
  } catch (err) {
    console.error("List Error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
