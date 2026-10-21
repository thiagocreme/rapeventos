// RAP EVENTOS — v2
// Interações e animações. A página funciona sem este arquivo e sem as bibliotecas (GSAP / Lenis);
// aqui só acrescentamos movimento, e tudo respeita "reduzir movimento" do sistema.
(() => {
  const root = document.documentElement;
  // ?estatico na URL: versão parada, usada para gerar imagens e o PDF de apresentação.
  const params = new URLSearchParams(location.search);
  const estatico = params.has('estatico');
  if (estatico) {
    root.classList.add('estatico');
    document.querySelectorAll('img[loading="lazy"]').forEach(img => { img.loading = 'eager'; });
    // ?estatico&so=momentos mostra só aquela seção (o cabeçalho continua por cima)
    const so = params.get('so');
    if (so) {
      [...document.querySelectorAll('main > *, body > footer')].forEach(el => {
        if (el.id !== so) el.style.display = 'none';
      });
      if (so === 'servicos') document.getElementById(so).style.paddingTop = 'calc(var(--header-h) + 48px)';
    }
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches || estatico;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasGsap = typeof window.gsap !== 'undefined';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  if (hasGsap) {
    const plugins = [window.ScrollTrigger, window.SplitText].filter(Boolean);
    gsap.registerPlugin(...plugins);
  }

  /* ---------- Rolagem suave (Lenis) ---------- */
  let lenis = null;
  if (!reduce && window.Lenis && hasGsap && window.ScrollTrigger) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToTarget = target => {
    if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.4 });
    else target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  };
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const target = id.length > 1 ? document.querySelector(id) : null;
    if (!target) return;
    e.preventDefault();
    setMenu(false);
    scrollToTarget(target);
    history.replaceState(null, '', id);
  });

  /* ---------- Cabeçalho, botão flutuante ---------- */
  const header = $('[data-header]');
  const waFloat = $('[data-wa-float]');
  const hero = $('[data-hero]');
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-solid', y > 30);
    const goingDown = y > lastY && y > window.innerHeight * 0.9;
    if (!$('[data-nav]').classList.contains('is-open')) header.classList.toggle('is-hidden', goingDown);
    const nearEnd = y + window.innerHeight > document.documentElement.scrollHeight - 140;
    waFloat.classList.toggle('is-visible', y > hero.offsetHeight * 0.6 && !nearEnd);
    lastY = y;
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Menu do celular ---------- */
  const toggle = $('[data-menu-toggle]');
  const nav = $('[data-nav]');
  const menuLabel = $('[data-menu-label]');
  function setMenu(open) {
    if (!toggle) return;
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    menuLabel.textContent = open ? 'Fechar menu' : 'Abrir menu';
    document.body.style.overflow = open ? 'hidden' : '';
    if (lenis) open ? lenis.stop() : lenis.start();
    if (open && hasGsap && !reduce) {
      gsap.fromTo($$('li, .nav-cta-mobile', nav), { y: 40, opacity: 0 }, { y: 0, opacity: 1, stagger: 0.06, duration: 0.7, ease: 'expo.out', delay: 0.2 });
    }
  }
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 961px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* ---------- Vídeo do hero ---------- */
  const video = $('[data-hero-video]');
  const vToggle = $('[data-video-toggle]');
  const vLabel = $('[data-video-toggle-label]');
  const userPaused = () => vToggle.getAttribute('aria-pressed') === 'true';
  const setPaused = p => {
    vToggle.setAttribute('aria-pressed', String(p));
    vLabel.textContent = p ? 'Reproduzir vídeo e animações de fundo' : 'Pausar vídeo e animações de fundo';
    hero.classList.toggle('is-paused', p);
  };
  const tryPlay = () => video.play().catch(() => {});
  const saveData = navigator.connection && navigator.connection.saveData;
  if (reduce || saveData) {
    video.removeAttribute('autoplay');
    video.pause();
    setPaused(true);
  } else {
    tryPlay();
    ['pointerdown', 'keydown', 'touchstart'].forEach(ev =>
      window.addEventListener(ev, () => { if (video.paused && !userPaused()) tryPlay(); }, { once: true, passive: true }));
  }
  vToggle.addEventListener('click', () => {
    if (video.paused) { tryPlay(); setPaused(false); } else { video.pause(); setPaused(true); }
  });
  new IntersectionObserver(([en]) => {
    if (userPaused()) return;
    en.isIntersecting ? tryPlay() : video.pause();
  }, { threshold: 0.02 }).observe(hero);

  /* ---------- Spotlight do hero ---------- */
  if (finePointer && !reduce) {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${e.clientX - r.left}px`);
      hero.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  }

  /* ---------- Marca do rodapé acende sob o mouse ---------- */
  const mark = $('[data-footer-mark]');
  if (mark && finePointer && !reduce) {
    mark.addEventListener('pointermove', e => {
      const r = mark.getBoundingClientRect();
      mark.style.setProperty('--fx', `${e.clientX - r.left}px`);
      mark.style.setProperty('--fy', `${e.clientY - r.top}px`);
    });
    mark.addEventListener('pointerleave', () => { mark.style.setProperty('--fx', '50%'); mark.style.setProperty('--fy', '-50%'); });
  }

  /* ---------- Cursor ---------- */
  const cursor = $('[data-cursor]');
  const cursorLabel = $('[data-cursor-label]');
  if (finePointer && !reduce && hasGsap) {
    root.classList.add('has-cursor');
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
    window.addEventListener('pointermove', e => { xTo(e.clientX); yTo(e.clientY); }, { passive: true });
    document.addEventListener('pointerover', e => {
      const media = e.target.closest('[data-cursor]:not(.cursor)');
      const link = e.target.closest('a, button');
      cursor.classList.toggle('is-media', !!media);
      cursor.classList.toggle('is-link', !media && !!link);
      cursorLabel.textContent = media ? media.dataset.cursor : '';
    });
    document.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
    document.addEventListener('pointerenter', () => cursor.classList.remove('is-hidden'));
  }

  /* ---------- Botões magnéticos ---------- */
  if (finePointer && !reduce && hasGsap) {
    $$('.magnetic').forEach(el => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.3);
        yTo((e.clientY - r.top - r.height / 2) * 0.4);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ---------- Cards com inclinação 3D ---------- */
  if (finePointer && !reduce) {
    $$('.tilt').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.setProperty('--px', `${px * 100}%`);
        el.style.setProperty('--py', `${py * 100}%`);
        el.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 7}deg) rotateY(${(px - 0.5) * 7}deg)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  /* ---------- Galeria (a partir de assets/js/galeria.js) ---------- */
  const gallery = $('[data-gallery]');
  const items = (window.RAP_GALERIA || []).filter(i => i && i.src);
  const formatos = ['destaque', 'alto', 'largo', 'quadrado'];
  items.forEach((item, i) => {
    const tile = document.createElement('figure');
    tile.className = `tile ${formatos.includes(item.formato) ? item.formato : 'quadrado'}`;
    tile.style.margin = '0';
    tile.dataset.cat = item.categoria || 'festa';
    tile.dataset.idx = i;
    const isVideo = item.tipo === 'video';
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'tile-btn';
    btn.dataset.cursor = isVideo ? 'Play' : 'Ver';
    btn.setAttribute('aria-label', `${isVideo ? 'Assistir vídeo' : 'Ampliar foto'}: ${item.alt || ''}`);
    const img = document.createElement('img');
    img.src = isVideo ? (item.poster || '') : (item.miniatura || item.src);
    img.alt = '';
    img.loading = 'lazy';
    img.decoding = 'async';
    btn.appendChild(img);
    if (isVideo) {
      const pv = document.createElement('video');
      pv.muted = true; pv.loop = true; pv.playsInline = true; pv.preload = 'none';
      pv.setAttribute('aria-hidden', 'true');
      btn.appendChild(pv);
      btn.insertAdjacentHTML('beforeend', '<span class="tile-play" aria-hidden="true"><svg class="icon"><use href="#i-play"/></svg></span>');
      if (finePointer && !reduce) {
        btn.addEventListener('pointerenter', () => {
          if (!pv.src) pv.src = item.src;
          pv.play().then(() => tile.classList.add('is-previewing')).catch(() => {});
        });
        btn.addEventListener('pointerleave', () => { pv.pause(); tile.classList.remove('is-previewing'); });
      }
    }
    btn.insertAdjacentHTML('beforeend', `<span class="tile-tag" aria-hidden="true"><svg class="icon"><use href="#${isVideo ? 'i-play' : 'i-expand'}"/></svg>${isVideo ? 'Vídeo' : 'Foto'}</span>`);
    btn.addEventListener('click', () => openLightbox(i, btn));
    tile.appendChild(btn);
    gallery.appendChild(tile);
  });
  // Bloco final da galeria convidando para o WhatsApp (usa o mesmo link dos outros botões)
  const waHref = $('.wa-float').getAttribute('href');
  gallery.insertAdjacentHTML('beforeend', `
    <div class="tile alto tile-cta">
      <span class="tile-cta-kicker">Sua vez</span>
      <p class="tile-cta-title">A próxima pista pode ser a sua.</p>
      <a class="btn btn-gold magnetic" href="${waHref}" target="_blank" rel="noopener">
        <svg class="icon" aria-hidden="true"><use href="#i-whatsapp"/></svg>Fale com a RAP
      </a>
    </div>`);

  /* ---------- Vídeos da Grande Final: um de cada vez ---------- */
  const clips = [...document.querySelectorAll('[data-clip]')];
  clips.forEach(v => {
    v.addEventListener('play', () => { clips.forEach(o => { if (o !== v) o.pause(); }); v.closest('.clip').classList.add('is-playing'); });
    v.addEventListener('pause', () => v.closest('.clip').classList.remove('is-playing'));
  });

  /* ---------- A Grande Final: vídeo de fundo e player com som ---------- */
  const cine = $('[data-cine]');
  if (cine) {
    const fundos = $$('[data-cine-bg]', cine);
    const economia = reduce || (navigator.connection && navigator.connection.saveData);
    const visivel = v => v.getClientRects().length > 0; // escondido no celular ou no computador = não carrega
    const tocarFundos = () => fundos.forEach(v => {
      if (!visivel(v)) { v.pause(); return; }
      if (!v.src) v.src = v.dataset.src;
      v.play().catch(() => {});
    });
    if (!economia && 'IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => {
        if (en.isIntersecting) tocarFundos(); else fundos.forEach(v => v.pause());
      }, { rootMargin: '150px 0px' }).observe(cine);
    }
    const dlg = $('[data-cine-dialog]', cine);
    const player = $('[data-cine-player]', cine);
    let quemAbriu = null;
    $$('[data-cine-open]', cine).forEach(b => b.addEventListener('click', () => {
      quemAbriu = b;
      fundos.forEach(v => v.pause());
      player.poster = b.dataset.cinePoster || '';
      player.src = b.dataset.cineOpen;
      player.setAttribute('aria-label', b.dataset.cineTitulo || 'Vídeo');
      if (typeof dlg.showModal === 'function') { dlg.showModal(); if (lenis) lenis.stop(); }
      player.play().catch(() => {});
    }));
    $('[data-cine-close]', cine).addEventListener('click', () => dlg.close());
    dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', () => {
      player.pause(); player.removeAttribute('src'); player.load();
      if (lenis) lenis.start();
      if (!economia) tocarFundos();
      if (quemAbriu) quemAbriu.focus();
    });
  }

  /* ---------- Filtros da galeria ---------- */
  let visiveis = items.map((_, i) => i);
  $$('[data-filtro]').forEach(b => b.addEventListener('click', () => {
    const f = b.dataset.filtro;
    $$('[data-filtro]').forEach(o => o.setAttribute('aria-pressed', String(o === b)));
    const tiles = $$('.tile[data-cat]', gallery);
    visiveis = [];
    tiles.forEach(t => {
      const mostra = f === 'todos' || t.dataset.cat === f;
      t.hidden = !mostra;
      if (mostra) visiveis.push(Number(t.dataset.idx));
    });
    if (hasGsap && !reduce) gsap.fromTo(tiles.filter(t => !t.hidden), { opacity: 0, y: 24, clipPath: 'inset(0% 0% 0% 0%)' }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05, ease: 'expo.out', overwrite: true });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }));

  /* ---------- Lightbox ---------- */
  const dialog = $('[data-lightbox]');
  const stage = $('[data-lightbox-stage]');
  const caption = $('[data-lightbox-caption]');
  let current = 0, opener = null;
  const render = i => {
    current = (i + visiveis.length) % visiveis.length;
    const item = items[visiveis[current]];
    stage.innerHTML = '';
    if (item.tipo === 'video') {
      const v = document.createElement('video');
      v.src = item.src; v.controls = true; v.playsInline = true; v.autoplay = true;
      if (item.poster) v.poster = item.poster;
      v.setAttribute('aria-label', item.alt || 'Vídeo');
      stage.appendChild(v);
    } else {
      const im = document.createElement('img');
      im.src = item.src; im.alt = item.alt || '';
      stage.appendChild(im);
    }
    caption.textContent = `${item.alt || ''} (${current + 1} de ${visiveis.length})`;
    if (hasGsap && !reduce) gsap.fromTo(stage.firstChild, { opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1, duration: 0.45, ease: 'expo.out' });
  };
  function openLightbox(i, from) {
    opener = from;
    $$('.tile video').forEach(v => v.pause());
    render(Math.max(0, visiveis.indexOf(i)));
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
      if (lenis) lenis.stop();
    } else {
      window.open(items[i].src, '_blank', 'noopener');
    }
  }
  $('[data-lightbox-close]').addEventListener('click', () => dialog.close());
  $('[data-lightbox-prev]').addEventListener('click', () => render(current - 1));
  $('[data-lightbox-next]').addEventListener('click', () => render(current + 1));
  dialog.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') render(current - 1);
    if (e.key === 'ArrowRight') render(current + 1);
  });
  dialog.addEventListener('click', e => { if (e.target === dialog || e.target === stage) dialog.close(); });
  dialog.addEventListener('close', () => {
    stage.innerHTML = '';
    if (lenis) lenis.start();
    if (opener) opener.focus();
  });
  // Arrastar para o lado troca de foto (celular)
  let startX = null;
  stage.addEventListener('pointerdown', e => { startX = e.clientX; });
  stage.addEventListener('pointerup', e => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 50 && e.target.tagName !== 'VIDEO') render(current + (dx < 0 ? 1 : -1));
  });

  /* ---------- Vídeo do CTA final: carrega só perto da tela ---------- */
  const finalVideo = $('[data-lazy-video]');
  const fToggle = $('[data-final-toggle]');
  let finalPaused = reduce || saveData;
  const syncFinal = () => {
    fToggle.setAttribute('aria-pressed', String(finalPaused));
    fToggle.querySelector('.sr-only').textContent = finalPaused ? 'Reproduzir vídeo de fundo' : 'Pausar vídeo de fundo';
  };
  syncFinal();
  fToggle.addEventListener('click', () => {
    finalPaused = !finalPaused;
    const s = finalVideo.querySelector('source[data-src]');
    if (s) { s.src = s.dataset.src; s.removeAttribute('data-src'); finalVideo.load(); }
    finalPaused ? finalVideo.pause() : finalVideo.play().catch(() => {});
    syncFinal();
  });
  if (finalVideo && !reduce && !saveData) {
    new IntersectionObserver(([en]) => {
      if (finalPaused) return;
      if (en.isIntersecting) {
        const s = finalVideo.querySelector('source[data-src]');
        if (s) { s.src = s.dataset.src; s.removeAttribute('data-src'); finalVideo.load(); }
        finalVideo.play().catch(() => {});
      } else {
        finalVideo.pause();
      }
    }, { rootMargin: '200px 0px' }).observe(finalVideo);
  }

  /* ---------- Manifesto: palavras acendem com a rolagem ---------- */
  const manifesto = $('[data-words]');
  const wrapWords = node => {
    [...node.childNodes].forEach(n => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.appendChild(s);
        });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) wrapWords(n);
    });
  };

  const year = $('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Intro + animações GSAP ---------- */
  const intro = $('[data-intro]');
  if (!hasGsap || reduce) {
    intro.remove();
    return;
  }

  const ST = window.ScrollTrigger;
  const Split = window.SplitText;

  // Títulos: letras sobem de dentro de uma máscara
  const heroLines = $$('.hero-title [data-split]');
  const heroSplits = Split ? heroLines.map(el => Split.create(el, { type: 'words,chars', mask: 'chars' })) : [];
  const heroChars = heroSplits.flatMap(s => s.chars);
  gsap.set(heroChars.length ? heroChars : heroLines, { yPercent: 110 });
  gsap.set('.hero [data-anim]', { opacity: 0, y: 24 });
  gsap.set('.wall', { scale: 1.18, opacity: 0 });

  const playHero = () => {
    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
    tl.to('.wall', { scale: 1, opacity: 1, duration: 2, ease: 'power3.out' }, 0)
      .to(heroChars.length ? heroChars : heroLines, { yPercent: 0, duration: 1.2, stagger: 0.028 }, 0.15)
      .to('.hero [data-anim]', { opacity: 1, y: 0, duration: 1, stagger: 0.12 }, 0.6)
      .from('.hero-eq i', { scaleY: 0, duration: 0.8, stagger: { each: 0.02, from: 'center' } }, 0.6)
      .from(['.badge-spin', '.video-toggle'], { opacity: 0, scale: 0.6, duration: 0.9 }, 0.9);
  };

  // Intro com contador: curta e sem esperar o vídeo carregar
  intro.style.animation = 'none';
  const counter = { v: 0 };
  const count = $('[data-intro-count]');
  const bar = $('[data-intro-bar]');
  gsap.timeline()
    .from(intro.querySelector('img'), { opacity: 0, scale: 0.85, duration: 0.6, ease: 'expo.out' })
    .to(counter, {
      v: 100, duration: 0.9, ease: 'power2.inOut',
      onUpdate: () => { const n = Math.round(counter.v); count.textContent = String(n).padStart(2, '0'); bar.style.width = `${n}%`; }
    }, 0)
    .to(intro, { yPercent: -100, duration: 0.9, ease: 'expo.inOut', onStart: playHero }, '+=0.1')
    .add(() => intro.remove());

  if (!ST) return;

  // Hero: parede aproxima e o texto sobe ao rolar
  gsap.to('.wall', { scale: 1.12, yPercent: 6, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-content', { yPercent: -18, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: hero, start: 'center center', end: 'bottom top', scrub: true } });

  // Títulos de seção
  $$('[data-split]').filter(el => !el.closest('.hero-title')).forEach(el => {
    if (Split) {
      const s = Split.create(el, { type: 'words,lines', mask: 'lines' });
      gsap.from(s.words, { yPercent: 110, duration: 1.1, stagger: 0.05, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 85%' } });
    } else {
      gsap.from(el, { y: 40, opacity: 0, duration: 1, scrollTrigger: { trigger: el, start: 'top 85%' } });
    }
  });

  // Elementos que sobem
  $$('[data-anim="up"]').forEach(el => {
    gsap.from(el, { y: 50, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: el, start: 'top 88%' } });
  });

  // Faixas: inclinam conforme a velocidade da rolagem
  const tracks = $$('.tape-track');
  const skewTo = gsap.quickTo(tracks, 'skewX', { duration: 0.5, ease: 'power3' });
  ST.create({ onUpdate: self => skewTo(gsap.utils.clamp(-12, 12, self.getVelocity() / -250)) });

  // Manifesto
  if (manifesto) {
    wrapWords(manifesto);
    const words = $$('.w', manifesto);
    ST.create({
      trigger: manifesto, start: 'top 80%', end: 'bottom 45%', scrub: true,
      onUpdate: self => {
        const n = Math.round(self.progress * words.length);
        words.forEach((w, i) => w.classList.toggle('on', i < n));
      }
    });
  }

  // Serviços: rolagem horizontal no desktop
  const mm = gsap.matchMedia();
  mm.add('(min-width: 1000px) and (min-height: 620px)', () => {
    const section = $('[data-services]');
    const track = $('[data-services-track]');
    section.classList.add('is-horizontal');
    const dist = () => track.scrollWidth - window.innerWidth;
    const tween = gsap.to(track, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: { trigger: section, start: 'top top', end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1 }
    });
    $$('.service-img img', track).forEach(img => {
      gsap.fromTo(img, { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: img.closest('.service'), containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
    });
    return () => section.classList.remove('is-horizontal');
  });
  mm.add('(max-width: 999px), (max-height: 619px)', () => {
    $$('.service').forEach(card => {
      gsap.from(card, { y: 70, opacity: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 88%' } });
      gsap.fromTo(card.querySelector('.service-img img'), { clipPath: 'inset(12% 12% 12% 12%)' }, { clipPath: 'inset(0% 0% 0% 0%)', ease: 'none', scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 45%', scrub: true } });
    });
  });

  // Galeria: blocos se revelam em cascata
  gsap.set('.tile', { clipPath: 'inset(100% 0% 0% 0%)' });
  ST.batch('.tile', {
    start: 'top 92%',
    onEnter: batch => gsap.to(batch, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.2, ease: 'expo.inOut', stagger: 0.1 })
  });

  // Diferenciais
  ST.batch('.feat', {
    start: 'top 90%',
    onEnter: batch => gsap.fromTo(batch, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.1, overwrite: true })
  });

  // A Grande Final: a tela "abre" de um cartão até ocupar tudo, como uma cortina
  const palco = document.querySelector('[data-cine-stage]');
  if (palco) {
    gsap.fromTo(palco, { clipPath: 'inset(9% 6% 9% 6% round 36px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
      scrollTrigger: { trigger: palco, start: 'top 95%', end: 'top 15%', scrub: true }
    });
    gsap.fromTo('.cine-bg', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: palco, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.fromTo('.cine-phone', { y: 120, rotate: 12, opacity: 0 }, { y: 0, rotate: 5, opacity: 1, ease: 'none', scrollTrigger: { trigger: palco, start: 'top 70%', end: 'top 10%', scrub: true } });
    gsap.from('.cine-tags li', { y: 20, opacity: 0, stagger: 0.08, duration: 0.7, ease: 'expo.out', scrollTrigger: { trigger: '.cine-tags', start: 'top 90%' } });
  }

  // CTA final e rodapé
  gsap.fromTo('.final-video', { scale: 1.25 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: '[data-final]', start: 'top bottom', end: 'center center', scrub: true } });
  ST.batch('.footer-card > *', {
    start: 'top 92%',
    onEnter: batch => gsap.fromTo(batch, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: 'expo.out', stagger: 0.08, overwrite: true })
  });
  gsap.fromTo('[data-footer-mark]', { yPercent: 45, opacity: 0 }, { yPercent: 0, opacity: 1, ease: 'none', scrollTrigger: { trigger: '[data-footer-mark]', start: 'top bottom', end: 'bottom bottom', scrub: true } });

  // Recalcula depois que as fontes e imagens carregam
  window.addEventListener('load', () => ST.refresh());
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => ST.refresh());
})();
