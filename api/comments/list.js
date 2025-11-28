// api/comments/list.js
import { getCommentsOfRoom } from "../../commentsStore.js";

export default async function handler(req, res) {
  try {
    const { roomId } = req.query || {};
    if (!roomId) {
      return res
        .status(400)
        .json({ ok: false, error: "roomId لازم است." });
    }

    const comments = await getCommentsOfRoom(String(roomId));

    return res.status(200).json({ ok: true, comments });
  } catch (err) {
    console.error("Error in /api/comments/list:", err);
    return res
      .status(500)
      .json({ ok: false, error: "خطای سرور در دریافت کامنت‌ها" });
  }
}
