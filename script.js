// Initialize AOS (Animate on Scroll)
AOS.init({
    once: true, // Whether animation should happen only once - while scrolling down
    offset: 100, // Offset (in px) from the original trigger point
});

// Mobile Menu Toggle
const mobileMenu = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

mobileMenu.addEventListener('click', () => {
    mobileMenu.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links li a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Countdown Timer (Target: La Dot - Nov 28, 2026)
const weddingDate = new Date('November 28, 2026 10:00:00').getTime();

const countdown = setInterval(() => {
    const now = new Date().getTime();
    const gap = weddingDate - now;

    // Time calculations
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(gap / day);
    const hours = Math.floor((gap % day) / hour);
    const minutes = Math.floor((gap % hour) / minute);
    const seconds = Math.floor((gap % minute) / second);

    // Update HTML
    document.getElementById('days').innerText = days < 10 ? '0' + days : days;
    document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
    document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
    document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;

    // If the count down is finished, write some text
    if (gap < 0) {
        clearInterval(countdown);
        document.getElementById('countdown').innerHTML = "<h2>Le grand jour est arrivé !</h2>";
    }
}, 1000);

// Smooth Scroll for anchor links (safeguard for older browsers)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
