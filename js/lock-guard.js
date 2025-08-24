import {storage} from './utils.js';
const KEY_UNLOCKS='unlocks_v1';
const KEY_PLAN='plan_v1';
export const unlocks={all:()=>storage.get(KEY_UNLOCKS,{}),has:(id)=>!!storage.get(KEY_UNLOCKS,{})[id],add:(id)=>{const u=storage.get(KEY_UNLOCKS,{});u[id]=true;storage.set(KEY_UNLOCKS,u);}};
export const plan={get:()=>storage.get(KEY_PLAN,'none'),set:(p)=>storage.set(KEY_PLAN,p)};
export const adsDisabled=()=>plan.get()==='lifetime';
