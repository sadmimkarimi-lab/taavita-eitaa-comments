// api/comments/delete.js
import { deleteComment } from "../../commentsStore.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ ok: false, error: "Method not allowed" });
  }

  const { postKey, commentId } = req.body || {};

  if (!postKey || !commentId) {
    return res
      .status(400)
      .json({ ok: false, error: "postKey و commentId لازم است" });
  }

  try {
    deleteComment(postKey, commentId);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error deleting comment:", err);
    return res
      .status(500)
      .json({ ok: false, error: "خطا در حذف کامنت" });
  }
}
