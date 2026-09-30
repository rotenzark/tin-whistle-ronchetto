/* PLUMBING_V 4 — Bespoke Studio · meccanica invisibile canonica.
   ────────────────────────────────────────────────────────────────
   CONFINE (inviolabile): questo file contiene SOLO plumbing — la meccanica
   che il visitatore non percepisce come design. NIENTE markup di sezioni,
   NIENTE stile, NIENTE struttura: concept, griglia, tipografia, hero e
   animazioni-firma si progettano DA ZERO per ogni cliente (GATE #3).
   Se qui dentro scivola del layout, questo diventa il nuovo scheletro
   condiviso — cioè il difetto "copia-incolla" che il metodo combatte.

   Come si usa: si COPIA nella cartella js/ del sito e si adatta la sola
   costante SITE. Le animazioni-firma del sito si scrivono nel proprio
   main.js DOPO questo file (o in coda a questo file, sotto il marcatore).
   Ogni bug nuovo si corregge QUI (bump PLUMBING_V + changelog nel README)
   e poi nel sito: mai il contrario.

   Fix già incorporati (non rimuovere):
   - ScrollTrigger registrato SUBITO allo script load, MAI dentro l'intro
     o un setTimeout (bug APF #5 del 16/7: race col watchdog → sezioni
     che sparivano allo scroll).
   - Reveal con once:true (niente re-animazioni da zero ri-scorrendo).
   - Watchdog 1,5s che forza visibile e UCCIDE i trigger non scattati.
   - Lightbox su [hidden] + override CSS !important (bug: display:flex
     batteva [hidden] e la lightbox restava visibile).
   - Foto-contenuto MAI lazy (regola workflow §8): il plumbing non tocca
     il loading, ma il lint lo verifica.
   - Orari Europe/Rome con finestre multiple e scavalco di mezzanotte
     (pattern Il Cavallante 18:00–00:30). */

(function () {
  'use strict';
  var root = document.documentElement;
  root.classList.add('js');
  var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) root.classList.add('reduced-motion');

  /* ══════════ CONFIG PER-SITO — l'unica parte da adattare ══════════ */
  var SITE = {
    slug: 'tin-whistle-ronchetto',
    /* nessun WhatsApp pubblicato: solo il telefono */
    whatsapp: { number: '', message: '', ids: [] },
    /* Google (30/9/2026): lunedì–venerdì 11–15:30 e 20–02; sabato 20–02; domenica chiuso. Le 2 di notte = '26:00' (scavalca mezzanotte) */
    hours: {
      0: [],
      1: [['11:00', '15:30'], ['20:00', '26:00']],
      2: [['11:00', '15:30'], ['20:00', '26:00']],
      3: [['11:00', '15:30'], ['20:00', '26:00']],
      4: [['11:00', '15:30'], ['20:00', '26:00']],
      5: [['11:00', '15:30'], ['20:00', '26:00']],
      6: [['20:00', '26:00']],
    },
    hoursStatusId: 'orarioStato',
    hoursTableSelector: '[data-day]',
    todayClass: 'is-today',
    introId: 'intro',
    introDuration: 1800,
    revealSelector: '.reveal',
    inViewClass: 'in-view',
    breakpointMenu: 1040,
    EN: {
      "m.salta": "Skip to the content",
      "m.top": "Tin Whistle: back to the top",
      "m.nav": "The sections",
      "m.lingua": "Language",
      "m.menu": "Open the menu",
      "m.ingrandisci": "Enlarge the photo",
      "m.lightbox": "Enlarged photo",
      "m.chiudi": "Close",
      "n.whistle": "The tin whistle",
      "n.pub": "The pub",
      "n.banco": "Drinks and food",
      "n.dicono": "Reviews",
      "n.orari": "Hours and where",
      "n.domande": "Questions",
      "t.chiama": "Call",
      "t.indicazioni": "Directions",
      "h.sopra": "Via Lodovico il Moro 55, Milan · on the Naviglio Grande",
      "h.titolo": "Irish beers, poured the proper way.",
      "h.testo": "The Irish pub on the street along the Naviglio Grande, towards Ronchetto: dark wood and ochre walls, beers on tap, sandwiches, piadine and pinse. Lunch on weekdays, in the evening until 2 am.",
      "h.chi": "from a review on Google (in Italian: «so much wood, so much Ireland, great beer»)",
      "h.google": "on Google, 391 reviews",
      "a.facciata": "The front at night in the fog: the dark sign reading «Irish Pub Tin Whistle» in light gothic letters, the green awning, the lit window and the small tables on the pavement.",
      "c.facciata": "The front at night, with the sign in gothic letters.",
      "s.titolo": "The tin whistle",
      "s.testo1": "The tin whistle is the six-hole tin flute of traditional Irish music: in Irish it is called feadóg stáin. The pub is named after it, and in its logo a leprechaun plays one.",
      "s.testo2": "Here it plays the opening of two traditional jigs, note by note, and underneath the fingering chart is written out: a filled dot is a covered hole, an empty one is open; the dot above the letter means the second octave. Choose a tune.",
      "p.titolo": "The fingering",
      "p.desc": "A tin whistle, the six-hole tin flute, plays the opening of a traditional tune: note by note the fingers cover and uncover the holes, and underneath the fingering chart is written out, six dots per note, filled if the hole is covered, empty if it is open. The Irish Washerwoman, The Kesh or the D scale.",
      "p.d0": "The Irish Washerwoman: the first two bars of a traditional jig in G.",
      "p.d1": "The Kesh: the first three bars, another traditional jig in G.",
      "p.d2": "The D scale: the holes open from the bottom, one at a time.",
      "p.modi": "Which tune",
      "p.b2": "The scale",
      "p.fonte": "The notes of the two tunes come from thesession.org, the fingerings from the chart of the D tin whistle.",
      "u.titolo": "The pub",
      "u.testo1": "A small place on the street along the Naviglio Grande: the beamed ceiling, the dark wood panelling, the ochre walls with framed prints, the round tables and the rush-seated chairs.",
      "u.testo2": "In a corner the front of a vintage white car has become a bench seat; hanging in the room, the fingerpost signs to Dublin. Outside, small tables on the pavement.",
      "a.sala": "The empty room: the wooden ceiling, the ochre walls with prints, the windows onto the street, the wooden tables and rush-seated chairs, on the left the white front of a car.",
      "c.sala": "The room, with the windows onto the street.",
      "a.auto": "The front of a vintage white car, with its two headlights, turned into a quilted leather bench seat, with a small table and two leather chairs.",
      "c.auto": "The bench seat made from the front of a car.",
      "a.cartelli": "Two white fingerpost signs hanging in the room: «Baile Átha Cliath, Dublin 5» and «Éire, Ireland».",
      "c.cartelli": "The fingerpost signs: Dublin, 5.",
      "u.nota": "The photos come from their Google listing, taken by customers.",
      "b.titolo": "Drinks and food",
      "b.bere": "At the bar",
      "b.mangiare": "From the kitchen",
      "b.1": "Irish beers on tap, Guinness and Kilkenny",
      "b.2": "Craft beers, including some you rarely find",
      "b.3": "Irish coffee and cocktails",
      "b.4": "Irish whiskey and amari",
      "b.5": "Sandwiches and piadine, vegetarian and vegan too",
      "b.6": "200 g burgers",
      "b.7": "Pinse",
      "b.8": "Big salads, nachos and sharing boards",
      "a.pinta": "A pint of dark beer with its head of foam, seen from above, on a round black table.",
      "c.pinta": "A dark pint.",
      "a.panino": "A hot sandwich wrapped in paper, on a round wooden board.",
      "c.panino": "A hot sandwich on the board.",
      "b.pranzo": "Lunch on weekdays, for a quick break; in the evening until 2 am.",
      "b.feste": "On St Patrick's Day live music and «rivers of beer», as they put it; sometimes football on TV: they announce it on their Facebook page.",
      "b.fonte": "What they serve is told by customers in their reviews. Ask at the bar for the menu of the day.",
      "d.titolo": "Reviews",
      "d.google": "on Google, 391 reviews",
      "d.g2a": "Google, 2 years ago",
      "d.g3a": "Google, 3 years ago",
      "d.g8a": "Google, 8 years ago",
      "d.nota": "From the reviews on Google, as they were written (in Italian). The line at the top also comes from a review on Google.",
      "d.tutte": "All the reviews on Google",
      "o.titolo": "Hours and where",
      "o.cap": "Opening hours",
      "g.lun": "Monday",
      "g.mar": "Tuesday",
      "g.mer": "Wednesday",
      "g.gio": "Thursday",
      "g.ven": "Friday",
      "g.sab": "Saturday",
      "g.dom": "Sunday",
      "o.chiuso": "closed",
      "o.nota": "Hours from their Google listing (September 2026): in the evening they close at 2 am. For holidays and special nights it is best to call.",
      "o.palo": "The nearest stops",
      "o.palon": "Walking distances as the crow flies, approximately.",
      "o.mappa": "Map: Tin Whistle, Via Lodovico il Moro 55, Milan",
      "o.dove": "Where",
      "o.dovev": "Via Lodovico il Moro 55, 20143 Milan, on the street along the Naviglio Grande",
      "o.tel": "Phone",
      "o.fb": "Social",
      "o.fbv": "Their Facebook page",
      "q.titolo": "Questions",
      "q.1": "When are you open?",
      "q.1r": "Monday to Friday from 11 am to 3:30 pm and from 8 pm to 2 am; Saturday from 8 pm to 2 am. Closed on Sundays.",
      "q.2": "Can I have lunch?",
      "q.2r": "Yes, on weekdays: sandwiches, piadine, burgers, pinse and big salads, customers say.",
      "q.3": "Are there vegetarian options?",
      "q.3r": "Yes: vegetarian and vegan sandwiches, pinse and piadine, a customer writes on Google. For anything else, ask at the bar.",
      "q.4": "Can I bring my dog?",
      "q.4r": "Yes: on their Google listing dogs are allowed.",
      "q.5": "How do I get there?",
      "q.5r": "Via Lodovico il Moro 55, on the street along the Naviglio Grande: bus 98 stops about 110 metres away, tram 2 about 200, the M4 Frattini station is about 760 metres away.",
      "f2.orario": "Monday–Friday 11 am–3:30 pm and 8 pm–2 am · Saturday 8 pm–2 am · Sunday closed",
      "f2.cred": "Demo website made by <a href=\"https://bespokestud.io\" rel=\"noopener\">Bespoke Studio</a> · the photos come from their Google listing, taken by customers; hours and reviews from Google (September 2026). We drew the fingering ourselves.",
      "f2.su": "Back to the top ↑"
    },
    LANGS: null,
    RTL: ['ar', 'he', 'fa', 'ur'],
    HOURS_I18N: null,
  };
  /* normalizzazione: EN storico -> LANGS */
  if (!SITE.LANGS) SITE.LANGS = SITE.EN && Object.keys(SITE.EN).length ? { en: SITE.EN } : {};
  var LANG_CODES = Object.keys(SITE.LANGS);   // senza 'it', che è il DOM
  /* ═════════════════════════════════════════════════════════════════ */

  /* ---------- WhatsApp wiring ---------- */
  if (SITE.whatsapp.number) {
    var waHref = 'https://wa.me/' + SITE.whatsapp.number + '?text=' +
      encodeURIComponent(SITE.whatsapp.message);
    SITE.whatsapp.ids.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) { el.href = waHref; el.target = '_blank'; el.rel = 'noopener'; }
    });
  }

  /* ---------- GSAP: registrazione IMMEDIATA + reveal + watchdog ---------- */
  var hasGsap = typeof gsap !== 'undefined';
  var hasST = hasGsap && typeof ScrollTrigger !== 'undefined';
  if (hasST) gsap.registerPlugin(ScrollTrigger);

  function showAllReveals() {
    var els = document.querySelectorAll(SITE.revealSelector);
    els.forEach(function (el) { el.classList.add(SITE.inViewClass); });
    if (hasGsap) {
      if (hasST) {
        els.forEach(function (el) {
          ScrollTrigger.getAll().forEach(function (st) {
            if (st.trigger === el && !st.progress) st.kill();
          });
        });
      }
      gsap.set(els, { opacity: 1, y: 0, x: 0 });
    }
  }
  // FIX FOUC (18/7): il watchdog è SOLO un fallback se GSAP non c'è (o reduced-motion).
  // Rivelare in anticipo tutti i .reveal mentre gli scroll-trigger sono attivi causava il
  // flash (scompaiono/ricompaiono) sotto la piega. Con GSAP attivo, rivelano gli ScrollTrigger.
  setTimeout(function () { if (!hasGsap || reducedMotion) showAllReveals(); }, 1500);

  if (hasGsap && !reducedMotion) {
    // reveal generico: le animazioni-FIRMA del sito vanno oltre questo,
    // ma si registrano ANCHE LORO subito, mai dopo l'intro.
    // ⚠️ REGOLA ANTI-FLASH (18/7): un elemento .reveal deve avere UNA SOLA animazione che
    // ne porta l'opacità a 1. Se un elemento ha una FIRMA che ne anima l'opacità (stagger,
    // timeline, ecc.), ESCLUDILO da qui via SITE.revealSelector (es. '.reveal:not(.mondo)'),
    // altrimenti il reveal generico + la firma si sovrappongono e l'elemento FLASHA.
    // immediateRender:false → lo stato "from" (opacity:0) NON viene ri-applicato ad ogni
    // ScrollTrigger.refresh() (che scatta al window.load mentre scrolli) → niente flash su refresh.
    gsap.utils.toArray(SITE.revealSelector).forEach(function (el) {
      gsap.fromTo(el, { opacity: 0, y: 28 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out', immediateRender: false,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      });
    });
  } else {
    // fallback senza GSAP: IntersectionObserver + classe
    if ('IntersectionObserver' in window && !reducedMotion) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) { e.target.classList.add(SITE.inViewClass); io.unobserve(e.target); }
        });
      }, { threshold: 0.12 });
      document.querySelectorAll(SITE.revealSelector).forEach(function (el) { io.observe(el); });
    } else {
      showAllReveals();
    }
  }

  /* ---------- intro skippabile (NON gate-a nulla) ---------- */
  var intro = document.getElementById(SITE.introId);
  /* ⚠️ L'hook si legge AL MOMENTO DELLA CHIAMATA, mai catturato per valore
     qui. Il codice-firma vive sotto il marcatore di fine plumbing — cioè
     gira DOPO questa riga — quindi `window.bespokeHeroEntrance ||
     function(){}` congelava la funzione vuota e l'entrata dell'hero non
     partiva più: titolo a opacity 0 per sempre, hero vuota sul live.
     (20/7/2026, riprodotto a schermo su Benessere Futuro #159.) */
  function heroEntrance() {
    if (typeof window.bespokeHeroEntrance === 'function') window.bespokeHeroEntrance();
  }
  function hideIntro() {
    if (!intro) return;
    var el = intro; intro = null;
    el.classList.add('hide');
    setTimeout(function () { el.remove(); }, 700);
    heroEntrance();
  }
  // rimozione IMMEDIATA (niente fade): serve quando qualcosa deve stare sopra
  // l'intro subito, es. l'apertura del menu. Durante il fade l'intro resta
  // hit-testable e i link del drawer non sono cliccabili.
  function killIntroNow() {
    if (!intro) return;
    var el = intro; intro = null;
    el.remove();
    heroEntrance();
  }
  if (reducedMotion || !intro) {
    if (intro) { intro.remove(); intro = null; }
    /* ⚠️ setTimeout 0 NON è decorativo: senza intro questo ramo gira in modo
       SINCRONO, cioè PRIMA che il codice-firma — che sta sotto il marcatore
       di fine plumbing, dentro questa stessa IIFE — abbia assegnato
       `window.bespokeHeroEntrance`. Il risultato è un'entrata dell'hero MUTA:
       nessun errore, elementi visibili, animazione semplicemente mai partita.
       Rimandando di un tick la IIFE è conclusa e l'hook esiste.
       (14/8/2026, A.S.FA. Sicilia: misurato h1 a opacity 1 già al load.)
       Cugino del bug `hero-hook-congelato` del 20/7: lì l'hook era catturato
       troppo presto, qui è CHIAMATO troppo presto. */
    setTimeout(heroEntrance, 0);
  } else {
    setTimeout(hideIntro, SITE.introDuration);
    setTimeout(hideIntro, 6000); // safety net: l'intro non può incastrarsi
    intro.addEventListener('click', hideIntro);
  }

  /* ---------- burger menu (inert + focus + Escape + resize) ---------- */
  var burger = document.getElementById('burger');
  /* 26/7/2026 (Il Papiro #168) — IL PANNELLO SI RISOLVE DA `aria-controls`.
     Il canone apriva sempre `#mainNav`, dando per scontato che la nav
     desktop FOSSE anche il drawer. Molti siti invece hanno un drawer
     separato (`#mobile-menu`) con `hidden`, mentre `#mainNav` su mobile è
     `display:none`: il burger aggiungeva `nav-open` a un elemento nascosto
     e il menu non si apriva. È la stessa decisione già presa il 20/7 per
     qa-motion — «è lì che il markup accessibile dice qual è il pannello» —
     che però non era mai rientrata qui. */
  var nav = (function () {
    var byAria = burger && burger.getAttribute('aria-controls');
    return (byAria && document.getElementById(byAria)) || document.getElementById('mainNav');
  })();
  if (burger && nav) {
    var navUsaHidden = nav.hasAttribute('hidden');
    var lastFocus = null;
    var closeNav = function () {
      nav.classList.remove('nav-open');
      if (navUsaHidden) nav.hidden = true;
      burger.setAttribute('aria-expanded', 'false');
      if (lastFocus) { lastFocus.focus(); lastFocus = null; }
    };
    var openNav = function () {
      // L'intro ha z-index alto ed è figlia del body: se è ancora a schermo
      // copre il drawer (che vive nello stacking context dell'header) e i link
      // risultano non cliccabili. Aprire il menu chiude l'intro.
      // (bug trovato da qa-motion su Linea Uomo, 19/7/2026 → PLUMBING_V 2)
      if (typeof killIntroNow === 'function') killIntroNow();
      lastFocus = document.activeElement;
      if (navUsaHidden) nav.hidden = false;
      nav.classList.add('nav-open');
      burger.setAttribute('aria-expanded', 'true');
      var first = nav.querySelector('a, button');
      if (first) first.focus();
    };
    burger.addEventListener('click', function () {
      nav.classList.contains('nav-open') ? closeNav() : openNav();
    });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', closeNav); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('nav-open')) closeNav();
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > SITE.breakpointMenu) closeNav();
    });
  }

  /* ---------- lightbox accessibile ---------- */
  var lightbox = document.getElementById('lightbox');
  var lightboxImg = document.getElementById('lightboxImg');
  var lightboxClose = document.getElementById('lightboxClose');
  if (lightbox && lightboxImg) {
    var opener = null;
    var openLb = function (src, alt) {
      lightboxImg.src = src; lightboxImg.alt = alt || '';
      lightbox.hidden = false;
      document.body.style.overflow = 'hidden';
      if (lightboxClose) lightboxClose.focus();
    };
    var closeLb = function () {
      lightbox.hidden = true; lightboxImg.src = '';
      document.body.style.overflow = '';
      if (opener) { opener.focus(); opener = null; }
    };
    document.querySelectorAll('[data-full]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        opener = btn;
        var img = btn.querySelector('img');
        openLb(btn.getAttribute('data-full'), img ? img.alt : '');
      });
    });
    if (lightboxClose) lightboxClose.addEventListener('click', closeLb);
    lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !lightbox.hidden) closeLb();
    });
  }

  /* ---------- orari dinamici Europe/Rome (finestre multiple + scavalco) ---------- */
  function romeNow() {
    try {
      var f = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Europe/Rome', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      var p = f.formatToParts(new Date());
      var map = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
      var get = function (t) { return p.find(function (x) { return x.type === t; }).value; };
      return { day: map[get('weekday')], mins: parseInt(get('hour'), 10) * 60 + parseInt(get('minute'), 10) };
    } catch (e) {
      var d = new Date();
      return { day: d.getDay(), mins: d.getHours() * 60 + d.getMinutes() };
    }
  }
  var toMin = function (hm) {
    var a = hm.split(':');
    return parseInt(a[0], 10) * 60 + parseInt(a[1], 10);
  };
  var fmt = function (m) {
    m = m % 1440;
    return ('0' + Math.floor(m / 60)).slice(-2) + ':' + ('0' + (m % 60)).slice(-2);
  };
  var DAYS_IT = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
  var DAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var HOURS_BASE = {
    it: { open: 'Aperto ora', closesAt: 'chiude alle ', opensToday: 'Chiuso · apre oggi alle ',
          opensOn: 'Chiuso · apre {day} alle ', closed: 'Chiuso', days: DAYS_IT },
    en: { open: 'Open now', closesAt: 'closes at ', opensToday: 'Closed · opens today at ',
          opensOn: 'Closed · opens {day} at ', closed: 'Closed', days: DAYS_EN },
  };
  /* risolve le etichette orari per la lingua richiesta, con fallback en -> it */
  function strings(lang) {
    var custom = (SITE.HOURS_I18N && SITE.HOURS_I18N[lang]) || null;
    var base = HOURS_BASE[lang] || HOURS_BASE.en;
    if (!custom) return base;
    var outp = {};
    Object.keys(HOURS_BASE.it).forEach(function (k) {
      outp[k] = custom[k] !== undefined ? custom[k] : base[k];
    });
    return outp;
  }

  function hoursState() {
    var now = romeNow();
    // finestra del giorno corrente
    var wins = SITE.hours[now.day] || [];
    for (var i = 0; i < wins.length; i++) {
      var s = toMin(wins[i][0]), e = toMin(wins[i][1]);
      if (now.mins >= s && now.mins < Math.min(e, 1440)) {
        return { open: true, day: now.day, closesAt: fmt(e) };
      }
    }
    // coda dopo mezzanotte della sera PRIMA
    var prev = (now.day + 6) % 7;
    var pw = SITE.hours[prev] || [];
    for (var j = 0; j < pw.length; j++) {
      var pe = toMin(pw[j][1]);
      if (pe > 1440 && now.mins < pe - 1440) {
        return { open: true, day: prev, closesAt: fmt(pe) };
      }
    }
    // chiuso: prossima apertura (oggi o nei prossimi 7 giorni)
    for (var k = 0; k < wins.length; k++) {
      if (now.mins < toMin(wins[k][0])) {
        return { open: false, day: now.day, opensToday: fmt(toMin(wins[k][0])) };
      }
    }
    for (var d = 1; d <= 7; d++) {
      var nd = (now.day + d) % 7;
      var nw = SITE.hours[nd] || [];
      if (nw.length) return { open: false, day: now.day, opensDay: nd, opensAt: fmt(toMin(nw[0][0])) };
    }
    return { open: false, day: now.day };
  }

  function renderHours() {
    var el = document.getElementById(SITE.hoursStatusId);
    var st = hoursState();
    document.querySelectorAll(SITE.hoursTableSelector).forEach(function (row) {
      row.classList.toggle(SITE.todayClass,
        parseInt(row.getAttribute('data-day'), 10) === st.day);
    });
    if (!el) return;
    /* V4: le etichette si risolvono per lingua corrente, non con un booleano
       en/it. Fallback a catena lingua -> en -> it, così un sito con AR o FR
       che non traduce lo stato orari resta comunque leggibile. */
    var L = strings(root.lang);
    var txt;
    if (st.open) {
      txt = L.open + ' · ' + L.closesAt + st.closesAt;
    } else if (st.opensToday) {
      txt = L.opensToday + st.opensToday;
    } else if (st.opensAt !== undefined) {
      txt = L.opensOn.replace('{day}', L.days[st.opensDay]) + st.opensAt;
    } else {
      txt = L.closed;
    }
    el.textContent = txt;
  }
  renderHours();
  setInterval(renderHours, 60000);

  /* ---------- i18n overlay (EN sopra l'IT del DOM) ---------- */
  var originals = {}; // attr -> key -> testo IT
  var I18N_ATTRS = [
    ['data-i18n', null],
    ['data-i18n-aria', 'aria-label'],
    ['data-i18n-alt', 'alt'],
    ['data-i18n-placeholder', 'placeholder'],
    ['data-i18n-title', 'title'],
  ];
  function setLang(lang) {
    /* V4: qualunque lingua dichiarata in SITE.LANGS, non più solo 'en'.
       'it' resta la lingua del DOM: nessun dizionario, nessuna sostituzione.
       Una lingua sconosciuta ricade su 'it' invece di rompere la pagina. */
    root.lang = (lang === 'it' || LANG_CODES.indexOf(lang) !== -1) ? lang : 'it';
    root.dir = SITE.RTL.indexOf(root.lang) !== -1 ? 'rtl' : 'ltr';
    var dict = SITE.LANGS[root.lang] || null;
    I18N_ATTRS.forEach(function (pair) {
      var dattr = pair[0], target = pair[1];
      if (!originals[dattr]) originals[dattr] = {};
      document.querySelectorAll('[' + dattr + ']').forEach(function (el) {
        var key = el.getAttribute(dattr);
        var store = originals[dattr];
        /* innerHTML, NON textContent: gli elementi tradotti contengono
           quasi sempre markup (<strong>, <br>) e con textContent il primo
           passaggio a EN lo appiattisce — tornando in italiano il grassetto
           non torna più. I valori del dizionario sono statici e scritti da
           noi. (20/7/2026: la flotta era già così, il boilerplate no.) */
        if (!(key in store)) store[key] = target ? el.getAttribute(target) : el.innerHTML;
        var val = dict && dict[key] !== undefined ? dict[key] : store[key];
        if (target) el.setAttribute(target, val); else el.innerHTML = val;
      });
    });
    renderHours();
    /* stato visivo della coppia di bottoni lingua, se il sito la usa */
    document.querySelectorAll('[data-lang]').forEach(function (b) {
      var on = b.getAttribute('data-lang') === root.lang;
      b.classList.toggle('is-on', on);
      if (b.tagName === 'BUTTON') b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
    try { localStorage.setItem(SITE.slug + '-lang', lang); } catch (e) {}
  }
  /* 26/7/2026 (Il Papiro #168) — SI CABLANO ENTRAMBE LE FORME DI SELETTORE.
     Il canone conosceva solo il toggle singolo `#langToggle`, ma nella
     flotta esiste da tempo anche la COPPIA di bottoni `[data-lang]`
     (Warsa, Mido…): `i18n-roundtrip` era già stato insegnato a riconoscerle
     il 20/7, il plumbing no. Chi copiava il boilerplate e usava la coppia
     si ritrovava il cambio lingua MORTO, e nessun lint statico se ne
     accorgeva (lo becca solo qa-motion, a runtime). */
  var langToggle = document.getElementById('langToggle');
  if (langToggle) {
    /* V4: il toggle singolo CICLA sull'anello ['it', ...LANG_CODES].
       Con due lingue il comportamento è identico a prima (it <-> en). */
    var RING = ['it'].concat(LANG_CODES);
    langToggle.addEventListener('click', function () {
      var i = RING.indexOf(root.lang);
      setLang(RING[(i + 1) % RING.length]);
    });
  }
  document.querySelectorAll('[data-lang]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang')); });
  });
  try {
    var saved = localStorage.getItem(SITE.slug + '-lang');
    if (saved && saved !== 'it' && LANG_CODES.indexOf(saved) !== -1) setLang(saved);
  } catch (e) {}

  /* ---------- action-bar mobile (opzionale: #actionBar) ---------- */
  var actionBar = document.getElementById('actionBar');
  if (actionBar) {
    var onScroll = function () {
      actionBar.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ══════════ FINE PLUMBING — da qui in giù SOLO il codice-firma
     del sito (animazioni e interazioni uniche del cliente), che si
     registra comunque SUBITO, mai dentro setTimeout/intro. ══════════ */

  /* ══════════ TIN WHISTLE — Irish pub sul Naviglio Grande ══════════
     La pagina si orienta coi cartelli a dito irlandesi che hanno in sala.
     la FIRMA — «la diteggiatura»: il tin whistle (il flautino di latta a sei fori che dà il nome al pub) suona l'inizio di un brano
     tradizionale; nota dopo nota le dita chiudono e aprono i fori e sotto, sul cartoncino, si scrive la tavola delle diteggiature.
     Lo stato è M (il brano), T (0…1 sul tempo del brano: ogni nota ha la sua finestra; all'inizio della nota le dita passano dalla
     diteggiatura precedente alla sua in un attacco breve, la sua colonna compare, il cursore d'oro la segna, dal becco escono gli
     archi del suono che si spengono) e V (il cartoncino: 0 al suo posto, fino a 1 portato via a destra, da −1 a 0 ne arriva uno vuoto
     da sinistra). Senza JS e alla fine: Washerwoman, T = 1, V = 0 (l'HTML). L'attesa (classe nell'head): dita sollevate e cartoncino
     vuoto, nello stesso posto. Scegliere: il cartoncino scritto va via, ne arriva uno vuoto, il brano suona. Reduced-motion: tutto
     subito. rAF a tempo, guardia 1,5 s, IO al 60 %, resize solo se cambia la larghezza; un gesto durante l'animazione la ferma dov'è. */
  var DATI = {"vb":[720,380],"fori":[290,340,390,470,520,570],"tempi":{"inizio":300,"ottavo":200,"servi":380,"arriva":380,"via":300,"entra":300,"attacco":70},"brani":[{"nome":"The Irish Washerwoman","ottavi":14,"suona":2800,"note":[{"nome":"D","alta":true,"f":"011111","x":61,"t":0,"w":0.07142857142857142,"a":0.025},{"nome":"C","alta":false,"f":"011000","x":107,"t":0.07142857142857142,"w":0.07142857142857142,"a":0.025},{"nome":"B","alta":false,"f":"100000","x":153,"t":0.14285714285714285,"w":0.07142857142857142,"a":0.025},{"nome":"G","alta":false,"f":"111000","x":199,"t":0.21428571428571427,"w":0.07142857142857142,"a":0.025},{"nome":"G","alta":false,"f":"111000","x":245,"t":0.2857142857142857,"w":0.07142857142857142,"a":0.025},{"nome":"D","alta":false,"f":"111111","x":291,"t":0.35714285714285715,"w":0.07142857142857142,"a":0.025},{"nome":"G","alta":false,"f":"111000","x":337,"t":0.42857142857142855,"w":0.07142857142857142,"a":0.025},{"nome":"G","alta":false,"f":"111000","x":383,"t":0.5,"w":0.07142857142857142,"a":0.025},{"nome":"B","alta":false,"f":"100000","x":429,"t":0.5714285714285714,"w":0.07142857142857142,"a":0.025},{"nome":"G","alta":false,"f":"111000","x":475,"t":0.6428571428571429,"w":0.07142857142857142,"a":0.025},{"nome":"B","alta":false,"f":"100000","x":521,"t":0.7142857142857143,"w":0.07142857142857142,"a":0.025},{"nome":"D","alta":true,"f":"011111","x":567,"t":0.7857142857142857,"w":0.07142857142857142,"a":0.025},{"nome":"C","alta":false,"f":"011000","x":613,"t":0.8571428571428571,"w":0.07142857142857142,"a":0.025},{"nome":"B","alta":false,"f":"100000","x":659,"t":0.9285714285714286,"w":0.07142857142857142,"a":0.025}]},{"nome":"The Kesh","ottavi":18,"suona":3600,"note":[{"nome":"G","alta":false,"f":"111000","x":61,"t":0,"w":0.16666666666666666,"a":0.019444444444444445},{"nome":"G","alta":false,"f":"111000","x":107,"t":0.16666666666666666,"w":0.05555555555555555,"a":0.019444444444444445},{"nome":"A","alta":false,"f":"110000","x":153,"t":0.2222222222222222,"w":0.05555555555555555,"a":0.019444444444444445},{"nome":"B","alta":false,"f":"100000","x":199,"t":0.2777777777777778,"w":0.05555555555555555,"a":0.019444444444444445},{"nome":"A","alta":false,"f":"110000","x":245,"t":0.3333333333333333,"w":0.16666666666666666,"a":0.019444444444444445},{"nome":"A","alta":false,"f":"110000","x":291,"t":0.5,"w":0.05555555555555555,"a":0.019444444444444445},{"nome":"B","alta":false,"f":"100000","x":337,"t":0.5555555555555556,"w":0.05555555555555555,"a":0.019444444444444445},{"nome":"D","alta":true,"f":"011111","x":383,"t":0.6111111111111112,"w":0.05555555555555555,"a":0.019444444444444445},{"nome":"E","alta":true,"f":"111110","x":429,"t":0.6666666666666666,"w":0.05555555555555555,"a":0.019444444444444445},{"nome":"D","alta":true,"f":"011111","x":475,"t":0.7222222222222222,"w":0.05555555555555555,"a":0.019444444444444445},{"nome":"D","alta":true,"f":"011111","x":521,"t":0.7777777777777778,"w":0.05555555555555555,"a":0.019444444444444445},{"nome":"G","alta":true,"f":"111000","x":567,"t":0.8333333333333334,"w":0.05555555555555555,"a":0.019444444444444445},{"nome":"D","alta":true,"f":"011111","x":613,"t":0.8888888888888888,"w":0.05555555555555555,"a":0.019444444444444445},{"nome":"D","alta":true,"f":"011111","x":659,"t":0.9444444444444444,"w":0.05555555555555555,"a":0.019444444444444445}]},{"nome":"La scala","ottavi":16,"suona":3200,"note":[{"nome":"D","alta":false,"f":"111111","x":199,"t":0,"w":0.125,"a":0.021875},{"nome":"E","alta":false,"f":"111110","x":245,"t":0.125,"w":0.125,"a":0.021875},{"nome":"F#","alta":false,"f":"111100","x":291,"t":0.25,"w":0.125,"a":0.021875},{"nome":"G","alta":false,"f":"111000","x":337,"t":0.375,"w":0.125,"a":0.021875},{"nome":"A","alta":false,"f":"110000","x":383,"t":0.5,"w":0.125,"a":0.021875},{"nome":"B","alta":false,"f":"100000","x":429,"t":0.625,"w":0.125,"a":0.021875},{"nome":"C#","alta":false,"f":"000000","x":475,"t":0.75,"w":0.125,"a":0.021875},{"nome":"D","alta":true,"f":"011111","x":521,"t":0.875,"w":0.125,"a":0.021875}]}]};
  var prendi = function (id) { return document.getElementById(id); };
  var figuraF = prendi('fischio-firma'), svgF = prendi('fischioSvg'), tuttoF = prendi('tabTutto'), leggiF = prendi('fischioLeggi');
  var cursoreF = prendi('tabCursore'), ondeF = prendi('fischioOnde');
  var DITA = svgF ? [0, 1, 2, 3, 4, 5].map(function (h) { return svgF.querySelector('.dito[data-h="' + h + '"]'); }) : [];
  var COLONNE = svgF ? DATI.brani.map(function (B, m) { return [].slice.call(svgF.querySelectorAll('.tab__brano[data-m="' + m + '"] .tab__col')).sort(function (a, b) { return +a.getAttribute('data-i') - +b.getAttribute('data-i'); }); }) : [];
  var BOTTONI = [].slice.call(document.querySelectorAll('.fischio__modi button[data-modo]'));
  var TF = DATI.tempi;
  var faseF = 'fatta', modoF = '', rafF = 0, guardiaF = 0, larghezzaAvvioF = 0, corseF = 0, pianoF = null;
  var MF = 0, TT = 1, VF = 0;
  var destinazioneF = { m: 0 };
  var c01 = function (t) { return Math.max(0, Math.min(1, t)); };
  var r3 = function (n) { return Math.round(n * 1000) / 1000; };
  var CURVE = {
    dolce: function (u) { return u < .5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2; },
    lineare: function (u) { return u; }
  };
  /* la nota che suona a T: l'ultima cominciata (a T = 0 nessuna: le dita sono sollevate) */
  function notaA(B, t) { if (t <= 0) return -1; var k = -1; for (var i = 0; i < B.note.length; i++) if (B.note[i].t <= t) k = i; return k; }
  function annunciaF(m) {
    var el = document.querySelector('.fischio__d[data-m="' + m + '"]');
    if (leggiF) leggiF.textContent = el ? el.textContent : '';
  }
  /* il disegno dello stato: allo stato finale gli stessi attributi dell'HTML */
  function disegnaF(m, t, v) {
    if (m !== MF || figuraF.getAttribute('data-modo') !== String(m)) {
      MF = m;
      figuraF.setAttribute('data-modo', String(m));
      BOTTONI.forEach(function (bt) { bt.setAttribute('aria-pressed', String(+bt.getAttribute('data-modo') === m)); });
    }
    TT = t; VF = v;
    var B = DATI.brani[m], k = notaA(B, t);
    /* le dita: dalla diteggiatura della nota prima (o sollevate) a quella della nota k, nell'attacco */
    var N = k < 0 ? null : B.note[k], q = N ? c01((t - N.t) / N.a) : 0, prima = k > 0 ? B.note[k - 1].f : '000000';
    DITA.forEach(function (d, h) {
      var a = +prima.charAt(h), b = N ? +N.f.charAt(h) : 0;
      d.setAttribute('opacity', String(r3(a + (b - a) * q)));
    });
    COLONNE[m].forEach(function (c, i) { var n = B.note[i]; c.setAttribute('opacity', String(r3(c01((t - n.t) / n.a)))); });
    cursoreF.setAttribute('transform', 'translate(' + B.note[Math.max(k, 0)].x + ' 0)');
    cursoreF.setAttribute('opacity', k < 0 ? '0' : String(r3(c01((1 - t) / 0.03))));
    ondeF.setAttribute('opacity', k < 0 ? '0' : String(r3(0.9 * (1 - c01((t - N.t) / N.w)))));
    if (v === 0) { tuttoF.removeAttribute('transform'); tuttoF.removeAttribute('opacity'); }
    else if (v > 0) { tuttoF.setAttribute('transform', 'translate(' + r3(TF.via * v) + ' 0)'); tuttoF.setAttribute('opacity', String(r3(1 - v))); }
    else { tuttoF.setAttribute('transform', 'translate(' + r3(TF.entra * v) + ' 0)'); tuttoF.setAttribute('opacity', String(r3(1 + v))); }
  }
  /* un piano: tratti { da, a, m, x0: {t, v}, x1: {…}, curva } */
  function fotogrammaF(t) {
    var P = pianoF.piano, cur = null;
    for (var i = 0; i < P.length; i++) if (t >= P[i].da) cur = P[i];
    if (!cur) return;
    var q = t < cur.a ? c01((t - cur.da) / Math.max(1, cur.a - cur.da)) : 1, e = CURVE[cur.curva](q), A = cur.x0, B = cur.x1;
    disegnaF(cur.m, A.t + (B.t - A.t) * e, A.v + (B.v - A.v) * e);
  }
  var st2 = function (t, v) { return { t: t, v: v }; };
  function sorvegliaF() { clearTimeout(guardiaF); guardiaF = setTimeout(chiudiF, 1500); }
  function chiudiF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    disegnaF(destinazioneF.m, 1, 0);
    /* i cartoncini nascosti degli altri brani tornano come nell'HTML (un brano interrotto e lasciato li avrebbe a metà) */
    COLONNE.forEach(function (C, k) { if (k !== destinazioneF.m) C.forEach(function (c) { c.setAttribute('opacity', '1'); }); });
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    root.classList.remove('firma-attesa');
    faseF = 'fatta';
  }
  /* un gesto durante un'animazione (o nell'attesa): tutto si ferma dov'è (#244); dall'attesa dita sollevate e cartoncino vuoto */
  function fermaF() {
    cancelAnimationFrame(rafF); rafF = 0;
    clearTimeout(guardiaF);
    if (root.classList.contains('firma-attesa')) { disegnaF(MF, 0, 0); root.classList.remove('firma-attesa'); }
    else disegnaF(MF, TT, VF);
    if (figuraF) figuraF.setAttribute('data-firma', 'fatta');
    faseF = 'fatta';
  }
  function avviaF(modo, piano) {
    cancelAnimationFrame(rafF); rafF = 0;
    modoF = modo; pianoF = piano;
    root.classList.remove('firma-attesa');
    faseF = 'corre'; if (figuraF) figuraF.setAttribute('data-firma', 'corre');
    larghezzaAvvioF = window.innerWidth;
    var t0 = null, corsa = ++corseF;
    function fotogramma(ts) {
      rafF = 0;
      /* un fotogramma rimasto in coda dopo la chiusura (o di una corsa vecchia) non riapre niente */
      if (faseF !== 'corre' || corsa !== corseF) return;
      if (t0 === null) t0 = ts;
      var t = ts - t0;
      fotogrammaF(t);
      if (t >= pianoF.fine) { chiudiF(); return; }
      sorvegliaF();
      rafF = requestAnimationFrame(fotogramma);
    }
    sorvegliaF();
    rafF = requestAnimationFrame(fotogramma);
  }
  function avviaIntroF() {
    /* dalla classe d'attesa agli attributi senza cambiare un pixel: dita sollevate, cartoncino vuoto */
    disegnaF(0, 0, 0);
    destinazioneF = { m: 0 };
    var S = DATI.brani[0].suona;
    var P = [{ da: 0, a: TF.inizio, m: 0, x0: st2(0, 0), x1: st2(0, 0), curva: 'lineare' }, { da: TF.inizio, a: TF.inizio + S, m: 0, x0: st2(0, 0), x1: st2(1, 0), curva: 'lineare' }];
    avviaF('intro', { piano: P, fine: TF.inizio + S });
  }
  /* il gesto: scegliere un brano. Se è quello che sta già suonando, niente; altrimenti tutto si ferma dov'è, il cartoncino va via,
     ne arriva uno vuoto e il brano suona. */
  function sceltaF(m) {
    if (faseF === 'corre' && destinazioneF.m === m) return;
    if (faseF === 'corre' || root.classList.contains('firma-attesa')) fermaF();
    destinazioneF = { m: m };
    annunciaF(m);
    if (reducedMotion) { chiudiF(); return; }
    var P = [], t = 0, mm = MF, a = st2(TT, VF);
    var passo = function (dura, m2, b, curva) { P.push({ da: t, a: t + dura, m: m2, x0: a, x1: b, curva: curva }); t += dura; a = b; };
    if (a.v >= 0) {
      passo(TF.servi, mm, st2(a.t, 1), 'dolce');
      a = st2(0, -1);
    }
    passo(TF.arriva, m, st2(0, 0), 'dolce');
    passo(DATI.brani[m].suona, m, st2(1, 0), 'lineare');
    avviaF('prepara', { piano: P, fine: t });
  }

  /* la testata segna la sezione in cui ti trovi */
  var linkVoci = [].slice.call(document.querySelectorAll('#mainNav a'));
  var bersagliVoci = linkVoci.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  function aggiornaVoci() {
    var y = (document.getElementById('testata') || { offsetHeight: 80 }).offsetHeight + 40, ora = -1;
    for (var i = 0; i < bersagliVoci.length; i++) { if (bersagliVoci[i] && bersagliVoci[i].getBoundingClientRect().top <= y) ora = i; }
    linkVoci.forEach(function (a, k) { if (k === ora) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
  }
  var tickVoci = 0;
  window.addEventListener('scroll', function () {
    if (tickVoci) return;
    tickVoci = requestAnimationFrame(function () { tickVoci = 0; aggiornaVoci(); });
  }, { passive: true });
  aggiornaVoci();

  /* lo stato degli orari anche sopra la tabella */
  function copiaStato() {
    var primo = document.getElementById(SITE.hoursStatusId);
    if (!primo) return;
    var aperto = hoursState().open;
    ['orarioStato', 'orarioStato2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (!el) return;
      if (el !== primo) el.textContent = primo.textContent;
      el.classList.toggle('is-aperto', aperto);
    });
  }
  copiaStato();
  setInterval(copiaStato, 60000);
  /* la copia segue lo stato principale a ogni cambio, anche di lingua (#243, stato-lingua-check) */
  (function () {
    var primoS = document.getElementById(SITE.hoursStatusId);
    if (primoS && window.MutationObserver) new MutationObserver(copiaStato).observe(primoS, { childList: true, characterData: true, subtree: true });
  })();

  /* la diteggiatura è «in vista» quando se ne vede almeno il 60% (o il 60% della finestra, se è più alta della finestra); l'altezza è
     quella del documento: all'avvio innerHeight di un telefono può non essere ancora quella vera (#233) */
  function altezzaVista() { return document.documentElement.clientHeight || window.innerHeight || 800; }
  function abbastanza(top, bottom, alto, vh) { return Math.min(bottom, vh) - Math.max(top, 0) >= 0.6 * Math.min(alto, vh); }
  function inVistaF() { var r = svgF.getBoundingClientRect(); return abbastanza(r.top, r.bottom, r.height, altezzaVista()); }

  if (figuraF && svgF && tuttoF && cursoreF && ondeF && DITA.every(Boolean) && COLONNE.every(function (C, m) { return C.length === DATI.brani[m].note.length; }) && BOTTONI.length === DATI.brani.length) {
    try { clearTimeout(window.__attesaFischio); } catch (e) {}
    window.__fischio = {
      stato: function () {
        return { fase: faseF, modo: modoF, corse: corseF, m: MF, t: TT, v: VF, meta: destinazioneF.m };
      },
      tempi: TF,
    };
    var daFareF = !reducedMotion && root.classList.contains('firma-attesa');
    /* la pagina aperta su una sezione (#orari): il browser ci scorre dopo, la firma non si vedrebbe */
    var ancoraF = location.hash && location.hash.length > 1 && location.hash !== '#inizio';
    var inVista = inVistaF();
    /* perché la firma è partita o no (lo legge il check) */
    window.__fischio.avvio = { daFare: daFareF, ancora: !!ancoraF, inVista: inVista, top: svgF.getBoundingClientRect().top, vh: altezzaVista() };
    if (!daFareF || ancoraF) chiudiF();
    else if (inVista) avviaIntroF();
    else if ('IntersectionObserver' in window) {
      /* la diteggiatura sotto la piega: parte quando se ne vede abbastanza; fino ad allora dita sollevate e cartoncino vuoto */
      var soglie = []; for (var sg = 0; sg <= 20; sg++) soglie.push(sg / 20);
      var ioF = new IntersectionObserver(function (voci) {
        if (!voci.some(function (v) { return v.isIntersecting && abbastanza(v.boundingClientRect.top, v.boundingClientRect.bottom, v.boundingClientRect.height, altezzaVista()); })) return;
        ioF.disconnect();
        if (faseF === 'fatta' && root.classList.contains('firma-attesa')) avviaIntroF();
      }, { threshold: soglie });
      ioF.observe(svgF);
      window.__fischio.avvio.aspetta = true;
    } else chiudiF();
    /* un resize chiude la firma solo se cambia la LARGHEZZA (sul telefono arrivano resize della sola altezza, #228) */
    window.addEventListener('resize', function () {
      if (faseF !== 'corre' || Math.abs(window.innerWidth - larghezzaAvvioF) <= 1) return;
      chiudiF();
    });
    BOTTONI.forEach(function (b) { b.addEventListener('click', function () { sceltaF(+b.getAttribute('data-modo')); }); });
  }
})();
