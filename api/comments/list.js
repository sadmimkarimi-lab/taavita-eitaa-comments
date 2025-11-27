// api/comments/list.js
import { getCommentsByPostKey } from "../../commentsStore.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ ok: false, error: "Method not allowed" });
  }

  const { postKey } = req.query || {};

  if (!postKey) {
    return res
      .status(400)
      .json({ ok: false, error: "postKey لازم است" });
  }

  const comments = getCommentsByPostKey(postKey);

  return res.status(200).json({
    ok: true,
    comments
  });
}
