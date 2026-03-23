/* ═══════════════════════════════════════════════════════════
   Sumit Singh Portfolio — Enhanced Animations Script
   Custom cursor, page loader, scroll reveals, parallax, 
   magnetic buttons, 3D card tilt, count-up, marquee
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ─────────── 0. THEME TOGGLE ───────────
  const themeToggle = document.getElementById('themeToggle');
  const storedTheme = localStorage.getItem('theme');
  
  if (storedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }

  // ─────────── 1. CUSTOM CURSOR ───────────
  const cursor = document.querySelector('.cursor');
  const follower = document.querySelector('.cursor-follower');
  let cursorX = 0, cursorY = 0;
  let followerX = 0, followerY = 0;

  if (cursor && follower) {
    document.addEventListener('mousemove', (e) => {
      cursorX = e.clientX;
      cursorY = e.clientY;
      cursor.style.left = cursorX + 'px';
      cursor.style.top = cursorY + 'px';
    });

    function updateFollower() {
      followerX += (cursorX - followerX) * 0.12;
      followerY += (cursorY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(updateFollower);
    }
    requestAnimationFrame(updateFollower);

    // Cursor hover states
    const hoverEls = document.querySelectorAll('a, button, .btn, .tag, .project-card, .skill-card, .cert-card, .repo-card, .stat-card, input, textarea');
    hoverEls.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('hover');
        follower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('hover');
        follower.classList.remove('hover');
      });
    });

    // Text hover for headings
    const headings = document.querySelectorAll('h1, h2, .hero-tagline');
    headings.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.classList.add('text-hover');
        cursor.classList.remove('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursor.classList.remove('text-hover');
      });
    });
  }


  // ─────────── 2. PAGE LOADER ───────────
  const loader = document.querySelector('.page-loader');
  const counter = document.querySelector('.loader-counter');
  if (loader) {
    let count = 0;
    const interval = setInterval(() => {
      count += Math.floor(Math.random() * 8) + 2;
      if (count >= 100) {
        count = 100;
        clearInterval(interval);
        setTimeout(() => loader.classList.add('loaded'), 300);
      }
      if (counter) counter.textContent = count + '%';
    }, 40);
  }


  // ─────────── 3. HERO NAME — Character Reveal ───────────
  const heroName = document.getElementById('heroName');
  if (heroName) {
    const name = 'Sumit Singh';
    let html = '';
    for (let i = 0; i < name.length; i++) {
      const ch = name[i] === ' ' ? '&nbsp;' : name[i];
      const delay = 2 + i * 0.08;
      html += `<span style="display:inline-block;opacity:0;animation:charFade 0.7s cubic-bezier(0.16,1,0.3,1) ${delay}s forwards">${ch}</span>`;
    }
    heroName.innerHTML = html;
  }


  // ─────────── 4. SCROLL REVEAL ───────────
  const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale', '.reveal-clip', '.reveal-rotate'];
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        // Count-up
        const statNum = e.target.querySelector('.stat-number');
        if (statNum && !statNum.dataset.counted) {
          statNum.dataset.counted = 'true';
          countUp(statNum);
        }
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  revealClasses.forEach(cls => {
    document.querySelectorAll(cls).forEach(el => observer.observe(el));
  });


  // ─────────── 5. COUNT-UP ───────────
  function countUp(el) {
    const target = parseInt(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const duration = 1400;
    let start = null;
    function ease(t) { return t === 1 ? 1 : 1 - Math.pow(2, -10 * t); }
    function step(ts) {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      el.textContent = Math.floor(ease(p) * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }


  // ─────────── 6. NAVBAR SCROLL ───────────
  const nav = document.getElementById('navbar');
  const scrollIndicator = document.getElementById('scrollIndicator');
  window.addEventListener('scroll', () => {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 60);
    if (scrollIndicator) scrollIndicator.classList.toggle('hidden', window.scrollY > 200);
  }, { passive: true });


  // ─────────── 7. HAMBURGER MENU ───────────
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
      document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
    });
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }


  // ─────────── 8. SMOOTH SCROLL ───────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const id = anchor.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });


  // ─────────── 9. MARQUEE DUPLICATION ───────────
  document.querySelectorAll('.marquee-track').forEach(track => {
    track.innerHTML += track.innerHTML;
  });


  // ─────────── 10. MAGNETIC BUTTONS ───────────
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });


  // ─────────── 11. 3D CARD TILT ───────────
  const tiltCards = document.querySelectorAll('.project-card, .skill-card, .github-profile-card, .repo-card');
  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-8px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });


  // ─────────── 12. PARALLAX WATERMARKS & DOTS ───────────
  const watermarks = document.querySelectorAll('.section-watermark');
  window.addEventListener('scroll', () => {
    watermarks.forEach(wm => {
      const rect = wm.parentElement.getBoundingClientRect();
      const offset = rect.top * 0.06;
      wm.style.transform = `translateY(${offset}px)`;
    });
  }, { passive: true });


  // ─────────── 13. FLOATING DOTS (visual depth) ───────────
  document.querySelectorAll('.section, .section-alt, .hero').forEach(sec => {
    for (let i = 0; i < 3; i++) {
      const dot = document.createElement('div');
      dot.className = 'floating-dot';
      const size = Math.random() * 6 + 3;
      dot.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        background: var(--gold);
        top: ${Math.random() * 80 + 10}%;
        left: ${Math.random() * 90 + 5}%;
      `;
      sec.appendChild(dot);
    }
  });


  // ─────────── 14. AI CHATBOT LOGIC ───────────
  const chatTrigger = document.getElementById('chatTrigger');
  const chatPanel = document.getElementById('chatPanel');
  const chatClose = document.getElementById('chatClose');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');
  const chatMessages = document.getElementById('chatMessages');

  let chatHistory = [];
  let isThinking = false;

  // Open/Close Chat
  if (chatTrigger && chatPanel && chatClose) {
    chatTrigger.addEventListener('click', () => {
      chatPanel.classList.add('active');
      if (chatHistory.length === 0) {
        setTimeout(() => addMessage('Hey 👋 I’m Sumit. Feel free to ask me anything about my work, projects, or experience.', 'ai'), 300);
      }
    });
    chatClose.addEventListener('click', () => {
      chatPanel.classList.remove('active');
    });
  }

  // Add a message to the UI
  function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `message msg-${sender}`;
    msg.textContent = text;
    chatMessages.appendChild(msg);
    scrollToBottom();
    
    if (sender === 'ai') {
      chatHistory.push({ role: 'assistant', content: text });
    } else {
      chatHistory.push({ role: 'user', content: text });
    }
  }

  // Show typing indicator
  function showTyping() {
    isThinking = true;
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typingIndicator';
    indicator.innerHTML = '<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>';
    chatMessages.appendChild(indicator);
    scrollToBottom();
  }

  // Remove typing indicator
  function removeTyping() {
    isThinking = false;
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  // Scroll to bottom of chat
  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Handle send message
  async function handleSend() {
    const text = chatInput.value.trim();
    if (!text || isThinking) return;

    chatInput.value = '';
    addMessage(text, 'user');
    showTyping();

    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: chatHistory.slice(-5) }) // Send last 5 msgs for context
      });

      const data = await response.json();
      removeTyping();

      if (response.ok && data.reply) {
        addMessage(data.reply, 'ai');
      } else {
        addMessage(data.message || 'Sorry, I ran into an issue finding that answer.', 'ai');
      }
    } catch (err) {
      removeTyping();
      addMessage('Sorry, my AI server seems to be offline right now. Feel free to contact me via the form below!', 'ai');
      console.error('Chat API Error:', err);
    }
  }

  if (chatSend && chatInput) {
    chatSend.addEventListener('click', handleSend);
    chatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

});


// Cybernetic Tools Section Logic
setTimeout(() => {
  if (typeof tsParticles !== 'undefined') {
    tsParticles.load('tools-particles', {
      preset: 'links',
      fullScreen: { enable: false },
      particles: {
        number: { value: 80, density: { enable: true, value_area: 800 } },
        color: { value: ['#38BDF8', '#FACC15'] },
        links: { enable: true, color: '#38BDF8', distance: 150, opacity: 0.2, width: 1 },
        move: { enable: true, speed: 1.5, direction: 'none', outModes: { default: 'bounce' } },
        size: { value: 2 },
        opacity: { value: 0.5 }
      },
      interactivity: {
        events: { onHover: { enable: true, mode: 'grab' }, resize: true },
        modes: { grab: { distance: 140, links: { opacity: 0.8 } } }
      },
      background: { color: 'transparent' }
    });
  }
}, 500);

// Cybernetic Hover Spotlight Effect for Nodes
const ecoNodes = document.querySelectorAll('.eco-node');
ecoNodes.forEach(node => {
  node.addEventListener('mousemove', e => {
    const rect = node.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    node.style.setProperty('--mouse-x', `${x}px`);
    node.style.setProperty('--mouse-y', `${y}px`);
  });
});


// ─────────── 15. TIMELINE LINE PROGRESS ───────────
document.addEventListener("DOMContentLoaded", () => {
  const timeline = document.querySelector('.timeline-container');
  const progressBar = document.getElementById('timelineProgress');
  if(timeline && progressBar) {
    window.addEventListener('scroll', () => {
      const rect = timeline.getBoundingClientRect();
      const scrollPos = window.innerHeight / 2 - rect.top; 
      const height = Math.max(0, Math.min(rect.height - 100, scrollPos));
      progressBar.style.height = height + 'px';
    }, { passive: true });
  }
});
