/* ==========================================================================
   RAKSHA BANDHAN.EXE
   ========================================================================== */

/* ============================================================
   CONFIGURATION — EDIT EVERYTHING YOU NEED IN THIS BLOCK
   ============================================================ */
const CONFIG = {
  // What you call her. This is also the login password on Screen 1.
  // Matching is case-insensitive and ignores extra spaces, so don't stress
  // about capitalisation when you tell her the password.
  nickname: "Cubdi",
  password: "Kubdi", // <-- CHANGE THIS to her actual nickname/password

  brotherName: "Harshit Bafila",

  // ----------------------------------------------------------
  // Final message on the last page. Edit freely.
  // Leave a blank line between paragraphs to start a new one.
  // ----------------------------------------------------------
  message: `**Happy Raksha Bandhan, Didi ❤️**

Its kind of crazy to think that we arent actually related by blood, and yet somehow, in just one year, youve become someone I genuinely see as my big sister.

College gave me a lot of people, but meeting you was one of those things Ill always be grateful for. You have been there like an elder sister — guiding me, listening to me, scolding me when needed, and making things feel a little easier whenever I needed someone.

Maybe we dont have years of childhood memories together, but the bond weve built in this one year means a lot to me. And honestly, sometimes a relationship doesnt need blood to feel like family.

I hope this Rakhi reminds you that you have a little brother here who genuinely respects you, cares about you, and will always be there for you whenever you need him.

**Thank you for becoming the sister I never knew I needed.**

Happy Raksha Bandhan, Didi.
**Not by blood, but definitely by heart. ❤️**
.

This took way longer to build than a normal rakhi post would have, but you're not exactly a normal sister, so.

I don't say this enough, but I notice everything — the way you check up on me without making it a whole thing, the way you still remember stuff I said months ago, the way home feels different (better) when you're around.

So instead of a text, you got an entire fake operating system, a rigged quiz, and a gift box. That's just how I say it.

Happy Raksha Bandhan. Here's to more years of me pretending to be annoyed and you pretending to believe me.`,

  // ----------------------------------------------------------
  // Your photos. Put the actual files inside the /images folder,
  // then list them here in the order you want them to appear.
  // title and caption are optional — leave them as "" to skip.
  // ----------------------------------------------------------
  photos: [
    { src: "images/photo1.jpeg", title: "hehehe", caption: "" },
    { src: "images/photo2.jpeg", title: "crazyy pic", caption: "" },
    { src: "images/photo3.jpeg", title: "hawa anne do", caption: "" },
    { src: "images/photo4.jpeg", title: "moj", caption: "" },
  ],
};

/* ============================================================
   QUIZ DATA
   ============================================================ */
const QUIZ = [
  {
    question: "How much would you rate your brother on a scale of 1 to 10?",
    type: "single",
    options: ["gadha/10", "suar/10", "10/10", "heIstheCoolest/10"],
    correct: ["heIstheCoolest/10"],
  },
  {
    question: "Do you think he will do anything you say to him?",
    type: "single",
    options: [
      "apnaKaam hi nhi krta",
      "Haa Eak baari maai",
      "Nonhiii kregaa",
      "gadhe se kyaa kaam krwayunn",
    ],
    correct: ["Haa Eak baari maai"],
  },
  {
    question: "Do you think he is a bit annoying?",
    type: "single",
    options: [
      "NHII voo coool haai bhautt zaydaa",
      "HAAANN",
      "pagalHAAiKya",
      "kbhiKbhiiii",
    ],
    correct: ["NHII voo coool haai bhautt zaydaa"],
  },
  {
    question: "How much, on a scale of 10, would you rate the bonding between you two?",
    type: "single",
    options: ["4/10", "6/10", "10/10", "∞/10"],
    correct: ["∞/10"],
  },
  {
    question: "What would he probably be thinking about having a sister like you?",
    type: "multiple",
    hint: "Some feelings don't really care about language... or formatting.",
    options: [
      { label: "GREATEFUL", style: "" },
      { label: "GREATFULL", style: "bold" },
      { label: "GREATFULL", style: "italic" },
      { label: "आभारी", style: "" },
    ],
  },
];

const REJECTION_MESSAGES = [
  "That answer has been rejected by the Brotherhood Committee.",
  "Objection sustained. The Committee is not convinced.",
  "Access denied by the Sibling Court of Appeals.",
  "Nice try. Read it again.",
  "The Committee needs all four. No exceptions.",
];

/* ============================================================
   STATE
   ============================================================ */
const state = {
  currentQuestion: 0,
  rakhisCollected: 0,
  selectedMultiple: new Set(),
  answering: false,
};

/* ============================================================
   SCREEN NAVIGATION
   ============================================================ */
function goToScreen(id) {
  const current = document.querySelector(".screen.is-active");
  const next = document.getElementById(id);
  if (!next || current === next) return;

  if (current) {
    current.classList.remove("is-active");
    current.classList.add("is-leaving");
    setTimeout(() => {
      current.hidden = true;
      current.classList.remove("is-leaving");
    }, 650);
  }

  next.hidden = false;
  // force reflow so the transition actually runs
  void next.offsetWidth;
  requestAnimationFrame(() => next.classList.add("is-active"));
}

/* ============================================================
   AUDIO — tiny Web Audio chime, no external files
   ============================================================ */
let audioCtx = null;
function unlockAudio() {
  if (audioCtx) return;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  } catch (e) {
    audioCtx = null;
  }
}
["pointerdown", "keydown"].forEach((evt) =>
  document.addEventListener(evt, unlockAudio, { once: true })
);

function playChime() {
  if (!audioCtx) return;
  if (audioCtx.state === "suspended") audioCtx.resume();
  const notes = [523.25, 659.25, 784.0, 1046.5]; // C5 E5 G5 C6
  const now = audioCtx.currentTime;
  notes.forEach((freq, i) => {
    const start = now + i * 0.11;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.14, start + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.55);
    osc.connect(gain).connect(audioCtx.destination);
    osc.start(start);
    osc.stop(start + 0.6);
  });
}

function playSoftClick(good) {
  if (!audioCtx) return;
  if (audioCtx.state === "suspended") audioCtx.resume();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = "sine";
  osc.frequency.value = good ? 720 : 200;
  gain.gain.setValueAtTime(0.001, now);
  gain.gain.linearRampToValueAtTime(0.1, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + (good ? 0.28 : 0.22));
  osc.connect(gain).connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.3);
}

/* ============================================================
   SCREEN 1 — PASSWORD
   ============================================================ */
function initPasswordScreen() {
  const form = document.getElementById("password-form");
  const input = document.getElementById("password-input");
  const error = document.getElementById("password-error");
  const card = document.querySelector(".password-card");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const guess = input.value.trim().toLowerCase();
    const answer = CONFIG.password.trim().toLowerCase();

    if (guess.length && guess === answer) {
      error.classList.remove("is-visible");
      form.querySelector("button").disabled = true;
      setTimeout(() => {
        goToScreen("screen-boot");
        runBootSequence();
      }, 350);
    } else {
      playSoftClick(false);
      error.textContent = "Access denied. Nice try, sister.";
      error.classList.add("is-visible");
      card.classList.remove("is-shaking");
      void card.offsetWidth;
      card.classList.add("is-shaking");
      input.value = "";
      input.focus();
    }
  });
}

/* ============================================================
   SCREEN 2 — BOOT SEQUENCE
   ============================================================ */
function typeLine(container, text, extraClass, speed = 16) {
  return new Promise((resolve) => {
    const p = document.createElement("p");
    p.className = "term-line" + (extraClass ? " " + extraClass : "");
    container.appendChild(p);
    const cursor = document.createElement("span");
    cursor.className = "term-cursor";

    let i = 0;
    function step() {
      p.textContent = text.slice(0, i);
      p.appendChild(cursor);
      if (i < text.length) {
        i++;
        setTimeout(step, speed);
      } else {
        cursor.remove();
        resolve(p);
      }
    }
    step();
  });
}

function wait(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function runBootSequence() {
  const body = document.getElementById("terminal-body");
  // keep the brand line, clear the rest
  body.innerHTML = '<p class="term-line term-line--brand">RAKSHA&nbsp;BANDHAN.EXE</p>';

  await wait(400);
  await typeLine(body, "Initializing sibling protocol...");
  await wait(200);

  const track = document.createElement("div");
  track.className = "term-progress-track";
  const fill = document.createElement("div");
  fill.className = "term-progress-fill";
  track.appendChild(fill);
  body.appendChild(track);
  await wait(50);
  fill.style.width = "100%";
  await wait(1800);

  await typeLine(body, "Loading memories... [OK]", "term-line--ok");
  await wait(220);
  await typeLine(body, "Loading sibling data... [OK]", "term-line--ok");
  await wait(220);
  await typeLine(body, "Checking brother status... [VERIFIED]", "term-line--ok");
  await wait(220);
  await typeLine(body, "Checking sister status... [VERIFIED]", "term-line--ok");
  await wait(220);
  await typeLine(body, "Establishing Rakhi connection... [CONNECTED]", "term-line--ok");
  await wait(500);
  await typeLine(body, "SYSTEM READY.", "term-line--ready", 26);
  await wait(1000);

  goToScreen("screen-quiz");
  renderQuestion();
}

/* ============================================================
   SCREEN 3 — QUIZ
   ============================================================ */
function initRakhiTracker() {
  const row = document.getElementById("rakhi-row");
  row.innerHTML = "";
  for (let i = 0; i < QUIZ.length; i++) {
    const dot = document.createElement("span");
    dot.className = "rakhi-dot";
    dot.dataset.index = i;
    row.appendChild(dot);
  }
}

function updateRakhiTracker() {
  const dots = document.querySelectorAll(".rakhi-dot");
  dots.forEach((dot, i) => {
    if (i < state.rakhisCollected) {
      if (!dot.classList.contains("is-filled")) {
        dot.classList.add("is-filled", "is-popping");
        setTimeout(() => dot.classList.remove("is-popping"), 600);
      }
    }
  });
}

function renderQuestion() {
  state.selectedMultiple = new Set();
  state.answering = false;
  const q = QUIZ[state.currentQuestion];
  const card = document.getElementById("quiz-card");

  card.classList.add("is-transitioning");

  setTimeout(() => {
    card.innerHTML = "";

    const progress = document.createElement("p");
    progress.className = "quiz-progress";
    progress.textContent = `QUESTION ${state.currentQuestion + 1} OF ${QUIZ.length}`;
    card.appendChild(progress);

    const question = document.createElement("h2");
    question.className = "quiz-question";
    question.textContent = q.question;
    card.appendChild(question);

    const list = document.createElement("ul");
    list.className = "quiz-options";
    card.appendChild(list);

    if (q.type === "single") {
      q.options.forEach((optText) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quiz-option";
        btn.innerHTML = `<span>${escapeHtml(optText)}</span><span class="quiz-option__mark"></span>`;
        btn.addEventListener("click", () => handleSingleAnswer(btn, optText));
        li.appendChild(btn);
        list.appendChild(li);
      });
    } else {
      q.options.forEach((opt, idx) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "quiz-option";
        let label = escapeHtml(opt.label);
        if (opt.style === "bold") label = `<strong>${label}</strong>`;
        if (opt.style === "italic") label = `<em>${label}</em>`;
        btn.innerHTML = `<span>${label}</span><span class="quiz-option__mark">✓</span>`;
        btn.addEventListener("click", () => toggleMultipleOption(btn, idx));
        li.appendChild(btn);
        list.appendChild(li);
      });

      const hint = document.createElement("p");
      hint.className = "quiz-hint";
      hint.textContent = q.hint || "";
      card.appendChild(hint);

      const submit = document.createElement("button");
      submit.type = "button";
      submit.className = "btn btn-primary quiz-submit";
      submit.innerHTML = "<span>CONFIRM ANSWER</span>";
      submit.addEventListener("click", handleMultipleSubmit);
      card.appendChild(submit);
    }

    const rejection = document.createElement("p");
    rejection.className = "quiz-rejection";
    rejection.id = "quiz-rejection";
    card.appendChild(rejection);

    card.classList.remove("is-transitioning");
  }, 220);
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function showRejection() {
  const el = document.getElementById("quiz-rejection");
  const msg = REJECTION_MESSAGES[Math.floor(Math.random() * REJECTION_MESSAGES.length)];
  el.textContent = msg;
  el.classList.remove("is-visible");
  void el.offsetWidth;
  el.classList.add("is-visible");
}

function handleSingleAnswer(btn, optText) {
  if (state.answering) return;
  const q = QUIZ[state.currentQuestion];
  const correct = q.correct.includes(optText);

  if (correct) {
    state.answering = true;
    playSoftClick(true);
    btn.classList.add("is-correct");
    btn.querySelector(".quiz-option__mark").textContent = "✓";
    document.querySelectorAll(".quiz-option").forEach((b) => (b.disabled = true));
    state.rakhisCollected++;
    updateRakhiTracker();
    setTimeout(advanceQuestion, 900);
  } else {
    playSoftClick(false);
    btn.classList.add("is-wrong");
    btn.querySelector(".quiz-option__mark").textContent = "✗";
    showRejection();
    document.querySelector(".quiz-card").classList.remove("is-shaking");
    void document.querySelector(".quiz-card").offsetWidth;
    document.querySelector(".quiz-card").classList.add("is-shaking");
    setTimeout(() => {
      btn.classList.remove("is-wrong");
      btn.querySelector(".quiz-option__mark").textContent = "";
    }, 550);
  }
}

function toggleMultipleOption(btn, idx) {
  if (state.answering) return;
  if (state.selectedMultiple.has(idx)) {
    state.selectedMultiple.delete(idx);
    btn.classList.remove("is-selected");
  } else {
    state.selectedMultiple.add(idx);
    btn.classList.add("is-selected");
  }
}

function handleMultipleSubmit() {
  if (state.answering) return;
  const q = QUIZ[state.currentQuestion];
  const allSelected = state.selectedMultiple.size === q.options.length;

  if (allSelected) {
    state.answering = true;
    playSoftClick(true);
    document.querySelectorAll(".quiz-option").forEach((b) => {
      b.disabled = true;
      b.classList.add("is-correct");
    });
    state.rakhisCollected++;
    updateRakhiTracker();
    setTimeout(finishQuiz, 900);
  } else {
    playSoftClick(false);
    showRejection();
    const card = document.querySelector(".quiz-card");
    card.classList.remove("is-shaking");
    void card.offsetWidth;
    card.classList.add("is-shaking");
  }
}

function advanceQuestion() {
  state.currentQuestion++;
  if (state.currentQuestion >= QUIZ.length) {
    finishQuiz();
  } else {
    renderQuestion();
  }
}

function finishQuiz() {
  document.getElementById("celebration-score").textContent =
    `${state.rakhisCollected}/${QUIZ.length} RAKHIS COLLECTED`;
  goToScreen("screen-celebration");
  playChime();
  runConfetti();
}

/* ============================================================
   CONFETTI — lightweight canvas particles
   ============================================================ */
function runConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const resize = () => {
    canvas.width = canvas.offsetWidth * dpr;
    canvas.height = canvas.offsetHeight * dpr;
  };
  resize();

  const colors = ["#cf9f52", "#e3c58a", "#a8354a", "#f7f1e6", "#8c2438"];
  const count = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 130;
  const particles = [];

  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -20 - Math.random() * canvas.height * 0.5,
      w: (4 + Math.random() * 6) * dpr,
      h: (8 + Math.random() * 10) * dpr,
      color: colors[Math.floor(Math.random() * colors.length)],
      speedY: (1.5 + Math.random() * 2.5) * dpr,
      speedX: (Math.random() - 0.5) * 2 * dpr,
      rotation: Math.random() * Math.PI,
      rotationSpeed: (Math.random() - 0.5) * 0.2,
      life: 0,
      maxLife: 260 + Math.random() * 120,
    });
  }

  let frame = 0;
  function tick() {
    frame++;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let alive = false;
    particles.forEach((p) => {
      if (p.life >= p.maxLife) return;
      alive = true;
      p.life++;
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      const fade = p.life > p.maxLife - 40 ? (p.maxLife - p.life) / 40 : 1;
      ctx.save();
      ctx.globalAlpha = Math.max(fade, 0);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    if (alive && frame < 420) {
      requestAnimationFrame(tick);
    }
  }
  if (count > 0) requestAnimationFrame(tick);
}

/* ============================================================
   SCREEN 4 — GIFT BOX
   ============================================================ */
function initGiftBox() {
  const box = document.getElementById("gift-box");
  box.addEventListener("click", () => {
    if (box.classList.contains("is-open")) return;
    box.classList.add("is-open");
    playChime();
    setTimeout(() => {
      goToScreen("screen-final");
      renderFinalPage();
    }, 1100);
  });
}

document.getElementById("claim-btn").addEventListener("click", () => {
  goToScreen("screen-gift");
});

/* ============================================================
   SCREEN 5 — FINAL PAGE
   ============================================================ */
let finalRendered = false;

function renderFinalPage() {
  if (finalRendered) return;
  finalRendered = true;

  const msgEl = document.getElementById("final-message");
  const paragraphs = CONFIG.message.trim().split(/\n\s*\n/);
  paragraphs.forEach((para, i) => {
    const p = document.createElement("p");
    p.textContent = para.trim();
    p.style.animationDelay = `${0.15 + i * 0.18}s`;
    msgEl.appendChild(p);
  });

  buildGallery();
}

function buildGallery() {
  const gallery = document.getElementById("gallery");
  const photos = CONFIG.photos || [];
  if (!photos.length) {
    gallery.closest(".gallery-section").hidden = true;
    return;
  }

  let activeIndex = 0;
  let autoplayTimer = null;

  const track = document.createElement("div");
  track.className = "gallery-track";

  photos.forEach((photo, i) => {
    const slide = document.createElement("div");
    slide.className = "gallery-slide";

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.title || `Memory ${i + 1}`;
    img.loading = "lazy";
    img.addEventListener("error", () => {
      slide.innerHTML = "";
      const ph = document.createElement("div");
      ph.className = "gallery-placeholder";
      ph.innerHTML = `
        <span class="gallery-placeholder__icon"></span>
        <span class="gallery-placeholder__text">Add your photo at<br><strong>${escapeHtml(photo.src)}</strong></span>
      `;
      slide.appendChild(ph);
    });
    slide.appendChild(img);

    if (photo.title || photo.caption) {
      const caption = document.createElement("div");
      caption.className = "gallery-slide__caption";
      if (photo.title) {
        const t = document.createElement("p");
        t.className = "gallery-slide__title";
        t.textContent = photo.title;
        caption.appendChild(t);
      }
      if (photo.caption) {
        const c = document.createElement("p");
        c.className = "gallery-slide__text";
        c.textContent = photo.caption;
        caption.appendChild(c);
      }
      slide.appendChild(caption);
    }

    track.appendChild(slide);
  });

  gallery.appendChild(track);

  if (photos.length > 1) {
    const prev = document.createElement("button");
    prev.className = "gallery-nav gallery-nav--prev";
    prev.setAttribute("aria-label", "Previous photo");
    prev.innerHTML = "&#8249;";

    const next = document.createElement("button");
    next.className = "gallery-nav gallery-nav--next";
    next.setAttribute("aria-label", "Next photo");
    next.innerHTML = "&#8250;";

    gallery.appendChild(prev);
    gallery.appendChild(next);

    const dots = document.createElement("div");
    dots.className = "gallery-dots";
    const dotEls = photos.map((_, i) => {
      const d = document.createElement("button");
      d.className = "gallery-dot" + (i === 0 ? " is-active" : "");
      d.setAttribute("aria-label", `Go to photo ${i + 1}`);
      d.addEventListener("click", () => goTo(i));
      dots.appendChild(d);
      return d;
    });
    gallery.appendChild(dots);

    function goTo(i) {
      activeIndex = (i + photos.length) % photos.length;
      track.style.transform = `translateX(-${activeIndex * 100}%)`;
      dotEls.forEach((d, idx) => d.classList.toggle("is-active", idx === activeIndex));
      restartAutoplay();
    }

    prev.addEventListener("click", () => goTo(activeIndex - 1));
    next.addEventListener("click", () => goTo(activeIndex + 1));

    // touch swipe
    let touchStartX = null;
    track.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );
    track.addEventListener(
      "touchend",
      (e) => {
        if (touchStartX === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(dx) > 40) goTo(activeIndex + (dx < 0 ? 1 : -1));
        touchStartX = null;
      },
      { passive: true }
    );

    function restartAutoplay() {
      clearInterval(autoplayTimer);
      autoplayTimer = setInterval(() => goTo(activeIndex + 1), 6000);
    }
    restartAutoplay();
    gallery.addEventListener("pointerdown", () => clearInterval(autoplayTimer));
  }
}

/* ============================================================
   INIT
   ============================================================ */
initPasswordScreen();
initRakhiTracker();
initGiftBox();
document.getElementById("password-input").focus();
