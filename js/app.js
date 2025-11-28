// app.js

function generateRoomId() {
  return `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("roomForm");
  const resultBox = document.getElementById("resultBox");
  const roomTitleInput = document.getElementById("roomTitle");
  const roomIdOutput = document.getElementById("roomIdOutput");
  const commentLinkInput = document.getElementById("commentLink");
  const copyBtn = document.getElementById("copyLinkBtn");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const roomId = generateRoomId();
    const title = roomTitleInput.value.trim();

    const params = new URLSearchParams();
    params.set("room", roomId);
    if (title) params.set("title", title);

    const baseUrl = window.location.origin;
    const commentUrl = `${baseUrl}/comment.html?${params.toString()}`;

    roomIdOutput.value = roomId;
    commentLinkInput.value = commentUrl;
    resultBox.classList.remove("hidden");
  });

  copyBtn.addEventListener("click", async () => {
    const value = commentLinkInput.value;
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      copyBtn.textContent = "کپی شد ✔";
      setTimeout(() => (copyBtn.textContent = "کپی لینک"), 1500);
    } catch {
      alert("کپی نشد، لطفاً دستی کپی کنید.");
    }
  });
});
