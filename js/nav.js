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
