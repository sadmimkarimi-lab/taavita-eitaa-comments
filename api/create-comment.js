// api/comments/create-comment.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ ok: false, error: "Method not allowed" });
  }

  // roomId ساده مبتنی بر زمان
  const roomId = `${Date.now()}-${Math.random()
    .toString(16)
    .slice(2, 8)}`;

  return res.status(200).json({ ok: true, roomId });
}
