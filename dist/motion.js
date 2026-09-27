(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(pointer: fine)');
  let paused = preference.matches;
  const activeAnimations = new Set();
  const effectsEnabled = () => !paused && !preference.matches;
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.append(progress);
  const toggle = document.createElement('button');
  toggle.className = 'motion-toggle';
  toggle.type = 'button';
  document.body.append(toggle);
  function synchronize() {
    document.documentElement.classList.toggle('effects-paused', paused);
    toggle.textContent = paused ? 'Resume motion' : 'Pause motion';
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.disabled = preference.matches;
    if (preference.matches) toggle.textContent = 'Reduced motion on';
    if (paused) {
      activeAnimations.forEach(animation => animation.cancel());
      document.querySelectorAll('.magnetic').forEach(el => el.style.translate = '');
      document.querySelector('.universe').style.rotate = '';
    }
  }
  toggle.addEventListener('click', () => { paused = !paused; synchronize(); });
  preference.addEventListener('change', () => { paused = preference.matches; synchronize(); });
  synchronize();
  function animate(el, frames, timing) {
    if (!effectsEnabled()) return;
    const animation = el.animate(frames, timing);
    activeAnimations.add(animation);
    animation.finished.then(() => activeAnimations.delete(animation)).catch(() => activeAnimations.delete(animation));
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      observer.unobserve(entry.target);
      const children = entry.target.matches('.hero-copy') ? [...entry.target.children] : entry.target.querySelectorAll('h2, h3, .chips li, .facts > div, .skill-row, .experience-entry');
      children.forEach((child, index) => animate(child,
        [{opacity:0,translate:'0 28px'},{opacity:1,translate:'0 0'}],
        {duration:700,delay:Math.min(index * 85,425),easing:'cubic-bezier(.2,.7,.3,1)',fill:'backwards'}));
      entry.target.querySelectorAll('.chart span').forEach((bar,index) => animate(bar,
        [{scale:'1 0',transformOrigin:'bottom'},{scale:'1 1',transformOrigin:'bottom'}],
        {duration:1000,delay:index*80,easing:'cubic-bezier(.2,.7,.3,1)',fill:'backwards'}));
    });
  }, {threshold:.12});
  document.querySelectorAll('.hero-copy,.section').forEach(el => observer.observe(el));
  let scrollPending = false;
  function updateScroll() {
    const maximum = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${maximum > 0 ? Math.min(1, scrollY / maximum) : 0})`;
    scrollPending = false;
  }
  addEventListener('scroll', () => { if (!scrollPending) {scrollPending = true;requestAnimationFrame(updateScroll);} }, {passive:true});
  addEventListener('resize', updateScroll);
  updateScroll();
  document.querySelectorAll('.project').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (!effectsEnabled() || !finePointer.matches) return;
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX-bounds.left)/bounds.width;
      const y = (event.clientY-bounds.top)/bounds.height;
      card.style.setProperty('--light-x', `${x*100}%`);
      card.style.setProperty('--light-y', `${y*100}%`);
      card.style.setProperty('--tilt-x', `${(0.5-y)*7}deg`);
      card.style.setProperty('--tilt-y', `${(x-0.5)*9}deg`);
    });
    card.addEventListener('pointerleave', () => {card.style.setProperty('--tilt-x','0deg');card.style.setProperty('--tilt-y','0deg');});
  });
  document.querySelectorAll('.magnetic').forEach(el => {
    el.addEventListener('pointermove', event => {
      if (!effectsEnabled() || !finePointer.matches) return;
      const rect = el.getBoundingClientRect();
      el.style.translate = `${(event.clientX-rect.left-rect.width/2)*.12}px ${(event.clientY-rect.top-rect.height/2)*.12}px`;
    });
    el.addEventListener('pointerleave', () => el.style.translate = '');
  });
  const hero = document.querySelector('.hero');
  const universe = document.querySelector('.universe');
  hero.addEventListener('pointermove', event => {
    if (!effectsEnabled() || !finePointer.matches) return;
    const rect = hero.getBoundingClientRect();
    universe.style.rotate = `${((event.clientX-rect.left)/rect.width-.5)*7}deg`;
  });
  hero.addEventListener('pointerleave', () => universe.style.rotate = '');
})();
