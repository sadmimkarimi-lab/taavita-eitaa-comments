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
    // اگر دوست داشتی بعداً توکن بات رو استفاده کنیم
    const botToken = process.env.EITAA_BOT_TOKEN || null;
    if (!botToken) {
      console.warn("EITAA_BOT_TOKEN تنظیم نشده است (مشکلی برای نسخه فعلی نیست).");
    }

    const id = Date.now().toString();

    // به‌دست آوردن دامنه‌ی فعلی (مثلاً taavita-eitaa-comments.vercel.app)
    const host =
      process.env.VERCEL_URL
        ? "https://" + process.env.VERCEL_URL
        : "https://taavita-eitaa-comments.vercel.app";

    const commentLink = `${host}/comment.html?room=${id}`;

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
