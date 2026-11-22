/* Slider des wireframes : un seul cadre visible à la fois, onglets, flèches,
   clavier, et fenêtre d'agrandissement (utile sur mobile).
   Sans JavaScript, les wireframes restent empilés et lisibles. */
(function () {
  var sliders = document.querySelectorAll("[data-wf-slider]");
  if (!sliders.length) return;

  function refit() {
    if (window.wfRefresh) window.wfRefresh();
  }

  sliders.forEach(function (root, sIndex) {
    var slides = Array.prototype.slice.call(root.querySelectorAll(".wf-slide"));
    if (slides.length < 2) return;
    var current = 0;
    var uid = "wf" + sIndex;

    root.classList.add("is-ready");
    root.setAttribute("role", "region");
    root.setAttribute("aria-roledescription", "carrousel");
    root.setAttribute("aria-label", "Wireframes anonymisés");

    slides.forEach(function (slide, i) {
      slide.id = uid + "-slide-" + i;
      slide.setAttribute("role", "group");
      slide.setAttribute("aria-roledescription", "diapositive");
      slide.setAttribute("aria-label", slide.getAttribute("data-title") + " (" + (i + 1) + " sur " + slides.length + ")");
    });

    /* Flèches + pied (compteur, agrandir) */
    function arrow(dir) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "wf-arrow wf-arrow-" + (dir < 0 ? "prev" : "next");
      b.setAttribute("aria-label", dir < 0 ? "Wireframe précédent" : "Wireframe suivant");
      b.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + (dir < 0 ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7") + '"/></svg>';
      b.addEventListener("click", function () { go((current + dir + slides.length) % slides.length); });
      return b;
    }

    var stage = document.createElement("div");
    stage.className = "wf-stage";
    slides.forEach(function (s) { stage.appendChild(s); });
    stage.appendChild(arrow(-1));
    stage.appendChild(arrow(1));

    var head = document.createElement("div");
    head.className = "wf-head";
    var count = document.createElement("span");
    count.className = "wf-count";
    count.setAttribute("aria-live", "polite");
    head.appendChild(count);

    var foot = document.createElement("div");
    foot.className = "wf-foot";
    var zoom = document.createElement("button");
    zoom.type = "button";
    zoom.className = "wf-zoom";
    zoom.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>Agrandir';
    foot.appendChild(zoom);

    root.appendChild(head);
    root.appendChild(stage);
    root.appendChild(foot);

    function go(i) {
      current = i;
      slides.forEach(function (s, k) {
        var on = k === i;
        s.classList.toggle("is-active", on);
        s.hidden = !on;
      });
      count.textContent = (i + 1) + " / " + slides.length;
      refit();
    }

    /* Fenêtre d'agrandissement */
    var dialog = null;
    zoom.addEventListener("click", function () {
      if (typeof HTMLDialogElement === "undefined") return;
      var slide = slides[current];
      var frame = slide.querySelector(".wireframe-placeholder");
      if (!frame) return;
      if (!dialog) {
        dialog = document.createElement("dialog");
        dialog.className = "wf-modal";
        dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
        dialog.addEventListener("close", function () {
          dialog.querySelector(".wf-modal-body").innerHTML = "";
          zoom.focus();
        });
        document.body.appendChild(dialog);
      }
      var title = slide.getAttribute("data-title");
      dialog.setAttribute("aria-label", "Wireframe : " + title);
      dialog.innerHTML =
        '<div class="wf-modal-head"><span class="wf-modal-title"></span>' +
        '<button type="button" class="wf-modal-close" aria-label="Fermer">' +
        '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19"/></svg></button></div>' +
        '<div class="wf-modal-body"></div>';
      dialog.querySelector(".wf-modal-title").textContent = title;
      dialog.querySelector(".wf-modal-close").addEventListener("click", function () { dialog.close(); });
      var holder = document.createElement("div");
      holder.className = "wf-modal-frame";
      holder.style.setProperty("--r", slide.style.getPropertyValue("--r"));
      holder.appendChild(frame.cloneNode(true));
      dialog.querySelector(".wf-modal-body").appendChild(holder);
      dialog.showModal();
      refit();
    });

    root.addEventListener("keydown", function (e) {
      if (e.target.closest && e.target.closest(".wf-viewport")) return;
      var d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (d) go((current + d + slides.length) % slides.length);
    });

    go(0);
  });
})();
