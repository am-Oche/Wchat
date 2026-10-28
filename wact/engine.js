/* WAct demo data engine — seeded, consistent per workspace / range / source.
   Every number on every card, chart, funnel and table derives from the same daily series. */
(function(){
  window.WACT_BRAND = { name:'WAct', tagline:'Turn WhatsApp chats into trackable conversions' };

  function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  function hash(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)}return h>>>0}

  const WORKSPACES = [
    { id:'ecom',   name:'E-commerce',     phone:'+1 (201) 555-0124', scale:1.00, cpc:0.315, kw:['Kitchen Renovation Du…','Oak dining table sale','Linen bedding set','Outdoor sofa deals','Bathroom vanity 60"'] },
    { id:'estate', name:'Real Estate',    phone:'+1 (305) 555-0188', scale:0.55, cpc:0.92,  kw:['2 bed condo downtown','Waterfront villas','New build townhouse','Rent to own homes','Studio near metro'] },
    { id:'clinic', name:'Northside Clinic', phone:'+44 20 7946 0321', scale:0.72, cpc:0.58, kw:['Dental implants cost','Invisalign consult','Teeth whitening','Emergency dentist','Kids dentist near me'] },
  ];
  const SOURCES = [
    { id:'g-brand', name:'Google Ads – Brand Campaign',      short:'Google Ads – Campaign A', ch:'google',    w:.34, q:.70, cpc:.85, status:'Active' },
    { id:'g-lead',  name:'Google Ads – Lead Campaign',       short:'Google Ads – Campaign B', ch:'google',    w:.30, q:.58, cpc:1.10, status:'Active' },
    { id:'ms',      name:'Microsoft Ads – Source Campaign',  short:'Microsoft Ads',           ch:'microsoft', w:.12, q:.52, cpc:.95, status:'Paused' },
    { id:'meta',    name:'Meta – Click-to-WhatsApp',         short:'Meta CTWA',               ch:'meta',      w:.16, q:.55, cpc:1.25, status:'Active' },
    { id:'wa-org',  name:'WhatsApp Organic',                 short:'WhatsApp',                ch:'whatsapp',  w:.08, q:.66, cpc:0,    status:'Active' },
  ];
  const RANGES = { '7d':7, '30d':30, '3m':90, '6m':182, '1y':365 };
  const DAYS = 730; // history depth (so 1y has a previous period)

  const FIRST = ['Ali','Maria','Daniel','Sofia','Omar','Chloe','Lucas','Amara','Noah','Leila','Ethan','Priya','Mateo','Hana','Samuel','Zara','Liam','Fatima','Jonas','Grace','Tunde','Elena','Ravi','Mei'];
  const LAST  = ['Salman Zia','Okafor','Fischer','Rossi','Haddad','Martin','Silva','Mensah','Kim','Ahmed','Novak','Patel','García','Tanaka','Adeyemi','Costa','Murphy','Rahman','Berg','Lewis','Bello','Ivanova','Shah','Chen'];
  const MSGS = ['Hi, I\'m interested and would like to check availability.','Hello! Is this still in stock?','Can I get a quote for this?','What are your opening hours this week?','Do you deliver to my area?','Hi, I saw your ad — can you send pricing?','Is there a discount for first orders?','Can someone call me back today?'];

  // Build daily series per workspace per source
  const cache = {};
  function series(wsId){
    if(cache[wsId]) return cache[wsId];
    const ws = WORKSPACES.find(w=>w.id===wsId);
    const out = {};
    SOURCES.forEach(src=>{
      const r = mulberry(hash(wsId+src.id));
      const arr = [];
      for(let d=0; d<DAYS; d++){
        const age = DAYS-1-d;                                 // 0 = today
        const date = new Date(); date.setHours(0,0,0,0); date.setDate(date.getDate()-age);
        const dow = date.getDay();
        const season = 1 + .18*Math.sin((d/365)*Math.PI*2 + hash(src.id)%7);
        const week = [0.78,1.06,1.1,1.08,1.04,0.94,0.8][dow];
        const trend = 0.62 + 0.38*(d/DAYS);
        const noise = 0.82 + r()*0.36;
        const clicks = Math.round(80*ws.scale*src.w*season*week*trend*noise*(src.ch==='whatsapp'?1.6:1)*1.26);
        const leadR  = (src.ch==='whatsapp'?0.30:0.125) * (0.85+r()*0.3);
        const leads  = Math.round(clicks*leadR);
        const verified = Math.round(leads*src.q*(0.88+r()*0.24));
        const matched  = Math.round(verified*(src.ch==='whatsapp'?0.55:0.86)*(0.92+r()*0.1));
        const sent     = Math.round(matched*(src.ch==='whatsapp'?0:0.82)*(0.9+r()*0.1));
        const spend    = +(clicks*src.cpc*ws.cpc/0.85*0.37*(0.9+r()*0.2)).toFixed(2);
        arr.push({ date, clicks, leads, verified, matched, sent, spend });
      }
      out[src.id] = arr;
    });
    return (cache[wsId] = out);
  }

  // Live overlay: leads that arrived during this session (added to "today")
  const live = {}; // wsId -> {srcId: {leads, verified, ...}}
  function liveFor(ws){ return live[ws] || (live[ws] = {}); }

  function sumRange(wsId, srcIds, days, offset){
    const s = series(wsId); const L = liveFor(wsId);
    const tot = {clicks:0,leads:0,verified:0,matched:0,sent:0,spend:0};
    const daily = [];
    for(let i=DAYS-offset-days; i<DAYS-offset; i++){
      const row = {date:s[SOURCES[0].id][i].date, clicks:0,leads:0,verified:0,matched:0,sent:0,spend:0};
      srcIds.forEach(id=>{
        const x = s[id][i];
        for(const k in tot){ row[k]+=x[k]; }
        if(i===DAYS-1 && offset===0 && L[id]) for(const k in L[id]) row[k]+=L[id][k];
      });
      for(const k in tot) tot[k]+=row[k];
      daily.push(row);
    }
    return {tot, daily};
  }

  function pct(a,b){ return b ? ((a-b)/b)*100 : 0; }

  function compute(wsId, range, sourceFilter){
    const days = typeof range==='number' ? Math.max(2,Math.min(365,range)) : (RANGES[range] || 30);
    const srcIds = (sourceFilter && sourceFilter.length) ? sourceFilter : SOURCES.map(s=>s.id);
    const cur = sumRange(wsId, srcIds, days, 0);
    const prev = sumRange(wsId, srcIds, days, days);
    const t = cur.tot, p = prev.tot;
    const cpl = t.verified ? t.spend/t.verified : 0;
    const pcpl = p.verified ? p.spend/p.verified : 0;
    const quality = t.leads ? (t.verified/t.leads)*100*1.06 : 0;
    const pquality = p.leads ? (p.verified/p.leads)*100*1.06 : 0;

    // Bucket daily into ~14-28 points for sparklines/charts
    const bucket = days<=7?1: days<=30?1: days<=90?3: days<=182?7: 14;
    const pts = [];
    for(let i=0;i<cur.daily.length;i+=bucket){
      const slice = cur.daily.slice(i,i+bucket);
      const agg = slice.reduce((a,r)=>{for(const k in a) a[k]+=r[k]; return a},{clicks:0,leads:0,verified:0,matched:0,sent:0,spend:0});
      agg.date = slice[0].date;
      agg.cpl = agg.verified? agg.spend/agg.verified : 0;
      agg.quality = agg.leads? agg.verified/agg.leads*100*1.06 : 0;
      pts.push(agg);
    }

    // Per source rows (always all sources so the table is complete, flagged if filtered out)
    const sources = SOURCES.map(src=>{
      const c = sumRange(wsId,[src.id],days,0).tot;
      const pp = sumRange(wsId,[src.id],days,days).tot;
      const scpl = c.verified? c.spend/c.verified : 0;
      return { ...src, leads:c.leads, qualified:c.verified, spend:c.spend, cpl:scpl, sent:c.sent,
        delta:pct(c.verified,pp.verified), included: srcIds.includes(src.id) };
    });
    const paid = sources.filter(s=>s.cpc>0 && s.included && s.qualified>0);
    const best = paid.slice().sort((a,b)=>a.cpl-b.cpl)[0];
    const worst = paid.slice().sort((a,b)=>b.cpl-a.cpl)[0];

    return {
      range, days, srcIds,
      kpi:{
        qualified:{ value:t.verified, delta:pct(t.verified,p.verified), series:pts.map(x=>x.verified) },
        cpl:{ value:cpl, delta:pct(cpl,pcpl), series:pts.map(x=>x.cpl) },
        quality:{ value:quality, delta:pct(quality,pquality), series:pts.map(x=>x.quality) },
        spend:{ value:t.spend, delta:pct(t.spend,p.spend) },
      },
      funnel:[
        {key:'clicks',  label:'Clicks',         value:t.clicks},
        {key:'leads',   label:'Leads',          value:t.leads},
        {key:'verified',label:'Verified',       value:t.verified},
        {key:'matched', label:'Source matched', value:t.matched},
        {key:'sent',    label:'Sent to Ads',    value:t.sent},
      ],
      points:pts, sources,
      variance: best && worst ? { best, worst, diff: worst.cpl-best.cpl, avg: paid.reduce((a,s)=>a+s.cpl,0)/paid.length, rows: paid } : null,
    };
  }

  // Recent leads list (deterministic history + live arrivals)
  const leadStore = {};
  function makeLead(wsId, r, ageMin, live){
    const ws = WORKSPACES.find(w=>w.id===wsId);
    const src = (function(){ let x=r(),acc=0; for(const s of SOURCES){acc+=s.w; if(x<=acc) return s;} return SOURCES[0]; })();
    const st = r(); const status = live ? 'Pending' : (st<src.q? 'Verified' : st<src.q+.18 ? 'Pending' : 'Rejected');
    const name = FIRST[Math.floor(r()*FIRST.length)]+' '+LAST[Math.floor(r()*LAST.length)];
    const ph = ws.phone.slice(0,ws.phone.indexOf(' ')+1);
    return {
      id: 'L'+Math.floor(r()*1e8).toString(36), name,
      phone: ph+'••• •••'+String(Math.floor(r()*9000+1000)).slice(0,2)+String(Math.floor(r()*90+10)),
      src: src.id, campaign: src.name, ch: src.ch, status,
      cpl: src.cpc ? +(2.4+r()*5.8).toFixed(2) : 0,
      at: Date.now() - ageMin*60000,
      msg: MSGS[Math.floor(r()*MSGS.length)],
      kw: ws.kw[Math.floor(r()*ws.kw.length)],
      gclid: src.ch==='google' ? 'CjwKCAjw'+Math.floor(r()*1e12).toString(36)+'ZPDBhBW'+Math.floor(r()*1e6).toString(36) : null,
      live: !!live
    };
  }
  function leads(wsId){
    if(leadStore[wsId]) return leadStore[wsId];
    const r = mulberry(hash('leads'+wsId)); const arr = [];
    let age = 3;
    for(let i=0;i<40;i++){ arr.push(makeLead(wsId,r,age)); age += Math.floor(4+r()*38); }
    return (leadStore[wsId]=arr);
  }

  // Live feed (stands in for SSE /api/stream)
  const subs = new Set();
  let liveR = mulberry(Date.now()%100000);
  function pushLive(wsId){
    const lead = makeLead(wsId, liveR, 0, true);
    leads(wsId).unshift(lead);
    const L = liveFor(wsId); const o = L[lead.src] || (L[lead.src]={clicks:0,leads:0,verified:0,matched:0,sent:0,spend:0});
    o.clicks += 3+Math.floor(liveR()*6); o.leads += 1; o.spend += lead.cpl*0.6;
    // a few seconds later the lead gets verified (or not)
    setTimeout(()=>{
      const ok = liveR() < 0.7; lead.status = ok ? 'Verified' : 'Rejected'; lead.flash = Date.now();
      if(ok){ o.verified+=1; o.matched+=1; if(lead.ch!=='whatsapp') o.sent+=1; o.spend += lead.cpl*0.4; }
      subs.forEach(fn=>fn({type:'update', ws:wsId, lead}));
    }, 4200);
    subs.forEach(fn=>fn({type:'lead', ws:wsId, lead}));
    return lead;
  }
  let timer=null, activeWs='ecom';
  function startLive(ws, every){
    activeWs = ws || activeWs; if(timer) clearInterval(timer);
    timer = setInterval(()=>pushLive(activeWs), every||7000);
  }
  function setLiveWs(ws){ activeWs = ws; }
  function subscribe(fn){ subs.add(fn); return ()=>subs.delete(fn); }

  // Formatting helpers
  const fmt = {
    int: n => Math.round(n).toLocaleString('en-US'),
    money: n => '$'+n.toFixed(2),
    money0: n => '$'+Math.round(n).toLocaleString('en-US'),
    pct1: n => n.toFixed(1)+'%',
    delta: n => (n>=0?'+':'−')+Math.abs(n).toFixed(1)+'%',
    ago: t => { const m = Math.max(0,Math.round((Date.now()-t)/60000)); if(m<1) return 'Just now'; if(m<60) return m+'m ago'; const h=Math.round(m/60); if(h<24) return h+'h ago'; return Math.round(h/24)+'d ago'; },
  };

  window.WactEngine = { WORKSPACES, SOURCES, RANGES, compute, leads, subscribe, startLive, setLiveWs, pushLive, fmt };
})();
