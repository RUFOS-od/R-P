/* ═══════════════════════════════════════════════════════════
   RUFOS & PRISCA — FAIRE PART DE MARIAGE
   Script Premium — Optimisé Mobile
   ═══════════════════════════════════════════════════════════ */

/* ─── Détection mobile ───────────────────────────────────── */
const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
              || window.innerWidth <= 768;

/* ─── 1. LOADING SCREEN ─────────────────────────────────── */
window.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');

    // Mobile : intro courte (1.4s) | Desktop : cinématique (2.6s)
    const delay = isMobile ? 1400 : 2600;

    setTimeout(() => {
        loadingScreen.classList.add('hidden');

        setTimeout(() => {
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

/* ─── 4. SCROLL PROGRESS BAR ─────────────────────────────── */
const progressBar = document.getElementById('scroll-progress');
const header      = document.querySelector('.header');
let   scrollTicking = false;

function updateScrollUI() {
    const scrollTop     = document.documentElement.scrollTop || document.body.scrollTop;
    const scrollHeight  = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress      = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = progress + '%';

    // Shrink nav on scroll
    if (scrollTop > 60) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    scrollTicking = false;
}

window.addEventListener('scroll', () => {
    if (!scrollTicking) {
        requestAnimationFrame(updateScrollUI);
        scrollTicking = true;
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
    const target   = new Date(targetDate).getTime();
    const elements = ids.map(id => document.getElementById(id));
    let   interval;

    function update() {
        const gap = target - Date.now();

        if (gap < 0) {
            clearInterval(interval);
            const container = document.getElementById(containerId);
            if (container) {
                container.innerHTML = '<span class="countdown-done">' + doneMsg + '</span>';
            }
            return;
        }

        const d = Math.floor(gap / 86400000);
        const h = Math.floor((gap % 86400000) / 3600000);
        const m = Math.floor((gap % 3600000)  /   60000);
        const s = Math.floor((gap %   60000)  /    1000);
        const fmt = n => String(n).padStart(2, '0');

        if (elements[0]) elements[0].textContent = fmt(d);
        if (elements[1]) elements[1].textContent = fmt(h);
        if (elements[2]) elements[2].textContent = fmt(m);
        if (elements[3]) elements[3].textContent = fmt(s);
    }

    // Remplir immédiatement (pas attendre 1s) — `interval` doit exister avant cet appel :
    // si la date cible est déjà passée, update() appelle clearInterval(interval) tout de suite.
    interval = setInterval(update, 1000);
    update();
}

// Côte d'Ivoire est en UTC+0 toute l'année (pas de changement d'heure) :
// on fixe l'offset explicitement pour que le compte à rebours soit correct
// quel que soit le fuseau horaire du visiteur.

// Countdown 1 : La Dot — 28 Nov 2026, 10h, Yamoussoukro
startCountdown('2026-11-28T10:00:00Z',
    ['days', 'hours', 'minutes', 'seconds'],
    'countdown',
    'Le grand jour est arrivé ! ✨');

// Countdown 2 : Mariage Civil — 20 Fév 2027, 14h, Abidjan
startCountdown('2027-02-20T14:00:00Z',
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
let   isPlaying        = false;
let   userPaused       = false;
let   autoplayAttempts = 0;
const MAX_AUTOPLAY_ATTEMPTS = 10;

// Réglage du volume (très doux en fond)
bgMusic.volume = 0.07;

function setPlayingState(playing) {
    isPlaying = playing;
    musicIcon.textContent = playing ? '⏸' : '♪';
    musicBtn.classList.toggle('playing', playing);
}

function playMusic() {
    userPaused = false;
    bgMusic.play().then(() => setPlayingState(true)).catch(() => {});
}

function pauseMusic() {
    userPaused = true;
    bgMusic.pause();
    setPlayingState(false);
}

// Bouton play/pause manuel
musicBtn.addEventListener('click', () => {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
});

musicBtn.setAttribute('title', 'Don\'t Play with me — Thompsxn Therapy');

// Lancer la musique automatiquement dès que possible.
// Les navigateurs bloquent l'autoplay sans interaction : on réessaie un nombre
// limité de fois, et on s'arrête dès que l'utilisateur a mis en pause manuellement
// (sinon une tentative programmée avant la pause pouvait relancer le son après coup).
function autoPlayMusic() {
    if (userPaused || isPlaying || autoplayAttempts >= MAX_AUTOPLAY_ATTEMPTS) return;
    autoplayAttempts++;
    bgMusic.play().then(() => setPlayingState(true)).catch(() => {
        setTimeout(autoPlayMusic, 500);
    });
}

autoPlayMusic();

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
let   guestPulseTimeout = null;
const GUEST_MIN = 1;
const GUEST_MAX = 20;

// ── Compteur de personnes ──
function updateGuestCounter() {
    guestDisplay.textContent = guestCount;
    guestInput.value = guestCount;
    guestMinus.disabled = guestCount <= GUEST_MIN;
    guestPlus.disabled  = guestCount >= GUEST_MAX;

    clearTimeout(guestPulseTimeout);
    guestDisplay.style.transform = 'scale(1.3)';
    guestPulseTimeout = setTimeout(() => guestDisplay.style.transform = 'scale(1)', 200);
}

guestMinus.addEventListener('click', () => {
    if (guestCount > GUEST_MIN) {
        guestCount--;
        updateGuestCounter();
    }
});

guestPlus.addEventListener('click', () => {
    if (guestCount < GUEST_MAX) {
        guestCount++;
        updateGuestCounter();
    }
});

updateGuestCounter();

// ── Soumission via Formspree (AJAX) ──
if (rsvpForm) {
    rsvpForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validation : au moins un événement coché
        const checked = rsvpForm.querySelectorAll('input[name="evenements"]:checked');
        if (checked.length === 0) {
            showFormError('Veuillez sélectionner au moins un événement.');
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
                    rsvpSuccess.focus();
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
        err.className = 'form-error';
        err.setAttribute('role', 'alert');
        submitBtn.insertAdjacentElement('afterend', err);
    }
    err.textContent = msg;
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
