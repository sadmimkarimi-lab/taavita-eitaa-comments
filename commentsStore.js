// commentsStore.js
// ذخیره‌ی کامنت‌ها در حافظه (فقط برای تست و نسخه اولیه)

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
