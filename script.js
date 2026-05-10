const opening = document.getElementById("opening");
const enterSite = document.getElementById("enterSite");
const musicToggle = document.getElementById("musicToggle");
const heartButton = document.getElementById("heartButton");
const letterSeal = document.getElementById("letterSeal");
const finalSurprise = document.getElementById("finalSurprise");
const modal = document.getElementById("modal");
const modalClose = document.getElementById("modalClose");
const modalTitle = document.getElementById("modalTitle");
const modalText = document.getElementById("modalText");
const canvas = document.getElementById("sparkleCanvas");
const ctx = canvas.getContext("2d");
const songPlayer = document.getElementById("songPlayer");
const bgSong = document.getElementById("bgSong");
const songClose = document.getElementById("songClose");

let musicPlaying = false;
let particles = [];
let particleFrame = 0;
let particleAnimationId = null;

function isMobileView() {
    return window.innerWidth <= 768;
}

function resizeCanvas() {
    const pixelRatio = isMobileView() ? 1 : Math.min(window.devicePixelRatio || 1, 1.75);
    canvas.width = window.innerWidth * pixelRatio;
    canvas.height = window.innerHeight * pixelRatio;
    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}

function createParticle(x, y, burst = false) {
    const colors = ["#d94f76", "#f27663", "#d9a441", "#72b6a1", "#ffffff"];
    return {
        x,
        y,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: burst ? Math.random() * 6 + 3 : Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * (burst ? 9 : 1.2),
        speedY: burst ? (Math.random() - 0.7) * 8 : Math.random() * 1.8 + 0.6,
        life: burst ? 90 : 220,
        rotation: Math.random() * Math.PI
    };
}

function sprinkle(count = 38, x = window.innerWidth / 2, y = window.innerHeight / 2) {
    const total = isMobileView() ? Math.min(count, 14) : count;

    for (let i = 0; i < total; i++) {
        particles.push(createParticle(x, y, true));
    }

    startParticles();
}

function startParticles() {
    if (particleAnimationId === null) {
        particleAnimationId = requestAnimationFrame(drawParticles);
    }
}

function drawParticles() {
    particleFrame += 1;

    if (document.hidden || (isMobileView() && particleFrame % 2 !== 0)) {
        particleAnimationId = requestAnimationFrame(drawParticles);
        return;
    }

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

    const maxParticles = isMobileView() ? 28 : 180;
    const spawnChance = 0.84;

    if (!isMobileView() && particles.length < maxParticles && Math.random() > spawnChance) {
        particles.push(createParticle(Math.random() * window.innerWidth, -10));
    }

    particles = particles.filter((particle) => particle.life > 0).slice(-maxParticles);

    particles.forEach((particle) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.speedY += 0.025;
        particle.rotation += 0.04;
        particle.life -= 1;

        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.globalAlpha = Math.max(particle.life / 120, 0);
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 1.7);
        ctx.restore();
    });

    if (particles.length > 0 || !isMobileView()) {
        particleAnimationId = requestAnimationFrame(drawParticles);
    } else {
        particleAnimationId = null;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    }
}

function setSongButton(isPlaying) {
    musicPlaying = isPlaying;
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
    musicToggle.innerHTML = `<span class="music-icon"></span> ${isPlaying ? "Song Playing" : "Song"}`;
}

function toggleMusic(forcePlay = false) {
    if (!musicPlaying || forcePlay) {
        setSongButton(true);
        songPlayer.classList.add("show");
        bgSong.volume = 0.85;
        bgSong.play().catch(() => {
            setSongButton(false);
            songPlayer.classList.add("show");
        });
        return;
    }

    setSongButton(false);
    bgSong.pause();
}

function showModal(title, text) {
    modalTitle.textContent = title;
    modalText.textContent = text;
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    sprinkle(55);
}

function hideModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
}

enterSite.addEventListener("click", () => {
    opening.classList.add("hidden");
    document.body.classList.remove("locked");
    sprinkle(isMobileView() ? 28 : 90);
    toggleMusic(true);
});

musicToggle.addEventListener("click", () => toggleMusic());

songClose.addEventListener("click", () => {
    setSongButton(false);
    songPlayer.classList.remove("show");
    bgSong.pause();
    bgSong.currentTime = 0;
});

bgSong.addEventListener("play", () => setSongButton(true));
bgSong.addEventListener("pause", () => {
    if (!bgSong.ended) {
        setSongButton(false);
    }
});

heartButton.addEventListener("click", () => {
    showModal(
        "Ami, meri jaan",
        "Aapki wajah se meri zindagi mein himmat, barkat aur roshni hai. Main har din Allah ka shukar karta hoon ke mujhe aap jaisi maa mili."
    );
});

letterSeal.addEventListener("click", () => {
    letterSeal.closest(".letter-card").classList.add("open");
    sprinkle(isMobileView() ? 24 : 70, window.innerWidth / 2, window.innerHeight / 2);
});

document.querySelectorAll(".gift-card").forEach((gift, index) => {
    gift.addEventListener("click", () => {
        const titles = ["Flowers For Ami", "Warm Hug", "Respect", "Dua"];
        const rect = gift.getBoundingClientRect();
        showModal(titles[index], gift.dataset.gift);
        sprinkle(isMobileView() ? 18 : 50, rect.left + rect.width / 2, rect.top + rect.height / 2);
    });
});

document.querySelectorAll(".memory").forEach((memory) => {
    memory.addEventListener("mouseenter", () => {
        document.querySelectorAll(".memory").forEach((item) => item.classList.remove("active"));
        memory.classList.add("active");
    });
});

finalSurprise.addEventListener("click", () => {
    showModal(
        "Final Surprise",
        "Ami, ye poori website sirf aik baat kehne ke liye hai: aap meri sab se bari blessing hain. Happy Mother's Day."
    );
});

modalClose.addEventListener("click", hideModal);

modal.addEventListener("click", (event) => {
    if (event.target === modal) {
        hideModal();
    }
});

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        hideModal();
    }
});

window.addEventListener("resize", resizeCanvas);

document.body.classList.add("locked");
resizeCanvas();
if (!isMobileView()) {
    startParticles();
}
