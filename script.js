/*
  PERSONALIZATION:
  1) Ganti NAME dengan nama orang yang berulang tahun.
  2) Ganti BIRTHDAY_DATE dengan tanggal/jam ulang tahun.
  3) Ubah intro dan isi surat jika mau.
*/
const CONFIG = {
  NAME: "Sayang",
  BIRTHDAY_DATE: "2026-08-23T23:59:59",
  INTRO: "Selamat ulang tahun, sayang. Terima kasih sudah hadir dan membuat hari-hariku terasa lebih indah. Semoga semua impianmu perlahan menjadi nyata, dan semoga aku selalu punya kesempatan untuk menemani setiap langkahmu.",
};

const $ = (s) => document.querySelector(s);
const nameEls = ["#navName","#heroName","#letterName","#modalName","#footerName"];
nameEls.forEach(sel => $(sel).textContent = CONFIG.NAME);
$("#heroIntro").textContent = CONFIG.INTRO;

const date = new Date(CONFIG.BIRTHDAY_DATE);
if (!isNaN(date)) {
  $("#dateText").textContent = date.toLocaleDateString("id-ID", {day:"numeric", month:"long", year:"numeric"});
}

function updateCountdown(){
  const now = new Date();
  let diff = date - now;
  if (diff < 0) {
    // After the birthday, count toward the next annual occurrence.
    const next = new Date(date);
    next.setFullYear(now.getFullYear() + (date < now ? 1 : 0));
    diff = next - now;
  }
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff / 3600000) % 24;
  const m = Math.floor(diff / 60000) % 60;
  const s = Math.floor(diff / 1000) % 60;
  $("#days").textContent = String(d).padStart(2,"0");
  $("#hours").textContent = String(h).padStart(2,"0");
  $("#minutes").textContent = String(m).padStart(2,"0");
  $("#seconds").textContent = String(s).padStart(2,"0");
}
updateCountdown(); setInterval(updateCountdown,1000);

// Letter modal
const envelope = $("#envelope"), modal = $("#letterModal");
function openLetter(){
  envelope.classList.add("open");
  setTimeout(() => modal.classList.add("show"), 650);
  modal.setAttribute("aria-hidden","false");
}
function closeLetter(){
  modal.classList.remove("show");
  modal.setAttribute("aria-hidden","true");
  setTimeout(() => envelope.classList.remove("open"), 250);
}
envelope.addEventListener("click", openLetter);
envelope.addEventListener("keydown", e => { if(e.key==="Enter"||e.key===" ") openLetter(); });
$("#closeModal").onclick = closeLetter;
$("#closeModal2").onclick = closeLetter;
modal.addEventListener("click", e => { if(e.target === modal) closeLetter(); });
$("#openGift").onclick = () => {
  $("#letter").scrollIntoView({behavior:"smooth"});
  setTimeout(openLetter, 700);
};

// Background music
// Put the uploaded song in the website folder as "music.mp3".
const music = new Audio("music.mp3");
music.loop = true;
music.preload = "auto";
music.volume = 0.65;

let playing = false;
function startMusic(){
  music.play().then(()=>{
    playing = true;
    $("#musicBtn").innerHTML="♫ <span>Playing</span>";
  }).catch(()=>{
    $("#musicBtn").innerHTML="♫ <span>Tap again</span>";
  });
}
function stopMusic(){
  music.pause();
  playing=false;
  $("#musicBtn").innerHTML="♫ <span>Music</span>";
}
$("#musicBtn").onclick=()=>playing?stopMusic():startMusic();

// Love button + fireworks
const canvas=$("#fireworks"), ctx=canvas.getContext("2d");
let particles=[];
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+"px";canvas.style.height=innerHeight+"px";ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
addEventListener("resize",resize); resize();
function burst(x,y){
  for(let i=0;i<80;i++){
    const a=Math.random()*Math.PI*2, speed=1+Math.random()*5;
    particles.push({x,y,vx:Math.cos(a)*speed,vy:Math.sin(a)*speed,life:1,size:1+Math.random()*2});
  }
}
function animate(){
  ctx.clearRect(0,0,innerWidth,innerHeight);
  particles=particles.filter(p=>p.life>0);
  particles.forEach(p=>{p.x+=p.vx;p.y+=p.vy;p.vy+=.035;p.life-=.014;ctx.globalAlpha=Math.max(p.life,0);ctx.fillStyle=`hsl(${330+Math.random()*35},90%,70%)`;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill()});
  ctx.globalAlpha=1;requestAnimationFrame(animate);
}
animate();

$("#loveButton").onclick=()=>{
  $("#loveResponse").classList.add("show");
  $("#toast").classList.add("show");
  setTimeout(()=>$("#toast").classList.remove("show"),2800);
  for(let i=0;i<5;i++) setTimeout(()=>burst(15+Math.random()*70/100*innerWidth,20+Math.random()*45/100*innerHeight),i*220);
  if(!playing) startMusic();
};

// Soft reveal on scroll
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add("visible")}),{threshold:.12});
document.querySelectorAll(".memory,.wish-card,.countdown-section").forEach(el=>observer.observe(el));
