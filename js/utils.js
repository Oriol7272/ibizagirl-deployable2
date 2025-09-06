export const qs = (sel, root=document)=>root.querySelector(sel);
export const qsa = (sel, root=document)=>Array.from(root.querySelectorAll(sel));
export const seedToday = ()=>{ const d=new Date(); return d.getFullYear()*10000+(d.getMonth()+1)*100+d.getDate(); };
export function shuffleSeeded(arr, seed){
  const a=[...arr]; let m=a.length,i,t;
  const rand=()=>{ seed=(seed*9301+49297)%233280; return seed/233280; };
  while(m){ i=Math.floor(rand()*m--); t=a[m]; a[m]=a[i]; a[i]=t; }
  return a;
}
export const hasUnlock = (id)=> !!localStorage.getItem('unlocks_'+id);
export const plan = ()=> localStorage.getItem('plan') || 'none';
