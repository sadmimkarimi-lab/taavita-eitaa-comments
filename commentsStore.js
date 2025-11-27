// commentsStore.js
// نسخه ساده: ذخیره در حافظه سرور (برای تست و نسخه اول)
// بعداً همین توابع رو به Redis وصل می‌کنیم.

let comments = [];

/**
 * اضافه کردن یک کامنت جدید
 */
export function addComment(comment) {
  comments.push(comment);
}

/**
 * گرفتن کامنت‌ها بر اساس postKey
 */
export function getCommentsByPostKey(postKey) {
  return comments.filter((c) => c.postKey === postKey);
}

/**
 * حذف یک کامنت بر اساس postKey و id
 */
export function deleteComment(postKey, commentId) {
  comments = comments.filter(
    (c) => !(c.postKey === postKey && c.id === commentId)
  );
}
