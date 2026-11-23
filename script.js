const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#primary-nav");
const bookingForm = document.querySelector("#booking-form");
const arrivalInput = document.querySelector("#arrival");
const departureInput = document.querySelector("#departure");
const staySummary = document.querySelector("#stay-summary");
const formNotice = document.querySelector("#form-notice");

document.documentElement.classList.add("js-ready");
document.querySelector("#current-year").textContent = String(new Date().getFullYear());

if (menuToggle && navigation) {
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.querySelector(".sr-only").textContent = isOpen ? "Otvoriť navigáciu" : "Zavrieť navigáciu";
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target instanceof Element && event.target.closest("a")) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.querySelector(".sr-only").textContent = "Otvoriť navigáciu";
      navigation.classList.remove("is-open");
    }
  });
}

if (arrivalInput && departureInput && staySummary) {
  const today = new Date();
  const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);
  arrivalInput.min = localToday;
  departureInput.min = localToday;

  const updateStay = () => {
    departureInput.min = arrivalInput.value || localToday;
    if (departureInput.value && arrivalInput.value && departureInput.value <= arrivalInput.value) {
      departureInput.setCustomValidity("Odchod musí byť po dátume príchodu.");
      staySummary.textContent = "Dátum odchodu musí byť neskôr ako dátum príchodu.";
      return;
    }
    departureInput.setCustomValidity("");

    if (!arrivalInput.value || !departureInput.value) {
      staySummary.textContent = "Vyberte dátum príchodu a odchodu.";
      return;
    }

    const arrival = new Date(`${arrivalInput.value}T12:00:00`);
    const departure = new Date(`${departureInput.value}T12:00:00`);
    const nights = Math.round((departure - arrival) / 86_400_000);
    staySummary.textContent = `Vybraný pobyt: ${nights} ${nights === 1 ? "noc" : nights > 1 && nights < 5 ? "noci" : "nocí"}.`;
  };

  arrivalInput.addEventListener("change", updateStay);
  departureInput.addEventListener("change", updateStay);
}

if (bookingForm && formNotice) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!bookingForm.reportValidity()) return;

    const formData = new FormData(bookingForm);
    const arrival = String(formData.get("arrival"));
    const departure = String(formData.get("departure"));
    const guests = String(formData.get("guests"));
    const subject = `Dopyt na pobyt: ${arrival} – ${departure}`;
    const body = [
      `Meno: ${formData.get("name")}`,
      `E-mail: ${formData.get("email")}`,
      `Príchod: ${arrival}`,
      `Odchod: ${departure}`,
      `Počet hostí: ${guests}`,
      "",
      String(formData.get("message") || ""),
    ].join("\n");
    const mailto = `mailto:rezervacie@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    formNotice.textContent = "Otvárame e-mailový program s pripraveným dopytom. Rezervácia bude platná až po potvrdení.";
    window.location.href = mailto;
  });
}

const revealElements = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
