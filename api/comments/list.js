// api/comments/list.js
import { getCommentsByPostKey } from "../../commentsStore.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { postKey } = req.query || {};

    if (!postKey) {
      return res
        .status(400)
        .json({ ok: false, error: "postKey لازم است" });
    }

    const comments = await getCommentsByPostKey(postKey);

    return res.status(200).json({
      ok: true,
      comments
    });
  } catch (err) {
    console.error("Error in /api/comments/list:", err);
    return res
      .status(500)
      .json({ ok: false, error: "خطای سرور در خواندن کامنت‌ها" });
  }
}
