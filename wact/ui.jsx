/* Shared WAct UI primitives */
const { useState, useEffect, useRef, useLayoutEffect, useMemo, useCallback } = React;

function I({ n, s = 18, className = '', style }) {
  return <span className={'wi-wrap ' + className} style={{ display: 'inline-flex', ...style }} dangerouslySetInnerHTML={{ __html: window.WIcon(n, s) }} />;
}
function Logo({ size = 22, color }) {
  return <span dangerouslySetInnerHTML={{ __html: window.WLogo({ size, color }) }} style={{ display: 'inline-flex' }} />;
}

/* Count-up that tweens from last value to the new one */
function CountUp({ value, format = (v) => Math.round(v).toLocaleString('en-US'), duration = 900 }) {
  const [shown, setShown] = useState(0);
  const from = useRef(0);
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setShown(value); from.current = value; return; }
    const start = performance.now(), a = from.current, b = value;
    let raf;
    const step = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const e = 1 - Math.pow(1 - p, 3);
      setShown(a + (b - a) * e);
      if (p < 1) raf = requestAnimationFrame(step); else from.current = b;
    };
    raf = requestAnimationFrame(step);
    return () => { cancelAnimationFrame(raf); from.current = b; };
  }, [value]);
  return <span className="tnum">{format(shown)}</span>;
}

/* Sparkline with area fill, end dot, draw-in */
function Sparkline({ data, w = 120, h = 56, tone = 'pos', drawKey }) {
  const id = useMemo(() => 'sg' + Math.random().toString(36).slice(2, 8), []);
  if (!data || data.length < 2) return null;
  const min = Math.min(...data), max = Math.max(...data), rng = max - min || 1;
  const pts = data.map((v, i) => [(i / (data.length - 1)) * (w - 6) + 1, h - 6 - ((v - min) / rng) * (h - 14)]);
  // stepped-ish smooth: straight segments like the reference
  const d = pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
  const area = d + ` L${pts[pts.length - 1][0]} ${h} L${pts[0][0]} ${h} Z`;
  const col = tone === 'neg' ? '#D9877C' : '#8FA886';
  const last = pts[pts.length - 1];
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="spark" key={drawKey} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={col} stopOpacity=".28" />
          <stop offset="1" stopColor={col} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} className="spark-area" />
      <path d={d} fill="none" stroke={col} strokeWidth="1.6" pathLength="1" className="spark-line" />
      <circle cx={last[0]} cy={last[1]} r="3" fill="#fff" stroke={col} strokeWidth="1.6" className="spark-dot" />
    </svg>
  );
}

function DeltaChip({ value, invert = false }) {
  const good = invert ? value <= 0 : value >= 0;
  return (
    <span className={'delta ' + (good ? 'delta-pos' : 'delta-neg')}>
      <I n={value >= 0 ? 'arrowUp' : 'arrowDown'} s={10} />
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

/* Segmented control with sliding pill, ARIA tablist, arrow keys */
function Segmented({ options, value, onChange, size = 'sm', dark = true, label = 'Options', onCustom }) {
  const ref = useRef(null);
  const [pill, setPill] = useState({ x: 0, w: 0, ready: false });
  const idx = options.findIndex((o) => o.value === value);
  useLayoutEffect(() => {
    const el = ref.current?.querySelectorAll('[role=tab]')[idx];
    if (el) setPill({ x: el.offsetLeft, w: el.offsetWidth, ready: true });
  }, [idx, options.length]);
  useEffect(() => {
    const ro = new ResizeObserver(() => {
      const el = ref.current?.querySelectorAll('[role=tab]')[idx];
      if (el) setPill((p) => ({ ...p, x: el.offsetLeft, w: el.offsetWidth }));
    });
    ref.current && ro.observe(ref.current);
    return () => ro.disconnect();
  }, [idx]);
  const onKey = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    e.preventDefault();
    const n = (idx + (e.key === 'ArrowRight' ? 1 : -1) + options.length) % options.length;
    onChange(options[n].value);
    ref.current.querySelectorAll('[role=tab]')[n].focus();
  };
  return (
    <div className={'seg seg-' + size + (dark ? ' seg-dark' : ' seg-light')} role="tablist" aria-label={label} ref={ref} onKeyDown={onKey}>
      <span className="seg-pill" style={{ transform: `translateX(${pill.x}px)`, width: pill.w, opacity: pill.ready && idx >= 0 ? 1 : 0 }} />
      {options.map((o, i) => (
        <button key={o.value} role="tab" aria-selected={i === idx} tabIndex={i === idx ? 0 : -1}
          className={i === idx ? 'on' : ''} onClick={() => onChange(o.value)}>{o.label}</button>
      ))}
    </div>
  );
}

/* Popover / dropdown */
function Popover({ trigger, children, align = 'right', width = 240, open: openProp, onOpenChange }) {
  const [openS, setOpenS] = useState(false);
  const open = openProp ?? openS;
  const setOpen = (v) => { onOpenChange ? onOpenChange(v) : setOpenS(v); };
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const k = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', h); document.addEventListener('keydown', k);
    return () => { document.removeEventListener('mousedown', h); document.removeEventListener('keydown', k); };
  }, [open]);
  return (
    <div className="pop-wrap" ref={ref}>
      {trigger({ open, toggle: () => setOpen(!open) })}
      <div className={'pop ' + (open ? 'open' : '')} style={{ [align]: 0, width }} role="dialog">
        {typeof children === 'function' ? children({ close: () => setOpen(false) }) : children}
      </div>
    </div>
  );
}

function StatusChip({ status, flash }) {
  const map = { Verified: 'st-ok', Active: 'st-ok', Pending: 'st-wait', Paused: 'st-mute', Rejected: 'st-bad' };
  return <span className={'st ' + (map[status] || 'st-mute') + (flash ? ' st-flash' : '')} key={flash || status}><i />{status}</span>;
}

/* Reveal when in view (adds .in) */
function useInView(opts = { threshold: 0.3 }) {
  const ref = useRef(null);
  const [inView, set] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { set(true); io.disconnect(); } }, opts);
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

Object.assign(window, { I, Logo, CountUp, Sparkline, DeltaChip, Segmented, Popover, StatusChip, useInView });
