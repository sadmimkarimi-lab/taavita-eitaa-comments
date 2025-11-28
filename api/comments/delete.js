// api/comments/delete.js
import { deleteCommentFromRoom } from "../../commentsStore.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ ok: false, error: "Method not allowed" });
    }

    const { roomId, commentId } = req.body || {};

    if (!roomId || !commentId) {
      return res
        .status(400)
        .json({ ok: false, error: "roomId و commentId لازم است." });
    }

    await deleteCommentFromRoom(String(roomId), String(commentId));

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Error in /api/comments/delete:", err);
    return res
      .status(500)
      .json({ ok: false, error: "خطای سرور در حذف کامنت" });
  }
}
