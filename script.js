const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".site-nav");
const inquiryForm = document.querySelector("#inquiry-form");
const content = window.ACRE_SCOUTS_CONTENT || { media: [], partners: [] };

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  navigation.classList.remove("open");
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  menuButton.setAttribute("aria-expanded", String(!open));
  navigation.classList.toggle("open", !open);
  document.body.classList.toggle("menu-open", !open);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 20);
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

inquiryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const form = new FormData(inquiryForm);
  const message = [
    "Hello Acre Scouts, I have a site requirement.",
    "",
    `Name: ${form.get("name")}`,
    `Company: ${form.get("company") || "Not specified"}`,
    `Phone: ${form.get("phone")}`,
    `Target region: ${form.get("region")}`,
    `Requirement: ${form.get("requirement")}`
  ].join("\n");

  window.open(`https://wa.me/916395236431?text=${encodeURIComponent(message)}`, "_blank", "noopener");
});

document.querySelector("#year").textContent = new Date().getFullYear();

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderMedia() {
  const grid = document.querySelector("#media-grid");
  if (!grid) return;

  grid.innerHTML = content.media.map((item, index) => {
    let visual = `<div class="media-placeholder" aria-hidden="true">${String(index + 1).padStart(2, "0")}</div>`;

    if (item.type === "image" && item.src) {
      visual = `<img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.alt)}" loading="lazy">`;
    }

    if (item.type === "video" && item.src) {
      visual = `<video src="${escapeHtml(item.src)}" poster="${escapeHtml(item.poster)}" controls preload="metadata" aria-label="${escapeHtml(item.title)}"></video>`;
    }

    return `
      <article class="media-card reveal">
        ${visual}
        <div class="media-card-content">
          <span>${escapeHtml(item.label || "Acre Scouts")}</span>
          <h3>${escapeHtml(item.title)}</h3>
          <p>${escapeHtml(item.description)}</p>
        </div>
      </article>`;
  }).join("");
}

function renderPartners() {
  const grid = document.querySelector("#partner-grid");
  if (!grid) return;

  grid.innerHTML = content.partners.map((partner) => {
    const logo = partner.logo
      ? `<img src="${escapeHtml(partner.logo)}" alt="${escapeHtml(partner.name)} logo" loading="lazy">`
      : `<div><strong>${escapeHtml(partner.name)}</strong><span>${escapeHtml(partner.description)}</span></div>`;

    return partner.url
      ? `<a class="partner-card reveal" href="${escapeHtml(partner.url)}" target="_blank" rel="noopener">${logo}</a>`
      : `<div class="partner-card reveal">${logo}</div>`;
  }).join("");
}

renderMedia();
renderPartners();

document.querySelectorAll(".reveal:not(.visible)").forEach((element) => {
  revealObserver.observe(element);
});
