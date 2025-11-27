// api/comments/add.js
import { addComment } from "../../commentsStore.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { postKey, text, name } = req.body || {};

    if (!postKey || !text) {
      return res
        .status(400)
        .json({ ok: false, error: "postKey و text الزامی است" });
    }

    // اگر name نیامده بود، یک نام پیش‌فرض می‌گذاریم
    const safeName =
      name && name.trim() ? name.trim() : "کاربر مهمان";

    const now = Date.now();

    const comment = {
      id: now.toString(),
      postKey,
      text,
      name: safeName,
      createdAt: now
    };

    // ذخیره در Redis
    await addComment(comment);

    return res.status(200).json({ ok: true, comment });
  } catch (err) {
    console.error("Error in /api/comments/add:", err);
    return res
      .status(500)
      .json({ ok: false, error: "خطای سرور در ذخیره کامنت" });
  }
}
