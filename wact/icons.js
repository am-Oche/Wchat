/* WAct icon set — original, 24px grid, 2px stroke, square caps, mitred joins. */
(function(){
  const P = {
    // Brand set (from identity board)
    chat:'M11 18h1c5 0 9-3.1 9-7s-4-7-9-7-9 3.1-9 7c0 2.8 2 5.2 5 6.3V21',
    bell:'M6 17v-6a6 6 0 0 1 12 0v6M4 17h16M10 21h4',
    route:'<circle cx="6" cy="6" r="2.6"/><circle cx="13" cy="18" r="2.6"/><path d="M8 8.2l3.8 7.2M14 3h3v3h3v4"/>',
    chart:'M4 3v13a4 4 0 0 0 4 4h13M9 15h3.5l4-8H20',
    checksq:'M4 10V4h16v16h-7M3 15l3.5 3.5L12 13',
    mention:'M3 13h8v8M3 13a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v1h-7v-4M11 9V4h4v2',
    user:'<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    flag:'M5 21V4h9v3h5v9h-7v-3H5',
    folder:'M3 5h7l2 3h9v11H3z',
    arrowc:'M3 8h6v6h11M16 10l4 4-4 4',
    // UI set
    grid:'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v6h-6z',
    users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a5.5 5.5 0 0 1 3.5 6"/>',
    settings:'<circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/><path d="M4 7h9M17 7h3M4 17h3M11 17h9"/>',
    plug:'M9 3v5M15 3v5M6 8h12v4a6 6 0 0 1-12 0zM12 18v3',
    link:'M10 14l4-4M8.5 11.5l-2 2a3.5 3.5 0 0 0 5 5l2-2M15.5 12.5l2-2a3.5 3.5 0 0 0-5-5l-2 2',
    tag:'<path d="M3 3h8l10 10-8 8L3 11z"/><path d="M7.5 7.5h.01"/>',
    bolt:'M13 2L5 14h6l-1 8 8-12h-6z',
    updown:'M8 9l4-4 4 4M8 15l4 4 4-4',
    sidebar:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M9 4v16"/>',
    chevDown:'M6 9l6 6 6-6',
    chevR:'M9 6l6 6-6 6',
    x:'M6 6l12 12M18 6L6 18',
    plus:'M12 5v14M5 12h14',
    download:'M12 4v11M7 10l5 5 5-5M4 20h16',
    dollar:'<circle cx="12" cy="12" r="9"/><path d="M15 9h-4a1.5 1.5 0 0 0 0 3h2a1.5 1.5 0 0 1 0 3H9M12 7v2M12 15v2"/>',
    star:'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
    arrowUp:'M12 19V5M6 11l6-6 6 6',
    arrowDown:'M12 5v14M6 13l6 6 6-6',
    arrowR:'M5 12h14M13 6l6 6-6 6',
    more:'M5 12h.01M12 12h.01M19 12h.01',
    check:'M5 12l5 5 9-10',
    timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',
    calendar:'<rect x="3" y="5" width="18" height="16"/><path d="M3 10h18M8 3v4M16 3v4"/>',
    card:'<rect x="2" y="5" width="20" height="14"/><path d="M2 10h20M6 15h4"/>',
    globe:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18"/>',
    cursor:'M5 3l14 7-6 2-2 6z',
    send:'M3 11l18-8-8 18-2-8z',
    trash:'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
    search:'<circle cx="11" cy="11" r="6"/><path d="M16 16l4 4"/>',
    menu:'M4 7h16M4 12h16M4 17h16',
    external:'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
    shield:'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
    ad:'M3 10v4h4l8 5V5L7 10zM18 9a4 4 0 0 1 0 6'
  };
  function WIcon(name, size, cls){
    size = size || 18;
    const d = P[name] || P.grid;
    const inner = d.charAt(0) === '<' ? d : '<path d="'+d+'"/>';
    return '<svg class="wi '+(cls||'')+'" width="'+size+'" height="'+size+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">'+inner+'</svg>';
  }
  /* Logo: speech-bubble ring with notch + wordmark */
  function WBubble(stroke){
    return '<svg viewBox="0 0 44 36" fill="none" aria-hidden="true"><path d="M15.5 33.5V28.3C8.2 26.8 3.5 22.2 3.5 16.3 3.5 9 11.6 3.5 22 3.5S40.5 9 40.5 16.3 32.4 29 22 29H18" stroke="'+(stroke||'currentColor')+'" stroke-width="5.2" stroke-linecap="square"/></svg>';
  }
  function WLogo(opts){
    opts = opts || {};
    const name = (window.WACT_BRAND && window.WACT_BRAND.name) || 'WAct';
    return '<span class="wlogo" style="'+(opts.color?'color:'+opts.color+';':'')+(opts.size?'font-size:'+opts.size+'px':'')+'">'+WBubble()+'<b>'+name+'</b></span>';
  }
  Object.assign(window, { WIcon, WLogo, WBubble, WICON_NAMES:Object.keys(P) });
})();
