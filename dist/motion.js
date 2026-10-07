/* Motion is progressive enhancement: native scrolling and readable static content remain. */
const motionPreference=window.matchMedia('(prefers-reduced-motion: reduce)');
let customMotion=null;
try{customMotion=localStorage.getItem('otis-motion');}catch{}
let motionEnabled=!motionPreference.matches&&customMotion!=='off';
const motionToggle=document.querySelector('.motion-toggle');
const activeAnimations=new Set();
function animateElement(element,keyframes,options={}){
 if(!motionEnabled||!element)return null;
 const animation=element.animate(keyframes,{duration:850,easing:'cubic-bezier(.22,1,.36,1)',...options});
 activeAnimations.add(animation);animation.finished.catch(()=>{}).finally(()=>activeAnimations.delete(animation));return animation;
}
function updateMotion(){
 document.body.classList.toggle('motion-off',!motionEnabled);
 motionToggle.setAttribute('aria-pressed',String(motionEnabled));
 motionToggle.setAttribute('aria-label',motionEnabled?'Turn animations off':'Turn animations on');
 motionToggle.querySelector('span').textContent=motionEnabled?'on':'off';
 if(!motionEnabled){activeAnimations.forEach(a=>a.cancel());document.querySelectorAll('[data-motion-transform]').forEach(el=>el.style.transform='');}
 scheduleScroll();
}
motionToggle.addEventListener('click',()=>{motionEnabled=!motionEnabled;try{localStorage.setItem('otis-motion',motionEnabled?'on':'off');}catch{}updateMotion();});
motionPreference.addEventListener('change',()=>{motionEnabled=!motionPreference.matches;updateMotion();});

const memories=[
 {src:'images/rhode_and_scwharz_hackathon-0.webp',alt:'A moment at the Rohde & Schwarz Hackathon',caption:'At the hackathon. In my element.',date:'JUN ’26'},
 {src:'images/microsoft_internship-0.webp',alt:'A group photograph from the Microsoft internship',caption:'A summer. A team. A lot learned.',date:'SUMMER ’24'},
 {src:'images/cursor_hackathon-0.webp',alt:'Working together on laptops at the Cursor Hackathon',caption:'An idea, a laptop, and a teammate.',date:'MAR ’26'},
 {src:'images/dipper_lab_internship-3.webp',alt:'Learning at a Dipper Lab session',caption:'Back at the workbench.',date:'SEP ’26'}
];
let memoryIndex=0;
const memoryPhoto=document.querySelector('#memory-photo');
const photoFigure=document.querySelector('.stack-photo');
function changeMemory(direction){
 memoryIndex=(memoryIndex+direction+memories.length)%memories.length;const next=memories[memoryIndex];
 photoFigure.getAnimations().forEach(a=>a.cancel());
 memoryPhoto.src=next.src;memoryPhoto.alt=next.alt;
 document.querySelector('#memory-caption').textContent=next.caption;
 document.querySelector('#memory-date').textContent=next.date;
 document.querySelector('#memory-count').textContent=`${String(memoryIndex+1).padStart(2,'0')} / 04`;
 animateElement(photoFigure,[{transform:`translateX(${direction*35}px) rotate(${direction*7}deg)`,opacity:.45},{transform:'translateX(0) rotate(0)',opacity:1}],{duration:650});
}
document.querySelector('#memory-prev').addEventListener('click',()=>changeMemory(-1));
document.querySelector('#memory-next').addEventListener('click',()=>changeMemory(1));
memories.slice(1).forEach(memory=>{const image=new Image();image.src=memory.src;});

const dock=document.createElement('nav');dock.className='chapter-dock';dock.setAttribute('aria-label','Page chapters');
dock.innerHTML='<span>THE NOTEBOOK</span><i class="dock-divider" aria-hidden="true"></i><a href="#work">Work</a><a href="#experience">Experience</a><a href="#journey">Journey</a><a href="#about">Otis</a><a href="#contact">Hello ↗</a>';
document.body.append(dock);
const sections=[...document.querySelectorAll('#work,#experience,#journey,#about,#contact')];
const progress=document.querySelector('.reading-progress');
const header=document.querySelector('.header');
const hero=document.querySelector('.hero-v2');
const nameFirst=document.querySelector('.name-first');const nameLast=document.querySelector('.name-last');
const statement=document.querySelector('.moving-statement');const track=document.querySelector('.statement-track');
const asterisk=document.querySelector('.asterisk');
[nameFirst,nameLast,track,asterisk].forEach(el=>el.dataset.motionTransform='');
let scrollFrame=0;
function scheduleScroll(){if(!scrollFrame)scrollFrame=requestAnimationFrame(updateScroll);}
function updateScroll(){
 scrollFrame=0;const y=window.scrollY, height=window.innerHeight;const max=document.documentElement.scrollHeight-height;
 progress.style.transform=`scaleX(${max>0?y/max:0})`;
 header.classList.toggle('is-scrolled',y>45);dock.classList.toggle('is-visible',y>hero.offsetHeight*.75&&y<max-180);
 let current=null;sections.forEach(section=>{if(section.getBoundingClientRect().top<height*.45)current=section.id;});
 document.querySelectorAll('.header nav a,.chapter-dock a').forEach(a=>{if(a.hash===`#${current}`)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
 if(!motionEnabled)return;
 if(window.innerWidth>700&&hero.getBoundingClientRect().bottom>0){const shift=Math.min(y*.065,55);nameFirst.style.transform=`translateX(${-shift}px)`;nameLast.style.transform=`translateX(${shift}px)`;}else if(window.innerWidth<=700){nameFirst.style.transform='';nameLast.style.transform='';}
 const sr=statement.getBoundingClientRect();if(sr.bottom>0&&sr.top<height)track.style.transform=`translateX(${-Math.max(0,height-sr.top)*.22}px)`;
 const ar=asterisk.getBoundingClientRect();if(ar.bottom>0&&ar.top<height)asterisk.style.transform=`rotate(${(height-ar.top)*.07}deg)`;
}
window.addEventListener('scroll',scheduleScroll,{passive:true});window.addEventListener('resize',scheduleScroll,{passive:true});
updateMotion();
const reveals=document.querySelectorAll('.section-heading h2,.section-heading>p,.experience-photo,.experience-copy,.journal-card,.field-notes-title,.community,.about-copy,.contact-bottom');
const revealObserver=new IntersectionObserver(entries=>{for(const entry of entries){if(entry.isIntersecting){animateElement(entry.target,[{transform:'translateY(38px)',opacity:.45},{transform:'translateY(0)',opacity:1}],{duration:1000});revealObserver.unobserve(entry.target);}}},{threshold:.13});
reveals.forEach(el=>revealObserver.observe(el));
const photoObserver=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll('.photo-reel figure').forEach((figure,i)=>{const rest=getComputedStyle(figure).transform;animateElement(figure,[{transform:`translateY(${25+i*20}px) rotate(0deg)`},{transform:rest}],{duration:1100,delay:i*100});});photoObserver.unobserve(entry.target);}});},{threshold:.2});
photoObserver.observe(document.querySelector('.photo-reel'));
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
 const cards=[...document.querySelectorAll('.project-card')];cards.forEach(card=>card.classList.toggle('is-filtered',button.dataset.filter!=='all'));
 cards.filter(card=>!card.hidden).forEach((card,i)=>animateElement(card,[{transform:'translateY(22px)',opacity:.3},{transform:'translateY(0)',opacity:1}],{duration:550,delay:i*45}));
}));
const projectDialog=document.querySelector('#project-dialog');
new MutationObserver(()=>{if(projectDialog.open)animateElement(projectDialog,[{opacity:0,transform:'translateY(35px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:450});}).observe(projectDialog,{attributes:true,attributeFilter:['open']});
animateElement(document.querySelector('.name-first'),[{transform:'translateY(45px)',opacity:.15},{transform:'translateY(0)',opacity:1}],{duration:1100});
animateElement(document.querySelector('.name-last'),[{transform:'translateY(55px)',opacity:.15},{transform:'translateY(0)',opacity:1}],{duration:1100,delay:100});
animateElement(document.querySelector('.memory-stack'),[{transform:'translateY(30px) rotate(-2deg)',opacity:.2},{transform:window.innerWidth<=700?'translateY(0) rotate(-7deg)':'translateY(0) rotate(-8deg)',opacity:1}],{duration:1200,delay:150});
document.addEventListener('visibilitychange',()=>{if(document.hidden){activeAnimations.forEach(a=>a.finish());if(scrollFrame){cancelAnimationFrame(scrollFrame);scrollFrame=0;}}else scheduleScroll();});
