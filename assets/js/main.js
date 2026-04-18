const body = document.body;
const header = document.querySelector(".site-header");
const menuButton = document.querySelector(".nav-toggle");
const navigation = document.querySelector(".site-nav");
const modalTriggers = document.querySelectorAll("[data-modal-open]");

let activeModal = null;

const syncBodyLock = () => {
  const menuOpen = header?.classList.contains("is-menu-open");
  const modalOpen = activeModal && !activeModal.hidden;
  body.classList.toggle("is-locked", Boolean(menuOpen || modalOpen));
};

const closeMenu = () => {
  if (!header || !menuButton) return;

  header.classList.remove("is-menu-open");
  menuButton.setAttribute("aria-expanded", "false");
  syncBodyLock();
};

const toggleMenu = () => {
  if (!header || !menuButton) return;

  const isOpen = header.classList.toggle("is-menu-open");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  syncBodyLock();
};

const updateHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 16);
};

menuButton?.addEventListener("click", toggleMenu);

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMenu);
});

window.addEventListener("scroll", updateHeaderState, { passive: true });
window.addEventListener("resize", () => {
  if (window.innerWidth > 980) {
    closeMenu();
  }
});
updateHeaderState();

const revealItems = document.querySelectorAll("[data-reveal]");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -60px 0px" }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const faqItems = document.querySelectorAll(".faq__item");

const setFaqState = (item, isOpen) => {
  const button = item.querySelector(".faq__question");
  item.classList.toggle("is-open", isOpen);
  button?.setAttribute("aria-expanded", String(isOpen));
};

faqItems.forEach((item) => {
  const button = item.querySelector(".faq__question");
  setFaqState(item, item.classList.contains("is-open"));

  button?.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    faqItems.forEach((faqItem) => setFaqState(faqItem, false));

    if (!isOpen) {
      setFaqState(item, true);
    }
  });
});

const openModal = (modalId) => {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  activeModal = modal;
  modal.hidden = false;
  syncBodyLock();
  modal.querySelector(".modal__close")?.focus();
};

const closeModal = () => {
  if (!activeModal) return;

  activeModal.hidden = true;
  activeModal = null;
  syncBodyLock();
};

modalTriggers.forEach((trigger) => {
  trigger.addEventListener("click", () => openModal(trigger.dataset.modalOpen));
});

document.querySelectorAll("[data-modal-close]").forEach((button) => {
  button.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  if (activeModal) {
    closeModal();
    return;
  }

  closeMenu();
});
