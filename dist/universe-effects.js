(() => {
  const hero = document.querySelector('.hero');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(pointer: fine)');
  const enabled = () => !reduced.matches && !document.documentElement.classList.contains('effects-paused');
  const canvas = document.createElement('canvas');
  canvas.className = 'starfield';
  canvas.setAttribute('aria-hidden', 'true');
  hero.prepend(canvas);
  const context = canvas.getContext('2d');
  let width = 0, height = 0, frame = 0, previous = 0, visible = true;
  let stars = [];
  const pointer = {x:-1000,y:-1000};
  function resize() {
    width = hero.clientWidth;
    height = hero.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    if (!context) return;
    context.setTransform(ratio,0,0,ratio,0,0);
    stars = Array.from({length:width<700?32:75}, () => ({
      x:Math.random()*width,y:Math.random()*height,r:.5+Math.random()*1.3,
      speed:3+Math.random()*9,phase:Math.random()*Math.PI*2
    }));
    draw(0,0);
  }
  function draw(time, delta) {
    if (!context) return;
    context.clearRect(0,0,width,height);
    for (const star of stars) {
      if (delta) {star.y -= star.speed*delta; if(star.y < -4)star.y=height+4;}
      const alpha=.25+(Math.sin(time*.00065+star.phase)+1)*.2;
      context.fillStyle=`rgba(174,224,231,${alpha})`;
      context.beginPath();context.arc(star.x,star.y,star.r,0,Math.PI*2);context.fill();
      const distance=Math.hypot(star.x-pointer.x,star.y-pointer.y);
      if(enabled() && distance<150){
        context.strokeStyle=`rgba(142,228,218,${(1-distance/150)*.28})`;
        context.lineWidth=.65;context.beginPath();context.moveTo(star.x,star.y);context.lineTo(pointer.x,pointer.y);context.stroke();
      }
    }
  }
  function tick(time) {
    frame=0;
    if(!enabled() || !visible || document.hidden || !context)return;
    const delta=previous?Math.min((time-previous)/1000,.05):0;
    previous=time;draw(time,delta);frame=requestAnimationFrame(tick);
  }
  function reconcile() {
    if(frame){cancelAnimationFrame(frame);frame=0;}
    previous=0;
    if(enabled() && visible && !document.hidden && context)frame=requestAnimationFrame(tick);
    else{pointer.x=-1000;pointer.y=-1000;draw(0,0);}
    if(!enabled())document.querySelectorAll('.tap-wave').forEach(el=>el.remove());
  }
  hero.addEventListener('pointermove', event => {
    if(!enabled() || !fine.matches)return;
    const bounds=hero.getBoundingClientRect();pointer.x=event.clientX-bounds.left;pointer.y=event.clientY-bounds.top;
  });
  hero.addEventListener('pointerleave',()=>{pointer.x=-1000;pointer.y=-1000;});
  document.addEventListener('pointerdown',event=>{
    if(!enabled() || event.target.closest('.motion-toggle') || document.querySelectorAll('.tap-wave').length>=6)return;
    const wave=document.createElement('span');wave.className='tap-wave';wave.setAttribute('aria-hidden','true');
    wave.style.left=`${event.clientX}px`;wave.style.top=`${event.clientY}px`;document.body.append(wave);
    wave.addEventListener('animationend',()=>wave.remove(),{once:true});setTimeout(()=>wave.remove(),800);
  });
  const contact=document.querySelector('.contact');
  contact.addEventListener('pointermove',event=>{
    if(!enabled() || !fine.matches)return;
    const rect=contact.getBoundingClientRect();
    contact.style.setProperty('--contact-x',`${event.clientX-rect.left}px`);
    contact.style.setProperty('--contact-y',`${event.clientY-rect.top}px`);
  });
  new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;reconcile();}).observe(hero);
  new MutationObserver(reconcile).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
  new ResizeObserver(resize).observe(hero);
  document.addEventListener('visibilitychange',reconcile);
  reduced.addEventListener('change',reconcile);
  resize();reconcile();
})();
