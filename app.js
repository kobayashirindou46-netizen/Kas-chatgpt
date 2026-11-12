const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const money = (n) => new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
const today = new Date();
$('#today').textContent = today.toLocaleDateString('id-ID',{weekday:'short',day:'numeric',month:'short',year:'numeric'});
$('#txDate').value = today.toISOString().slice(0,10);

let txs = [
 {name:'Setoran tunai',type:'Setor tunai',date:'2026-11-12',amount:1500000,dir:'in',note:'Nasabah D’CELL'},
 {name:'Pembelian token listrik',type:'Tagihan',date:'2026-11-12',amount:250000,dir:'out',note:'PLN 123456789'},
 {name:'Top up DANA',type:'E-wallet',date:'2026-11-11',amount:103000,dir:'in',note:'Pelanggan'}
];
function renderRows(){
 const html = txs.map(t=>`<tr><td><b>${escapeHtml(t.name)}</b><small>${escapeHtml(t.note||'')}</small></td><td><span class="tag">${escapeHtml(t.type)}</span></td><td>${new Date(t.date+'T00:00:00').toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}</td><td class="${t.dir==='in'?'green':'red'}">${t.dir==='in'?'+':'−'} ${money(t.amount)}</td><td><span class="status">Contoh</span></td></tr>`).join('');
 $('#recentRows').innerHTML = html || '<tr><td colspan="5">Belum ada transaksi.</td></tr>';
 $('#allRows').innerHTML = html || '<tr><td colspan="5">Belum ada transaksi.</td></tr>';
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
renderRows();

function go(page){
 $$('.page').forEach(p=>p.classList.toggle('active',p.id==='page-'+page));
 $$('[data-page]').forEach(b=>b.classList.toggle('active',b.dataset.page===page));
 const names={dashboard:'Dashboard',transaksi:'Transaksi',rekening:'Rekening',utang:'Utang & Piutang',laporan:'Laporan'};
 $('#crumb').textContent=names[page]||'Dashboard';
 window.scrollTo({top:0,behavior:'smooth'});
}
$$('[data-page]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.page)));
$$('[data-goto]').forEach(b=>b.addEventListener('click',()=>go(b.dataset.goto)));

function openModal(type){
 $('#modal').classList.add('show');
 if(type) $('#txType').value=type;
 $('#txName').focus();
}
function closeModal(){$('#modal').classList.remove('show');}
['#addTop','#addTransactions'].forEach(s=>$(s).addEventListener('click',()=>openModal()));
$$('[data-type]').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.type)));
$('#closeModal').addEventListener('click',closeModal);
$('#modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});
$('#txForm').addEventListener('submit',e=>{
 e.preventDefault();
 const type=$('#txType').value;
 const labels={masuk:'Pemasukan',keluar:'Pengeluaran',transfer:'Transfer',tarik:'Tarik tunai',setor:'Setor tunai',topup:'Top up e-wallet'};
 const item={name:$('#txName').value.trim(),type:labels[type],date:$('#txDate').value,amount:Number($('#txAmount').value),dir:type==='keluar'?'out':'in',note:$('#txNote').value.trim()};
 if(!item.name||!item.amount||item.amount<1)return;
 txs.unshift(item);renderRows();closeModal();e.target.reset();$('#txDate').value=today.toISOString().slice(0,10);
 $('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),2200);
});
$('#searchTx').addEventListener('input',e=>{
 const q=e.target.value.toLowerCase();
 $$('#allRows tr').forEach(r=>r.style.display=r.textContent.toLowerCase().includes(q)?'':'none');
});
function toggleTheme(){document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';}
$('#themeBtn').addEventListener('click',toggleTheme);$('#themeTop').addEventListener('click',toggleTheme);
$('#debtInfo').addEventListener('click',()=>alert('Form utang/piutang akan dibuat pada tahap integrasi berikutnya.'));
