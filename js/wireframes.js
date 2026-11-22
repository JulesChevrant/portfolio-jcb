/* Met chaque wireframe (.wf-screen, dessiné à sa taille d'origine) à l'échelle
   de la largeur disponible.
   - data-wf-w : largeur de référence ; data-wf-h : hauteur totale de la capture.
   - Cadre simple : le ratio est fixé en CSS (aspect-ratio).
   - Cadre défilant (.is-scroll + .wf-sizer) : data-wf-view-h = hauteur visible de
     référence ; la hauteur de défilement est recalculée à chaque changement d'échelle.
   - window.wfRefresh() : à rappeler quand de nouveaux cadres apparaissent
     (diapositive affichée, fenêtre d'agrandissement). */
(function () {
  var observer = null;
  var observed = [];

  function fit(viewport) {
    var screen = viewport.querySelector(".wf-screen");
    if (!screen) return;
    var sizer = viewport.querySelector(".wf-sizer");
    var refWidth = parseFloat(viewport.getAttribute("data-wf-w")) || 1888;
    var refHeight = parseFloat(viewport.getAttribute("data-wf-h")) || 0;
    var width = (sizer || viewport).clientWidth;
    if (!width) return; /* masqué (ex. diapositive inactive) : recalculé à l'affichage */
    var scale = width / refWidth;
    screen.style.transform = "scale(" + scale + ")";
    if (sizer && refHeight) sizer.style.height = refHeight * scale + "px";
  }

  function refresh() {
    var viewports = document.querySelectorAll(".wf-viewport");
    viewports.forEach(function (viewport) {
      fit(viewport);
      if (observer && observed.indexOf(viewport) === -1) {
        observed.push(viewport);
        observer.observe(viewport);
      }
    });
  }

  if ("ResizeObserver" in window) {
    observer = new ResizeObserver(function (entries) {
      entries.forEach(function (entry) {
        fit(entry.target);
      });
    });
  }

  window.wfRefresh = refresh;
  refresh();
  window.addEventListener("resize", refresh);
  window.addEventListener("load", refresh);
})();
