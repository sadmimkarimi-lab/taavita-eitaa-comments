// api/comments/add.js
import { addCommentToRoom } from "../../commentsStore.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res
        .status(405)
        .json({ ok: false, error: "Method not allowed" });
    }

    const { roomId, name, message } = req.body || {};

    if (!roomId || !message || !String(message).trim()) {
      return res
        .status(400)
        .json({ ok: false, error: "roomId و message الزامی هستند." });
    }

    const comment = await addCommentToRoom(
      String(roomId),
      name,
      message
    );

    return res.status(200).json({ ok: true, comment });
  } catch (err) {
    console.error("Error in /api/comments/add:", err);
    return res
      .status(500)
      .json({ ok: false, error: "خطای سرور در ثبت کامنت" });
  }
}
