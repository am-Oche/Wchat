/* WAct marketing home — Phase 1 (header, hero, problem, scroll story, CTA, footer) */
const NAV_LINKS = [
  { label: 'How it Works', href: '#how' }, { label: 'Use Cases', href: '#use-cases' },
  { label: 'Integrations', href: '#integrations' }, { label: 'Blog', href: '#blog' }, { label: 'Contact Us', href: '#contact' },
];

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(() => setY(window.scrollY)); };
    window.addEventListener('scroll', on, { passive: true }); on();
    return () => window.removeEventListener('scroll', on);
  }, []);
  return y;
}

function goApp(e) {
  e && e.preventDefault();
  const w = document.querySelector('.wipe');
  w.classList.remove('go'); void w.offsetWidth; w.classList.add('go');
  setTimeout(() => { location.href = 'WAct Dashboard.html'; }, 480);
}

function Header() {
  const y = useScrollY();
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className={'hdr ' + (y > 40 ? 'cond' : '')}>
        <div className="hdr-in">
          <a href="#top" aria-label="WAct home" style={{ textDecoration: 'none' }}><Logo size={22} /></a>
          <nav aria-label="Main">{NAV_LINKS.map((l) => <a key={l.label} href={l.href}>{l.label}</a>)}</nav>
          <div className="hdr-ctas">
            <a className="pill pill-light" href="WAct Dashboard.html" onClick={goApp}>Login</a>
            <a className="pill pill-dark" href="WAct Dashboard.html" onClick={goApp}>Start My Free Trial</a>
          </div>
          <button className="pill pill-light menu-btn" onClick={() => setOpen(!open)} aria-expanded={open}>{open ? 'Close' : 'Menu'}</button>
        </div>
      </header>
      <div className={'mnav ' + (open ? 'open' : '')} aria-hidden={!open}>
        {NAV_LINKS.map((l) => <a key={l.label} href={l.href} onClick={() => setOpen(false)}>{l.label}</a>)}
        <a className="pill pill-dark" href="WAct Dashboard.html" onClick={goApp}>Start My Free Trial</a>
      </div>
    </>
  );
}

/* Live dashboard preview scaled to fit the hero stage */
function HeroPreview() {
  const ref = useRef(null);
  const [s, setS] = useState(0.8);
  useLayoutEffect(() => {
    const ro = new ResizeObserver(([e]) => setS(e.contentRect.width / 1240));
    ro.observe(ref.current);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="preview" ref={ref}>
      <div className="preview-scale" style={{ transform: `scale(${s})` }}>
        <WactDashboard embedded liveEvery={6000} />
      </div>
    </div>
  );
}

/* Phone-sized hero card (mobile only) */
function HeroPhoneCard() {
  return (
    <div className="hero-phone-card">
      <div className="glass">
        <div className="msg">
          <span className="av" />
          <div style={{ flex: 1 }}><div style={{ display: 'flex', justifyContent: 'space-between' }}><b>Ali Salman Zia</b><small style={{ font: '400 10px var(--sans)', color: 'var(--text-3)' }}>10:53</small></div>
            <p>Hi, I'm interested and would like to check availability.</p></div>
        </div>
      </div>
      <div className="glass" style={{ marginTop: 10 }}>
        <div className="kv">
          <div>GCLID <code>CjwKCAjwsZPDBhBW…</code></div>
          <div>UTM Source <code>Google</code></div>
          <div>UTM Term <code>Kitchen Renovation Du…</code></div>
          <div>URL <code>https://kitchen.renovatio…</code></div>
        </div>
      </div>
    </div>
  );
}

function Hero() {
  const y = useScrollY();
  return (
    <section className="hero" id="top" data-screen-label="Home · Hero">
      <div className="tex" style={{ transform: `translateY(${y * 0.15}px)` }} />
      <div className="hero-copy">
        <h1>
          <span className="mask"><span>Understand Which Ads Drive</span></span>
          <span className="mask"><span className="sage">Real WhatsApp Chats</span></span>
        </h1>
        <p className="hero-sub fade-up">WAct connects directly to your WhatsApp API, allowing you to attribute your WhatsApp chats to your Paid Ads campaigns.</p>
        <div className="trust fade-up">
          <span><I n="timer" s={15} />Set up in 10 minutes</span>
          <span><I n="calendar" s={15} />Free 14 day trial</span>
          <span><I n="card" s={15} />No credit card needed</span>
        </div>
        <div className="hero-cta fade-up"><a className="pill pill-lime" href="WAct Dashboard.html" onClick={goApp}>Start 14 day free trial</a></div>
      </div>
      <div className="hero-stage">
        <div className="layer l1" /><div className="layer l2" />
        <HeroPreview />
      </div>
      <HeroPhoneCard />
    </section>
  );
}

/* ---------- Problem section ---------- */
function UtmCard() {
  const [ref, inView] = useInView({ threshold: 0.35 });
  const rows = [
    { k: 'UTM Source', v: 'Google', i: 'globe' },
    { k: 'GCLID', v: 'CjwKCAjwsZPDBhBW…', i: 'cursor', hl: true },
    { k: 'UTM Term', v: 'Kitchen Renovation Du…', i: 'tag' },
    { k: 'URL', v: 'https://kitchen.renovatio…', i: 'link' },
  ];
  return (
    <div className={'pcard rv ' + (inView ? 'in' : '')} ref={ref}>
      <div className="vis">
        <div className="utm">
          {rows.map((r, i) => (
            <div key={r.k} className={'utm-row ' + (r.hl ? 'hl' : '')} style={{ transitionDelay: 250 + i * 160 + 'ms' }}>
              <I n={r.i} s={13} /><span className="k">{r.k}</span><span className="v">{r.v}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="cap"><h3>Track every ad click<br />straight to a WhatsApp chat</h3><p>Capture ad IDs and UTM data the moment a chat starts, linking every WhatsApp lead to the campaign that drove it.</p></div>
    </div>
  );
}

function CplCard() {
  const [ref, inView] = useInView({ threshold: 0.35 });
  return (
    <div className={'pcard rv ' + (inView ? 'in' : '')} ref={ref} style={{ transitionDelay: '.08s' }}>
      <span className="example">Example</span>
      <div className="vis">
        <div className="cpl">
          <div className="bar b1"><small>Without data</small><b>$12<em>CPL</em></b></div>
          <div className="bar b2"><small>With real chats</small><b>$6<em>CPL</em></b></div>
        </div>
      </div>
      <div className="cap"><h3>Lower your cost<br />per qualified WhatsApp lead</h3><p>Optimising for real WhatsApp leads cuts wasted spend and lowers cost per qualified conversation, fast.</p></div>
    </div>
  );
}

function LoopCard() {
  const [ref, inView] = useInView({ threshold: 0.35 });
  const loop = 'M150 22 H240 A40 40 0 0 1 280 62 V128 A40 40 0 0 1 240 168 H60 A40 40 0 0 1 20 128 V62 A40 40 0 0 1 60 22 Z';
  return (
    <div className={'pcard sage rv ' + (inView ? 'in' : '')} ref={ref} style={{ transitionDelay: '.16s' }}>
      <div className="vis">
        <div className="loop">
          <svg viewBox="0 0 300 190" aria-hidden="true">
            <path id="wloop" d={loop} fill="none" stroke="rgba(255,255,255,.75)" strokeWidth="7" strokeLinecap="round" />
            <circle r="5.5" fill="#C3F186" stroke="#fff" strokeWidth="2">
              <animateMotion dur="5s" repeatCount="indefinite" rotate="auto"><mpath href="#wloop" /></animateMotion>
            </circle>
            <circle r="4" fill="#fff" opacity=".8">
              <animateMotion dur="5s" begin="-2.5s" repeatCount="indefinite"><mpath href="#wloop" /></animateMotion>
            </circle>
          </svg>
          <span className="node w n1" style={{ left: '50%', top: '11.6%' }}><span style={{ display: 'inline-flex', width: 15 }} dangerouslySetInnerHTML={{ __html: window.WBubble() }} />WAct</span>
          <span className="node n2" style={{ left: '6.7%', top: '50%' }}><I n="chat" s={13} />WhatsApp</span>
          <span className="node n3" style={{ left: '93.3%', top: '50%' }}><I n="ad" s={13} />Google Ads</span>
        </div>
      </div>
      <div className="cap"><h3>Send accurate conversion<br />data back to your ads</h3><p>Send WhatsApp conversion events back to your ad account so bidding algorithms learn from real outcomes.</p></div>
    </div>
  );
}

function Problem() {
  const [ref, inView] = useInView({ threshold: 0.4 });
  return (
    <section className="sec" id="how" data-screen-label="Home · Problem">
      <div className="wrap">
        <div className={'sec-h rv ' + (inView ? 'in' : '')} ref={ref}>
          <h2>Stop <span className="sage">wasting ad spend</span> on clicks that never turn into WhatsApp chats</h2>
          <p>If you're only tracking WhatsApp button clicks, instead of actual chats, your ads will keep optimising for the wrong customers.</p>
        </div>
        <div className="cards3"><UtmCard /><CplCard /><LoopCard /></div>
      </div>
    </section>
  );
}

/* ---------- Scroll-pinned story ---------- */
const STORY = [
  { h: <>Automatically captures <span className="sage">attribution data</span> from WhatsApp leads</>, p: 'Every chat arrives with its GCLID, UTM tags and landing page attached. No forms, no manual tagging, no guessing which ad did the work.' },
  { h: <>Stop wasting ad spend on <span className="sage">non-converting clicks</span></>, p: 'See which campaigns produce real conversations and which only produce taps on a button, then move budget to the ones that work.' },
  { h: <>Track the <span className="sage">four numbers</span> that matter, in real time</>, p: 'Qualified leads, cost per lead, lead quality and conversions sent to Ads. One screen that tells you if leads are coming in at an acceptable cost, and if anything is broken.' },
];

function PhoneStates({ step }) {
  const data = useMemo(() => window.WactEngine.compute('ecom', '30d', []), []);
  return (
    <div className="phone" aria-hidden="true">
      <div className="phone-scr">
        <div className="sb"><span>9:41</span><span style={{ letterSpacing: 2 }}>•••</span></div>
        {/* 1 — attribution capture */}
        <div className={'pstate ' + (step === 0 ? 'on' : '')}>
          <div className="ptop"><Logo size={16} /><span className="menu">Menu</span></div>
          <h4>Every chat, matched to the ad that started it.</h4>
          <div className="stack">
            <div className="glass"><div className="msg"><span className="av" /><div style={{ flex: 1 }}><b>Ali Salman Zia</b><p>Hi, I'm interested and would like to check availability.</p></div></div></div>
            <div className="glass"><div className="kv">
              <div>GCLID <code>CjwKCAjwsZPDBhBW…</code></div>
              <div>UTM Source <code>Google</code></div>
              <div>UTM Term <code>Kitchen Renovation Du…</code></div>
              <div>URL <code>https://kitchen.renovatio…</code></div>
            </div></div>
          </div>
        </div>
        {/* 2 — waste */}
        <div className={'pstate ' + (step === 1 ? 'on' : '')}>
          <div className="ptop"><Logo size={16} /><span className="menu">Menu</span></div>
          <h4>Clicks vs. chats, per campaign.</h4>
          <div className="stack">
            <div className="glass">
              <div style={{ font: '500 11px var(--sans)', color: 'var(--text-2)', marginBottom: 10 }}>Clicks <span style={{ color: 'var(--text-3)' }}>vs</span> <span style={{ background: 'var(--lime)', padding: '2px 6px', borderRadius: 6, color: 'var(--ink)' }}>real chats</span></div>
              <div className="waste">
                {[80, 30, 92, 18, 64, 40].map((h, i) => <i key={i} className={i % 2 ? 'k' : ''} style={{ height: h + '%', transitionDelay: i * 70 + 'ms' }} />)}
              </div>
            </div>
            <div className="mini-row">
              <div className="glass"><small>Wasted clicks</small><b>1,640</b></div>
              <div className="glass"><small>Budget to move</small><b>$410</b></div>
            </div>
          </div>
        </div>
        {/* 3 — four numbers */}
        <div className={'pstate ' + (step === 2 ? 'on' : '')}>
          <div className="ptop"><Logo size={16} /><span className="menu">Menu</span></div>
          <h4>The four numbers that matter.</h4>
          <div className="stack">
            <div className="glass">
              <div className="mini-kpi">
                <div><b>{step === 2 ? <CountUp value={data.kpi.qualified.value} /> : '0'}</b><small>Qualified Leads</small></div>
                <div style={{ display: 'grid', justifyItems: 'end', gap: 4 }}><DeltaChip value={data.kpi.qualified.delta} />{step === 2 && <Sparkline data={data.kpi.qualified.series} w={110} h={50} />}</div>
              </div>
            </div>
            <div className="mini-row">
              <div className="glass"><small>CPL</small><b>{window.WactEngine.fmt.money(data.kpi.cpl.value)}</b></div>
              <div className="glass"><small>Quality score</small><b>{data.kpi.quality.value.toFixed(1)}%</b></div>
            </div>
            <div className="glass" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><small style={{ font: '400 11px var(--sans)', color: 'var(--text-2)' }}>Sent to Google Ads</small><b style={{ font: '500 18px var(--sans)' }}>{data.funnel[4].value}</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Story() {
  const track = useRef(null);
  const [prog, setProg] = useState(0);
  useEffect(() => {
    let raf = 0;
    const on = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const el = track.current; if (!el) return;
        const r = el.getBoundingClientRect();
        const total = el.offsetHeight - window.innerHeight;
        setProg(Math.min(1, Math.max(0, -r.top / total)));
      });
    };
    window.addEventListener('scroll', on, { passive: true }); on();
    return () => window.removeEventListener('scroll', on);
  }, []);
  const step = Math.min(2, Math.floor(prog * 3));
  const jump = (i) => {
    const el = track.current; const total = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: el.offsetTop + total * ((i + 0.4) / 3), behavior: 'smooth' });
  };
  return (
    <section className="story" data-screen-label="Home · Story">
      <div className="story-track" ref={track}>
        <div className="story-pin">
          <div className="wrap">
            <div className="story-grid story-desk">
              <div>
                <div className="story-steps">
                  <div className="story-ph" />
                  {STORY.map((s, i) => (
                    <div key={i} className={'story-step ' + (i === step ? 'on' : '')}>
                      <span className="story-num">0{i + 1} / 03</span>
                      <h2>{s.h}</h2><p>{s.p}</p>
                    </div>
                  ))}
                </div>
                <div className="story-prog">
                  {STORY.map((_, i) => {
                    const local = Math.min(1, Math.max(0, prog * 3 - i));
                    return <button key={i} onClick={() => jump(i)} aria-label={'Step ' + (i + 1)}><i style={{ transform: `scaleX(${local})` }} /></button>;
                  })}
                </div>
              </div>
              <PhoneStates step={step} />
            </div>
            <div className="story-mob">
              {STORY.map((s, i) => (
                <div className="mcard grid-tex" key={i}>
                  <span className="story-num" style={{ marginBottom: 10 }}>0{i + 1} / 03</span>
                  <h3>{s.h}</h3><p>{s.p}</p>
                  <div style={{ height: 420, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', left: '50%', top: 0, width: 320, marginLeft: -160, transform: 'scale(.72)', transformOrigin: 'top center' }}><PhoneStates step={i} /></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function CtaBand() {
  const [ref, inView] = useInView({ threshold: 0.3 });
  return (
    <section className={'cta-band rv ' + (inView ? 'in' : '')} ref={ref} id="contact" data-screen-label="Home · CTA">
      <span className="ring" dangerouslySetInnerHTML={{ __html: window.WBubble() }} />
      <h2>Know which ads<br />start real conversations.</h2>
      <p>Connect your WhatsApp number and Google Ads account in about ten minutes.</p>
      <a className="pill pill-dark" href="WAct Dashboard.html" onClick={goApp}>Start 14 day free trial</a>
    </section>
  );
}

function Footer() {
  return (
    <footer className="ftr">
      <div className="wrap ftr-in">
        <Logo size={20} />
        <nav aria-label="Footer">
          {['How it Works', 'Use Cases', 'Integrations', 'Pricing', 'Blog', 'Contact', 'Privacy', 'Terms', 'DPA'].map((l) => <a key={l} href="#">{l}</a>)}
        </nav>
        <small>© 2026 WAct. WAct works with the WhatsApp Business Platform and Google Ads; it is not affiliated with or endorsed by Meta or Google. Figures marked "Example" are illustrative.</small>
      </div>
    </footer>
  );
}

function Home() {
  return (
    <>
      <Header />
      <Hero />
      <Problem />
      <Story />
      <div id="use-cases" /><div id="integrations" /><div id="blog" />
      <CtaBand />
      <Footer />
      <div className="wipe" />
    </>
  );
}
Object.assign(window, { Home });
