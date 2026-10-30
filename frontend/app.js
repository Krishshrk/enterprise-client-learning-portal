const products = [
  {name:'Banking',desc:'Enabling financial institutions to continually redefine themselves.',icon:'<path d="M5 21V9m7 12V9m7 12V9M3 7l9-5 9 5M2 22h20M2 7h20"/>'},
  {name:'Capital markets',desc:'Helping capital market firms embrace connected technologies.',icon:'<path d="M4 20v-6m6 6V9m6 11V4m6 16V2"/><path d="M2 22h20"/>'},
  {name:'Risk & compliance',desc:'Supporting compliance and risk management across markets.',icon:'<path d="M12 2 21 6v6c0 5-3.8 8.8-9 11-5.2-2.2-9-6-9-11V6l9-4Z"/><path d="m8 12 2.5 2.5L16 9"/>'},
  {name:'Insurance',desc:'Helping insurers adapt operations and serve customers efficiently.',icon:'<path d="M12 3c4.6 0 8 3.5 8 8.2 0 5-3.3 8.8-8 8.8s-8-3.8-8-8.8C4 6.5 7.4 3 12 3Z"/><path d="M12 7v8m-4-4h8"/>'},
  {name:'Azentio ERP',desc:'Industry cloud solutions for evolving enterprise operations.',icon:'<circle cx="5" cy="12" r="3"/><circle cx="19" cy="5" r="3"/><circle cx="19" cy="19" r="3"/><path d="m8 11 8-5M8 13l8 5"/>'}
];
const observations = [
  {title:'Seasonality in SME cash flow',meta:'Banking · 18 Jun 2026',status:'In review'},
  {title:'Digital onboarding hand-offs',meta:'Digital banking · 12 Jun 2026',status:'Approved'},
  {title:'Regional reporting workflows',meta:'Risk & compliance · 05 Jun 2026',status:'In review'}
];
const iconSvg = (d) => `<svg viewBox="0 0 24 24" role="img" aria-hidden="true">${d}</svg>`;
document.getElementById('productGrid').innerHTML = products.map((p,i)=>`<article class="product-card"><div class="product-icon">${iconSvg(p.icon)}</div><h3>${p.name}</h3><p>${p.desc}</p><a href="/products.html?category=${['banking','capital-markets','risk-compliance','insurance','erp'][i]}" aria-label="Find out more about ${p.name}">Find out more <span>→</span></a></article>`).join('');
fetch('/api/products').then(r=>r.ok?r.json():null).then(items=>{
  if(!Array.isArray(items)) return;
  const descriptions=new Map(items.map(item=>[item.name,item.description]));
  document.querySelectorAll('.product-card').forEach(card=>{const description=descriptions.get(card.querySelector('h3')?.textContent);if(description)card.querySelector('p').textContent=description;});
}).catch(()=>{});
const renderObservations = () => {
  document.getElementById('observationList').innerHTML = observations.slice(0,4).map(o=>`<div class="observation-row"><strong>${escapeHtml(o.title)}</strong><span class="status ${o.status==='Approved'?'approved':''}">${o.status}</span><small>${escapeHtml(o.meta)}</small></div>`).join('');
  document.getElementById('myCount').textContent = String(observations.length).padStart(2,'0');
};
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
renderObservations();
document.getElementById('closeAnnouncement').addEventListener('click',()=>document.getElementById('announcement').remove());
const nav=document.getElementById('mainNav');
document.getElementById('menuToggle').addEventListener('click',e=>{const open=nav.classList.toggle('open');e.currentTarget.setAttribute('aria-expanded',String(open));e.currentTarget.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');document.getElementById('menuToggle').setAttribute('aria-expanded','false');}));
document.getElementById('searchButton').addEventListener('click',()=>{const q=window.prompt('Search Azentio.ai');if(q?.trim()){const target=products.find(p=>p.name.toLowerCase().includes(q.toLowerCase()));document.getElementById(target?'products':'insights').scrollIntoView({behavior:'smooth'});}});
const dialog=document.getElementById('observationDialog');
document.getElementById('newObservation').addEventListener('click',()=>dialog.showModal());
document.getElementById('observationForm').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);observations.unshift({title:data.get('title'),meta:`${data.get('product')} · Draft saved just now`,status:'Draft'});renderObservations();dialog.close();e.currentTarget.reset();});
document.getElementById('demoForm').addEventListener('submit',async e=>{
  e.preventDefault();const form=e.currentTarget;const button=form.querySelector('button[type="submit"]');const message=document.getElementById('formMessage');button.disabled=true;message.textContent='Sending your request…';
  const payload=Object.fromEntries(new FormData(form).entries());
  try{const res=await fetch('/api/demo-requests',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)});if(!res.ok)throw new Error('The demo service is not available yet. Please try again later.');message.textContent='Thank you. Your request has been received.';form.reset();}
  catch(err){message.textContent=err.message.includes('Failed to fetch')?'Demo request service is offline. Start the FastAPI server to save this request.':err.message;message.style.color='#9c5936';}
  finally{button.disabled=false;}
});
