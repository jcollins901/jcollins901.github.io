(function () {
    "use strict";

    const PARTIALS = [
        ["include-nav", "partials/nav.html"],
        ["include-hero", "partials/hero.html"],
        ["include-about", "partials/about.html"],
        ["include-projects", "partials/projects.html"],
        ["include-showcase", "partials/showcase.html"],
        ["include-credentials", "partials/credentials.html"],
        ["include-contact", "partials/contact.html"],
        ["include-footer", "partials/footer.html"],
    ];

    async function loadPartials() {
        for (const [id, url] of PARTIALS) {
            const el = document.getElementById(id);
            if (!el) continue;
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error("Failed to load " + url);
            }
            el.innerHTML = await res.text();
        }
    }

    function initReveal() {
        const reveals = document.querySelectorAll(".reveal");
        function tick() {
            reveals.forEach(function (el) {
                if (el.getBoundingClientRect().top < window.innerHeight - 72) {
                    el.classList.add("active");
                }
            });
        }
        window.addEventListener("scroll", tick, { passive: true });
        tick();
    }

    function initProjectTabs() {
        const root = document.getElementById("projects");
        if (!root) return;

        const tabs = root.querySelectorAll(".tab");
        const panels = root.querySelectorAll(".tab-content");

        tabs.forEach(function (tab) {
            tab.addEventListener("click", function () {
                const name = tab.getAttribute("data-tab");
                if (!name) return;

                tabs.forEach(function (t) {
                    t.classList.remove("active");
                    t.setAttribute("aria-selected", "false");
                });
                tab.classList.add("active");
                tab.setAttribute("aria-selected", "true");

                panels.forEach(function (p) {
                    p.classList.remove("active");
                });
                const panel = document.getElementById("panel-" + name);
                if (panel) {
                    panel.classList.add("active");
                }
            });
        });
    }

    function initShowcase() {
        const pairs = [
            { btn: "showcase-btn-code", panel: "showcase-code" },
            { btn: "showcase-btn-data", panel: "showcase-data" },
            { btn: "showcase-btn-creative", panel: "showcase-creative" },
        ];

        const buttons = pairs
            .map(function (p) {
                return {
                    el: document.getElementById(p.btn),
                    panel: document.getElementById(p.panel),
                };
            })
            .filter(function (x) {
                return x.el && x.panel;
            });

        if (buttons.length === 0) return;

        function activate(index) {
            buttons.forEach(function (b, i) {
                const on = i === index;
                b.el.setAttribute("aria-selected", on ? "true" : "false");
                b.panel.classList.toggle("active", on);
            });
        }

        buttons.forEach(function (b, index) {
            b.el.addEventListener("click", function () {
                activate(index);
            });
        });
    }

    function showLoadError() {
        const bar = document.createElement("p");
        bar.className = "load-error";
        bar.setAttribute("role", "alert");
        bar.textContent =
            "Sections could not load. Use a local server (e.g. npx serve) or deploy to GitHub Pages; opening the file directly from disk often blocks partials.";
        document.body.insertBefore(bar, document.body.firstChild);
    }

    document.addEventListener("DOMContentLoaded", function () {
        loadPartials()
            .then(function () {
                initReveal();
                initProjectTabs();
                initShowcase();
            })
            .catch(function (err) {
                console.error(err);
                showLoadError();
            });
    });
})();
