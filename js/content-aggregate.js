const g=(n)=>window[n]||[];
export function getPools(){
  const full=[...g('FULL_POOL'), ...(window.FULL_POOL_2||[]), ...(window.FULL_POOL_3||[])].filter(Boolean);
  const premium=[...g('PREMIUM_POOL'), ...(window.PREMIUM_POOL_2||[]), ...(window.PREMIUM_POOL_3||[])].filter(Boolean);
  const videos=[...g('VIDEO_POOL'), ...(window.VIDEO_POOL_2||[]), ...(window.VIDEO_POOL_3||[])].filter(Boolean);
  return { full, premium, videos };
}
