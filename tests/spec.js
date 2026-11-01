// Especificación de credibilidad del simulador. Se corre en loop hasta que todo pase.
const fs=require('fs');
const s=fs.readFileSync(require('path').join(__dirname,'..','index.html'),'utf8');
const a=s.indexOf('// ===================== MODEL START'), b=s.indexOf('// ===================== MODEL END');
const M=new Function(s.slice(a,b)+';return {FISCAL,TERRITORIES,CONTROLS,RES_CONTROLS,DEFAULTS,RES_DEFAULTS,PRESETS,POLICY_IDS,simulate,simulateAI,adoptionFactor,counterfactualParams,val};')();
const {TERRITORIES:TS,DEFAULTS,RES_DEFAULTS,PRESETS,val}=M;
const BASE={...DEFAULTS,...RES_DEFAULTS};
const run=P=>{P={...P,_k:M.adoptionFactor(P)};const o={};TS.forEach(T=>o[T.id]=M.simulate(T,P));return o;};
let fails=[], passes=0;
const check=(ok,msg)=>{ if(ok) passes++; else fails.push(msg); };
const Y=y=>y-2026;
// S1 calibración 2026 exacta en todos los escenarios
for (const [pk,p] of Object.entries(PRESETS)) { const R=run({...BASE,...p.v});
  for (const T of TS){ const r=R[T.id][0];
    const pairs=[['u',r.u*100,val(T.u)],['P0',r.P0*100,val(T.H)],['Pc',r.Pc*100,val(T.Hc)],['gini',r.gini,val(T.gini),0.002],['tmi',r.tmi,val(T.tmi)],['tgf',r.tgf,val(T.tgf),0.01]];
    if(T.I) pairs.push(['ind',r.ind*100,val(T.I)]);
    pairs.push(['A2026',r.A*100,run(BASE)[T.id][0].A*100,0.001]);
    for (const [k,v,o,tol=0.15] of pairs) check(Math.abs(v-o)<=tol, `S1 calibración ${pk}/${T.id}/${k}: ${v.toFixed(3)} vs ${o}`);
  } }
// S2 signos esperados (efecto de subir cada política desde el valor por defecto)
const EXP=[ // [control, salida, signo esperado, año, filtro territorio]
 ['accel','A',+1,2035],['accel','dispCum',+1,2040],['reg','A',-1,2035],['subst','u',+1,2040],['tax','revenue',+1,2040],
 ['ubi','P0',-1,2040],['ubi','gini',-1,2040],['ubi','cost',+1,2040],['childb','Pc',-1,2040],['retrain','u',-1,2040],
 ['formal','inf',-1,2040,T=>T.inf],['formal','P0',-1,2040,T=>T.inf],['hours','u',-1,2040],['natal','tgf',+1,2045],['natal','pop',+1,2050],
 ['mig','pop',0,2050],['housing','P0',-1,2040],['edu','P0',-1,2050],['health','tmi',-1,2040],['tele','pop',-1,2050,T=>T.metro],
 ['effHw','A',+1,2035],['subst','ls',-1,2050],['subst','wage',-1,2050],['subst','pop',-1,2050],['subst','wageDisp',-1,2050],['grid','A',+1,2035],['satYear','A',+1,2040],['tax','gini',-1,2045],['childb','tmi',-1,2040],['ubi','tmi',-1,2040],
];
const ALLC=[...M.CONTROLS,...M.RES_CONTROLS].flatMap(g=>g.items);
const R0=run(BASE);
for (const [cid,key,sg,yr,flt] of EXP){ const c=ALLC.find(x=>x.id===cid); const R1=run({...BASE,[cid]:c.max});
  for (const T of TS){ if(flt && !flt(T)) continue; const x0=R0[T.id][Y(yr)][key], x1=R1[T.id][Y(yr)][key]; if(x0==null) continue;
    let want=sg; if(cid==='mig') want=Math.sign(val(T.mig)); const d=x1-x0;
    check(want===0? Math.abs(d)<1e-9 : Math.sign(d)===want && Math.abs(d)>1e-6, `S2 signo ${cid}↑ → ${key} ${T.id} ${yr}: Δ=${d.toExponential(2)} (esperado ${want>0?'+':'−'})`); } }
// S3 rangos plausibles y S4 suavidad en escenarios extremos y aleatorios
let rng=12345; const rand=()=>((rng=(rng*1103515245+12345)%2147483648)/2147483648);
const scen=[['base',BASE],...Object.entries(PRESETS).map(([k,p])=>[k,{...BASE,...p.v}]),
  ['min',Object.fromEntries(ALLC.map(c=>[c.id,c.min]))],['max',Object.fromEntries(ALLC.map(c=>[c.id,c.max]))]];
for(let i=0;i<150;i++) scen.push(['rand'+i,Object.fromEntries(ALLC.map(c=>[c.id,c.min+Math.round(rand()*(c.max-c.min)/c.step)*c.step]))]);
const worst={};
for (const [sn,P] of scen){ const R=run(P);
  for (const T of TS){ const arr=R[T.id];
    arr.forEach((r,i)=>{ const bad=[];
      for (const k of ['u','P0','Pc','gini','tmi','tgf','pop','te','A','balance']) if(!Number.isFinite(r[k])) bad.push(k+' NaN');
      if(r.u<0.015||r.u>0.40) bad.push('u '+(r.u*100).toFixed(1));
      if(r.P0<0.001||r.P0>0.9) bad.push('P0 '+(r.P0*100).toFixed(1));
      if(P.childb===0 && r.Pc<r.P0-0.03) bad.push('Pc<P0');
      if(r.gini<0.18||r.gini>0.70) bad.push('gini '+r.gini.toFixed(3));
      if(r.tmi<1.8||r.tmi>45) bad.push('tmi '+r.tmi.toFixed(1));
      if(r.inf!=null&&(r.inf<5||r.inf>85)) bad.push('inf');
      if(!(r.ls>=0.15&&r.ls<=0.85)||!Number.isFinite(r.wage)||r.wage<40||r.wage>300) bad.push('ls/wage '+(r.ls*100).toFixed(1)+' '+r.wage.toFixed(0));
      if(i>0){ const p=arr[i-1];
        if(Math.abs(r.u-p.u)>0.035) bad.push('salto u '+((r.u-p.u)*100).toFixed(1));
        if(Math.abs(r.P0-p.P0)>0.15) bad.push('salto P0 '+((r.P0-p.P0)*100).toFixed(1));
        if(Math.abs(r.gini-p.gini)>0.06) bad.push('salto gini');
        if(Math.abs(r.pop/p.pop-1)>0.03) bad.push('salto pob '+((r.pop/p.pop-1)*100).toFixed(1)+'%'); }
      bad.forEach(m=>{ const key=T.id+' '+m.split(' ')[0]+' '+(m.split(' ')[1]||''); worst[key]=worst[key]||`${sn} ${T.id} ${2026+i}: ${m}`; });
    });
  } }
Object.values(worst).forEach(m=>check(false,'S3/S4 '+m)); passes+=scen.length*TS.length - Object.keys(worst).length;
// S5 contrafáctico: sin políticas == escenario contrafáctico
{ const P={...BASE}; M.POLICY_IDS.forEach(k=>P[k]=0); P.mig=1; const k=M.adoptionFactor(P);
  const A=M.simulate(TS[0],{...P,_k:k}), C=M.simulate(TS[0],{...M.counterfactualParams(P),_k:k});
  check(JSON.stringify(A)===JSON.stringify(C),'S5 contrafáctico distinto'); }
// S6 escenario base plausible (2035) y S7 población 2050 vs proyecciones oficiales
const RB=R0; const g=(id,k,yr)=>RB[id][Y(yr)][k];
check(g('ar','u',2035)>0.05&&g('ar','u',2035)<0.15,`S6 desocupación AR 2035 ${(g('ar','u',2035)*100).toFixed(1)}`);
check(g('eu','u',2035)>0.04&&g('eu','u',2035)<0.12,`S6 desocupación UE 2035 ${(g('eu','u',2035)*100).toFixed(1)}`);
check(g('ar','A',2035)>0.2&&g('ar','A',2035)<0.85,`S6 adopción AR 2035 ${(g('ar','A',2035)*100).toFixed(0)}`);
check(g('ar','P0',2035)>0.15&&g('ar','P0',2035)<0.45,`S6 pobreza AR 2035 ${(g('ar','P0',2035)*100).toFixed(1)}`);
const BENCH=[ // cociente población año/2026 en el escenario base vs proyección oficial
 ['ar',2050,1.02,1.07,'Argendata/CIPPEC: pico ~5 % sobre la actual, nunca 50 M'],['latam',2050,1.06,1.11,'CEPAL: 663 M (2024) → máximo ~730 M en 2053'],
 ['eu',2050,0.975,1.0,'JRC/Eurostat: 453 M pico 2029, ~445 M en 2050'],['mad',2041,1.11,1.18,'INE: 7,17 M → 8,20 M en 2041'],['lon',2050,1.10,1.22,'GLA: 10,5–10,9 M en 2050 (central)'],
 ['caba',2050,0.95,1.04,'INDEC/IDECBA: CABA estable en torno a 3,1 M']];
for (const [id,yr,lo,hi,src] of BENCH){ const v=g(id,'pop',yr)/g(id,'pop',2026); check(v>=lo&&v<=hi,`S7 población ${id} ${yr}/2026 = ${v.toFixed(3)} fuera de [${lo}, ${hi}] (${src})`); }
// S8 dosis-respuesta monótona
for (const [cid,key,sg] of [['ubi','P0',-1],['retrain','u',-1],['childb','Pc',-1],['accel','A',+1]]) { const c=ALLC.find(x=>x.id===cid); let prev=null, ok=true;
  for(let v=c.min; v<=c.max+1e-9; v+=(c.max-c.min)/10){ const x=run({...BASE,[cid]:v}).ar[Y(2040)][key]; if(prev!=null && sg*(x-prev)< -0.003) ok=false; prev=x; }
  check(ok,`S8 respuesta no monótona ${cid}→${key}`); }
console.log(`PASAN ${passes} · FALLAN ${fails.length}`); fails.slice(0,60).forEach(f=>console.log('  ✗',f));
process.exitCode = fails.length?1:0;
