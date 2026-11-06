/* ==========================================================
   Nyatain Perasaan — Vanilla JS
   ========================================================== */

(function () {
  "use strict";

  /* ---------- SCROLL LOCK UNTIL TAP TO PLAY ---------- */
  if (history.scrollRestoration) {
    history.scrollRestoration = "manual";
  }
  window.scrollTo(0, 0);
  document.documentElement.classList.add("scroll-locked");
  document.body.classList.add("scroll-locked");

  const preventScroll = (e) => {
    if (document.body.classList.contains("scroll-locked")) {
      e.preventDefault();
    }
  };
  window.addEventListener("wheel", preventScroll, { passive: false });
  window.addEventListener("touchmove", preventScroll, { passive: false });
  window.addEventListener("keydown", (e) => {
    if (document.body.classList.contains("scroll-locked")) {
      const keys = ["ArrowDown", "ArrowUp", "PageDown", "PageUp", "Space", "Home", "End"];
      if (keys.includes(e.code) || [32, 33, 34, 35, 36, 38, 40].includes(e.keyCode)) {
        e.preventDefault();
      }
    }
  });

  /* ---------- LOADER ---------- */
  window.addEventListener("load", () => {
    setTimeout(() => {
      const loader = document.getElementById("loader");
      if (loader) loader.classList.add("hidden");
      setTimeout(() => loader && loader.remove(), 900);
      startTypewriter();
      showTapToPlay();
    }, 1400);
  });

  /* ---------- TAP TO PLAY & UNLOCK SCROLL ---------- */
  function showTapToPlay() {
    const btn = document.createElement("button");
    btn.id = "tapToPlay";
    btn.innerHTML = "🎷 Tap here to Play Music";
    btn.setAttribute("aria-label", "Play background music and begin");
    document.body.appendChild(btn);

    btn.addEventListener("click", () => {
      // 1. Buka kunci scroll
      document.documentElement.classList.remove("scroll-locked");
      document.body.classList.remove("scroll-locked");

      // 2. Putar musik
      if (audioEl) {
        audioEl.volume = parseFloat(volumeInput ? volumeInput.value : 0.6);
        audioEl.play().then(() => {
          isPlaying = true;
        }).catch(() => {});
      }

      // 3. Efek animasi hilang tombol
      btn.style.transition = "opacity 0.4s ease, transform 0.4s ease";
      btn.style.opacity = "0";
      btn.style.transform = "translateX(-50%) scale(0.9)";
      setTimeout(() => btn.remove(), 400);
    }, { once: true });
  }

  /* ---------- AMBIENT PETALS ---------- */
  const petalsLayer = document.getElementById("petalsLayer");
  for (let i = 0; i < 18; i++) {
    const p = document.createElement("div");
    p.className = "petal";
    p.style.left = Math.random() * 100 + "vw";
    p.style.animationDuration = (10 + Math.random() * 14) + "s";
    p.style.animationDelay = (-Math.random() * 12) + "s";
    p.style.opacity = (0.4 + Math.random() * 0.5).toFixed(2);
    p.style.transform = `scale(${0.6 + Math.random() * 0.8})`;
    petalsLayer.appendChild(p);
  }

  /* ---------- SPARKLES ---------- */
  const sparkLayer = document.getElementById("sparklesLayer");
  for (let i = 0; i < 40; i++) {
    const s = document.createElement("div");
    s.className = "sparkle";
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = Math.random() * 100 + "vh";
    s.style.animationDuration = (2 + Math.random() * 4) + "s";
    s.style.animationDelay = (-Math.random() * 4) + "s";
    sparkLayer.appendChild(s);
  }

  /* ---------- SCROLL REVEAL ---------- */
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  /* ---------- PARALLAX (subtle) ---------- */
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (petalsLayer) petalsLayer.style.transform = `translateY(${y * 0.05}px)`;
  }, { passive: true });

  /* ---------- TYPEWRITER ---------- */
  const TYPE_TEXT =
    "I don't know exactly when it happened, but one day I realized — you're someone special. Not because of anything big, but because of all the little things you do.";
  function startTypewriter() {
    const el = document.getElementById("typeText");
    if (!el) return;
    let i = 0;
    const tick = () => {
      if (i <= TYPE_TEXT.length) {
        el.textContent = TYPE_TEXT.slice(0, i++);
        setTimeout(tick, 38);
      }
    };
    const obs = new IntersectionObserver((es) => {
      es.forEach((en) => {
        if (en.isIntersecting) { tick(); obs.disconnect(); }
      });
    }, { threshold: 0.5 });
    obs.observe(el);
  }

  /* ---------- GIFT BOX ---------- */
  const giftbox = document.getElementById("giftbox");
  const giftMessage = document.getElementById("giftMessage");

  function moveNoButton() {
    const noBtn = document.getElementById("giftNoBtn");
    if (!noBtn) return;
    const parentRect = giftMessage.getBoundingClientRect();
    const buttonRect = noBtn.getBoundingClientRect();
    const maxX = Math.max(40, parentRect.width - buttonRect.width - 24);
    const maxY = Math.max(24, parentRect.height - buttonRect.height - 24);
    const moveX = Math.random() * maxX - maxX / 2;
    const moveY = Math.random() * maxY - maxY / 2;
    noBtn.style.transition = "transform 0.2s ease-out";
    noBtn.style.transform = `translate(${moveX}px, ${moveY}px) scale(0.95)`;
    setTimeout(() => {
      if (noBtn) noBtn.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }, 120);
  }

  const openGift = () => {
    if (giftbox.classList.contains("open")) return;
    giftbox.classList.add("open");
    giftMessage.innerHTML = `
      <p class="gift-prompt">Will you be my girlfriend? 💗</p>
      <div class="gift-choice">
        <button class="gift-btn gift-btn-yes" id="giftYesBtn" type="button">Yes, I will! 💗</button>
        <button class="gift-btn gift-btn-no" id="giftNoBtn" type="button">No</button>
      </div>
    `;
    setTimeout(() => giftMessage.classList.add("show"), 500);

    const yesBtn = document.getElementById("giftYesBtn");
    const noBtn = document.getElementById("giftNoBtn");

    yesBtn?.addEventListener("click", () => {
      giftMessage.innerHTML = `
        <p class="gift-prompt">Yay!! Thank you so much, this means everything!! 😽</p>
        <p class="gift-subtext">You're officially mine now! 💕</p>
      `;
      giftMessage.classList.add("show");
    });

    noBtn?.addEventListener("pointerdown", moveNoButton);
    noBtn?.addEventListener("mouseover", moveNoButton);

    burstConfetti(giftbox);
  };
  giftbox.addEventListener("click", openGift);
  giftbox.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openGift(); }
  });

  function burstConfetti(anchor) {
    const parent = anchor.parentElement;
    const symbols = ["♥", "✦", "✿", "❀", "♥", "✧"];
    for (let i = 0; i < 28; i++) {
      const c = document.createElement("span");
      c.className = "confetti";
      c.textContent = symbols[i % symbols.length];
      c.style.left = (anchor.offsetLeft + anchor.offsetWidth / 2) + "px";
      c.style.top = (anchor.offsetTop + anchor.offsetHeight / 2) + "px";
      c.style.color = ["#ffd4e5", "#ff9ec1", "#f6d59a", "#fff"][i % 4];
      c.style.setProperty("--x", (Math.random() * 360 - 180) + "px");
      c.style.setProperty("--y", (-100 - Math.random() * 200) + "px");
      c.style.setProperty("--r", (Math.random() * 720 - 360) + "deg");
      parent.appendChild(c);
      setTimeout(() => c.remove(), 1800);
    }
  }

  /* ---------- BOUQUET ---------- */
  const stage = document.getElementById("bouquetStage");
  const FLOWER_SVG = (c1, c2) => `
    <svg viewBox="0 0 64 64">
      <g>
        <ellipse cx="32" cy="14" rx="9" ry="14" fill="${c1}"/>
        <ellipse cx="32" cy="50" rx="9" ry="14" fill="${c1}"/>
        <ellipse cx="14" cy="32" rx="14" ry="9" fill="${c1}"/>
        <ellipse cx="50" cy="32" rx="14" ry="9" fill="${c1}"/>
        <circle cx="32" cy="32" r="7" fill="${c2}"/>
      </g>
    </svg>`;
  const PALETTES = [
    ["#ffb0d0", "#fff3d6"],
    ["#ff9ec1", "#f6d59a"],
    ["#e26ea0", "#ffe3ee"],
    ["#ffc6dc", "#c44a7d"],
    ["#d65a8b", "#fff7fb"],
    ["#ff7fb1", "#f6d59a"],
    ["#ffd4e5", "#e26ea0"]
  ];
  const positions = [
    { x: 50, y: 60, s: 1.1 },
    { x: 25, y: 75, s: 0.95 },
    { x: 75, y: 75, s: 0.95 },
    { x: 15, y: 50, s: 0.85 },
    { x: 85, y: 50, s: 0.85 },
    { x: 38, y: 40, s: 0.9 },
    { x: 62, y: 40, s: 0.9 }
  ];
  positions.forEach((p, i) => {
    const f = document.createElement("div");
    f.className = "flower";
    const [c1, c2] = PALETTES[i % PALETTES.length];
    f.innerHTML = FLOWER_SVG(c1, c2);
    f.style.left = `calc(${p.x}% - 32px)`;
    f.style.top = `calc(${p.y}% - 32px)`;
    f.style.setProperty("transform", `scale(${p.s})`);
    f.dataset.scale = p.s;
    stage.appendChild(f);
  });
  const bouquetObs = new IntersectionObserver((es) => {
    es.forEach((en) => {
      if (en.isIntersecting) {
        stage.querySelectorAll(".flower").forEach((f, i) => {
          setTimeout(() => {
            f.classList.add("bloom");
            f.style.transform = `scale(${f.dataset.scale}) translateY(0)`;
          }, i * 220);
        });
        bouquetObs.disconnect();
      }
    });
  }, { threshold: 0.3 });
  bouquetObs.observe(stage);

  /* ---------- LETTER ---------- */
  const env = document.getElementById("envelope");
  const toggleEnv = () => env.classList.toggle("open");
  env.addEventListener("click", toggleEnv);
  env.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleEnv(); }
  });

  /* ---------- GALLERY ---------- */
  const polaroidElements = document.querySelectorAll(".polaroid[data-img][data-cap]");

  const memoryModal = document.createElement("div");
  memoryModal.className = "memory-modal-overlay";
  memoryModal.innerHTML = `
    <div class="memory-modal-card glass" role="dialog" aria-modal="true" tabindex="-1">
      <button class="memory-modal-close" type="button" aria-label="Close">×</button>
      <div class="memory-modal-media"></div>
      <p class="memory-modal-caption"></p>
    </div>`;
  document.body.appendChild(memoryModal);

  const modalMedia = memoryModal.querySelector(".memory-modal-media");
  const modalCaption = memoryModal.querySelector(".memory-modal-caption");
  const modalCard = memoryModal.querySelector(".memory-modal-card");

  function openMemoryModal(imgSrc, cap) {
    modalMedia.innerHTML = `<img src="${imgSrc}" alt="${cap}" loading="lazy" />`;
    modalCaption.textContent = cap;
    memoryModal.classList.add("show");
    document.body.classList.add("modal-open");
    modalCard.focus();
  }

  function closeMemoryModal() {
    memoryModal.classList.remove("show");
    document.body.classList.remove("modal-open");
  }

  polaroidElements.forEach((el, i) => {
    const img = el.getAttribute("data-img");
    const cap = el.getAttribute("data-cap");
    el.setAttribute("role", "button");
    el.setAttribute("tabindex", "0");
    el.style.setProperty("--rot", ((i % 2 ? 1 : -1) * (2 + Math.random() * 4)) + "deg");
    el.innerHTML = `<div class="img"><img src="${img}" alt="${cap}" loading="lazy" /></div><div class="cap">${cap}</div>`;
    el.addEventListener("click", () => openMemoryModal(img, cap));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openMemoryModal(img, cap);
      }
    });
  });

  memoryModal.addEventListener("click", (e) => {
    if (e.target === memoryModal) closeMemoryModal();
  });
  memoryModal.querySelector(".memory-modal-close").addEventListener("click", closeMemoryModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMemoryModal();
  });

  /* ---------- MUSIC PLAYER ---------- */
  const playBtn = document.getElementById("playBtn");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const vinyl = document.getElementById("vinyl");
  const progress = document.getElementById("progress");
  const progressBar = document.getElementById("progressBar");
  const trackTitle = document.getElementById("trackTitle");
  const trackArtist = document.getElementById("trackArtist");
  const volumeInput = document.getElementById("volume");
  const audioEl = document.getElementById("musicAudio");

  let isPlaying = false;

  function updateProgress() {
    if (!audioEl || !audioEl.duration) return;
    const pct = (audioEl.currentTime / audioEl.duration) * 100;
    progressBar.style.width = `${Math.min(100, pct)}%`;
  }

  function togglePlay() {
    if (!audioEl) return;
    if (audioEl.paused) {
      audioEl.play().catch(() => {});
      isPlaying = true;
      playBtn.textContent = "❚❚";
      vinyl.classList.add("playing");
    } else {
      audioEl.pause();
      isPlaying = false;
      playBtn.textContent = "▶";
      vinyl.classList.remove("playing");
    }
  }

  function restartTrack() {
    if (!audioEl) return;
    audioEl.currentTime = 0;
    if (isPlaying) audioEl.play().catch(() => {});
    updateLyricsSync();
  }

  playBtn.addEventListener("click", togglePlay);
  prevBtn.addEventListener("click", restartTrack);
  nextBtn.addEventListener("click", restartTrack);
  volumeInput.addEventListener("input", () => {
    if (audioEl) audioEl.volume = parseFloat(volumeInput.value);
  });
  progress.addEventListener("click", (e) => {
    if (!audioEl || !audioEl.duration) return;
    const r = progress.getBoundingClientRect();
    const pct = (e.clientX - r.left) / r.width;
    audioEl.currentTime = pct * audioEl.duration;
    progressBar.style.width = `${pct * 100}%`;
    updateLyricsSync();
  });

  audioEl.addEventListener("timeupdate", () => {
    updateProgress();
    updateLyricsSync();
  });
  audioEl.addEventListener("loadedmetadata", updateProgress);
  audioEl.addEventListener("play", () => {
    playBtn.textContent = "❚❚";
    vinyl.classList.add("playing");
  });
  audioEl.addEventListener("pause", () => {
    if (!audioEl.ended) {
      playBtn.textContent = "▶";
      vinyl.classList.remove("playing");
    }
  });
  audioEl.addEventListener("ended", () => {
    audioEl.currentTime = 0;
    playBtn.textContent = "▶";
    vinyl.classList.remove("playing");
    isPlaying = false;
  });
  audioEl.loop = true;

  /* ---------- LYRICS SYNC & AUTO-SCROLL ---------- */
  const LYRICS_DATA = [
    { time: 0, text: "♪ (Music Playing) ♪" },
    { time: 4, text: "Ooh-ooh-ooh, ooh, ooh, ooh, ooh (Mm)" },
    { time: 10, text: "Ooh-ooh-ooh, ooh, ooh, ooh" },
    { time: 15.2, text: "Dance with me, darling" },
    { time: 18.5, text: "Just one more time" },
    { time: 22.1, text: "Take my hand and let's just slow dance all night" },
    { time: 28.1, text: "Girl, you know I'm hoping" },
    { time: 32.1, text: "Hoping when the music ends" },
    { time: 36.0, text: "You and I will fall in love all over again" },
    { time: 43.0, text: "Dance with me, darling" },
    { time: 46.5, text: "Just one more time" },
    { time: 50.1, text: "Put your pride aside, right here next to mine" },
    { time: 56.1, text: "Girl, you know I'm hoping" },
    { time: 60.0, text: "Hoping when the music ends" },
    { time: 64.0, text: "You and I will fall in love all over again, yeah" },
    { time: 71.0, text: "(All the stars) All the stars are out tonight" },
    { time: 75.8, text: "Ooh, maybe they'll shine a little light" },
    { time: 79.4, text: "Help us find what we're trying to find" },
    { time: 83.0, text: "It's been so long since I held you tight" },
    { time: 86.5, text: "I won't let you go 'til we get it right" },
    { time: 91.0, text: "Will you dance with me, darling?" },
    { time: 94.5, text: "Just one more time" },
    { time: 97.5, text: "It's the only thing that we ain't tried" },
    { time: 101.5, text: "Girl, you know I'm hoping" },
    { time: 105.5, text: "Hoping when the music ends" },
    { time: 109.0, text: "You and I will fall in love all over again" },
    { time: 114.0, text: "And again, all over again" },
    { time: 122.0, text: "Will you dance with me, darling?" },
    { time: 126.0, text: "Please, please, please" },
    { time: 130.0, text: "Oh, just one more time" },
    { time: 136.0, text: "Oh, I gotta let you know, baby, I still love you" },
    { time: 144.0, text: "And I don't wanna dance with nobody" },
    { time: 148.0, text: "Nobody, nobody but you" },
    { time: 154.0, text: "Nobody but you" },
    { time: 162.0, text: "Will you dance with me, darling?" },
    { time: 168.0, text: "Just one more time" },
    { time: 174.0, text: "Girl, you know I'm hoping" },
    { time: 180.0, text: "Hoping when the music ends" },
    { time: 186.0, text: "You and I will fall in love all over again" },
    { time: 195.0, text: "Ooh-ooh, ooh-ooh-ooh-ooh" },
    { time: 205.0, text: "♪ Falling in love with you all over again ♥ ♪" }
  ];

  const lyricsViewport = document.getElementById("lyricsViewport");
  const lyricsTrack = document.getElementById("lyricsTrack");
  let activeLyricIndex = -1;
  const lyricElements = [];

  if (lyricsTrack && lyricsViewport) {
    LYRICS_DATA.forEach((item, index) => {
      const p = document.createElement("p");
      p.className = "lyric-line";
      p.textContent = item.text;
      p.dataset.index = index;
      p.addEventListener("click", () => {
        if (audioEl) {
          audioEl.currentTime = item.time;
          if (audioEl.paused) audioEl.play().catch(() => {});
        }
      });
      lyricsTrack.appendChild(p);
      lyricElements.push(p);
    });

    setTimeout(() => {
      scrollLyric(0);
    }, 100);
  }

  function scrollLyric(index) {
    if (index < 0 || index >= lyricElements.length) return;
    if (activeLyricIndex === index) return;

    if (activeLyricIndex >= 0 && lyricElements[activeLyricIndex]) {
      lyricElements[activeLyricIndex].classList.remove("active");
    }

    const currentEl = lyricElements[index];
    currentEl.classList.add("active");
    activeLyricIndex = index;

    const viewportHeight = lyricsViewport.clientHeight || 140;
    const lineCenter = currentEl.offsetTop + currentEl.offsetHeight / 2;
    const targetY = (viewportHeight / 2) - lineCenter;
    lyricsTrack.style.transform = `translateY(${targetY}px)`;
  }

  function updateLyricsSync() {
    if (!audioEl || !lyricElements.length) return;
    const currentTime = audioEl.currentTime;

    let currentIndex = 0;
    for (let i = 0; i < LYRICS_DATA.length; i++) {
      if (currentTime >= LYRICS_DATA[i].time) {
        currentIndex = i;
      } else {
        break;
      }
    }

    scrollLyric(currentIndex);
  }

  window.addEventListener("resize", () => {
    if (activeLyricIndex >= 0) {
      const temp = activeLyricIndex;
      activeLyricIndex = -1;
      scrollLyric(temp);
    }
  });

  /* ---------- FINAL SURPRISE + BOTTLE ---------- */
  const bottle = document.getElementById("bottle");
  const finalMsg = document.getElementById("finalMessage");

  const openBottle = () => {
    bottle.classList.add("open");
    setTimeout(() => {
      finalMsg.classList.add("show");
      initConfession();
    }, 500);
    burstHearts(bottle);
  };
  bottle.addEventListener("click", openBottle);
  bottle.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openBottle(); }
  });

  /* ---------- CONFESSION YES / NO ---------- */
  function moveConfessionNo() {
    const noBtn = document.getElementById("confessionNo");
    if (!noBtn) return;
    const parentRect = finalMsg.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const maxX = Math.max(50, parentRect.width - btnRect.width - 20);
    const maxY = Math.max(30, parentRect.height - btnRect.height - 20);
    const moveX = Math.random() * maxX - maxX / 2;
    const moveY = Math.random() * maxY - maxY / 2;
    noBtn.style.transition = "transform 0.25s ease-out";
    noBtn.style.transform = `translate(${moveX}px, ${moveY}px) scale(0.9)`;
  }

  function initConfession() {
    const yesBtn = document.getElementById("confessionYes");
    const noBtn = document.getElementById("confessionNo");
    if (!yesBtn || !noBtn) return;

    yesBtn.addEventListener("click", () => {
      // Hide choice buttons
      const choiceEl = document.getElementById("confessionChoice");
      if (choiceEl) choiceEl.remove();

      // Update final message content
      finalMsg.innerHTML = `
        <p class="script big">Yayyyy!! 🥳💗</p>
        <p>Thank you for saying yes.<br>I promise I'll always be here for you.</p>
        <p class="script signoff">— we're official now 💕</p>
      `;
      finalMsg.classList.add("show");

      // Update ending section
      const endingTitle = document.getElementById("endingTitle");
      const endingSubtitle = document.getElementById("endingSubtitle");
      if (endingTitle) endingTitle.textContent = "Thank You For Saying Yes. 💕";
      if (endingSubtitle) endingSubtitle.textContent = "— I truly care about you ♥";

      // Big confetti burst
      for (let i = 0; i < 3; i++) {
        setTimeout(() => burstHearts(bottle), i * 400);
      }
    });

    noBtn.addEventListener("pointerdown", moveConfessionNo);
    noBtn.addEventListener("mouseover", moveConfessionNo);
    noBtn.addEventListener("touchstart", moveConfessionNo, { passive: true });
  }

  function burstHearts(anchor) {
    const parent = anchor.parentElement;
    for (let i = 0; i < 24; i++) {
      const h = document.createElement("span");
      h.className = "confetti";
      h.textContent = "♥";
      h.style.left = (anchor.offsetLeft + anchor.offsetWidth / 2) + "px";
      h.style.top = (anchor.offsetTop + anchor.offsetHeight / 2) + "px";
      h.style.color = ["#ffd4e5", "#ff9ec1", "#e26ea0", "#fff"][i % 4];
      h.style.fontSize = (14 + Math.random() * 14) + "px";
      h.style.setProperty("--x", (Math.random() * 400 - 200) + "px");
      h.style.setProperty("--y", (-200 - Math.random() * 220) + "px");
      h.style.setProperty("--r", (Math.random() * 720 - 360) + "deg");
      parent.appendChild(h);
      setTimeout(() => h.remove(), 1800);
    }
  }

  /* ---------- ENDING SAKURA ---------- */
  const sakuraLayer = document.getElementById("sakuraLayer");
  for (let i = 0; i < 30; i++) {
    const s = document.createElement("div");
    s.className = "sakura";
    s.style.left = Math.random() * 100 + "%";
    s.style.animationDuration = (8 + Math.random() * 10) + "s";
    s.style.animationDelay = (-Math.random() * 12) + "s";
    s.style.transform = `scale(${0.6 + Math.random()})`;
    sakuraLayer.appendChild(s);
  }
})();
