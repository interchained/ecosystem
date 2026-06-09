/* ===== Interchained Release Hub — interactions ===== */
(function () {
  "use strict";
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- Starfield ---- */
  (function stars() {
    const host = document.getElementById("bgStars");
    if (!host) return;
    const N = reduce ? 0 : 90;
    const frag = document.createDocumentFragment();
    for (let i = 0; i < N; i++) {
      const s = document.createElement("span");
      s.style.left = Math.random() * 100 + "%";
      s.style.top = Math.random() * 100 + "%";
      const sz = Math.random() * 2 + 1;
      s.style.width = s.style.height = sz + "px";
      s.style.setProperty("--dur", (Math.random() * 4 + 2.5).toFixed(2) + "s");
      s.style.setProperty("--d", (Math.random() * 5).toFixed(2) + "s");
      if (Math.random() > 0.82) s.style.background = "#F5C469";
      frag.appendChild(s);
    }
    host.appendChild(frag);
  })();

  /* ---- Nav: scrolled state + mobile toggle ---- */
  const nav = document.getElementById("nav");
  const onScroll = () => {
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 30);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");
  if (toggle && links) {
    toggle.addEventListener("click", () => links.classList.toggle("open"));
    links.addEventListener("click", (e) => {
      if (e.target.tagName === "A") links.classList.remove("open");
    });
  }

  /* ---- Scroll reveals (rAF + scroll based; IO-independent) ---- */
  const reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (reduce) {
    reveals.forEach((el) => el.classList.add("in"));
  } else {
    let pending = reveals.slice();
    const check = () => {
      const vh = window.innerHeight || document.documentElement.clientHeight;
      pending = pending.filter((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.92 && r.bottom > 0) {
          el.classList.add("in");
          return false;
        }
        return true;
      });
      if (!pending.length) window.removeEventListener("scroll", onCheck);
    };
    let raf = null;
    const onCheck = () => {
      if (!raf) raf = requestAnimationFrame(() => { check(); raf = null; });
    };
    window.addEventListener("scroll", onCheck, { passive: true });
    window.addEventListener("resize", onCheck, { passive: true });
    // initial passes (cover layout/font settling)
    requestAnimationFrame(check);
    setTimeout(check, 120);
    setTimeout(check, 500);
    // absolute safety net
    setTimeout(() => reveals.forEach((el) => el.classList.add("in")), 2500);
  }

  /* ---- Parallax grid ---- */
  const grid = document.getElementById("bgGrid");
  if (grid && !reduce) {
    let ty = 0, raf = null;
    window.addEventListener(
      "scroll",
      () => {
        ty = window.scrollY * 0.04;
        if (!raf)
          raf = requestAnimationFrame(() => {
            grid.style.transform = `translateY(${ty}px)`;
            raf = null;
          });
      },
      { passive: true }
    );
    window.addEventListener("mousemove", (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 14;
      const y = (e.clientY / window.innerHeight - 0.5) * 14;
      grid.style.backgroundPosition = `${x}px ${y}px`;
    });
  }

  /* ---- Terminal typing ---- */
  const term = document.getElementById("term");
  if (term) {
    const lines = [
      { t: "$ git clone https://github.com/interchained/interchained", c: "p" },
      { t: "Cloning interchained … done.", c: "c" },
      { t: "$ ./src/interchainedd -addnode=seed.interchained.org:17101", c: "p" },
      { t: "[ok] proof-of-work consensus engaged", c: "gr" },
      { t: "[ok] difficulty adjustment online (DAA)", c: "gr" },
      { t: "[itc] block reward applied via subsidy curve", c: "g" },
      { t: "[net] vision dashboard syncing blocks…", c: "o" },
      { t: "$ verify -build-in-public", c: "p" },
      { t: "the chain is live ▮", c: "g" },
    ];
    const render = (count, partial) => {
      let html = "";
      for (let i = 0; i < count; i++)
        html += `<div class="l ${lines[i].c}">${lines[i].t}</div>`;
      if (partial !== null && count < lines.length)
        html += `<div class="l ${lines[count].c}">${partial}<span class="term-cursor"></span></div>`;
      term.innerHTML = html;
    };

    const run = () => {
      let li = 0;
      const next = () => {
        if (li >= lines.length) return;
        const full = lines[li].t;
        let ch = 0;
        const type = () => {
          ch++;
          render(li, full.slice(0, ch));
          if (ch < full.length) setTimeout(type, 18 + Math.random() * 26);
          else {
            li++;
            render(li, null);
            setTimeout(next, 360);
          }
        };
        type();
      };
      next();
    };

    if (reduce) {
      render(lines.length, null);
    } else {
      let started = false;
      const maybeStart = () => {
        if (started) return;
        const r = term.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;
        if (r.top < vh * 0.8 && r.bottom > 0) {
          started = true;
          window.removeEventListener("scroll", maybeStart);
          run();
        }
      };
      window.addEventListener("scroll", maybeStart, { passive: true });
      maybeStart();
      setTimeout(maybeStart, 600);
    }
  }

  /* ---- Eco-map: pulse a random line node periodically ---- */
  const ecoNodes = document.querySelectorAll(".eco-node");
  if (ecoNodes.length && !reduce) {
    setInterval(() => {
      const n = ecoNodes[Math.floor(Math.random() * ecoNodes.length)];
      n.style.boxShadow = "var(--glow-gold)";
      n.style.borderColor = "var(--gold)";
      setTimeout(() => {
        n.style.boxShadow = "";
        n.style.borderColor = "";
      }, 700);
    }, 1400);
  }
})();
