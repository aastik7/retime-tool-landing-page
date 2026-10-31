// Supply only the creator's confirmed listing and support contact.
const RETIME_CONFIG = {
  productUrl: '',
  supportEmail: '',
  supportProfile: ''
};

(function () {
  'use strict';
  const $ = (selector, parent = document) => parent.querySelector(selector);
  const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const safeHttp = value => {
    if (!value) return '';
    try {
      const url = new URL(value, location.href);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch { return ''; }
  };

  const productUrl = safeHttp(RETIME_CONFIG.productUrl);
  const purchase = $('#purchase-final');
  if (productUrl) {
    $$('[data-purchase], #purchase-final').forEach(link => {
      link.href = productUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.removeAttribute('aria-disabled');
    });
    purchase.textContent = 'Buy on Superhive · $2 ↗';
    $('#purchase-status').textContent = 'Purchase and download through Superhive.';
  }

  const contact = RETIME_CONFIG.supportEmail
    ? 'mailto:' + RETIME_CONFIG.supportEmail.replace(/[\r\n]/g, '')
    : safeHttp(RETIME_CONFIG.supportProfile);
  if (contact) {
    const link = $('#support-link');
    link.href = contact;
    link.hidden = false;
    if (!contact.startsWith('mailto:')) {
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    }
  }

  // Without JavaScript all three guides remain available with native controls.
  const tabs = $$('.scene-tab');
  const panels = $$('.scene-panel');
  const tablist = $('.scene-tabs');
  tablist.setAttribute('role', 'tablist');
  document.documentElement.classList.add('is-interactive');
  function selectScene(index, focus = false) {
    tabs.forEach((tab, current) => {
      const active = current === index;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = panels[current];
      if (!active) $$('video', panel).forEach(video => video.pause());
      panel.hidden = !active;
      panel.setAttribute('role', 'tabpanel');
      panel.tabIndex = 0;
    });
    if (focus) tabs[index].focus();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectScene(index));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      selectScene(next, true);
    });
  });
  selectScene(0);

  // Native players remain usable without JavaScript. Only the hero may autoplay.
  const videos = $$('video.recording');
  const hero = $('#hero-video');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const states = new Map(videos.map(video => [video, { visible: false, pausedForVisibility: false }]));
  let heroMayAutoplay = !reducedMotion.matches;
  let heroPlayRequest = null;

  function pauseForVisibility(video) {
    if (video === hero && heroPlayRequest) heroPlayRequest.interrupted = true;
    if (video.paused) return;
    states.get(video).pausedForVisibility = true;
    video.pause();
  }

  function syncPlayback() {
    videos.forEach(video => {
      const state = states.get(video);
      const fullscreen = document.fullscreenElement;
      const visible = !video.closest('[hidden]') && (state.visible || (fullscreen && fullscreen.contains(video)));
      if (!visible || document.hidden) {
        pauseForVisibility(video);
        return;
      }
      if (video !== hero || !heroMayAutoplay || reducedMotion.matches || !video.paused || heroPlayRequest) return;
      const request = { interrupted: false };
      heroPlayRequest = request;
      video.play().catch(error => {
        if (error.name !== 'AbortError' || !request.interrupted) heroMayAutoplay = false;
      }).finally(() => {
        heroPlayRequest = null;
        if (request.interrupted) syncPlayback();
      });
    });
  }

  videos.forEach(video => {
    video.muted = true;
    video.addEventListener('pause', () => {
      const state = states.get(video);
      if (state.pausedForVisibility) state.pausedForVisibility = false;
      else if (video === hero) heroMayAutoplay = false;
    });
    video.addEventListener('play', () => {
      if (video === hero && !heroPlayRequest) heroMayAutoplay = !reducedMotion.matches;
      if (document.hidden || !states.get(video).visible) syncPlayback();
    });
    video.addEventListener('error', () => {
      if (video === hero) heroMayAutoplay = false;
      const message = document.createElement('p');
      message.className = 'media-error';
      message.append('This clip could not load. ');
      const link = document.createElement('a');
      link.href = video.getAttribute('src');
      link.textContent = 'Open the recording';
      message.append(link);
      video.after(message);
    }, { once: true });
  });

  function measureVisibility() {
    videos.forEach(video => {
      const bounds = video.getBoundingClientRect();
      const visibleHeight = Math.max(0, Math.min(bounds.bottom, innerHeight) - Math.max(bounds.top, 0));
      states.get(video).visible = bounds.width > 0 && bounds.height > 0 && visibleHeight / bounds.height >= 0.12;
    });
    syncPlayback();
  }
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { states.get(entry.target).visible = entry.isIntersecting && entry.intersectionRatio >= 0.12; });
      syncPlayback();
    }, { threshold: [0, 0.12] });
    videos.forEach(video => observer.observe(video));
  } else {
    let scheduled = false;
    const scheduleMeasure = () => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; measureVisibility(); });
    };
    addEventListener('scroll', scheduleMeasure, { passive: true });
    addEventListener('resize', scheduleMeasure);
  }
  measureVisibility();
  document.addEventListener('visibilitychange', syncPlayback);
  document.addEventListener('fullscreenchange', syncPlayback);
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      heroMayAutoplay = false;
      hero.pause();
    }
  });

  const rows = $$('#shortcut-table tbody tr');
  $('#shortcut-search').addEventListener('input', event => {
    const query = event.target.value.trim().toLowerCase();
    let count = 0;
    rows.forEach(row => {
      row.hidden = !row.textContent.toLowerCase().includes(query);
      if (!row.hidden) count++;
    });
    $('#no-shortcuts').hidden = count !== 0;
    $('#shortcut-count').textContent = query ? `${count} of ${rows.length} controls shown.` : `${rows.length} controls.`;
  });

  // Reveal a collapsed native detail when a feature links directly to it.
  function revealDetail() {
    if (!location.hash) return;
    const target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
    if (target?.matches('details')) target.open = true;
  }
  addEventListener('hashchange', revealDetail);
  revealDetail();
})();
