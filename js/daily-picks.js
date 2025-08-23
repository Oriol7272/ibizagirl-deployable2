import {seededShuffle} from './seeded-random.js';
import {todaySeed} from './utils.js';
import {getPools} from './content-aggregate.js';
const pick=(arr,n)=>arr.slice(0,Math.min(n,arr.length));
export function getDailySets({forceRefresh=false}={}){
  const {full,premium,videos}=getPools();
  const seed=forceRefresh?Math.floor(Math.random()*1e9):todaySeed();
  const full20=pick(seededShuffle(full,seed+11),20);
  const premium100=pick(seededShuffle(premium,seed+23),100).map((it,i)=>({...it,_i:i}));
  const vids20=pick(seededShuffle(videos,seed+37),20).map(v=>({...v,type:'video'}));
  const newCount=Math.floor(premium100.length*0.30);
  const marked=premium100.map((it,i)=>({...it,isNew:i<newCount}));
  return {full20, premium100:marked, vids20};
}
