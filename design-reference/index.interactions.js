// Interaction logic from the hi-fi canvas home page (DCLogic component). Port to vanilla JS or an Astro island.
// - hover: tile photo fades out to reveal the flat color; grain drops to 0.45
// - cursor trail: up to 7 grayscale stamps of the hovered tile photo follow the cursor, each 56px+ apart, fading and shrinking with age, alternating +/-3deg
// - dark mode toggle swaps --bg/--fg/--accent/--band

class Component extends DCLogic {
  constructor(props) { super(props); this.state = { hover: -1, dark: false, pts: [] }; }
  renderVals() {
    var P = '#FFFDF8', K = '#17120F', self = this;
    var items = [
      { title: 'The Design to Action Networks', href: 'dan.html', bg: '#B8B8FF', fg: K, span: 4, h: 360, img: 'url(../public/images/dan-site-visit-hill.jpg) center 45% / cover', stamp: '../public/images/dan-site-visit-hill.jpg', big: true },
      { title: 'World Design Policy Conference', href: 'conference.html', bg: '#730F1F', fg: P, span: 2, h: 360, img: 'url(../public/images/conf-audience.jpg) center / cover', stamp: '../public/images/conf-audience.jpg' },
      { title: 'San Diego Design Week', href: 'design-week.html', bg: '#888D2A', fg: K, span: 2, h: 280, img: 'url(../public/images/ddd-qualcomm-stage.jpg) center / cover', stamp: '../public/images/ddd-qualcomm-stage.jpg' },
      { title: 'Why learn design now', href: 'why-learn-design-now.html', bg: '#730F1F', fg: P, span: 2, h: 280, img: 'url(../public/images/edu-team-meeting.jpg) center / cover', stamp: '../public/images/edu-team-meeting.jpg' },
      { title: 'Housing Design-a-thon', href: '#', soon: true, bg: '#A8A29C', fg: K, span: 2, h: 280, img: 'url(../public/images/housing-designathon.jpg) center / cover', stamp: '../public/images/housing-designathon.jpg' }
    ];
    var d = this.state.dark;
    var grainSvg = "<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.42' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>";
    var grain = 'url("data:image/svg+xml,' + encodeURIComponent(grainSvg).replace(/%2523/g, '%23') + '")';
    return {
      rootStyle: '--bg: ' + (d ? K : P) + '; --fg: ' + (d ? P : K) + '; --accent: ' + (d ? '#B8B8FF' : '#730F1F') + '; --muted: ' + (d ? '#B5ADA5' : '#4F4A45') + '; --band: ' + (d ? '#730F1F' : K) + '; background: var(--bg); color: var(--fg); font-family: Instrument Serif, Georgia, serif; min-height: 100vh; transition: background-color 300ms, color 300ms;',
      darkPressed: d ? 'true' : 'false',
      themeLabel: d ? 'Dark' : 'Light',
      knobStyle: 'width: 10px; height: 10px; border-radius: 5px; border: 1px solid currentColor; background: ' + (d ? 'currentColor' : 'transparent') + ';',
      toggleTheme: function () { self.setState({ dark: !d }); },
      track: function (e) {
        var cur = items[self.state.hover];
        if (!cur || !cur.stamp) return;
        var r = e.currentTarget.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top, pts = self.state.pts, last = pts[pts.length - 1];
        if (!last || Math.abs(last.x - x) + Math.abs(last.y - y) > 56) self.setState({ pts: pts.concat([{ x: x, y: y, img: cur.stamp }]).slice(-7) });
      },
      out: function () { self.setState({ hover: -1, pts: [] }); },
      trail: this.state.pts.map(function (p, i, arr) {
        var age = arr.length - 1 - i, s = 1 - age * 0.12;
        return { style: 'position: absolute; left: 0; top: 0; width: 112px; height: 80px; pointer-events: none; z-index: 3; background: url(' + p.img + ') center / cover; filter: grayscale(1) contrast(1.1); mix-blend-mode: multiply; opacity: ' + Math.max(0, 1 - age * 0.15) + '; transform: translate(' + (p.x - 56) + 'px, ' + (p.y - 40) + 'px) scale(' + s + ') rotate(' + ((i % 2) ? 3 : -3) + 'deg);' };
      }),
      tiles: items.map(function (t, i) {
        var on = self.state.hover === i;
        return {
          title: t.title, meta: t.meta, href: t.href, disabled: t.soon ? 'true' : 'false',
          badgeStyle: 'font-family: DM Mono, monospace; font-size: 20px; font-weight: 500; letter-spacing: 0.06em; text-transform: uppercase; align-self: flex-start; padding: 8px 14px; background: #FFFDF8; color: #17120F; visibility: ' + (t.soon ? 'visible' : 'hidden') + ';',
          enter: function () { self.setState({ hover: i }); },
          leave: function () { self.setState({ hover: -1 }); },
          style: 'grid-column: span ' + t.span + '; min-height: ' + t.h + 'px; position: relative; overflow: hidden; padding: 24px; box-sizing: border-box; text-decoration: none; background: ' + t.bg + ';',
          metaStyle: 'font-family: DM Mono, monospace; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; align-self: flex-start; padding: 4px 8px; transition: background-color 240ms, color 240ms; background: ' + (on ? t.bg : K) + '; color: ' + (on ? t.fg : P) + ';',
          imgStyle: 'position: absolute; inset: 0; background: ' + t.img + '; filter: grayscale(1) contrast(1.15); mix-blend-mode: luminosity; opacity: ' + (on ? 0 : 1) + '; transition: opacity 300ms;',
          grainStyle: 'position: absolute; inset: 0; pointer-events: none; background: ' + grain + '; mix-blend-mode: overlay; opacity: ' + (on ? 0.45 : 0.75) + '; transition: opacity 300ms;',
          titleStyle: 'font-size: ' + (t.big ? 44 : 26) + 'px; line-height: 1.1; font-weight: 400; letter-spacing: -0.01em; max-width: 16ch; align-self: flex-start; padding: 4px 8px; transition: background-color 240ms, color 240ms; background: ' + t.bg + '; color: ' + t.fg + ';'
        };
      })
    };
  }
}
