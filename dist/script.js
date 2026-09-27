const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const words = ['think.', 'connect.', 'perform.', 'matter.'];
let wordIndex = 0;
if (!reduced) setInterval(() => {
  if (document.hidden || document.documentElement.classList.contains('effects-paused')) return;
  const el = document.getElementById('word-cycle');
  el.animate([{opacity:1,transform:'translateY(0)'},{opacity:0,transform:'translateY(-10px)'}],{duration:250,fill:'forwards'}).onfinish=()=>{
    wordIndex=(wordIndex+1)%words.length; el.textContent=words[wordIndex];
    el.animate([{opacity:0,transform:'translateY(10px)'},{opacity:1,transform:'translateY(0)'}],{duration:350,fill:'forwards'});
  };
}, 2400);

const tooltip=document.querySelector('.skill-tooltip');
document.querySelectorAll('.planet.skill').forEach(btn=>btn.addEventListener('click',()=>{
  tooltip.textContent=`${btn.dataset.skill} · tap to explore below`;
  document.getElementById('skills-title').scrollIntoView({behavior:reduced?'auto':'smooth'});
}));

document.querySelectorAll('.skill-row').forEach(row=>{
  const activate=()=>{document.querySelectorAll('.skill-row').forEach(r=>r.classList.remove('active'));row.classList.add('active');document.getElementById('skill-detail').textContent=row.dataset.detail};
  row.addEventListener('mouseenter',activate);row.addEventListener('click',activate);
});

const commands={
  help:'Commands: about, skills, projects, contact, clear',
  about:'Disha Vyas — AI and Full Stack Engineer and curious product builder based in Indore, India.',
  skills:'React · Next.js · TypeScript · Node.js · Express · SQL · MongoDB · Applied AI',
  projects:'01 MedFlow AI\n02 LendSphere AI\n03 ChatPulse AI',
  contact:'Email: dishavyas1008@gmail.com\nPhone: +91 6267481715',
};
const form=document.getElementById('terminal-form'), input=document.getElementById('terminal-input'), output=document.getElementById('terminal-output');
function clearTerminal(){output.innerHTML='<p class="muted">Terminal cleared. Type <b>help</b> to begin.</p>'}
document.getElementById('terminal-clear').addEventListener('click',clearTerminal);
form.addEventListener('submit',e=>{e.preventDefault();const cmd=input.value.trim().toLowerCase();if(!cmd)return;const prompt=document.createElement('p');prompt.innerHTML=`<span class="success">visitor@disha.dev:~$</span> ${cmd}`;output.append(prompt);if(cmd==='clear')clearTerminal();else{const response=document.createElement('p');response.className=commands[cmd]?'muted':'muted';response.textContent=commands[cmd]||`Command not found: ${cmd}. Type help.`;output.append(response)}input.value='';output.scrollTop=output.scrollHeight});

const dialog=document.getElementById('case-dialog');
document.querySelectorAll('.case-button').forEach(btn=>btn.addEventListener('click',()=>dialog.showModal()));
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});

const cursor=document.querySelector('.cursor');
if(window.matchMedia('(pointer:fine)').matches){
  window.addEventListener('mousemove',e=>{cursor.style.left=e.clientX+'px';cursor.style.top=e.clientY+'px'});
  document.querySelectorAll('a,button,input').forEach(el=>{el.addEventListener('mouseenter',()=>cursor.classList.add('active'));el.addEventListener('mouseleave',()=>cursor.classList.remove('active'))});
}

const menu=document.querySelector('.menu');
menu.addEventListener('click',()=>{const nav=document.querySelector('.site-header nav');const open=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!open));nav.style.display=open?'none':'flex';nav.style.position='absolute';nav.style.top='70px';nav.style.right='20px';nav.style.padding='18px';nav.style.background='#0d1a2c';nav.style.flexDirection='column'});
