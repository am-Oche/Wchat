/* WAct dashboard app — shell + Dashboard page, driven by WactEngine */
const E = window.WactEngine;

const NAV = [
  { group: 'General', items: [
    { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
    { id: 'leads', label: 'Leads', icon: 'users', badge: 'live' },
    { id: 'campaigns', label: 'Campaigns', icon: 'flag' },
    { id: 'conversations', label: 'Conversations', icon: 'chat' },
  ]},
  { group: 'Analytics', items: [
    { id: 'reports', label: 'Reports', icon: 'chart' },
    { id: 'attribution', label: 'Attribution', icon: 'route' },
  ]},
  { group: 'Workspace settings', items: [
    { id: 'general', label: 'General', icon: 'settings' },
    { id: 'connections', label: 'Connections', icon: 'link' },
    { id: 'integrations', label: 'Integrations', icon: 'plug' },
    { id: 'tracking', label: 'Tracking', icon: 'tag' },
    { id: 'autoreplies', label: 'Auto-replies', icon: 'bolt' },
    { id: 'team', label: 'Team & roles', icon: 'user' },
  ]},
];
const RANGE_OPTS = [
  { value: '7d', label: '7d' }, { value: '30d', label: '30d' }, { value: '3m', label: '3m' },
  { value: '6m', label: '6m' }, { value: '1y', label: '1y' }, { value: 'custom', label: 'Custom' },
];
const srcAbbr = { google: 'G', microsoft: 'MS', meta: 'M', whatsapp: <I n="chat" s={14} /> };

/* ---------------- Sidebar ---------------- */
function WorkspaceSwitcher({ ws, setWs, compact }) {
  const cur = E.WORKSPACES.find((w) => w.id === ws);
  return (
    <Popover width={250} align="left" trigger={({ toggle }) => (
      <button className="ws" onClick={toggle} aria-label="Switch workspace">
        <span className="ws-ico"><I n="folder" s={18} /></span>
        {!compact && <span className="ws-meta hide-c"><div className="ws-name">{cur.name}</div><div className="ws-sub">{cur.phone}</div></span>}
        {!compact && <I n="updown" s={14} className="hide-c" style={{ color: 'var(--text-3)' }} />}
      </button>
    )}>
      {({ close }) => (
        <div className="ws-list">
          <div className="pop-head">Workspaces</div>
          {E.WORKSPACES.map((w) => (
            <button key={w.id} onClick={() => { setWs(w.id); close(); }}>
              <span className="ws-ico"><I n="folder" s={14} /></span>
              <span style={{ flex: 1 }}><div className="ws-name" style={{ fontSize: 13 }}>{w.name}</div><div className="ws-sub">{w.phone}</div></span>
              {w.id === ws && <I n="check" s={14} />}
            </button>
          ))}
          <div className="side-sep" style={{ margin: '6px 4px' }} />
          <button onClick={close}><span className="ws-ico" style={{ background: 'var(--g100)' }}><I n="plus" s={14} /></span><span className="ws-name" style={{ fontSize: 13 }}>New workspace</span></button>
        </div>
      )}
    </Popover>
  );
}

function Sidebar({ page, setPage, ws, setWs, collapsed, setCollapsed, data, liveCount }) {
  const [closed, setClosed] = useState({});
  const used = Math.min(100, Math.round((data.kpi.qualified.value / 2400) * 100 * (30 / data.days)));
  return (
    <aside className="side" aria-label="Primary">
      <div className="side-top">
        {collapsed ? <span style={{ color: 'var(--ink)', width: 28 }} dangerouslySetInnerHTML={{ __html: window.WBubble() }} /> : <Logo size={22} />}
        <button className="icon-btn" onClick={() => setCollapsed(!collapsed)} aria-label="Collapse sidebar"><I n="sidebar" s={17} /></button>
      </div>
      <WorkspaceSwitcher ws={ws} setWs={setWs} compact={collapsed} />
      {NAV.map((g, gi) => (
        <div className="nav-group" key={g.group}>
          {gi > 0 && <div className="side-sep" style={{ margin: '0 6px 8px' }} />}
          <button className={'nav-label hide-c ' + (closed[g.group] ? 'closed' : '')} onClick={() => setClosed({ ...closed, [g.group]: !closed[g.group] })} aria-expanded={!closed[g.group]}>
            <I n="chevDown" s={11} />{g.group}
          </button>
          <div className={'nav-items ' + (closed[g.group] ? 'closed' : '')}>
            <div>
              {g.items.map((it) => (
                <button key={it.id} className={'nav-item ' + (page === it.id ? 'on' : '')} onClick={() => setPage(it.id)} title={it.label} aria-current={page === it.id ? 'page' : undefined}>
                  <I n={it.icon} s={16} /><span className="hide-c">{it.label}</span>
                  {it.badge === 'live' && liveCount > 0 && <span className="badge hide-c">+{liveCount}</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
      ))}
      <div className="promo grid-tex hide-c">
        <h4>No Waste, No Leads</h4>
        <p>Qualified leads this month vs. your plan limit.</p>
        <div className="bar"><i style={{ width: used + '%' }} /></div>
        <small>{used}% of 2,400 qualified leads</small>
        <div><button className="pill pill-dark">Upgrade plan</button></div>
      </div>
      <div className="user-chip hide-c">
        <span className="avatar">JM</span>
        <div style={{ flex: 1, minWidth: 0 }}><b>Jordan Mills</b><span>jordan@agency.co</span></div>
        <I n="more" s={16} style={{ color: 'var(--text-3)' }} />
      </div>
    </aside>
  );
}

/* ---------------- Dashboard page ---------------- */
function KpiCard({ icon, value, label, delta, series, invert, format, drawKey, bump }) {
  const good = invert ? delta <= 0 : delta >= 0;
  return (
    <div className={'card kpi lift ' + (bump ? 'bump' : '')} key={bump ? 'b' + bump : undefined}>
      <span className="kpi-ico"><I n={icon} s={16} /></span>
      <div className="kpi-chart">
        <DeltaChip value={delta} invert={invert} />
        <Sparkline data={series} w={128} h={64} tone={good ? 'pos' : 'neg'} drawKey={drawKey} />
      </div>
      <div style={{ alignSelf: 'end' }}>
        <div className="kpi-val"><CountUp value={value} format={format} /></div>
        <div className="kpi-lbl">{label}</div>
      </div>
    </div>
  );
}

function SourceFilter({ selected, setSelected }) {
  const all = E.SOURCES.map((s) => s.id);
  const sel = selected.length ? selected : all;
  const toggle = (id) => {
    let n = sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id];
    if (!n.length) n = all;
    setSelected(n.length === all.length ? [] : n);
  };
  return (
    <Popover width={260} trigger={({ toggle: t }) => (
      <button className="btn-o" onClick={t}>{selected.length ? `${selected.length} source${selected.length > 1 ? 's' : ''}` : 'All sources'}<I n="chevDown" s={13} /></button>
    )}>
      <div className="pop-head">Sources</div>
      {E.SOURCES.map((s) => (
        <button key={s.id} className="pop-item" onClick={() => toggle(s.id)}>
          <span className={'chk ' + (sel.includes(s.id) ? 'on' : '')}>{sel.includes(s.id) && <I n="check" s={10} />}</span>{s.name}
        </button>
      ))}
      <div className="side-sep" style={{ margin: '4px' }} />
      <button className="pop-item" onClick={() => setSelected([])}>Reset to all sources</button>
    </Popover>
  );
}

function Funnel({ data, selected, setSelected }) {
  const [ref, inView] = useInView({ threshold: 0.2 });
  const top = data.funnel[0].value || 1;
  const chips = selected.length ? E.SOURCES.filter((s) => selected.includes(s.id)) : E.SOURCES.filter((s) => ['g-brand', 'g-lead', 'wa-org'].includes(s.id));
  const removeChip = (id) => {
    const base = selected.length ? selected : E.SOURCES.map((s) => s.id);
    const n = base.filter((x) => x !== id);
    setSelected(n.length ? n : []);
  };
  return (
    <div className="card" ref={ref}>
      <div className="card-h">
        <div><h3>Conversion Funnel</h3><p>From click to qualified conversion sent to Google Ads</p></div>
        <div className="head-ctrls" style={{ width: 'auto' }}>
          <SourceFilter selected={selected} setSelected={setSelected} />
        </div>
      </div>
      <div className="chips">
        {chips.map((s) => (
          <span className="fchip" key={s.id}>{s.short}<button aria-label={'Remove ' + s.short} onClick={() => removeChip(s.id)}><I n="x" s={11} /></button></span>
        ))}
      </div>
      <div className="funnel">
        {data.funnel.map((f, i) => {
          const p = (f.value / top) * 100;
          const w = inView ? Math.max(p, 1.5) : 0;
          return (
            <div className="f-row" key={f.key}>
              <span>{f.label}</span>
              <span className="p tnum">{p >= 10 || p === 0 ? Math.round(p) : p.toFixed(1)}%</span>
              <span className="n"><CountUp value={f.value} /></span>
              <div className="f-track">
                <div className={'f-bar ' + (i === 0 ? 'hatch' : i === data.funnel.length - 1 ? 'lime' : '')} style={{ width: w + '%', transitionDelay: i * 80 + 'ms', opacity: i === 0 ? 1 : 1 - i * 0.04 }} />
                {i > 0 && <span className="f-tip" style={{ '--x': Math.max(p, 8) / 2 + '%' }}>{((f.value / (data.funnel[i - 1].value || 1)) * 100).toFixed(1)}% from {data.funnel[i - 1].label.toLowerCase()}</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function useSort(rows, initial) {
  const [sort, setSort] = useState(initial);
  const sorted = useMemo(() => {
    if (!sort) return rows;
    const [k, dir] = sort;
    return rows.slice().sort((a, b) => (a[k] > b[k] ? 1 : a[k] < b[k] ? -1 : 0) * dir);
  }, [rows, sort]);
  const th = (k, label, cls = '') => (
    <th className={cls} onClick={() => setSort(sort && sort[0] === k ? [k, -sort[1]] : [k, -1])} aria-sort={sort && sort[0] === k ? (sort[1] > 0 ? 'ascending' : 'descending') : 'none'}>
      {label}{sort && sort[0] === k && <span className="sort-ind">{sort[1] > 0 ? '▲' : '▼'}</span>}
    </th>
  );
  return [sorted, th];
}

function SourcesTable({ data }) {
  const [rows, th] = useSort(data.sources, ['qualified', -1]);
  return (
    <div className="card">
      <div className="card-h"><div><h3>Sources</h3><p>Leads, qualified leads and CPL by campaign</p></div></div>
      <div className="tbl-wrap" style={{ marginTop: 6 }}>
        <table className="tbl">
          <thead><tr>{th('name', 'Source')}{th('leads', 'Leads', 'r')}{th('qualified', 'Qualified', 'r')}{th('cpl', 'CPL', 'r hide-m')}{th('status', 'Status', 'hide-m')}</tr></thead>
          <tbody>
            {rows.map((s) => (
              <tr key={s.id} className={s.included ? '' : 'dim'}>
                <td><div className="src-cell"><span className={'src-ico ' + s.ch}>{srcAbbr[s.ch]}</span>{s.name}</div></td>
                <td className="r tnum"><CountUp value={s.leads} /></td>
                <td className="r tnum"><CountUp value={s.qualified} /></td>
                <td className="r tnum hide-m">{s.cpc ? E.fmt.money(s.cpl) : '—'}</td>
                <td className="hide-m"><StatusChip status={s.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Variance({ data }) {
  const v = data.variance;
  if (!v) return <div className="card"><div className="card-h"><div><h3>Source variance</h3><p>Select at least one paid source to compare CPL.</p></div></div></div>;
  const maxDev = Math.max(...v.rows.map((r) => Math.abs(r.cpl - v.avg))) || 1;
  return (
    <div className="card">
      <div className="card-h"><div><h3>Source variance</h3><p>CPL vs. average across paid sources</p></div></div>
      <div className="var-big"><b className="tnum">+<CountUp value={v.diff} format={(x) => '$' + x.toFixed(2)} /></b><span>Best vs worst CPL</span></div>
      <div className="var-rows">
        {v.rows.map((r) => {
          const dev = r.cpl - v.avg, w = (Math.abs(dev) / maxDev) * 50;
          return (
            <div className="var-row" key={r.id}>
              <span className="nm">{r.name}</span>
              <div className="var-track"><span className={'var-bar ' + (dev <= 0 ? 'good' : 'bad')} style={dev <= 0 ? { right: '50%', width: w + '%' } : { left: '50%', width: w + '%' }} /></div>
              <span className="v tnum">{E.fmt.money(r.cpl)}</span>
            </div>
          );
        })}
      </div>
      <div className="var-legend"><span>← Cheaper than avg ({E.fmt.money(v.avg)})</span><span>More expensive →</span></div>
    </div>
  );
}

function RecentActivity({ ws, tick, data }) {
  const all = E.leads(ws);
  const rows = all.filter((l) => data.srcIds.includes(l.src)).slice(0, 8);
  const seen = useRef(new Set());
  const [menu, setMenu] = useState(null);
  return (
    <div className="card" style={{ marginTop: 14 }}>
      <div className="card-h"><div><h3>Recent activity</h3><p>New WhatsApp leads, attributed in real time</p></div>
        <span className="live-dot"><i />Live</span></div>
      <div className="tbl-wrap" style={{ marginTop: 6 }}>
        <table className="tbl">
          <thead><tr><th>Lead</th><th className="hide-m">Campaign</th><th>Status</th><th className="hide-m">Time</th><th className="r hide-m">CPL</th><th style={{ width: 40 }}></th></tr></thead>
          <tbody>
            {rows.map((l) => {
              const isNew = l.live && !seen.current.has(l.id);
              seen.current.add(l.id);
              return (
                <tr key={l.id} className={isNew ? 'new' : ''}>
                  <td><div className="lead-cell"><b>{l.name}</b><span>{l.phone}</span></div></td>
                  <td className="hide-m"><div className="src-cell"><span className={'src-ico ' + l.ch}>{srcAbbr[l.ch]}</span>{l.campaign}</div></td>
                  <td><StatusChip status={l.status} flash={l.flash} /></td>
                  <td className="hide-m" style={{ color: 'var(--text-2)' }}>{E.fmt.ago(l.at)}</td>
                  <td className="r tnum hide-m">{l.cpl ? E.fmt.money(l.cpl) : '—'}</td>
                  <td>
                    <Popover width={200} open={menu === l.id} onOpenChange={(o) => setMenu(o ? l.id : null)} trigger={({ toggle }) => (
                      <button className="icon-btn" onClick={toggle} aria-label="Row actions"><I n="more" s={16} /></button>
                    )}>
                      <button className="pop-item" onClick={() => setMenu(null)}><I n="users" s={14} />View lead</button>
                      <button className="pop-item" onClick={() => setMenu(null)}><I n="send" s={14} />Send to Google Ads</button>
                      <button className="pop-item" onClick={() => setMenu(null)}><I n="chat" s={14} />Open conversation</button>
                      <button className="pop-item danger" onClick={() => setMenu(null)}><I n="trash" s={14} />Delete lead</button>
                    </Popover>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function exportCSV(data, ws) {
  const head = 'source,leads,qualified,spend,cpl,status\n';
  const body = data.sources.map((s) => [s.name, s.leads, s.qualified, s.spend.toFixed(2), s.cpl.toFixed(2), s.status].join(',')).join('\n');
  const blob = new Blob([head + body], { type: 'text/csv' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `wact-${ws}-${data.range}.csv`; a.click();
}

function DashboardPage({ ws, range, setRange, selected, setSelected, data, tick, bump, embedded }) {
  const [custom, setCustom] = useState(45);
  const [customOpen, setCustomOpen] = useState(false);
  const drawKey = ws + range + selected.join();
  return (
    <>
      <div className="page-head">
        <div><h1>Dashboard</h1><p>Real-time view of qualified leads, CPL and source performance</p></div>
        <div className="head-ctrls">
          {!embedded && <span className="live-dot"><i />Live</span>}
          <Popover width={240} open={customOpen} onOpenChange={setCustomOpen} trigger={() => (
            <Segmented label="Date range" options={RANGE_OPTS} value={typeof range === 'number' ? 'custom' : range}
              onChange={(v) => { if (v === 'custom') { setCustomOpen(true); } else setRange(v); }} />
          )}>
            <div className="range-pop">
              <label><span>Last</span><b>{custom} days</b></label>
              <input type="range" min="2" max="365" value={custom} onChange={(e) => setCustom(+e.target.value)} />
              <button className="pill pill-dark" onClick={() => { setRange(custom); setCustomOpen(false); }}>Apply range</button>
            </div>
          </Popover>
          <SourceFilter selected={selected} setSelected={setSelected} />
          <button className="btn-o" onClick={() => exportCSV(data, ws)}><I n="download" s={13} />Export</button>
        </div>
      </div>
      <div className="kpis">
        <KpiCard icon="users" value={data.kpi.qualified.value} label="Qualified Leads" delta={data.kpi.qualified.delta} series={data.kpi.qualified.series} drawKey={drawKey} bump={bump} />
        <KpiCard icon="dollar" value={data.kpi.cpl.value} label="CPL (Cost per Lead)" delta={data.kpi.cpl.delta} series={data.kpi.cpl.series} invert format={(v) => '$' + v.toFixed(2)} drawKey={drawKey} />
        <KpiCard icon="star" value={data.kpi.quality.value} label="Lead Quality Score" delta={data.kpi.quality.delta} series={data.kpi.quality.series} format={(v) => v.toFixed(1) + '%'} drawKey={drawKey} />
      </div>
      <Funnel data={data} selected={selected} setSelected={setSelected} />
      {!embedded && (
        <>
          <div className="row2">
            <SourcesTable data={data} />
            <Variance data={data} />
          </div>
          <RecentActivity ws={ws} tick={tick} data={data} />
        </>
      )}
    </>
  );
}

function ComingSoon({ item }) {
  return (
    <div className="empty">
      <div>
        <div className="eico"><I n={item.icon} s={24} /></div>
        <h2>{item.label}</h2>
        <p>This screen is scheduled for Phase 2. The shell, navigation and data engine are already wired, so it will plug straight in.</p>
        <span className="st st-mute"><i />Phase 2</span>
      </div>
    </div>
  );
}

/* ---------------- Toasts ---------------- */
function Toasts({ items }) {
  return (
    <div className="toasts" aria-live="polite">
      {items.map((t) => (
        <div className={'toast ' + (t.out ? 'out' : '')} key={t.id}>
          <span className="ti" dangerouslySetInnerHTML={{ __html: window.WBubble('#fff') }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', gap: 8 }}><b>WhatsApp Lead</b><time>{t.time}</time></div>
            <p>{t.msg}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ---------------- App ---------------- */
function WactDashboard({ embedded = false, liveEvery = 7000, defaultPage = 'dashboard' }) {
  const persist = !embedded;
  const ls = (k, d) => { try { const v = localStorage.getItem('wact.' + k); return v ? JSON.parse(v) : d; } catch { return d; } };
  const [page, setPage] = useState(persist ? ls('page', defaultPage) : defaultPage);
  const [ws, setWs] = useState(persist ? ls('ws', 'ecom') : 'ecom');
  const [range, setRange] = useState(persist ? ls('range', '30d') : '30d');
  const [selected, setSelected] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [tick, setTick] = useState(0);
  const [bump, setBump] = useState(0);
  const [toasts, setToasts] = useState([]);
  const [liveCount, setLiveCount] = useState(0);
  const [sheet, setSheet] = useState(false);

  useEffect(() => { if (persist) { localStorage.setItem('wact.page', JSON.stringify(page)); localStorage.setItem('wact.ws', JSON.stringify(ws)); localStorage.setItem('wact.range', JSON.stringify(range)); } }, [page, ws, range]);

  useEffect(() => {
    E.setLiveWs(ws);
    if (!window.__wactLive) { window.__wactLive = true; E.startLive(ws, liveEvery); }
    const off = E.subscribe((ev) => {
      if (ev.ws !== ws) return;
      setTick((t) => t + 1);
      if (ev.type === 'lead') {
        setLiveCount((c) => c + 1);
        const id = ev.lead.id;
        setToasts((ts) => [{ id, msg: ev.lead.msg, time: new Date().toTimeString().slice(0, 5) }, ...ts].slice(0, 2));
        setTimeout(() => setToasts((ts) => ts.map((t) => (t.id === id ? { ...t, out: true } : t))), 4200);
        setTimeout(() => setToasts((ts) => ts.filter((t) => t.id !== id)), 4600);
      }
      if (ev.type === 'update' && ev.lead.status === 'Verified') setBump(Date.now());
    });
    return off;
  }, [ws]);

  const data = useMemo(() => E.compute(ws, range, selected), [ws, range, selected, tick]);
  const item = NAV.flatMap((g) => g.items).find((i) => i.id === page) || NAV[0].items[0];
  const changeWs = (id) => { setWs(id); setSelected([]); setLiveCount(0); };
  const bnav = [NAV[0].items[0], NAV[0].items[1], NAV[0].items[3], NAV[1].items[0]];

  return (
    <div className={'wact-app ' + (embedded ? 'embedded' : '')}>
      <div className={'shell ' + (collapsed ? 'collapsed' : '')}>
        <Sidebar page={page} setPage={setPage} ws={ws} setWs={changeWs} collapsed={collapsed} setCollapsed={setCollapsed} data={data} liveCount={liveCount} />
        <main className="main" data-screen-label={'App · ' + item.label}>
          <div className="mtop">
            <Logo size={20} />
            <WorkspaceSwitcher ws={ws} setWs={changeWs} />
          </div>
          {page === 'dashboard'
            ? <DashboardPage ws={ws} range={range} setRange={setRange} selected={selected} setSelected={setSelected} data={data} tick={tick} bump={bump} embedded={embedded} />
            : <ComingSoon item={item} />}
        </main>
      </div>
      {!embedded && (
        <>
          <nav className="bnav" aria-label="Mobile">
            {bnav.map((b) => <button key={b.id} className={page === b.id ? 'on' : ''} onClick={() => setPage(b.id)}><I n={b.icon} s={18} />{b.label}</button>)}
            <button onClick={() => setSheet(true)}><I n="menu" s={18} />More</button>
          </nav>
          <div className={'sheet-bg ' + (sheet ? 'open' : '')} onClick={() => setSheet(false)} />
          <div className={'sheet ' + (sheet ? 'open' : '')} role="dialog" aria-label="Navigation">
            <div className="grab" />
            {NAV.map((g) => (
              <div key={g.group} style={{ marginBottom: 8 }}>
                <div className="pop-head">{g.group}</div>
                {g.items.map((it) => <button key={it.id} className={'nav-item ' + (page === it.id ? 'on' : '')} onClick={() => { setPage(it.id); setSheet(false); }}><I n={it.icon} s={16} />{it.label}</button>)}
              </div>
            ))}
          </div>
        </>
      )}
      <Toasts items={toasts} />
    </div>
  );
}

Object.assign(window, { WactDashboard });
