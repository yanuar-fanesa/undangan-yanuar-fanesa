const EVENT_DATE = new Date("2026-09-12T09:00:00+07:00");

const body = document.body;
const cover = document.getElementById("cover");
const openButton = document.getElementById("openInvitation");
const mainContent = document.getElementById("mainContent");
const musicButton = document.getElementById("musicButton");
const music = document.getElementById("backgroundMusic");
const toast = document.getElementById("toast");

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2400);
}

// Nama tamu dapat diisi melalui URL: index.html?to=Nama%20Tamu
const params = new URLSearchParams(window.location.search);
const guest = params.get("to");
if (guest) {
  document.getElementById("guestName").textContent = guest;
}

openButton.addEventListener("click", async () => {
  cover.classList.add("is-closed");
  body.classList.remove("locked");
  mainContent.setAttribute("aria-hidden", "false");
  musicButton.classList.add("show");

  if (music.querySelector("source")?.getAttribute("src")) {
    try {
      await music.play();
      musicButton.classList.add("playing");
    } catch (_) {
      // Autoplay dapat diblokir browser; pengguna tetap bisa menekan tombol musik.
    }
  }
});

musicButton.addEventListener("click", async () => {
  const source = music.querySelector("source")?.getAttribute("src");
  if (!source) {
    showToast("Tambahkan file musik pada elemen audio di index.html.");
    return;
  }

  if (music.paused) {
    await music.play();
    musicButton.classList.add("playing");
  } else {
    music.pause();
    musicButton.classList.remove("playing");
  }
});

function updateCountdown() {
  const now = new Date();
  const distance = EVENT_DATE - now;

  if (distance <= 0) {
    document.getElementById("countdown").innerHTML =
      "<p style='grid-column:1/-1;font-size:1.2rem'>Hari bahagia telah tiba. Mohon doa restunya.</p>";
    return;
  }

  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((distance / (1000 * 60)) % 60);
  const seconds = Math.floor((distance / 1000) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
  document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
}

updateCountdown();
setInterval(updateCountdown, 1000);

document.getElementById("saveDate").addEventListener("click", () => {
  const pad = (n) => String(n).padStart(2, "0");
  const start = EVENT_DATE;
  const end = new Date(start.getTime() + 5 * 60 * 60 * 1000);

  const toICSDate = (date) =>
    `${date.getUTCFullYear()}${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}T${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${pad(date.getUTCSeconds())}Z`;

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Yanuar & Fanesa//Wedding Invitation//ID",
    "BEGIN:VEVENT",
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    "SUMMARY:Pernikahan Yanuar & Fanesa",
    "DESCRIPTION:Undangan pernikahan Yanuar dan Fanesa.",
    "LOCATION:[Alamat lokasi acara]",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Pernikahan-Yanuar-Fanesa.ics";
  link.click();
  URL.revokeObjectURL(url);
});

document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const target = document.querySelector(button.dataset.copy);
    try {
      await navigator.clipboard.writeText(target.textContent.trim());
      showToast("Nomor berhasil disalin.");
    } catch (_) {
      showToast("Tidak dapat menyalin otomatis.");
    }
  });
});

const form = document.getElementById("rsvpForm");
const wishesList = document.getElementById("wishesList");
const formStatus = document.getElementById("formStatus");

function getWishes() {
  try {
    return JSON.parse(localStorage.getItem("yanuarFanesaWishes")) || [];
  } catch (_) {
    return [];
  }
}

function renderWishes() {
  const wishes = getWishes().slice().reverse().slice(0, 8);
  wishesList.innerHTML = wishes.map((wish) => `
    <article class="wish">
      <strong>${escapeHTML(wish.name)}</strong>
      <small>${escapeHTML(wish.attendance)} · ${escapeHTML(wish.guestCount)} tamu</small>
      <p>${escapeHTML(wish.message)}</p>
    </article>
  `).join("");
}

function escapeHTML(value) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[char]));
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = {
    name: document.getElementById("rsvpName").value.trim(),
    attendance: document.getElementById("attendance").value,
    guestCount: document.getElementById("guestCount").value,
    message: document.getElementById("message").value.trim(),
    createdAt: new Date().toISOString()
  };

  const wishes = getWishes();
  wishes.push(data);
  localStorage.setItem("yanuarFanesaWishes", JSON.stringify(wishes));

  form.reset();
  formStatus.textContent = "Terima kasih. Konfirmasi Anda telah tersimpan di perangkat ini.";
  renderWishes();
});

renderWishes();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
