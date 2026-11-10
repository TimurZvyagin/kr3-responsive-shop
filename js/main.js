const desktop = window.matchMedia("(min-width: 768px)");

const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");

function setMenu(open) {
  header.classList.toggle("site-header--open", open);
  navToggle.setAttribute("aria-expanded", String(open));
}

if (navToggle) {
  navToggle.addEventListener("click", () => {
    setMenu(navToggle.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", (event) => { 
    if (
      event.key === "Escape" &&
      header.classList.contains("site-header--open")
    ) {
      setMenu(false);
      navToggle.focus();
    }
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) setMenu(false);
  });
  header.querySelectorAll(".site-nav__link").forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  desktop.addEventListener("change", () => setMenu(false));
}

const filters = document.querySelector(".filters");

if (filters) {
  const items = Array.from(document.querySelectorAll(".product-grid__item"));
  const count = document.querySelector("[data-catalog-count]");
  const empty = document.querySelector("[data-catalog-empty]");

  const syncOpen = () => {
    filters.open = desktop.matches;
  };
  syncOpen();
  desktop.addEventListener("change", syncOpen);
  filters.querySelector("summary").addEventListener("click", (event) => {
    if (desktop.matches) event.preventDefault();
  });

  const updateCount = () => {
    const visible = items.filter(
      (item) => getComputedStyle(item).display !== "none",
    ).length;
    count.textContent = `показано товаров: ${visible} из ${items.length}`;
    empty.hidden = visible > 0;
  };
  filters.addEventListener("change", updateCount);
  filters.addEventListener("reset", () => setTimeout(updateCount));
}

document.querySelectorAll("[data-dialog-open]").forEach((opener) => {
  const dialog = document.getElementById(opener.dataset.dialogOpen);
  if (!dialog || typeof dialog.showModal !== "function") return;

  opener.addEventListener("click", (event) => {
    event.preventDefault();
    dialog.returnValue = "";
    dialog.showModal();
  });

  dialog.addEventListener("close", () => {
    opener.focus();

    const status = document.querySelector("[data-quick-status]");
    if (dialog.returnValue === "send" && status) {
      const name = dialog.querySelector("[name='name']").value.trim();
      status.textContent = `Спасибо, ${name}! Заявка отправлена, мы перезвоним в течение рабочего дня.`;
      status.hidden = false;
      dialog.querySelector("form").reset();
    }
  });
});

document.querySelectorAll("dialog.modal").forEach((dialog) => {
  dialog.querySelectorAll("[data-dialog-close]").forEach((button) => {
    button.addEventListener("click", () => dialog.close());
  });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) dialog.close();
  });
});
