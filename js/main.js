/* ==========================================================================
   AWTD — Africa Workforce Training & Development
   Shared Application Foundation & Interactive Controller (js/main.js)
   ========================================================================== */

(function () {
  'use strict';

  /* ---- 1. Single-Source Configuration ---- */
  var AWTD_CONFIG = {
    pilotCities: 'Abuja + Kaduna',
    maxPilotTracks: 2,
    defaultPilotTracks: ['electrical-solar', 'industrial-maintenance'],
    contactEmail: 'hello@awtd.org',
    legalName: 'Africa Workforce Training & Development, Inc.',
    documents: {
      'blueprint': {
        title: 'The AWTD Blueprint',
        year: '2026',
        status: 'Working Document · Awaiting Public Release Clearance',
        summary: 'The complete operational model: employer-led competency standards, the six-stage learner journey, and quality safeguards engineered to prevent theoretical drift.'
      },
      'market-survey': {
        title: 'Market Needs Survey',
        year: '2026',
        status: 'Working Document · Awaiting Public Release Clearance',
        summary: 'Employer demand mapping across candidate technical sectors, quantifying where critical technician gaps slow industrial and infrastructure growth.'
      },
      'concept-note': {
        title: 'Concept Note — Nigeria Pilot',
        year: '2026',
        status: 'Working Document · Awaiting Public Release Clearance',
        summary: 'Hub-and-spoke pilot scope, two-cohort design (50–60 learners), ≥70% placement target, and the Month 6 Decision Gate governing continental scale-up.'
      },
      'capability-statement': {
        title: 'Capability Statement (The Brief)',
        year: '2026',
        status: 'Pre-Release Verification · 5 Factual Edits in Review',
        summary: 'Executive overview of AWTD, priority technical sectors, measurable KPIs, and multi-jurisdiction governance across the United States, Nigeria, and South Africa.'
      }
    }
  };

  /* Load persisted single-source pilotCities if updated in Board Review mode */
  try {
    var savedCities = localStorage.getItem('awtd-pilot-cities');
    if (savedCities && savedCities.trim().length > 0) {
      AWTD_CONFIG.pilotCities = savedCities.trim();
    }
  } catch (e) {}

  window.AWTD_CONFIG = AWTD_CONFIG;

  /* ---- 2. Populate & Live-Edit Single-Source Config Fields ---- */
  function renderConfigBindings() {
    var cityNodes = document.querySelectorAll('[data-config="pilot-cities"]');
    cityNodes.forEach(function (node) {
      node.textContent = AWTD_CONFIG.pilotCities;
    });

    var emailNodes = document.querySelectorAll('[data-config="contact-email"]');
    emailNodes.forEach(function (node) {
      node.textContent = AWTD_CONFIG.contactEmail;
    });

    var legalNodes = document.querySelectorAll('[data-config="legal-name"]');
    legalNodes.forEach(function (node) {
      node.textContent = AWTD_CONFIG.legalName;
    });

    var cityInput = document.getElementById('reviewCityInput');
    if (cityInput && document.activeElement !== cityInput) {
      cityInput.value = AWTD_CONFIG.pilotCities;
    }
  }

  function initConfigBindings() {
    renderConfigBindings();

    var cityInput = document.getElementById('reviewCityInput');
    var citySaveBtn = document.getElementById('reviewCitySaveBtn');

    function applyCityUpdate() {
      if (!cityInput) return;
      var nextVal = cityInput.value.trim();
      if (!nextVal) {
        cityInput.value = AWTD_CONFIG.pilotCities;
        return;
      }
      AWTD_CONFIG.pilotCities = nextVal;
      try {
        localStorage.setItem('awtd-pilot-cities', nextVal);
      } catch (e) {}
      renderConfigBindings();
      if (citySaveBtn) {
        var origText = citySaveBtn.textContent;
        citySaveBtn.textContent = 'Synced ✓';
        setTimeout(function () {
          citySaveBtn.textContent = origText;
        }, 1400);
      }
    }

    if (citySaveBtn) {
      citySaveBtn.addEventListener('click', applyCityUpdate);
    }
    if (cityInput) {
      cityInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          applyCityUpdate();
        }
      });
    }
  }

  /* ---- 3. Board Review / Outstanding Items (#reviewToggle) Controller ---- */
  function initReviewToggle() {
    var toggle = document.getElementById('reviewToggle');
    var countBadge = document.getElementById('reviewCount');
    var nextBtn = document.getElementById('reviewNextBtn');
    var pendItems = Array.prototype.slice.call(document.querySelectorAll('.pend'));
    var currentPendIndex = -1;

    if (countBadge) {
      countBadge.textContent = String(pendItems.length);
    }

    if (!toggle) return;

    try {
      if (localStorage.getItem('awtd-review') === '1') {
        toggle.checked = true;
      }
    } catch (e) {}

    function syncReviewState() {
      var isReview = Boolean(toggle.checked);
      document.body.classList.toggle('review', isReview);
      toggle.setAttribute('aria-checked', isReview ? 'true' : 'false');
      try {
        localStorage.setItem('awtd-review', isReview ? '1' : '0');
      } catch (e) {}
    }

    toggle.addEventListener('change', syncReviewState);
    syncReviewState();

    if (nextBtn && pendItems.length > 0) {
      nextBtn.addEventListener('click', function () {
        currentPendIndex = (currentPendIndex + 1) % pendItems.length;
        var target = pendItems[currentPendIndex];
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
          target.style.outlineColor = '#084B23';
          setTimeout(function () {
            target.style.outlineColor = '';
          }, 1200);
        }
      });
    }
  }

  /* ---- 4. Sticky Header, Mobile Menu & Active Section Spy ---- */
  function initNavigation() {
    var nav = document.querySelector('.nav');
    var navToggle = document.getElementById('navToggle');
    var navLinksContainer = document.getElementById('navLinks');
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    function onScroll() {
      if (!nav) return;
      nav.classList.toggle('is-scrolled', window.scrollY > 16);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (navToggle && navLinksContainer) {
      navToggle.addEventListener('click', function () {
        var expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', expanded ? 'false' : 'true');
        navLinksContainer.classList.toggle('is-open', !expanded);
      });

      navLinksContainer.addEventListener('click', function (e) {
        if (e.target.tagName === 'A' && navLinksContainer.classList.contains('is-open')) {
          navToggle.setAttribute('aria-expanded', 'false');
          navLinksContainer.classList.remove('is-open');
        }
      });

      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navLinksContainer.classList.contains('is-open')) {
          navToggle.setAttribute('aria-expanded', 'false');
          navLinksContainer.classList.remove('is-open');
          navToggle.focus();
        }
      });
    }

    if ('IntersectionObserver' in window && navLinks.length > 0) {
      var sectionMap = {};
      navLinks.forEach(function (link) {
        var id = link.getAttribute('href').slice(1);
        if (id) sectionMap[id] = link;
      });

      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting && entry.target.id && sectionMap[entry.target.id]) {
              navLinks.forEach(function (l) {
                l.classList.remove('is-active');
              });
              sectionMap[entry.target.id].classList.add('is-active');
            }
          });
        },
        { rootMargin: '-28% 0px -60% 0px', threshold: 0 }
      );

      Object.keys(sectionMap).forEach(function (id) {
        var sec = document.getElementById(id);
        if (sec) observer.observe(sec);
      });
    }
  }

  /* ---- 5. Training Tracks Filter, Movable "Pilot phase" Chip & 3D Flip Dossiers ---- */
  function initTracksController() {
    var trackCards = Array.prototype.slice.call(document.querySelectorAll('.track-card'));
    var filterBtns = Array.prototype.slice.call(document.querySelectorAll('[data-track-filter]'));
    var statusMsg = document.getElementById('trackPilotStatus');
    if (trackCards.length === 0) return;

    var activePilotIds = AWTD_CONFIG.defaultPilotTracks.slice();
    try {
      var saved = localStorage.getItem('awtd-pilot-tracks');
      if (saved) {
        var parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length <= AWTD_CONFIG.maxPilotTracks) {
          activePilotIds = parsed;
        }
      }
    } catch (e) {}

    var currentFilter = 'all';

    function renderTrackChips() {
      trackCards.forEach(function (card) {
        var id = card.getAttribute('data-track-id');
        var isPilot = activePilotIds.indexOf(id) !== -1;
        card.setAttribute('data-pilot', isPilot ? 'true' : 'false');

        var chips = card.querySelectorAll('.chip');
        chips.forEach(function (chip) {
          if (isPilot) {
            chip.textContent = 'Pilot phase';
            chip.classList.remove('chip--future');
          } else {
            chip.textContent = 'Future rollout';
            chip.classList.add('chip--future');
          }
        });

        var toggleBtns = card.querySelectorAll('.track-pilot-toggle');
        toggleBtns.forEach(function (toggleBtn) {
          toggleBtn.textContent = isPilot ? 'Remove Pilot chip' : 'Set as Pilot track';
        });
      });

      var pilotCountEl = document.querySelector('[data-filter-count="pilot"]');
      var futureCountEl = document.querySelector('[data-filter-count="future"]');
      if (pilotCountEl) pilotCountEl.textContent = String(activePilotIds.length);
      if (futureCountEl) futureCountEl.textContent = String(trackCards.length - activePilotIds.length);

      applyFilter(currentFilter);
    }

    function applyFilter(filter) {
      currentFilter = filter;
      filterBtns.forEach(function (btn) {
        var isMatch = btn.getAttribute('data-track-filter') === filter;
        btn.classList.toggle('is-active', isMatch);
        btn.setAttribute('aria-pressed', isMatch ? 'true' : 'false');
      });

      trackCards.forEach(function (card) {
        var isPilot = card.getAttribute('data-pilot') === 'true';
        var show = true;
        if (filter === 'pilot') show = isPilot;
        else if (filter === 'future') show = !isPilot;
        card.classList.toggle('is-hidden', !show);
      });
    }

    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        applyFilter(btn.getAttribute('data-track-filter'));
      });
    });

    trackCards.forEach(function (card) {
      /* Movable Pilot Chip Toggle */
      var toggleBtns = card.querySelectorAll('.track-pilot-toggle');
      toggleBtns.forEach(function (toggleBtn) {
        toggleBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          var id = card.getAttribute('data-track-id');
          var idx = activePilotIds.indexOf(id);
          if (idx !== -1) {
            activePilotIds.splice(idx, 1);
            if (statusMsg) statusMsg.textContent = '';
          } else {
            if (activePilotIds.length >= AWTD_CONFIG.maxPilotTracks) {
              var removed = activePilotIds.shift();
              activePilotIds.push(id);
              if (statusMsg) {
                statusMsg.textContent = 'Pilot cap is 2 tracks. Shifted chip from ' + removed.replace(/-/g, ' ') + ' to ' + id.replace(/-/g, ' ') + '.';
              }
            } else {
              activePilotIds.push(id);
              if (statusMsg) statusMsg.textContent = '';
            }
          }
          try {
            localStorage.setItem('awtd-pilot-tracks', JSON.stringify(activePilotIds));
          } catch (err) {}
          renderTrackChips();
        });
      });

      /* 3D Flip Card Dossier Toggle */
      var flipBtns = card.querySelectorAll('.track-flip-btn');
      flipBtns.forEach(function (flipBtn) {
        flipBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          var willFlip = !card.classList.contains('is-flipped');
          card.classList.toggle('is-flipped', willFlip);
          var allFlipBtns = card.querySelectorAll('.track-flip-btn');
          allFlipBtns.forEach(function (b) {
            b.setAttribute('aria-expanded', willFlip ? 'true' : 'false');
          });
        });
      });
    });

    renderTrackChips();
  }

  /* ---- 5b. Status Quo vs AWTD Blueprint Interactive Contrast ---- */
  function initContrastController() {
    var contrastBtns = Array.prototype.slice.call(document.querySelectorAll('[data-contrast-dim]'));
    var contrastItems = Array.prototype.slice.call(document.querySelectorAll('[data-dim]'));
    if (contrastItems.length === 0) return;

    function setDimension(dim) {
      contrastBtns.forEach(function (btn) {
        var match = btn.getAttribute('data-contrast-dim') === dim;
        btn.classList.toggle('is-active', match);
        btn.setAttribute('aria-pressed', match ? 'true' : 'false');
      });

      contrastItems.forEach(function (item) {
        if (!dim || dim === 'all') {
          item.classList.remove('is-dimmed', 'is-highlighted');
        } else {
          var isMatch = item.getAttribute('data-dim') === dim;
          item.classList.toggle('is-highlighted', isMatch);
          item.classList.toggle('is-dimmed', !isMatch);
        }
      });
    }

    contrastBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        setDimension(btn.getAttribute('data-contrast-dim'));
      });
    });

    contrastItems.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        var activeBtn = document.querySelector('[data-contrast-dim].is-active');
        if (activeBtn && activeBtn.getAttribute('data-contrast-dim') !== 'all') return;
        var dim = item.getAttribute('data-dim');
        contrastItems.forEach(function (el) {
          el.classList.toggle('is-highlighted', el.getAttribute('data-dim') === dim);
        });
      });
      item.addEventListener('mouseleave', function () {
        var activeBtn = document.querySelector('[data-contrast-dim].is-active');
        if (activeBtn && activeBtn.getAttribute('data-contrast-dim') !== 'all') return;
        contrastItems.forEach(function (el) {
          el.classList.remove('is-highlighted');
        });
      });
    });
  }

  /* ---- 6. Position Papers & Capability Statement Modal ---- */
  function initDocumentModal() {
    var backdrop = document.getElementById('docModalBackdrop');
    var titleEl = document.getElementById('docModalTitle');
    var statusEl = document.getElementById('docModalStatus');
    var descEl = document.getElementById('docModalDesc');
    var closeBtn = document.getElementById('docModalClose');
    var requestBtn = document.getElementById('docModalRequest');
    var triggers = document.querySelectorAll('[data-doc-id]');
    var activeDocTitle = '';
    var lastFocused = null;

    if (!backdrop) return;

    function openModal(docId) {
      var doc = AWTD_CONFIG.documents[docId];
      if (!doc) return;
      activeDocTitle = doc.title;
      if (titleEl) titleEl.textContent = doc.title;
      if (statusEl) statusEl.textContent = doc.year + ' · ' + doc.status;
      if (descEl) descEl.textContent = doc.summary;
      lastFocused = document.activeElement;
      backdrop.classList.add('is-open');
      backdrop.setAttribute('aria-hidden', 'false');
      if (closeBtn) closeBtn.focus();
    }

    function closeModal() {
      backdrop.classList.remove('is-open');
      backdrop.setAttribute('aria-hidden', 'true');
      if (lastFocused && typeof lastFocused.focus === 'function') {
        lastFocused.focus();
      }
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        openModal(trigger.getAttribute('data-doc-id'));
      });
      trigger.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openModal(trigger.getAttribute('data-doc-id'));
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeModal);
    }

    backdrop.addEventListener('click', function (e) {
      if (e.target === backdrop) closeModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
        closeModal();
      }
    });

    if (requestBtn) {
      requestBtn.addEventListener('click', function () {
        closeModal();
        selectInquiryTopic('Document Request: ' + activeDocTitle);
      });
    }
  }

  /* ---- 7. Working with AWTD Pathways & Validated Inquiry Form with Local Ledger ---- */
  function selectInquiryTopic(topicValue) {
    var panel = document.getElementById('inquiryPanel');
    var select = document.getElementById('inquiryRole');
    var message = document.getElementById('inquiryMessage');
    var nameInput = document.getElementById('inquiryName');

    if (!panel) {
      window.location.href = 'get-involved.html?doc=' + encodeURIComponent(topicValue.replace('Document Request: ', '')) + '#inquiryPanel';
      return;
    }

    var pathwayBtns = document.querySelectorAll('[data-inquiry-topic]');
    pathwayBtns.forEach(function (btn) {
      btn.classList.toggle('is-selected', btn.getAttribute('data-inquiry-topic') === topicValue);
    });

    if (select) {
      var matched = false;
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].value === topicValue) {
          select.selectedIndex = i;
          matched = true;
          break;
        }
      }
      if (!matched) {
        select.value = 'Brief / Position Paper Request';
        if (message && !message.value) {
          message.value = 'Please notify me when "' + topicValue.replace('Document Request: ', '') + '" is cleared for release.';
        }
      }
    }

    if (panel) {
      panel.scrollIntoView({ behavior: 'smooth', block: 'center' });
      setTimeout(function () {
        if (nameInput) nameInput.focus();
      }, 450);
    }
  }

  function getSavedInquiries() {
    try {
      var raw = localStorage.getItem('awtd-inquiries');
      if (!raw) return [];
      var parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  }

  function updateInquiryLedgerUI() {
    var countEl = document.getElementById('inquiryLedgerCount');
    var list = getSavedInquiries();
    if (countEl) {
      countEl.textContent = String(list.length);
    }
  }

  function initInquiryForm() {
    var ctaTriggers = document.querySelectorAll('[data-inquiry-topic]');
    var form = document.getElementById('awtdInquiryForm');
    var statusEl = document.getElementById('inquiryStatus');
    var exportBtn = document.getElementById('exportInquiriesBtn');

    ctaTriggers.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        selectInquiryTopic(btn.getAttribute('data-inquiry-topic'));
      });
    });

    updateInquiryLedgerUI();

    if (exportBtn) {
      exportBtn.addEventListener('click', function () {
        var records = getSavedInquiries();
        if (records.length === 0) {
          if (statusEl) {
            statusEl.classList.remove('is-error');
            statusEl.textContent = 'Local inquiry ledger is currently empty (0 saved inquiries).';
          }
          return;
        }
        var blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'awtd-inquiries-ledger.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
    }

    if (!form) return;

    try {
      var params = new URLSearchParams(window.location.search);
      var docParam = params.get('doc');
      if (docParam) {
        selectInquiryTopic('Document Request: ' + docParam);
      }
    } catch (e) {}

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (document.getElementById('inquiryName') || {}).value || '';
      var org = (document.getElementById('inquiryOrg') || {}).value || '';
      var email = (document.getElementById('inquiryEmail') || {}).value || '';
      var role = (document.getElementById('inquiryRole') || {}).value || '';
      var msg = (document.getElementById('inquiryMessage') || {}).value || '';

      name = name.trim();
      org = org.trim();
      email = email.trim();
      msg = msg.trim();

      if (!name || !email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        if (statusEl) {
          statusEl.textContent = 'Validation required: Please provide your full name and a valid work email address.';
          statusEl.classList.add('is-error');
        }
        return;
      }

      /* Persist locally to localStorage ledger (since external SMTP/API backend is unconfigured) */
      var entry = {
        timestamp: new Date().toISOString(),
        name: name,
        organisation: org || 'N/A',
        email: email,
        pathway: role,
        message: msg || 'Requesting a conversation regarding ' + role + '.'
      };

      try {
        var existing = getSavedInquiries();
        existing.push(entry);
        localStorage.setItem('awtd-inquiries', JSON.stringify(existing));
      } catch (err) {}

      updateInquiryLedgerUI();

      if (statusEl) {
        statusEl.classList.remove('is-error');
        statusEl.textContent =
          'Saved to local browser ledger. Because no external SMTP/API server is configured yet, launching mail client for ' +
          AWTD_CONFIG.contactEmail +
          '...';
      }

      var subject = encodeURIComponent('[AWTD Inquiry] ' + role + (org ? ' — ' + org : ''));
      var bodyLines = [
        'Name: ' + name,
        'Organisation: ' + (org || 'N/A'),
        'Email: ' + email,
        'Category: ' + role,
        '',
        msg || 'Requesting a conversation regarding ' + role + '.'
      ];
      var mailtoUrl =
        'mailto:' +
        AWTD_CONFIG.contactEmail +
        '?subject=' +
        subject +
        '&body=' +
        encodeURIComponent(bodyLines.join('\n'));

      window.location.href = mailtoUrl;
    });
  }

  /* ---- 8. Scroll Reveal & Hero Stat Counter Animations ---- */
  function initAnimations() {
    var prefersReduced =
      window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var revealEls = document.querySelectorAll('.reveal');

    if (prefersReduced || !('IntersectionObserver' in window)) {
      revealEls.forEach(function (el) {
        el.classList.add('is-visible');
      });
      return;
    }

    var revealObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      revealObserver.observe(el);
    });

    var statEls = document.querySelectorAll('[data-stat-target]');
    var statsObserver = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          obs.unobserve(el);
          var target = parseInt(el.getAttribute('data-stat-target'), 10);
          var suffix = el.getAttribute('data-stat-suffix') || '';
          if (isNaN(target) || target === 0) {
            el.textContent = '0' + suffix;
            return;
          }
          var start = 0;
          var duration = 750;
          var startTime = null;
          function tick(ts) {
            if (!startTime) startTime = ts;
            var progress = Math.min((ts - startTime) / duration, 1);
            var eased = 1 - Math.pow(1 - progress, 3);
            var current = Math.round(start + (target - start) * eased);
            el.textContent = String(current) + suffix;
            if (progress < 1) {
              window.requestAnimationFrame(tick);
            } else {
              el.textContent = String(target) + suffix;
            }
          }
          window.requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );

    statEls.forEach(function (el) {
      statsObserver.observe(el);
    });
  }

  /* ---- Initialize on DOMContentLoaded ---- */
  function init() {
    initConfigBindings();
    initReviewToggle();
    initNavigation();
    initTracksController();
    initContrastController();
    initDocumentModal();
    initInquiryForm();
    initAnimations();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
