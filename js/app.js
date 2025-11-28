const STORAGE_KEY = "eitaa_comments_rooms";

function loadRooms() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : [];
}

function saveRooms(rooms) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rooms));
}

function renderRooms() {
  const container = document.getElementById("commentsList");
  const rooms = loadRooms();
  container.innerHTML = "";

  if (!rooms.length) {
    container.textContent = "هنوز هیچ اتاق کامنتی نساختی.";
    return;
  }

  rooms.forEach((room, idx) => {
    const div = document.createElement("div");
    div.className = "comment-item";

    const meta = document.createElement("div");
    meta.className = "comment-meta";
    meta.innerHTML = `
      <strong>${room.title}</strong>
      <small>نوع: ${room.type === "private" ? "خصوصی" : "عمومی"}</small>
      <small>لینک پست: ${room.postUrl}</small>
      <small>لینک کامنت: ${room.commentUrl}</small>
    `;

    const actions = document.createElement("div");
    actions.className = "comment-actions";

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "کپی لینک";
    copyBtn.onclick = () => {
      navigator.clipboard.writeText(room.commentUrl);
      alert("لینک کامنت کپی شد ✅");
    };

    const openBtn = document.createElement("button");
    openBtn.textContent = "باز کردن";
    openBtn.onclick = () => {
      window.open(room.commentUrl, "_blank");
    };

    const delBtn = document.createElement("button");
    delBtn.textContent = "حذف";
    delBtn.onclick = () => {
      if (!confirm("این اتاق کامنت حذف شود؟")) return;
      const updated = loadRooms().filter((_, i) => i !== idx);
      saveRooms(updated);
      renderRooms();
    };

    actions.appendChild(copyBtn);
    actions.appendChild(openBtn);
    actions.appendChild(delBtn);

    div.appendChild(meta);
    div.appendChild(actions);
    container.appendChild(div);
  });
}

async function createRoom() {
  const type = document.querySelector('input[name="commentType"]:checked').value;
  const postUrl = document.getElementById("postLink").value.trim();
  const title = document.getElementById("commentTitle").value.trim();
  const maxMessagesPerUser = document.getElementById("maxMessagesPerUser").value.trim();
  const badWords = document.getElementById("badWords").value.trim();
  const statusEl = document.getElementById("createStatus");

  if (!postUrl || !title) {
    statusEl.textContent = "لطفاً لینک پست و عنوان را وارد کن.";
    return;
  }

  statusEl.textContent = "در حال ایجاد لینک کامنت...";

  try {
    const res = await fetch("/api/create-comment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        postUrl,
        title,
        maxMessagesPerUser: maxMessagesPerUser ? Number(maxMessagesPerUser) : null,
        badWords: badWords
          ? badWords.split(",").map((w) => w.trim()).filter(Boolean)
          : []
      })
    });

    const data = await res.json();

    if (!res.ok || !data.ok) {
      statusEl.textContent = "خطا در ایجاد کامنت: " + (data.error || "نامشخص");
      return;
    }

    const rooms = loadRooms();
    rooms.push({
      id: data.comment.id,
      type,
      title,
      postUrl,
      commentUrl: data.comment.commentLink,
      maxMessagesPerUser: data.comment.maxMessagesPerUser,
      badWords: data.comment.badWords,
      createdAt: data.comment.createdAt
    });
    saveRooms(rooms);
    renderRooms();

    document.getElementById("postLink").value = "";
    document.getElementById("commentTitle").value = "";
    document.getElementById("maxMessagesPerUser").value = "";
    document.getElementById("badWords").value = "";

    statusEl.textContent = "اتاق کامنت ساخته شد ✅";
  } catch (err) {
    console.error(err);
    statusEl.textContent = "خطا در اتصال به سرور.";
  }
}

document.getElementById("createBtn").addEventListener("click", createRoom);
renderRooms();
