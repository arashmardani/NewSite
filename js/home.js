/**
 * ClassChain Homepage — interactions + network visualizations
 */
document.addEventListener("DOMContentLoaded", () => {
  // Sticky header
  const header = document.getElementById("header");
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 20);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Mobile menu
  const menuToggle = document.getElementById("menuToggle");
  const nav = document.getElementById("nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => nav.classList.toggle("open"));
    nav.querySelectorAll("a").forEach(a => {
      a.addEventListener("click", () => nav.classList.remove("open"));
    });
  }

  // ---------- Hero Network Canvas ----------
  initHeroNetwork();

  // ---------- Community Network Canvas ----------
  initCommunityNetwork();
});

/* ============================================================
   Hero background: subtle floating network of schools + donors
   ============================================================ */
function initHeroNetwork() {
  const canvas = document.getElementById("networkCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height, nodes = [], animId;

  const SCHOOL_COLOR = "rgba(212, 160, 23, 0.9)";
  const DONOR_COLOR = "rgba(56, 189, 248, 0.75)";
  const LINE_COLOR = "rgba(255, 255, 255, 0.12)";

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    createNodes();
  }

  function createNodes() {
    nodes = [];
    const schoolCount = Math.max(5, Math.floor(width / 220));
    const donorCount = Math.max(18, Math.floor(width / 55));

    // School nodes (larger, fewer)
    for (let i = 0; i < schoolCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 5 + Math.random() * 3.5,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        type: "school"
      });
    }

    // Donor nodes (smaller, more)
    for (let i = 0; i < donorCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 2 + Math.random() * 2.2,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        type: "donor"
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Soft ambient glow
    const grd = ctx.createRadialGradient(width * 0.5, height * 0.4, 0, width * 0.5, height * 0.4, width * 0.6);
    grd.addColorStop(0, "rgba(15, 118, 110, 0.15)");
    grd.addColorStop(1, "transparent");
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, width, height);

    // Connections
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = a.type === "school" || b.type === "school" ? 180 : 110;

        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.35;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
          ctx.lineWidth = a.type === "school" || b.type === "school" ? 1.1 : 0.7;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Nodes
    nodes.forEach(n => {
      // soft glow
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r * 2.8, 0, Math.PI * 2);
      ctx.fillStyle = n.type === "school"
        ? "rgba(212, 160, 23, 0.15)"
        : "rgba(56, 189, 248, 0.1)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.type === "school" ? SCHOOL_COLOR : DONOR_COLOR;
      ctx.fill();
    });

    // Move
    nodes.forEach(n => {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;
    });

    animId = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", () => {
    cancelAnimationFrame(animId);
    resize();
    draw();
  });
  draw();
}

/* ============================================================
   Community section: clearer network of schools + surrounding donors
   ============================================================ */
function initCommunityNetwork() {
  const canvas = document.getElementById("communityCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width, height, schools = [], donors = [], animId;
  let time = 0;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = canvas.offsetWidth;
    height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    createGraph();
  }

  function createGraph() {
    schools = [];
    donors = [];

    // 5-7 school nodes placed thoughtfully
    const schoolCount = width < 500 ? 4 : 6;
    const marginX = 60;
    const marginY = 50;

    for (let i = 0; i < schoolCount; i++) {
      const angle = (i / schoolCount) * Math.PI * 2 - Math.PI / 2;
      const radius = Math.min(width, height) * 0.28;
      const cx = width / 2;
      const cy = height / 2;

      schools.push({
        x: cx + Math.cos(angle) * radius * (0.7 + Math.random() * 0.4),
        y: cy + Math.sin(angle) * radius * (0.65 + Math.random() * 0.4),
        baseX: 0,
        baseY: 0,
        r: 8 + Math.random() * 3,
        pulse: Math.random() * Math.PI * 2
      });
      schools[i].baseX = schools[i].x;
      schools[i].baseY = schools[i].y;
    }

    // Donors clustered around schools
    schools.forEach((school, sIdx) => {
      const count = 5 + Math.floor(Math.random() * 5);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = 35 + Math.random() * 70;
        donors.push({
          x: school.x + Math.cos(angle) * dist,
          y: school.y + Math.sin(angle) * dist,
          baseX: 0,
          baseY: 0,
          r: 2.5 + Math.random() * 2,
          schoolIdx: sIdx,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 0.6
        });
        const d = donors[donors.length - 1];
        d.baseX = d.x;
        d.baseY = d.y;
      }
    });

    // A few free-floating donors
    for (let i = 0; i < 8; i++) {
      donors.push({
        x: marginX + Math.random() * (width - marginX * 2),
        y: marginY + Math.random() * (height - marginY * 2),
        baseX: 0,
        baseY: 0,
        r: 2 + Math.random() * 1.8,
        schoolIdx: -1,
        phase: Math.random() * Math.PI * 2,
        speed: 0.3 + Math.random() * 0.5
      });
      const d = donors[donors.length - 1];
      d.baseX = d.x;
      d.baseY = d.y;
    }
  }

  function draw() {
    time += 0.008;
    ctx.clearRect(0, 0, width, height);

    // Subtle grid / ambient
    ctx.fillStyle = "rgba(255,255,255,0.015)";
    for (let x = 0; x < width; x += 40) {
      for (let y = 0; y < height; y += 40) {
        ctx.fillRect(x, y, 1, 1);
      }
    }

    // Lines: school ↔ school (weaker)
    for (let i = 0; i < schools.length; i++) {
      for (let j = i + 1; j < schools.length; j++) {
        const a = schools[i];
        const b = schools[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 280) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(212, 160, 23, ${0.12 * (1 - dist / 280)})`;
          ctx.lineWidth = 1;
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // Lines: donor → school
    donors.forEach(d => {
      if (d.schoolIdx >= 0) {
        const s = schools[d.schoolIdx];
        const dx = d.x - s.x;
        const dy = d.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(56, 189, 248, ${0.22 * Math.max(0, 1 - dist / 130)})`;
        ctx.lineWidth = 0.9;
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }
    });

    // Donors
    donors.forEach(d => {
      // gentle float
      d.x = d.baseX + Math.sin(time * d.speed + d.phase) * 6;
      d.y = d.baseY + Math.cos(time * d.speed * 0.8 + d.phase) * 5;

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r * 2.2, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(56, 189, 248, 0.12)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(56, 189, 248, 0.9)";
      ctx.fill();
    });

    // Schools
    schools.forEach(s => {
      s.x = s.baseX + Math.sin(time * 0.5 + s.pulse) * 3;
      s.y = s.baseY + Math.cos(time * 0.4 + s.pulse) * 2.5;

      // outer glow
      const pulse = 1 + Math.sin(time * 1.5 + s.pulse) * 0.15;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 3.2 * pulse, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(212, 160, 23, 0.12)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * 1.8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(212, 160, 23, 0.25)";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = "#d4a017";
      ctx.fill();

      // core highlight
      ctx.beginPath();
      ctx.arc(s.x - s.r * 0.25, s.y - s.r * 0.25, s.r * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.45)";
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener("resize", () => {
    cancelAnimationFrame(animId);
    resize();
    draw();
  });
  draw();
}
