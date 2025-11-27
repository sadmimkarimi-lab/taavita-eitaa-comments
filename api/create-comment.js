// api/create-comment.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ ok: false, error: "Method not allowed" });
  }

  const {
    type,
    postUrl,
    title,
    maxMessagesPerUser,
    badWords
  } = req.body || {};

  if (!postUrl || !title) {
    return res
      .status(400)
      .json({ ok: false, error: "postUrl و title الزامی است" });
  }

  try {
    const botToken = process.env.EITAA_BOT_TOKEN;

    if (!botToken) {
      // فعلاً بدون توکن هم اجازه می‌ده برای تست ایجاد شود
      console.warn("EITAA_BOT_TOKEN تنظیم نشده است.");
    }

    // TODO:
    // در آینده این‌جا باید درخواست واقعی به API ایتا/بات بفرستیم
    // و لینک واقعی اتاق کامنت را بگیریم.
    // فعلاً برای تست یک لینک ساختگی می‌سازیم:

    const id = Date.now().toString();
    const fakeSlug = "comment_" + id;
    const commentLink = `https://eitaa.com/${fakeSlug}`;

    const comment = {
      id,
      type: type === "private" ? "private" : "public",
      postUrl,
      title,
      maxMessagesPerUser: maxMessagesPerUser || null,
      badWords: badWords || [],
      commentLink,
      createdAt: Date.now()
    };

    return res.status(200).json({ ok: true, comment });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ ok: false, error: "مشکل در ساخت اتاق کامنت" });
  }
}
