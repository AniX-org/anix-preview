// prettier-ignore
const autoredirectConfirmContainer = document.getElementById("auto-redirect-confirm");
// prettier-ignore
const autoredirectConfirmYesBtn = document.getElementById("auto-redirect-confirm-yes");
// prettier-ignore
const autoredirectConfirmNoBtn = document.getElementById("auto-redirect-confirm-no");
// prettier-ignore
const autoredirectServiceSelectContainer = document.getElementById("auto-redirect-service-select");
// prettier-ignore
const autoredirectServiceSelectCancelBtn = document.getElementById("auto-redirect-service-select-cancel");
// prettier-ignore
const autoredirectTimeoutContainer = document.getElementById("auto-redirect-timeout");
// prettier-ignore
const autoredirectTimeoutCountdownText = document.getElementById("auto-redirect-timeout-countdown-text");
// prettier-ignore
const autoredirectTimeoutCountdown = document.getElementById("auto-redirect-timeout-countdown");
// prettier-ignore
const autoredirectTimeoutCancelBtn = document.getElementById("auto-redirect-timeout-cancel");

const defaultTimeout = 5000; // 5 seconds

function setAutoredirect() {
  localStorage.setItem("autoredirect", true);
  localStorage.setItem("autoredirectTimeout", defaultTimeout);
}

function setAutoredirectService(index) {
  localStorage.setItem("autoredirectService", index);
}

getAutoredirect = () => {
  return localStorage.getItem("autoredirect") || false;
};

getAutoredirectService = () => {
  return localStorage.getItem("autoredirectService") || null;
};

getAutoredirectTimeout = () => {
  return localStorage.getItem("autoredirectTimeout")
    ? Number(localStorage.getItem("autoredirectTimeout"))
    : defaultTimeout;
};

function hideAutoredirectConfirmContainer() {
  autoredirectConfirmContainer.style = "--translate-y: 200%;";
  setTimeout(() => {
    autoredirectConfirmContainer.classList.add("hidden");
  }, 200);
}

function getServices() {
  return fetch("/api/availableServices")
    .then((response) => response.json())
    .then((data) => {
      return data;
    })
    .catch((error) => {
      console.error(error);
      return null;
    });
}

function redirectToService(services) {
  let locat = window.location.pathname.split("/");
  if (locat.length < 3) return;
  if (!["profile", "release", "collection"].includes(locat[1])) return;

  autoredirectTimeoutContainer.classList.remove("hidden");
  let timeout = getAutoredirectTimeout();
  // prettier-ignore
  autoredirectTimeoutCountdown.textContent = `${timeout / 1000}`.padStart(2, "0");
  setTimeout(() => {
    autoredirectTimeoutContainer.style = "--translate-y: 0%;";
  }, 200);
  const countdown = setInterval(() => {
    timeout -= 1000;
    // prettier-ignore
    autoredirectTimeoutCountdown.textContent = `${timeout / 1000}`.padStart(2, "0");
    if (timeout <= 0) {
      clearInterval(countdown);
      autoredirectTimeoutCountdownText.textContent = "Переходим...";

      let serviceIndex = getAutoredirectService();
      if (!serviceIndex) return;
      if (serviceIndex > services.length) serviceIndex = 0;

      const service = services[serviceIndex];
      if (service) {
        let url;
        if (service.url.startsWith("http")) {
          url = `${service.url}${locat[1]}/${locat[2]}`;
        } else {
          url = `${service.url}${locat[1]}?id=${locat[2]}`;
        }
        window.location.href = url;
      }
    }
  }, 1000);
  autoredirectTimeoutCancelBtn.addEventListener("click", () => {
    clearInterval(countdown);
    autoredirectTimeoutContainer.style = "--translate-y: 200%;";
    setTimeout(() => {
      autoredirectTimeoutContainer.classList.add("hidden");
    }, 200);
  });
  return;
}

window.addEventListener("load", async () => {
  const services = await getServices();
  // sourcery skip: use-braces
  if (!services) return;

  const isAutoredirectEnabled = getAutoredirect();
  if (!isAutoredirectEnabled) {
    autoredirectConfirmContainer.classList.remove("hidden");
    setTimeout(() => {
      autoredirectConfirmContainer.style = "--translate-y: 0%;";
    }, 200);

    autoredirectConfirmNoBtn.addEventListener("click", () => {
      hideAutoredirectConfirmContainer();
    });

    autoredirectConfirmYesBtn.addEventListener("click", () => {
      autoredirectServiceSelectContainer.classList.remove("hidden");
      autoredirectServiceSelectCancelBtn.addEventListener("click", () => {
        autoredirectServiceSelectContainer.classList.add("hidden");
        hideAutoredirectConfirmContainer();
      });

      // prettier-ignore
      const servicesBtns = document.querySelectorAll("[data-autoredirect-service-item]");
      servicesBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
          setAutoredirectService(btn.dataset.autoredirectServiceItem);
          setAutoredirect();
          autoredirectServiceSelectContainer.classList.add("hidden");
          hideAutoredirectConfirmContainer();
          setTimeout(() => {
            redirectToService(services);
          }, 100);
        });
      });
    });
    return;
  }

  redirectToService(services);
});
