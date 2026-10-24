// Portfolio assignment interactions
(function () {
  "use strict";
  var root = document.documentElement;
  var themeButton = document.getElementById("theme-toggle-button");
  var savedTheme = null;
  try { savedTheme = localStorage.getItem("portfolio-theme"); } catch (error) {}
  if (savedTheme === "light") root.classList.remove("dark");
  else root.classList.add("dark");

  if (themeButton) themeButton.addEventListener("click", function () {
    root.classList.toggle("dark");
    try { localStorage.setItem("portfolio-theme", root.classList.contains("dark") ? "dark" : "light"); } catch (error) {}
  });

  // Active navbar link while scrolling
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('nav a[href^="#"]'));
  var sections = navLinks.map(function (link) {
    return document.querySelector(link.getAttribute("href"));
  }).filter(Boolean);
  function updateActiveLink() {
    var current = "";
    sections.forEach(function (section) {
      if (section.getBoundingClientRect().top <= 140) current = section.id;
    });
    navLinks.forEach(function (link) {
      var active = link.getAttribute("href") === "#" + current;
      link.classList.toggle("text-primary", active);
      link.setAttribute("aria-current", active ? "location" : "false");
    });
    var topButton = document.getElementById("scroll-to-top");
    if (topButton) {
      var visible = window.scrollY > 350;
      topButton.classList.toggle("opacity-0", !visible);
      topButton.classList.toggle("invisible", !visible);
    }
  }
  window.addEventListener("scroll", updateActiveLink, { passive: true });
  window.addEventListener("load", updateActiveLink);
  updateActiveLink();

  // Portfolio category filters
  var filters = Array.prototype.slice.call(document.querySelectorAll(".portfolio-filter"));
  var projects = Array.prototype.slice.call(document.querySelectorAll(".portfolio-item"));
  filters.forEach(function (button) {
    button.addEventListener("click", function () {
      var label = button.textContent.trim();
      var category = "all";
      if (label.indexOf("مواقع") !== -1) category = "web";
      else if (label.indexOf("التطبيقات") !== -1) category = "app";
      else if (label.indexOf("التصميم") !== -1) category = "design";
      else if (label.indexOf("التجارة") !== -1) category = "ecommerce";
      filters.forEach(function (item) {
        item.classList.remove("active", "bg-linear-to-r", "from-primary", "to-secondary", "text-white");
        item.setAttribute("aria-pressed", item === button ? "true" : "false");
      });
      button.classList.add("active", "bg-linear-to-r", "from-primary", "to-secondary", "text-white");
      projects.forEach(function (project) {
        project.hidden = category !== "all" && project.getAttribute("data-category") !== category;
      });
    });
  });

  // Testimonials carousel
  var carousel = document.getElementById("testimonials-carousel");
  var next = document.getElementById("next-testimonial");
  var prev = document.getElementById("prev-testimonial");
  var slideIndex = 0;
  function moveCarousel(direction) {
    if (!carousel) return;
    var slides = Array.prototype.slice.call(carousel.children);
    if (!slides.length) return;
    slideIndex = (slideIndex + direction + slides.length) % slides.length;
    var slide = slides[slideIndex];
    var rtl = getComputedStyle(document.documentElement).direction === "rtl";
    var offset = slide.offsetLeft;
    carousel.style.transform = "translateX(" + (rtl ? offset : -offset) + "px)";
  }
  if (next) next.addEventListener("click", function () { moveCarousel(1); });
  if (prev) prev.addEventListener("click", function () { moveCarousel(-1); });
  window.addEventListener("resize", function () { if (carousel) carousel.style.transform = ""; });

  // Theme customization sidebar
  var sidebar = document.getElementById("settings-sidebar");
  var openButton = document.getElementById("settings-toggle");
  var closeButton = document.getElementById("close-settings");
  var colorsGrid = document.getElementById("theme-colors-grid");
  var colors = ["#6366f1", "#0d9488", "#e11d48", "#f59e0b", "#2563eb", "#9333ea", "#0891b2", "#16a34a"];
  function closeSettings() {
    if (!sidebar) return;
    sidebar.classList.add("translate-x-full");
    sidebar.classList.remove("translate-x-0");
  }
  if (openButton && sidebar) openButton.addEventListener("click", function () {
    sidebar.classList.remove("translate-x-full");
    sidebar.classList.add("translate-x-0");
  });
  if (closeButton) closeButton.addEventListener("click", closeSettings);
  if (colorsGrid) {
    colors.forEach(function (color) {
      var swatch = document.createElement("button");
      swatch.type = "button";
      swatch.setAttribute("aria-label", "اختيار اللون " + color);
      swatch.title = color;
      swatch.style.cssText = "width:34px;height:34px;border-radius:50%;background:" + color + ";border:3px solid white;box-shadow:0 0 0 1px #999;cursor:pointer";
      swatch.addEventListener("click", function () {
        root.style.setProperty("--color-primary", color);
        root.style.setProperty("--color-primary-rgb", color);
        root.style.setProperty("--primary", color);
        document.querySelectorAll("[class*='text-primary'],[class*='bg-primary'],[class*='border-primary']").forEach(function (el) {
          el.style.setProperty("--tw-text-opacity", "1");
        });
        root.style.setProperty("--theme-accent", color);
        var style = document.getElementById("custom-theme-color") || document.createElement("style");
        style.id = "custom-theme-color";
        style.textContent = ":root{--color-primary:" + color + ";--primary:" + color + "} .text-primary{color:" + color + "!important}.bg-primary{background-color:" + color + "!important}.border-primary{border-color:" + color + "!important}";
        document.head.appendChild(style);
      });
      colorsGrid.appendChild(swatch);
    });
  }
  var fontSelect = document.getElementById("font-select") || document.getElementById("font-family");
  if (fontSelect) fontSelect.addEventListener("change", function () {
    root.style.setProperty("--portfolio-font", fontSelect.value);
    document.body.style.fontFamily = fontSelect.value;
  });
  var reset = document.getElementById("reset-settings");
  if (reset) reset.addEventListener("click", function () {
    root.style.removeProperty("--color-primary");
    root.style.removeProperty("--primary");
    root.style.removeProperty("--theme-accent");
    document.body.style.fontFamily = "";
    var customStyle = document.getElementById("custom-theme-color");
    if (customStyle) customStyle.remove();
    if (fontSelect) fontSelect.selectedIndex = 0;
  });

  // Scroll-to-top
  var topButton = document.getElementById("scroll-to-top");
  if (topButton) topButton.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
})();