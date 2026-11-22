(function () {
  var toggle = document.querySelector(".nav-toggle");
  var list = document.querySelector(".nav-list");

  if (!toggle || !list) {
    return;
  }

  toggle.addEventListener("click", function () {
    var isOpen = list.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });
})();

/* Menu déroulant « Cas clients » : ouverture au clic, fermeture au clic
   extérieur et à Échap. */
(function () {
  var button = document.querySelector(".nav-dropdown-toggle");
  var panel = document.getElementById("nav-cas-clients");

  if (!button || !panel) {
    return;
  }

  function setOpen(isOpen) {
    panel.classList.toggle("is-open", isOpen);
    button.setAttribute("aria-expanded", isOpen ? "true" : "false");
  }

  function isOpen() {
    return button.getAttribute("aria-expanded") === "true";
  }

  button.addEventListener("click", function () {
    setOpen(!isOpen());
  });

  document.addEventListener("click", function (event) {
    if (isOpen() && !button.contains(event.target) && !panel.contains(event.target)) {
      setOpen(false);
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && isOpen()) {
      setOpen(false);
      button.focus();
    }
  });
})();
