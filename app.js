const DBKEY='myGarmentsDataV1';
let db=JSON.parse(localStorage.getItem(DBKEY)||'{"orders":[],"entries":[]}');
const $=id=>document.getElementById(id);
const num=v=>Math.max(0,Number(v)||0);
const fmt=n=>Number(n||0).toLocaleString('en-US');
const save=()=>localStorage.setItem(DBKEY,JSON.stringify(db));
const totals=id=>db.entries.filter(e=>!id||e.orderId===id).reduce((a,e)=>({input:a.input+e.input,assembly:a.assembly+e.assembly,output:a.output+e.output}),{input:0,assembly:0,output:0});
const orderName=o=>`${o.buyer} • ${o.style} • ${o.color||'রঙ নেই'} • ${o.group||'গ্রুপ নেই'}`;
function render(){
 const t=totals();
 $('overallStats').innerHTML=[['মোট অর্ডার',db.orders.length],['Total Input',fmt(t.input)],['Total Assembly',fmt(t.assembly)],['Total Output',fmt(t.output)]].map(x=>`<div class="stat"><small>${x[0]}</small><strong>${x[1]}</strong></div>`).join('');
 $('recentOrders').innerHTML=db.orders.slice(-5).reverse().map(o=>orderCard(o,false)).join('')||'<p class="muted">এখনো কোনো অর্ডার যোগ করা হয়নি।</p>';
 $('orderList').innerHTML=db.orders.map(o=>orderCard(o,true)).join('')||'<p class="muted">প্রথম অর্ডারটি যোগ করুন।</p>';
 const opts='<option value="">অর্ডার নির্বাচন করুন</option>'+db.orders.map(o=>`<option value="${o.id}">${esc(orderName(o))}</option>`).join('');
 $('entryOrder').innerHTML=opts;
 $('reportOrder').innerHTML='<option value="">সব অর্ডার</option>'+db.orders.map(o=>`<option value="${o.id}">${esc(orderName(o))}</option>`).join('');
 $('entryList').innerHTML=db.entries.slice().sort((a,b)=>b.date.localeCompare(a.date)).slice(0,12).map(entryCard).join('')||'<p class="muted">এখনো দৈনিক এন্ট্রি নেই।</p>';
 renderReport();
}
function esc(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function orderCard(o,buttons){const t=totals(o.id);return `<div class="item"><h3>${esc(o.buyer)} — ${esc(o.style)}</h3><p>Color: ${esc(o.color||'-')} | Season: ${esc(o.season||'-')} | Group: ${esc(o.group||'-')}</p><p>Order: ${fmt(o.quantity)} | Input: ${fmt(t.input)} | Assembly: ${fmt(t.assembly)} | Output: ${fmt(t.output)}</p>${buttons?`<div class="actions"><button class="btn secondary" onclick="editOrder('${o.id}')">এডিট</button><button class="btn danger" onclick="deleteOrder('${o.id}')">ডিলিট</button></div>`:''}</div>`}
function entryCard(e){let o=db.orders.find(x=>x.id===e.orderId);return `<div class="item"><h3>${esc(e.date)} — ${esc(o?o.style:'Deleted order')}</h3><p>${esc(o?o.buyer:'')} | Input: ${fmt(e.input)} | Assembly: ${fmt(e.assembly)} | Output: ${fmt(e.output)}</p><button class="btn danger" onclick="deleteEntry('${e.id}')">এন্ট্রি মুছুন</button></div>`}
function renderReport(){
 const id=$('reportOrder').value;const arr=db.orders.filter(o=>!id||o.id===id);let html='';
 arr.forEach(o=>{let t=totals(o.id);html+=`<div class="item"><h3>${esc(orderName(o))}</h3><div class="stats"><div class="stat"><small>Order Quantity</small><strong>${fmt(o.quantity)}</strong></div><div class="stat"><small>Total Input</small><strong>${fmt(t.input)}</strong></div><div class="stat"><small>Total Assembly</small><strong>${fmt(t.assembly)}</strong></div><div class="stat"><small>Total Output</small><strong>${fmt(t.output)}</strong></div></div><p class="muted">Output অনুযায়ী বাকি অর্ডার: ${fmt(Math.max(0,o.quantity-t.output))}</p></div>`});
 $('reportSummary').innerHTML=html||'<p class="muted">কোনো অর্ডার নেই।</p>';
 const entries=db.entries.filter(e=>!id||e.orderId===id).slice().sort((a,b)=>b.date.localeCompare(a.date));
 $('reportEntries').innerHTML=entries.map(entryCard).join('')||'<p class="muted">রেকর্ড নেই।</p>';
}
$('orderForm').addEventListener('submit',e=>{e.preventDefault();let id=$('orderId').value;let o={id:id||crypto.randomUUID(),buyer:$('buyer').value.trim(),style:$('style').value.trim(),color:$('color').value.trim(),season:$('season').value.trim(),group:$('group').value.trim(),quantity:num($('quantity').value)};if(id){db.orders=db.orders.map(x=>x.id===id?o:x)}else db.orders.push(o);save();$('orderForm').reset();$('orderId').value='';$('quantity').value='0';$('orderFormTitle').textContent='নতুন অর্ডার / স্টাইল যোগ করুন';render();alert('অর্ডার সংরক্ষণ হয়েছে।');});
window.editOrder=id=>{let o=db.orders.find(x=>x.id===id);if(!o)return;$('orderId').value=id;$('buyer').value=o.buyer;$('style').value=o.style;$('color').value=o.color;$('season').value=o.season;$('group').value=o.group;$('quantity').value=o.quantity;$('orderFormTitle').textContent='অর্ডার এডিট করুন';document.querySelector('[data-tab="orders"]').click();window.scrollTo(0,0)};
window.deleteOrder=id=>{if(!confirm('এই অর্ডার এবং এর সব দৈনিক এন্ট্রি মুছবেন?'))return;db.orders=db.orders.filter(o=>o.id!==id);db.entries=db.entries.filter(e=>e.orderId!==id);save();render()};
$('cancelEdit').onclick=()=>{$('orderForm').reset();$('orderId').value='';$('quantity').value='0';$('orderFormTitle').textContent='নতুন অর্ডার / স্টাইল যোগ করুন'};
$('entryDate').value=new Date().toISOString().slice(0,10);
$('entryForm').addEventListener('submit',e=>{e.preventDefault();if(!$('entryOrder').value)return alert('অর্ডার নির্বাচন করুন');db.entries.push({id:crypto.randomUUID(),orderId:$('entryOrder').value,date:$('entryDate').value,input:num($('dailyInput').value),assembly:num($('dailyAssembly').value),output:num($('dailyOutput').value)});save();$('dailyInput').value='0';$('dailyAssembly').value='0';$('dailyOutput').value='0';render();alert('দৈনিক হিসাব টোটালে যোগ হয়েছে।')});
window.deleteEntry=id=>{if(!confirm('এই দৈনিক এন্ট্রি মুছবেন?'))return;db.entries=db.entries.filter(e=>e.id!==id);save();render()};
$('reportOrder').onchange=renderReport;
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x===b));document.querySelectorAll('main section').forEach(s=>s.classList.toggle('hidden',s.id!==b.dataset.tab));if(b.dataset.tab==='report')renderReport()});
$('exportJson').onclick=()=>download('my-garments-backup.json',JSON.stringify(db,null,2),'application/json');
$('exportCsv').onclick=()=>{let rows=[['Date','Buyer','Style','Color','Season','Group','Daily Input','Daily Assembly','Daily Output']];db.entries.forEach(e=>{let o=db.orders.find(x=>x.id===e.orderId)||{};rows.push([e.date,o.buyer,o.style,o.color,o.season,o.group,e.input,e.assembly,e.output])});let csv='\ufeff'+rows.map(r=>r.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(',')).join('\n');download('my-garments-report.csv',csv,'text/csv;charset=utf-8')};
function download(name,data,type){let a=document.createElement('a'),u=URL.createObjectURL(new Blob([data],{type}));a.href=u;a.download=name;a.click();URL.revokeObjectURL(u)}
$('importFile').onchange=async e=>{let f=e.target.files[0];if(!f)return;try{let x=JSON.parse(await f.text());if(!Array.isArray(x.orders)||!Array.isArray(x.entries))throw Error();let oi=new Set(db.orders.map(o=>o.id)),ei=new Set(db.entries.map(o=>o.id));db.orders.push(...x.orders.filter(o=>!oi.has(o.id)));db.entries.push(...x.entries.filter(o=>!ei.has(o.id)));save();render();alert('ব্যাকআপের তথ্য যোগ হয়েছে।')}catch{alert('সঠিক ব্যাকআপ JSON ফাইল নির্বাচন করুন।')}e.target.value=''};
if('serviceWorker'in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
render();