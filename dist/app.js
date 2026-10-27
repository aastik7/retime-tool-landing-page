// Add your real product link, support contact, and recordings here when available.
const RETIME_CONFIG = {
  productUrl: '',
  supportEmail: '',
  supportProfile: '',
  videos: { hero: '', live: '', ease: '', smooth: '', undo: '' }
};
(function () {
  'use strict';
  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
  const NS = 'http://www.w3.org/2000/svg';
  const node = (tag, attrs = {}, parent) => { const n = document.createElementNS(NS, tag); Object.entries(attrs).forEach(([k,v]) => n.setAttribute(k,v)); if (parent) parent.append(n); return n; };
  const label = (txt, attrs, parent) => { const n = node('text', attrs, parent); n.textContent = txt; return n; };
  const safeHttp = url => { try { const u = new URL(url, location.href); return ['http:', 'https:'].includes(u.protocol) ? u.href : ''; } catch { return ''; } };
  let toastTimer;
  function toast(message) { const e = $('#toast'); e.textContent = message; e.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => e.classList.remove('visible'), 3500); }
  const productUrl = RETIME_CONFIG.productUrl && safeHttp(RETIME_CONFIG.productUrl);
  if (productUrl) {
    $$('[data-purchase], #purchase-final').forEach(a => { a.href = productUrl; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.removeAttribute('aria-disabled'); });
    $('#purchase-final').innerHTML = 'Get it on Superhive <svg class="icon" aria-hidden="true"><use href="#i-diagonal"/></svg>';
    $('#purchase-status').textContent = 'Purchase and download securely through Superhive.';
  } else { $('#purchase-final').addEventListener('click', e => { e.preventDefault(); toast('The Superhive product link is coming soon.'); }); }
  const contact = RETIME_CONFIG.supportEmail ? 'mailto:' + RETIME_CONFIG.supportEmail.replace(/[\r\n]/g, '') : safeHttp(RETIME_CONFIG.supportProfile || '');
  if ((RETIME_CONFIG.supportEmail || RETIME_CONFIG.supportProfile) && contact) { const a = $('#support-link'); a.href = contact; a.hidden = false; if (!contact.startsWith('mailto:')) { a.target = '_blank'; a.rel = 'noopener noreferrer'; } }
  const menu = $('.menu-toggle'), nav = $('#nav-links');
  menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); nav.classList.toggle('open', open); });
  function closeMenu() { menu.setAttribute('aria-expanded','false'); menu.setAttribute('aria-label','Open navigation'); nav.classList.remove('open'); }
  $$('a', nav).forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && nav.classList.contains('open')) { closeMenu(); menu.focus(); } });
  // Explanatory graph illustrations, not the extension's retiming implementation.
  function smoothPath(points) { return points.reduce((d, p, i) => { if (!i) return `M${p[0].toFixed(2)},${p[1].toFixed(2)}`; const prev = points[i-1], mid = (prev[0]+p[0])/2; return d + ` C${mid.toFixed(2)},${prev[1].toFixed(2)} ${mid.toFixed(2)},${p[1].toFixed(2)} ${p[0].toFixed(2)},${p[1].toFixed(2)}`; }, ''); }
  const graph = $('#hero-graph');
  const grid = node('g', {'aria-hidden':'true'}, graph);
  for(let x = 20; x <= 980; x += 40) { node('path',{d:`M${x} 0V320`,stroke:x%200===20?'#484f3c':'#333e2a','stroke-width':x%200===20?1:.65},grid); if((x-20)%80===0) label(String(Math.round((x-20)/10)),{x:x+3,y:14,fill:'#a4b390','font-size':8,'font-family':'Consolas,monospace'},grid); }
  for(let y=30;y<320;y+=40) node('path',{d:`M0 ${y}H980`,stroke:y===190?'#4d5c3d':'#343f2a','stroke-width':y===190?1:.65},grid);
  const selection = node('rect',{x:170,y:28,width:330,height:292,fill:'#d3934d',opacity:.045},graph);
  const curves = node('g',{'aria-hidden':'true'},graph), heroPaths = ['#c47c64','#96bc78','#79a0d0'].map(c => node('path',{fill:'none',stroke:c,'stroke-width':2.3},curves));
  const keys = node('g',{'aria-hidden':'true'},graph);
  const dope = node('g',{'aria-hidden':'true',display:'none'},graph);
  const shapes = [[[0,240],[170,240],[330,115],[500,135],[655,250],[810,183],[980,183]],[[0,256],[170,256],[330,224],[500,96],[655,120],[810,211],[980,211]],[[0,187],[170,187],[330,266],[500,230],[655,175],[810,260],[980,260]]];
  const keyNodes=shapes.map((points,i)=>points.slice(1,-1).map(()=>node('path',{fill:['#c47c64','#96bc78','#79a0d0'][i]},keys)));
  const dopeNodes=shapes.map((points,i)=>{const y=113+i*57;node('path',{d:`M0 ${y}H980`,stroke:'#414e32','stroke-width':1},dope);return points.slice(1,-1).map(()=>node('path',{fill:i===0?'#dfac72':'#a6b984'},dope));});
  const spans = node('g',{'aria-hidden':'true'},graph);
  const spanA = node('rect',{y:28,height:6,rx:2,fill:'#bf874e',opacity:.8},spans), spanB = node('rect',{y:28,height:6,rx:2,fill:'#bf874e',opacity:.8},spans);
  const easeLine = node('path',{fill:'none',stroke:'#74a2dc','stroke-width':2},spans), easeDiamond = node('path',{fill:'#84ace1'},spans), greenZone = node('rect',{y:61,height:8,rx:3,fill:'#8fba75',opacity:.7},spans);
  const markerGroups = [];
  [170,500,810].forEach((x,i) => { const g = node('g',i===1?{class:'marker-control',tabindex:0,role:'slider','aria-label':'Middle retime marker, frame','aria-valuemin':26,'aria-valuemax':71,'aria-valuenow':48,'aria-orientation':'horizontal'}:{'aria-hidden':'true'},graph); node('rect',{x:-17,y:16,width:34,height:304,fill:'transparent'},g); node('path',{d:'M0 27V320',stroke:'#d49a62','stroke-width':1.2,opacity:.9},g); node('rect',{class:'marker-cap',x:-12,y:17,width:24,height:15,rx:2,fill:i===1?'#edaa68':'#bc874e'},g); const t=label(i===1?'48':i===0?'15':'79',{x:0,y:27.5,'text-anchor':'middle',fill:'#332b1c','font-size':8,'font-family':'Consolas,monospace'},g); g.setAttribute('transform',`translate(${x},0)`); markerGroups.push({g,t}); });
  const cursor = node('g',{'aria-hidden':'true','pointer-events':'none'},graph); node('path',{d:'M0 0v22l6-7 6 11 4-2-6-10h10L0 0Z',fill:'#f5f1e6',stroke:'#282e1f','stroke-width':1.5},cursor);
  node('rect',{x:20,y:22,width:112,height:23,rx:4,fill:'#e8a66c'},cursor); label('Drag. Retime. Feel it.',{x:28,y:37,fill:'#302b1e','font-size':8.5,'font-family':'Arial,sans-serif'},cursor);
  let middle = 500, playing = !matchMedia('(prefers-reduced-motion: reduce)').matches, editorMode = 'graph', dragging = false, wasPlaying = false;
  function renderHero(value) {
    middle = clamp(value,280,730); const m = middle, mapX = x => x <= 500 ? 170+(x-170)*(m-170)/330 : m+(x-500)*(810-m)/310;
    selection.setAttribute('width',m-170); spanA.setAttribute('x',170); spanA.setAttribute('width',m-170); spanB.setAttribute('x',m); spanB.setAttribute('width',810-m);
    easeLine.setAttribute('d',`M182 48H${m-12}M${m+12} 48H798`); const d=(170+m)/2; easeDiamond.setAttribute('d',`M${d} 43l5 5-5 5-5-5Z`); greenZone.setAttribute('x',m-52);greenZone.setAttribute('width',104);
    shapes.forEach((points,i) => { const mapped = points.map(([x,y])=>[mapX(x),y]); heroPaths[i].setAttribute('d',smoothPath(mapped)); points.slice(1,-1).forEach(([x,y],j)=>{keyNodes[i][j].setAttribute('d',`M${mapX(x)} ${y-3.5}l3.5 3.5-3.5 3.5-3.5-3.5Z`);const dy=113+i*57;dopeNodes[i][j].setAttribute('d',`M${mapX(x)} ${dy-6}l6 6-6 6-6-6Z`);}); });
    markerGroups[1].g.setAttribute('transform',`translate(${m},0)`);const frame=Math.round((m-20)/10);markerGroups[1].t.textContent=frame; markerGroups[1].g.setAttribute('aria-valuenow',frame);$('#current-frame').textContent='Frame '+frame; cursor.setAttribute('transform',`translate(${m+5},35)`);
  }
  function syncPlay() { $('#hero-play').innerHTML = `<svg class="icon" aria-hidden="true"><use href="#i-${playing?'pause':'play'}"/></svg><span>${playing?'Pause':'Play'}</span>`; $('#hero-play').setAttribute('aria-label',playing?'Pause demo animation':'Play demo animation'); }
  $('#hero-play').addEventListener('click',()=>{playing=!playing;syncPlay();});
  $('#hero-reset').addEventListener('click',()=>{playing=false;renderHero(500);syncPlay();});
  const handle=markerGroups[1].g;
  function pointerX(e) { const r=graph.getBoundingClientRect();return (e.clientX-r.left)*980/r.width; }
  let dragStart=500;
  handle.addEventListener('pointerdown',e=>{ if(e.button!==0)return;e.preventDefault();dragging=true;dragStart=middle;wasPlaying=playing;playing=false;handle.setPointerCapture(e.pointerId);syncPlay();renderHero(pointerX(e));});
  handle.addEventListener('pointermove',e=>{if(dragging)renderHero(pointerX(e));});
  handle.addEventListener('pointerup',()=>{dragging=false;});
  handle.addEventListener('pointercancel',()=>{dragging=false;renderHero(dragStart);playing=wasPlaying;syncPlay();});
  handle.addEventListener('contextmenu',e=>{if(dragging){e.preventDefault();dragging=false;renderHero(dragStart);}});
  handle.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();playing=false;renderHero(e.key==='Home'?280:e.key==='End'?730:middle+(e.key==='ArrowLeft'?-1:1)*(e.shiftKey?50:10));syncPlay();}});
  function setEditor(mode) { editorMode=mode;const isGraph=mode==='graph';curves.style.display=isGraph?'':'none';keys.style.display=isGraph?'':'none';dope.style.display=isGraph?'none':'';$('#editor-type-label').textContent=isGraph?'▧  Graph Editor':'▤  Dope Sheet';['graph','dope'].forEach(v=>{const b=$('#tab-'+v);b.setAttribute('aria-selected',String(v===mode));b.tabIndex=v===mode?0:-1;}); }
  ['graph','dope'].forEach(mode=>{const b=$('#tab-'+mode);b.addEventListener('click',()=>setEditor(mode));b.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight','Home','End'].includes(e.key)){e.preventDefault();const next=e.key==='Home'?'graph':e.key==='End'?'dope':editorMode==='graph'?'dope':'graph';setEditor(next);$('#tab-'+next).focus();}});});
  renderHero(500);syncPlay();
  let heroVisible=true; new IntersectionObserver(([entry])=>{heroVisible=entry.isIntersecting;},{threshold:0.1}).observe(graph);
  let last=0, elapsed=0;
  function animate(time){if(time-last>32){if(playing&&heroVisible&&!document.hidden){elapsed+=Math.min(time-last,60);renderHero(500+Math.sin(elapsed/1800)*112);}last=time;}requestAnimationFrame(animate);}requestAnimationFrame(animate);
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',e=>{if(e.matches){playing=false;syncPlay();}});
  function miniMarkers(svg,positions,color='#d5a06c'){positions.forEach((x,i)=>{node('path',{d:`M${x} 20V193`,stroke:color,'stroke-width':1,opacity:.75},svg);node('rect',{x:x-8,y:15,width:16,height:10,rx:1,fill:color},svg);label(String(i*24+1),{x:x,y:22.5,'text-anchor':'middle',fill:'#292f20','font-size':6.5,'font-family':'Consolas,monospace'},svg);});}
  const live=$('#live-graph');
  function renderLive(){const value=Number($('#live-range').value),r=310+(value-100)*2.5;live.replaceChildren();miniMarkers(live,[65,r]);node('rect',{x:65,y:20,width:r-65,height:5,rx:2,fill:'#c29055'},live);const points=[[20,160],[65,160],[65+(r-65)*.45,78],[r,92],[520,150]];node('path',{d:smoothPath(points),fill:'none',stroke:'#b9c893','stroke-width':2.5},live);points.slice(1,-1).forEach(([x,y])=>node('path',{d:`M${x} ${y-4}l4 4-4 4-4-4Z`,fill:'#d9ae71'},live));label(value>105?'MORE ROOM. SLOWER MOTION.':value<95?'LESS ROOM. FASTER MOTION.':'YOUR ORIGINAL SEGMENT.',{x:280,y:183,'text-anchor':'middle',fill:'#acbc96','font-size':8,'letter-spacing':1.2},live);$('#live-output').value=(value/100).toFixed(2)+'×';}
  $('#live-range').addEventListener('input',renderLive);renderLive();
  const ease=$('#ease-graph');
  function renderEase(){const v=Number($('#ease-range').value),x=150-v*.5;ease.replaceChildren();node('rect',{x:65,y:28,width:215,height:160,fill:'#6a9bda',opacity:.1},ease);miniMarkers(ease,[65,495]);node('path',{d:'M65 44H495',stroke:'#679ad8','stroke-width':2},ease);node('path',{d:'M280 37l7 7-7 7-7-7Z',fill:'#8bb5ea'},ease);node('circle',{cx:x,cy:44,r:5,fill:'#81ace1'},ease);node('circle',{cx:395,cy:44,r:5,fill:'#81ace1'},ease);label((v>0?'+':'')+v+'%',{x:x,y:34,'text-anchor':'middle',fill:'#9cc4f4','font-size':9},ease);const cp1=clamp(165+v*1.3,72,275), cp2=clamp(185+v*.65,80,270);node('path',{d:`M20 167H65C${cp1} 167 ${cp2} 125 280 105C370 84 405 70 495 70H535`,fill:'none',stroke:'#adc38c','stroke-width':2.4},ease);node('path',{d:'M280 98l7 7-7 7-7-7Z',fill:'#8bb5ea'},ease);label('LEFT SECTION',{x:164,y:184,'text-anchor':'middle',fill:'#86a5cb','font-size':7,'letter-spacing':1.5},ease);label('RIGHT SECTION · UNCHANGED',{x:394,y:184,'text-anchor':'middle',fill:'#adbd98','font-size':7,'letter-spacing':.7},ease);$('#ease-output').value=(v>0?'+':'')+v+'%';}
  $('#ease-range').addEventListener('input',renderEase);renderEase();
  const smooth=$('#smooth-graph');
  function renderSmooth(){const v=Number($('#smooth-range').value),w=v*1.25,r=v*.9; smooth.replaceChildren();node('rect',{x:280-w,y:20,width:w*2,height:175,fill:'#7db283',opacity:.12},smooth);miniMarkers(smooth,[65,280,495]);node('rect',{x:280-w,y:39,width:w*2,height:8,rx:3,fill:'#81b786'},smooth);node('path',{d:'M30 159H280L495 68H535',fill:'none',stroke:'#899576','stroke-dasharray':'4 4','stroke-width':1,opacity:.5},smooth);const start=280-r,end=280+r,endY=159-r*(91/215);node('path',{d:`M30 159H${start}Q280 159 ${end} ${endY}L495 68H535`,fill:'none',stroke:'#9cc59c','stroke-width':2.6},smooth);label(v===0?'ABRUPT SPEED CHANGE':'A SOFTER TIMING TRANSITION',{x:280,y:185,'text-anchor':'middle',fill:'#b1c7a4','font-size':8,'letter-spacing':1.2},smooth);$('#smooth-output').value=v+'%';}
  $('#smooth-range').addEventListener('input',renderSmooth);renderSmooth();
  const undo=$('#undo-graph'),history=[280];let historyIndex=0;
  function renderUndo(){const m=history[historyIndex];undo.replaceChildren();miniMarkers(undo,[65,m,495]);node('path',{d:smoothPath([[20,135],[65,135],[m-70,70],[m,78],[495,120],[540,120]]),fill:'none',stroke:'#bbca99','stroke-width':2.4},undo);node('rect',{x:65,y:20,width:m-65,height:5,fill:'#c48d54',rx:2},undo);$('#demo-undo').disabled=historyIndex===0;$('#demo-redo').disabled=historyIndex===history.length-1;const status=$('#undo-status');status.replaceChildren();status.append(document.createTextNode(historyIndex===0?'Your original timing. ':'Retime '+historyIndex+'. '));const note=document.createElement('span');note.textContent=historyIndex===0?'Try a retime.':'Undo or try another.';status.append(note);}
  $('#demo-retime').addEventListener('click',()=>{history.splice(historyIndex+1);const choices=[355,225,395,310];history.push(choices[historyIndex%choices.length]);historyIndex++;renderUndo();});
  $('#demo-undo').addEventListener('click',()=>{if(historyIndex>0){historyIndex--;renderUndo();}});
  $('#demo-redo').addEventListener('click',()=>{if(historyIndex<history.length-1){historyIndex++;renderUndo();}});
  renderUndo();
  const rows=$$('#shortcut-table tbody tr');
  $('#shortcut-search').addEventListener('input',e=>{const q=e.target.value.trim().toLowerCase();let count=0;rows.forEach(row=>{row.hidden=!row.textContent.toLowerCase().includes(q);if(!row.hidden)count++;});$('#no-shortcuts').hidden=count!==0;$('#shortcut-count').textContent=q?`${count} of ${rows.length} controls shown.`:'14 controls. One smoother workflow.';});
  // Replace any illustration with a real recording after the creator supplies it.
  Object.entries(RETIME_CONFIG.videos).forEach(([key,url])=>{if(!url)return;const resolved=safeHttp(url),slot=$(`[data-video-slot="${key}"]`);if(!resolved||!slot)return;const video=document.createElement('video');video.className='recording';video.controls=true;video.loop=true;video.muted=true;video.playsInline=true;video.preload='metadata';video.setAttribute('aria-label',`Retime Tool ${key} feature recording`);video.src=resolved;const fallback=document.createElement('a');fallback.href=resolved;fallback.textContent='Download the feature recording';video.append(fallback);slot.replaceChildren(video);if(key==='hero'){playing=false;heroVisible=false;}video.addEventListener('error',()=>{const notice=document.createElement('p');notice.className='demo-caption';notice.style.padding='15px';notice.textContent='The feature recording could not be loaded. Please try again later.';slot.append(notice);},{once:true});});
})();
