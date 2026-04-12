/* ═══════════════════════════════════════════════════════════
   RUFOS & PRISCA — FAIRE PART DE MARIAGE
   Script Premium — Optimisé Mobile
   ═══════════════════════════════════════════════════════════ */

/* ─── Détection mobile ───────────────────────────────────── */
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
              || window.innerWidth <= 768;

/* ─── 1. LOADING SCREEN ─────────────────────────────────── */
window.addEventListener('load', () => {
    const loadingScreen = document.getElementById('loading-screen');

    // Mobile : intro courte (1.4s) | Desktop : cinématique (2.6s)
    const delay = isMobile ? 1400 : 2600;

    setTimeout(() => {
        loadingScreen.classList.add('hidden');

        setTimeout(() => {
            // Confetti seulement sur desktop (trop lourd sur mobile)
            if (!isMobile) fireConfetti();

            AOS.init({
                once:     true,
                offset:   isMobile ? 30 : 80,
                duration: isMobile ? 500 : 900,
                easing:   'ease-out-cubic',
                disable:  false,
            });
        }, isMobile ? 300 : 700);
    }, delay);
});

/* ─── 2. CONFETTI BURST ──────────────────────────────────── */
function fireConfetti() {
    const colors = ['#D4AF37', '#B53E0F', '#FFF8E7', '#2E5D4B', '#FFFFFF', '#FCF6BA'];
    const count = 90;

    for (let i = 0; i < count; i++) {
        createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
    }
}

function createConfettiPiece(color) {
    const piece = document.createElement('div');
    const size  = Math.random() * 9 + 4;
    const isCircle = Math.random() > 0.5;

    Object.assign(piece.style, {
        position:         'fixed',
        top:              '-12px',
        left:             Math.random() * 100 + 'vw',
        width:            size + 'px',
        height:           size + 'px',
        background:       color,
        zIndex:           '9997',
        borderRadius:     isCircle ? '50%' : '2px',
        pointerEvents:    'none',
        opacity:          '1',
        animation:        `confettiFall ${Math.random() * 2.5 + 1.5}s ease-in forwards`,
        animationDelay:   Math.random() * 1.2 + 's',
    });

    document.body.appendChild(piece);
    piece.addEventListener('animationend', () => piece.remove());
}

/* ─── 3. CANVAS PETAL ANIMATION ─────────────────────────── */
const canvas  = document.getElementById('petals-canvas');

// Sur mobile : on désactive le canvas complètement (économise CPU/batterie)
if (isMobile) {
    canvas.style.display = 'none';
}

const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

if (!isMobile) {
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
}

class Petal {
    constructor(randomY) {
        this.reset(randomY);
    }

    reset(startY) {
        this.x        = Math.random() * canvas.width;
        this.y        = startY !== undefined ? Math.random() * canvas.height : -20;
        this.w        = Math.random() * 14 + 7;
        this.h        = Math.random() * 9  + 5;
        this.speed    = Math.random() * 0.8 + 0.3;
        this.angle    = Math.random() * Math.PI * 2;
        this.rotSpeed = (Math.random() - 0.5) * 0.04;
        this.drift    = (Math.random() - 0.5) * 0.5;
        this.opacity  = Math.random() * 0.5 + 0.2;

        // Mix of gold, cream, and light petals
        const palette = [
            `rgba(212,175,55,${this.opacity})`,
            `rgba(255,248,231,${this.opacity})`,
            `rgba(251,245,183,${this.opacity})`,
            `rgba(255,215,0,${this.opacity * 0.7})`,
        ];
        this.color = palette[Math.floor(Math.random() * palette.length)];
    }

    update() {
        this.y     += this.speed;
        this.x     += this.drift;
        this.angle += this.rotSpeed;
        if (this.y > canvas.height + 20) this.reset();
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.beginPath();
        ctx.ellipse(0, 0, this.w / 2, this.h / 2, 0, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
}

const PETAL_COUNT = 28;
const petals = [];

if (!isMobile) {
    for (let i = 0; i < PETAL_COUNT; i++) {
        petals.push(new Petal(true));
    }

    function animatePetals() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        petals.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animatePetals);
    }

    animatePetals();
}

/* ─── 4. SCROLL PROGRESS BAR ─────────────────────────────── */
const progressBar = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    const scrollTop  = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress   = (scrollTop / scrollHeight) * 100;
    progressBar.style.width = progress + '%';

    // Shrink nav on scroll
    const header = document.querySelector('.header');
    if (scrollTop > 60) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
}, { passive: true });

/* ─── 5. MOBILE MENU ────────────────────────────────────── */
const mobileMenu = document.getElementById('mobile-menu');
const navLinks   = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

/* ─── 6. DUAL COUNTDOWN TIMERS ─────────────────────────── */
function startCountdown(targetDate, ids, containerId, doneMsg) {
    const target = new Date(targetDate).getTime();

    // Remplir immédiatement (pas attendre 1s)
    update();

    const interval = setInterval(update, 1000);

    function update() {
        const gap = target - Date.now();

        if (gap < 0) {
            clearInterval(interval);
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML =
                    '<span style="font-family:var(--font-script);font-size:1.4rem;color:var(--gold-solid)">' + doneMsg + '</span>';
            }
            return;
        }

        const d = Math.floor(gap / 86400000);
        const h = Math.floor((gap % 86400000) / 3600000);
        const m = Math.floor((gap % 3600000)  /   60000);
        const s = Math.floor((gap %   60000)  /    1000);
        const fmt = n => String(n).padStart(2, '0');

        const el = id => document.getElementById(id);
        if (el(ids[0])) el(ids[0]).textContent = fmt(d);
        if (el(ids[1])) el(ids[1]).textContent = fmt(h);
        if (el(ids[2])) el(ids[2]).textContent = fmt(m);
        if (el(ids[3])) el(ids[3]).textContent = fmt(s);
    }
}

// Countdown 1 : La Dot — 28 Nov 2026
startCountdown('November 28, 2026 10:00:00',
    ['days', 'hours', 'minutes', 'seconds'],
    'countdown',
    'Le grand jour est arrivé ! ✨');

// Countdown 2 : Mariage Civil — 20 Fév 2027
startCountdown('February 20, 2027 14:00:00',
    ['days2', 'hours2', 'minutes2', 'seconds2'],
    'countdown-civil',
    'Le mariage civil, c\'est maintenant ! 💍');

/* ─── 7. SMOOTH SCROLL ──────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.getBoundingClientRect().top + window.scrollY - 70;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});

/* ─── 8. MUSIC PLAYER ───────────────────────────────────── */
const musicBtn  = document.getElementById('music-toggle');
const bgMusic   = document.getElementById('bg-music');
const musicIcon = document.getElementById('music-icon');
let   isPlaying = false;
let   musicUnlocked = false;

// Réglage du volume (doux en fond)
bgMusic.volume = 0.35;

function playMusic() {
    bgMusic.play().then(() => {
        isPlaying    = true;
        musicUnlocked = true;
        musicIcon.textContent = '⏸';
        musicBtn.classList.add('playing');
        musicBtn.title = 'Don\'t Play with me — Thompsxn Therapy';
    }).catch(() => {});
}

function pauseMusic() {
    bgMusic.pause();
    isPlaying = false;
    musicIcon.textContent = '♪';
    musicBtn.classList.remove('playing');
}

// Bouton play/pause manuel
musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
});

// Sur mobile : la musique ne peut démarrer qu'après une interaction utilisateur.
// On attend le premier toucher sur la page pour lancer automatiquement.
function unlockAndPlay() {
    if (!musicUnlocked) {
        playMusic();
    }
    document.removeEventListener('touchstart', unlockAndPlay);
    document.removeEventListener('click',      unlockAndPlay);
}

document.addEventListener('touchstart', unlockAndPlay, { once: true, passive: true });
document.addEventListener('click',      unlockAndPlay, { once: true });

// Petit tooltip discret sur le bouton musique
musicBtn.setAttribute('title', 'Don\'t Play with me — Thompsxn Therapy');

/* ─── 9. TICKET SPARKLE ON HOVER (desktop seulement) ────── */
document.querySelectorAll('.event-ticket').forEach(ticket => {
    ticket.addEventListener(isMobile ? 'touchstart' : 'mouseenter', () => {
        const rect = ticket.getBoundingClientRect();
        spawnSparkle(rect.left + rect.width / 2, rect.top + window.scrollY);
    });
});

function spawnSparkle(x, y) {
    for (let i = 0; i < 6; i++) {
        const s = document.createElement('div');
        const angle = (i / 6) * 360;
        const dist  = Math.random() * 40 + 20;
        Object.assign(s.style, {
            position:   'absolute',
            left:       x + 'px',
            top:        y + 'px',
            width:      '6px',
            height:     '6px',
            background: '#D4AF37',
            borderRadius: '50%',
            pointerEvents: 'none',
            zIndex:     '500',
            transform:  `translate(-50%, -50%)`,
            animation:  `sparkleMove ${0.6 + Math.random() * 0.4}s ease-out forwards`,
        });

        // Use CSS custom props for direction
        s.style.setProperty('--sx', Math.cos((angle * Math.PI) / 180) * dist + 'px');
        s.style.setProperty('--sy', Math.sin((angle * Math.PI) / 180) * dist + 'px');

        document.body.appendChild(s);
        s.addEventListener('animationend', () => s.remove());
    }
}

// Add sparkle keyframes dynamically once
(function addSparkleKeyframes() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkleMove {
            0%   { transform: translate(-50%,-50%) scale(1); opacity:1; }
            100% { transform: translate(calc(-50% + var(--sx)), calc(-50% + var(--sy))) scale(0); opacity:0; }
        }
    `;
    document.head.appendChild(style);
})();

/* ─── 10. RSVP FORM ─────────────────────────────────────── */
const rsvpForm    = document.getElementById('rsvp-form');
const rsvpSuccess = document.getElementById('rsvp-success');
const guestMinus  = document.getElementById('guest-minus');
const guestPlus   = document.getElementById('guest-plus');
const guestDisplay= document.getElementById('guest-display');
const guestInput  = document.getElementById('guest-input');
const submitBtn   = document.querySelector('.btn-rsvp-submit');
const submitText  = document.getElementById('btn-submit-text');
let   guestCount  = 1;

// ── Compteur de personnes ──
guestMinus.addEventListener('click', () => {
    if (guestCount > 1) {
        guestCount--;
        guestDisplay.textContent = guestCount;
        guestInput.value = guestCount;
        guestDisplay.style.transform = 'scale(1.3)';
        setTimeout(() => guestDisplay.style.transform = 'scale(1)', 200);
    }
});

guestPlus.addEventListener('click', () => {
    if (guestCount < 20) {
        guestCount++;
        guestDisplay.textContent = guestCount;
        guestInput.value = guestCount;
        guestDisplay.style.transform = 'scale(1.3)';
        setTimeout(() => guestDisplay.style.transform = 'scale(1)', 200);
    }
});

// ── Soumission via Formspree (AJAX) ──
if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validation : au moins un événement coché
        const checked = rsvpForm.querySelectorAll('input[name="evenements"]:checked');
        if (checked.length === 0) {
            showFormError('Veuillez sélectionner au moins un événement. 💍');
            return;
        }

        // Désactiver le bouton
        submitBtn.disabled = true;
        submitText.textContent = 'Envoi en cours…';

        const data = new FormData(rsvpForm);

        try {
            const response = await fetch(rsvpForm.action, {
                method:  'POST',
                body:    data,
                headers: { 'Accept': 'application/json' },
            });

            if (response.ok) {
                // Succès
                rsvpForm.style.animation = 'fadeOutForm 0.4s ease forwards';
                setTimeout(() => {
                    rsvpForm.style.display    = 'none';
                    rsvpSuccess.style.display = 'block';
                    rsvpSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 400);
            } else {
                const json = await response.json();
                if (json.errors) {
                    showFormError('Une erreur est survenue. Vérifiez vos informations.');
                }
                submitBtn.disabled = false;
                submitText.textContent = 'Confirmer ma Présence ✦';
            }
        } catch {
            showFormError('Erreur réseau. Vérifiez votre connexion et réessayez.');
            submitBtn.disabled = false;
            submitText.textContent = 'Confirmer ma Présence ✦';
        }
    });
}

function showFormError(msg) {
    let err = document.getElementById('form-error');
    if (!err) {
        err = document.createElement('p');
        err.id = 'form-error';
        Object.assign(err.style, {
            color:        'var(--primary-color)',
            fontSize:     '0.85rem',
            marginTop:    '12px',
            textAlign:    'center',
            fontWeight:   '600',
            padding:      '10px',
            borderRadius: '6px',
            background:   'rgba(181,62,15,0.07)',
        });
        submitBtn.insertAdjacentElement('afterend', err);
    }
    err.textContent = msg;
    setTimeout(() => err.remove(), 4000);
}

// Animation fadeOut du formulaire
(function () {
    const s = document.createElement('style');
    s.textContent = `@keyframes fadeOutForm {
        to { opacity: 0; transform: translateY(-10px); }
    }`;
    document.head.appendChild(s);
})();

/* ─── 12. COLOUR SWATCH TOOLTIPS ────────────────────────── */
document.querySelectorAll('.color-swatch').forEach(swatch => {
    swatch.addEventListener('mouseenter', function () {
        const tip = document.createElement('div');
        tip.textContent = this.title;
        Object.assign(tip.style, {
            position:   'absolute',
            background: 'var(--dark-brown)',
            color:      'var(--gold-solid)',
            padding:    '3px 10px',
            borderRadius: '4px',
            fontSize:   '0.72rem',
            pointerEvents: 'none',
            zIndex:     '1000',
            whiteSpace: 'nowrap',
            transform:  'translateX(-50%)',
            marginTop:  '6px',
        });
        this.style.position = 'relative';
        this.appendChild(tip);
    });

    swatch.addEventListener('mouseleave', function () {
        const tip = this.querySelector('div');
        if (tip) tip.remove();
    });
});
