// add class active to header on scroll

let header = document.querySelector("header")

window.onscroll = function(){
    if (this.scrollY >= 50) {
        header.classList.add("active")
    }else{
        header.classList.remove("active")
    }
}

let nav_links = document.getElementById("links");

function Open_colose_Menu() {
    nav_links.classList.toggle("active")
}

// Reveal animations: add .loaded to body when DOM is ready so page-specific
// CSS (Courses.css) can animate elements into view.
document.addEventListener('DOMContentLoaded', function () {
    try {
        document.body.classList.add('loaded');
    } catch (e) {
        // fail silently if body not available
    }
});

// On page load, check session user and update navbar UI
// - Hide the Sign In / Up icon if logged in
// - Replace the user profile icon text with the user's first name
document.addEventListener('DOMContentLoaded', async function () {
    try {
        const isPages = window.location.pathname.toLowerCase().includes('/pages/');
        const prefix = isPages ? '../' : '';
        // Hide User Profile icon by default; it will be shown only when logged in
        try {
            const baseUserLink = document.querySelector('a[title="User Profile"]');
            if (baseUserLink) baseUserLink.style.display = 'none';
        } catch (_) {}
        const res = await fetch(prefix + 'current_user.php', { credentials: 'same-origin' });
        const data = await res.json().catch(() => ({}));
        if (res.ok && data && data.success && data.user && data.user.firstname) {
            // Mark session state and handle pending redirect
            window.__isLoggedIn = true;
            try {
                const pending = localStorage.getItem('postLoginRedirect');
                if (pending) {
                    localStorage.removeItem('postLoginRedirect');
                    const target = (isPages ? '../' : '') + pending.replace(/^\/?/, '');
                    window.location.href = target;
                    return;
                }
            } catch (_) {}
            const loginLink = document.querySelector('a[title="Sign In / Up"]');
            if (loginLink) loginLink.style.display = 'none';

            const userLink = document.querySelector('a[title="User Profile"]');
            if (userLink) {
                userLink.style.display = 'inline-flex';
                userLink.removeAttribute('target'); // avoid opening a new tab
                userLink.href = '#';
                userLink.innerHTML = ` ${data.user.firstname}`;
            }

            // Insert logout icon next to Facebook when logged in
            let existingLogout = document.querySelector('a[title="Logout"]');
            if (!existingLogout) {
                const logoutLink = document.createElement('a');
                logoutLink.title = 'Logout';
                logoutLink.href = '#';
                logoutLink.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
                const fbLink = document.querySelector('a[title="facebook"]');
                if (fbLink && fbLink.parentElement) {
                    fbLink.insertAdjacentElement('afterend', logoutLink);
                } else {
                    const icons = document.querySelector('header .icons');
                    if (icons) icons.appendChild(logoutLink);
                }
                logoutLink.addEventListener('click', async function (e) {
                    e.preventDefault();
                    try {
                        await fetch(prefix + 'logout.php', { method: 'POST', credentials: 'same-origin' });
                    } catch (err) {
                        // ignore network errors; attempt to continue
                    } finally {
                        window.location.href = isPages ? '../index.html' : 'index.html';
                    }
                });
            }
        }
    } catch (e) {
        // Ignore errors to avoid breaking the UI
    }
});
document.addEventListener('DOMContentLoaded', function () {
    // نجيب كل أزرار read-more
    const buttons = document.querySelectorAll('.read-more');

    buttons.forEach(function(btn) {
        btn.addEventListener('click', function () {
            // نفترض أن <p class="card-desc"> قبل الزر مباشرة
            const cardDesc = this.previousElementSibling;
            if (cardDesc && cardDesc.classList.contains('card-desc')) {
                cardDesc.classList.toggle('expanded');
                this.textContent = cardDesc.classList.contains('expanded') ? 'Read Less' : 'Read More';
            }
        });
    });
});



// Gate "Register Now" buttons: require login, then continue to registration
// (function installRegisterGate() {
//     if (window.__registerGateInstalled) return;
//     window.__registerGateInstalled = true;

//     document.addEventListener('click', async function (e) {
//         const link = e.target && e.target.closest && e.target.closest('a.register-btn');
//         if (!link) return;
//         e.preventDefault();

//         const href = link.getAttribute('href') || 'pages/Register.html';
//         const onPages = window.location.pathname.toLowerCase().includes('/pages/');
//         const prefix = onPages ? '../' : '';

//         let logged = !!window.__isLoggedIn;
//         if (!logged) {
//             try {
//                 const res = await fetch(prefix + 'current_user.php', { credentials: 'same-origin' });
//                 const data = await res.json().catch(() => ({}));
//                 logged = !!(res.ok && data && data.success && data.user);
//                 window.__isLoggedIn = logged;
//             } catch (_) {
//                 logged = false;
//             }
//         }

//         if (logged) {
//             window.location.href = href;
//         } else {
//             try { localStorage.setItem('postLoginRedirect', href); } catch (_) {}
//             window.location.href = onPages ? 'Login.html' : 'pages/Login.html';
//         }
//     });
// })();


(function parallaxHero(){let t=false;const e=document.querySelector('.hero .person');if(!e)return;const n=()=>{const o=window.scrollY*0.12;e.style.transform=`translateY(${o}px)`;t=false};window.addEventListener('scroll',()=>{if(!t){t=true;requestAnimationFrame(n)}},{passive:true});})();
// WhatsApp floating chat button injector for all pages
(function installWhatsAppFloat() {
  if (window.__wpFloatInjected) return;
  window.__wpFloatInjected = true;

  var css = `
  .whatsapp-float {
    position: fixed;
    right: 22px;
    bottom: 22px;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #25d366, #1ebe5d);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    z-index: 1000;
    opacity: 0.95;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
    transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
    animation: wpPulse 3s ease-out infinite;
  }
  .whatsapp-float:hover {
    transform: translateY(-2px);
    opacity: 1;
    box-shadow: 0 10px 24px rgba(37, 211, 102, 0.5);
    animation-play-state: paused;
  }
  .whatsapp-float svg {
    width: 26px;
    height: 26px;
    display: block;
    fill: #fff;
  }
  @keyframes wpPulse {
    0% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0.55); }
    70% { box-shadow: 0 0 0 18px rgba(37, 211, 102, 0); }
    100% { box-shadow: 0 0 0 0 rgba(37, 211, 102, 0); }
  }
  @media (max-width: 600px) {
    .whatsapp-float { width: 50px; height: 50px; right: 16px; bottom: 16px; }
    .whatsapp-float svg { width: 24px; height: 24px; }
  }`;

  document.addEventListener('DOMContentLoaded', function () {
    try {
      // Inject CSS once
      if (!document.getElementById('wp-float-style')) {
        var style = document.createElement('style');
        style.id = 'wp-float-style';
        style.textContent = css;
        document.head.appendChild(style);
      }

      // If button already exists on a page (e.g., index.html), do not add another
      if (!document.querySelector('.whatsapp-float')) {
        var btn = document.createElement('a');
        btn.href = 'https://api.whatsapp.com/send?phone=201122095549';
        btn.className = 'whatsapp-float';
        btn.target = '_blank';
        btn.rel = 'noopener';
        btn.setAttribute('aria-label', 'Chat on WhatsApp');
        btn.title = 'Chat on WhatsApp';
        // Inline SVG to avoid dependency on icon fonts
        btn.innerHTML = '<svg viewBox="0 0 32 32" aria-hidden="true" focusable="false"><path d="M19.11 17.39c-.26-.13-1.56-.77-1.8-.86-.24-.09-.41-.13-.58.13-.17.26-.67.86-.82 1.04-.15.17-.3.2-.56.07-.26-.13-1.1-.4-2.1-1.28-.78-.69-1.31-1.54-1.47-1.8-.15-.26-.02-.4.11-.53.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.32-.02-.45-.07-.13-.58-1.4-.8-1.9-.21-.5-.42-.43-.58-.43-.15 0-.32-.02-.49-.02s-.45.06-.68.32c-.24.26-.89.87-.89 2.12 0 1.25.91 2.46 1.04 2.63.13.17 1.79 2.74 4.33 3.84.61.26 1.09.41 1.46.52.61.19 1.16.16 1.59.1.49-.07 1.56-.64 1.78-1.27.22-.63.22-1.17.15-1.28-.06-.11-.24-.17-.49-.29zM16.02 5.33c-5.88 0-10.66 4.66-10.66 10.4 0 1.84.52 3.57 1.43 5.05l-1.52 5.56 5.82-1.53c1.43.78 3.08 1.22 4.83 1.22 5.88 0 10.66-4.66 10.66-10.4s-4.78-10.4-10.66-10.4zm0 18.93c-1.57 0-3.03-.45-4.26-1.22l-.3-.19-3.45.9.92-3.36-.2-.32c-.83-1.29-1.27-2.76-1.27-4.32 0-4.49 3.75-8.14 8.36-8.14s8.36 3.65 8.36 8.14-3.75 8.14-8.36 8.14z"></path></svg>';
        document.body.appendChild(btn);
      }
    } catch (e) { /* ignore to avoid breaking page */ }
  });
})();