// api/comments/add.js
import { addComment } from "../../commentsStore.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ ok: false, error: "Method not allowed" });
  }

  const { postKey, text, name } = req.body || {};

  if (!postKey || !text) {
    return res
      .status(400)
      .json({ ok: false, error: "postKey و text الزامی است" });
  }

  // اگر name نیامده بود، یک نام پیش‌فرض می‌گذاریم
  const safeName = name && name.trim() ? name.trim() : "کاربر مهمان";

  const comment = {
    id: Date.now().toString(),
    postKey,
    text,
    name: safeName,
    createdAt: Date.now()
  };

  // ذخیره در حافظه
  addComment(comment);

  return res.status(200).json({ ok: true, comment });
}
