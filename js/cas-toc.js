/* Sommaire latéral des pages « Cas client » : liens d'ancre vers les sections
   (h2), avec suivi de la section visible. Généré à partir des <section> de
   l'<article class="cas"> : rien à écrire dans le HTML des pages. */
(function () {
  var article = document.querySelector("article.cas");
  if (!article) return;

  var sections = Array.prototype.filter.call(article.querySelectorAll("section"), function (s) {
    return s.querySelector("h2");
  });
  if (sections.length < 3) return;

  function slug(text) {
    return text
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  var nav = document.createElement("nav");
  nav.className = "cas-toc";
  nav.setAttribute("aria-label", "Sur cette page");
  var list = document.createElement("ol");

  var links = sections.map(function (section) {
    var title = section.querySelector("h2").textContent.trim();
    if (!section.id) section.id = slug(title);
    var li = document.createElement("li");
    var a = document.createElement("a");
    a.href = "#" + section.id;
    a.innerHTML = '<span class="cas-toc-dot" aria-hidden="true"></span><span class="cas-toc-label"></span>';
    a.querySelector(".cas-toc-label").textContent = title;
    li.appendChild(a);
    list.appendChild(li);
    return a;
  });

  nav.appendChild(list);
  document.body.appendChild(nav);

  var ticking = false;
  function update() {
    ticking = false;
    var line = window.innerHeight * 0.35;
    var current = -1;
    sections.forEach(function (s, i) {
      if (s.getBoundingClientRect().top <= line) current = i;
    });
    var atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4;
    if (atBottom) current = sections.length - 1;
    links.forEach(function (a, i) {
      if (i === current) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  function onScroll() {
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  window.addEventListener("load", onScroll);
  update();
})();
