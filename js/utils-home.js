export const dailySeed = () => new Date().toISOString().slice(0,10);

// hash 32-bit FNV-like
function hash32(str){
  let h = 2166136261 >>> 0;
  for(let i=0;i<str.length;i++){
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// PRNG mulberry32
function mulberry32(a){
  return function(){
    let t = (a += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededPick(arr, n, salt=''){
  const seed = hash32(dailySeed() + String(salt));
  const rnd = mulberry32(seed);
  const pool = arr.slice();
  for(let i=pool.length-1;i>0;i--){
    const j = Math.floor(rnd() * (i+1));
    const tmp = pool[i]; pool[i] = pool[j]; pool[j] = tmp;
  }
  return pool.slice(0, Math.min(n, pool.length));
}

export const imgURL = it => it?.banner || it?.cover || it?.thumb || it?.src || it?.file || it?.url || it?.path;
