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

  let toastTimer;
  function toast(message) {
    const element = $('#toast');
    element.textContent = message;
    element.classList.add('visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove('visible'), 3500);
  }

  const productUrl = safeHttp(RETIME_CONFIG.productUrl);
  if (productUrl) {
    $$('[data-purchase], #purchase-final').forEach(link => {
      link.href = productUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.removeAttribute('aria-disabled');
    });
    $('#purchase-final').innerHTML = 'Get it on Superhive <svg class="icon" aria-hidden="true"><use href="#i-diagonal"/></svg>';
    $('#purchase-status').textContent = 'Purchase and download securely through Superhive.';
  } else {
    $('#purchase-final').addEventListener('click', event => {
      event.preventDefault();
      toast('The Superhive product link is coming soon.');
    });
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

  const menu = $('.menu-toggle');
  const nav = $('#nav-links');
  function closeMenu() {
    menu.setAttribute('aria-expanded', 'false');
    menu.setAttribute('aria-label', 'Open navigation');
    nav.classList.remove('open');
  }
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    nav.classList.toggle('open', open);
  });
  $$('a', nav).forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && nav.classList.contains('open')) {
      closeMenu();
      menu.focus();
    }
  });

  // Native players remain usable without JavaScript. Only the hero may autoplay.
  const videos = $$('video.recording');
  const hero = $('#hero-video');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const states = new Map(videos.map(video => [video, {
    visible: false,
    pausedForVisibility: false
  }]));
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
      const visible = state.visible || (fullscreen && fullscreen.contains(video));
      if (!visible || document.hidden) {
        pauseForVisibility(video);
        return;
      }
      if (video !== hero || !heroMayAutoplay || reducedMotion.matches || !video.paused || heroPlayRequest) return;
      const request = { interrupted: false };
      heroPlayRequest = request;
      video.play().catch(error => {
        // Scrolling away while play() is pending should not disable a later resume.
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

  // This small undo illustration explains history; it is not the add-on algorithm.
  const NS = 'http://www.w3.org/2000/svg';
  const node = (tag, attributes, parent) => {
    const element = document.createElementNS(NS, tag);
    Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
    parent.append(element);
    return element;
  };
  function smoothPath(points) {
    return points.reduce((path, point, index) => {
      if (!index) return `M${point[0]},${point[1]}`;
      const previous = points[index - 1];
      const middle = (previous[0] + point[0]) / 2;
      return path + ` C${middle},${previous[1]} ${middle},${point[1]} ${point[0]},${point[1]}`;
    }, '');
  }
  const undo = $('#undo-graph');
  const history = [280];
  let historyIndex = 0;
  function renderUndo() {
    const middle = history[historyIndex];
    undo.replaceChildren();
    [65, middle, 495].forEach((x, index) => {
      node('path', { d: `M${x} 20V175`, stroke: '#d5a06c', 'stroke-width': 1, opacity: 0.75 }, undo);
      node('rect', { x: x - 8, y: 15, width: 16, height: 10, rx: 1, fill: '#d5a06c' }, undo);
      const text = node('text', { x, y: 22.5, 'text-anchor': 'middle', fill: '#292f20', 'font-size': 6.5, 'font-family': 'Consolas,monospace' }, undo);
      text.textContent = String(index * 24 + 1);
    });
    node('path', { d: smoothPath([[20, 135], [65, 135], [middle - 70, 70], [middle, 78], [495, 120], [540, 120]]), fill: 'none', stroke: '#bbca99', 'stroke-width': 2.4 }, undo);
    node('rect', { x: 65, y: 20, width: middle - 65, height: 5, fill: '#c48d54', rx: 2 }, undo);
    $('#demo-undo').disabled = historyIndex === 0;
    $('#demo-redo').disabled = historyIndex === history.length - 1;
    const status = $('#undo-status');
    status.replaceChildren(document.createTextNode(historyIndex === 0 ? 'Your original timing. ' : `Retime ${historyIndex}. `));
    const note = document.createElement('span');
    note.textContent = historyIndex === 0 ? 'Try a retime.' : 'Undo or try another.';
    status.append(note);
  }
  $('#demo-retime').addEventListener('click', () => {
    history.splice(historyIndex + 1);
    const choices = [355, 225, 395, 310];
    history.push(choices[historyIndex % choices.length]);
    historyIndex++;
    renderUndo();
  });
  $('#demo-undo').addEventListener('click', () => {
    if (historyIndex > 0) { historyIndex--; renderUndo(); }
  });
  $('#demo-redo').addEventListener('click', () => {
    if (historyIndex < history.length - 1) { historyIndex++; renderUndo(); }
  });
  renderUndo();

  const rows = $$('#shortcut-table tbody tr');
  $('#shortcut-search').addEventListener('input', event => {
    const query = event.target.value.trim().toLowerCase();
    let count = 0;
    rows.forEach(row => {
      row.hidden = !row.textContent.toLowerCase().includes(query);
      if (!row.hidden) count++;
    });
    $('#no-shortcuts').hidden = count !== 0;
    $('#shortcut-count').textContent = query
      ? `${count} of ${rows.length} controls shown.`
      : `${rows.length} controls. One smoother workflow.`;
  });
})();
