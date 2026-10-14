# Handoff: rebuild galeolivia.com from the approved hi-fi design

Olivia approved a new high-fidelity design (October 2026) in a design canvas. This folder now holds everything needed to rebuild the site in this Astro project and publish it to GitHub Pages at **galeolivia.com**.

**The design in `design-reference/` is the source of truth.** It replaces the earlier "Visual direction v3" (Fraunces, cobalt / marigold / pink, duotone script). Where this repo's current code disagrees with the reference, the reference wins.

## What's in this folder

| Path | What it is |
| --- | --- |
| `design-reference/*.html` | Static exports of the six approved pages. Inline styles are the spec: spacing, sizes, colors, copy. Open them in a browser. |
| `design-reference/screenshots/*.png` | Full-page renders at 1280px, plus the home page at 390px. |
| `design-reference/index.interactions.js` | The home page's interaction logic from the canvas (hover, cursor trail, dark mode). Port it; don't ship it as-is. |
| `public/images/*.jpg` | Every photo the new design uses, already web-sized (1800px long edge). Named by page: `dan-`, `conf-`, `sddw-`, `ddd-`, `edu-`, `about-`, `housing-`. |

Old images still in `public/images/` (`dpc-*.jpg`, `portrait.jpg`) are from v3 and no longer used. Delete them once the new pages build.

## Pages and routes

| Reference file | Route | Notes |
| --- | --- | --- |
| `index.html` | `/` | Home: name, positioning line, five project tiles, numbers band, contact footer |
| `dan.html` | `/work/design-to-action-networks/` | Longest page. Contains two inline SVG graphics (see below) |
| `conference.html` | `/work/world-design-policy-conference/` | 4x2 photo grid with alternating captions |
| `design-week.html` | `/work/san-diego-design-week/` | |
| `why-learn-design-now.html` | `/work/why-learn-design-now/` | |
| `about.html` | `/about/` | Links the resume PDF |

- **Nav:** "Olivia Gale" → `/`, "Work" → `/#work` (the tile grid), "About" → `/about/`, "Contact" → `#contact` on home.
- **Housing Design-a-thon tile:** shows "Coming soon" and links nowhere (`aria-disabled="true"`, not focusable as a link). No page yet.
- **Every project page** ends with a full-width "Next project" band. Cycle: DAN → Conference → Design Week → Why learn design now → DAN.
- **Archived:** the old "What I'm Learning" page is archived for later. Keep `src/content/pages/learning.md`, but don't route or link it.
- **Retired:** the old project files in `src/content/projects/` don't match the new site. Move them to `src/content/_archive/` rather than deleting them: `wdc-legacy-program`, `designing-in-action-white-paper`, `design-at-large-ai`, `beyond-boundaries-policy-conference`, `digital-design-day-ai-panel`, `junior-designer-program`, and `housing-design-a-thon` (keep that one handy for the coming-soon page).

## Content: keep it editable as Markdown

Olivia wants to edit copy on GitHub after launch, so don't hard-code the copy into templates.

- **Projects:** one Markdown file per project in `src/content/projects/`.
  - Frontmatter: `title`, `subtitle`, `slug`, `order`, `featured`, `tileColor`, `heroImage`, `heroAlt`, `heroCaption`, `heroPosition`, `role`, `partners`, `dates`, `methods`, `recognition` (DAN only), `howMightWe`, `next`.
  - Body: numbered `## ` sections, each with a heading and paragraphs.
  - Photo rows, stat tiles, pull quotes and cards can be shortcodes or MDX components. The goal is that Olivia can change a sentence or a caption without touching layout code.
- **Home:** `src/site.config.json` (positioning line, numbers band, email, LinkedIn, resume URL).
- **About:** `src/content/pages/about.md`.
- **Copy:** take it verbatim from the reference HTML. It has been through several editing passes.
- **Links:** keep every source link in the copy.
- **Editing guide:** update `README.md` so it describes the new editing model.

## Design system

### Color

| Token | Hex | Use |
| --- | --- | --- |
| `--paper` | `#FFFDF8` | Page background |
| `--ink` | `#17120F` | Text, dark header and numbers band |
| `--body` | `#2A2420` | Long-form paragraph text |
| `--muted` | `#4F4A45` | Captions, small labels |
| `--oxblood` | `#730F1F` | Accent: section numbers, stat numbers, pull quotes, links on hover, home "Gale" |
| `--olive` | `#888D2A` | How-might-we cards, SDDW and About headers, Design Week tile |
| `--lilac` | `#B8B8FF` | DAN tile and header, highlights, footer, Next band |
| `--stone` | `#A8A29C` | Housing "coming soon" tile only |
| `--warm` | `#F4EFE6` | Card backgrounds on the Conference page |

**Dark mode** (toggle on home, swapping CSS variables): bg `#17120F`, fg `#FFFDF8`, accent `#B8B8FF`, numbers band `#730F1F`. Respect `prefers-color-scheme` on first load and remember the choice in `localStorage`.

Check contrast for every text and background pair you use (WCAG AA). Rewrite `scripts/check-contrast.mjs` for this palette; the old cobalt and marigold pairing rules no longer apply.

### Type

- **Instrument Serif** (regular and italic): display and body.
- **DM Mono** (400, 500): labels, nav, captions, metadata.
- Load both from Google Fonts, or self-host for speed.
- Scale from the reference:
  - home name `clamp(72px, 13vw, 176px)`
  - page H1 `clamp(40px, 6vw, 76–80px)`
  - section H2 34px
  - body 19–20px / 1.65
  - captions 12px DM Mono
  - mono labels 12px uppercase, 0.08em tracking

### Layout

- Max width 1160px, side padding 32px (16px on phones).
- Sections use a two-column header: a 220px left column (number plus H2) and body text up to 720px wide on the right. This stacks on narrow screens.
- No borders on cards or tiles. Olivia removed them on purpose.

### Photo treatment (site-wide)

Every photo sits on a solid color with this treatment:

```html
<div class="photo" style="--tint:#B8B8FF">
  <img src="/images/dan-site-visit-hill.jpg" alt="…">
</div>
```
```css
.photo { position: relative; background: var(--tint); line-height: 0; isolation: isolate; }
.photo img { display: block; width: 100%; object-fit: cover; filter: grayscale(1) contrast(1.15); mix-blend-mode: luminosity; }
.photo::after { content: ""; position: absolute; inset: 0; pointer-events: none;
  background: url("data:image/svg+xml,…fractalNoise baseFrequency 0.42…"); mix-blend-mode: overlay; opacity: .75; }
```

- **Tints per page:**

  | Page | Tint |
  | --- | --- |
  | DAN | lilac |
  | Conference | oxblood |
  | SDDW | olive |
  | Education | lilac |
  | About | lilac |

- **Per-image crops** are set in the reference with `object-position` and heights. Keep them; several were tuned by hand. Examples: the SDDW 2024 key art anchors left (`0% 50%`), and the Diana photo shows the full 3:2 frame at 600px wide.
- **Photo rows** use a grid of `repeat(auto-fit, minmax(220–240px, 1fr))`. In multi-photo rows, captions alternate top and bottom, odd items first (`flex-direction: column-reverse`).
- **Every photo has a caption.** Home tiles and cards are the exception.

### Components to build

- **Project header** (colored band): eyebrow, H1, italic subtitle, and a `<dl>` with Role, Partners, Dates, Methods (and Recognition on DAN).
- **Hero photo** with caption.
- **Numbered section** (two-column header).
- **How-might-we card:**
  - olive background, mono "Guiding question" label
  - large italic "How might we" at `clamp(44px, 5vw, 60px)`
  - the question in white at 30px
- **Pull quote:** 6px oxblood left rule, 30px italic oxblood.
- **Stat tiles:** a large bold oxblood number with a label underneath.
- **Photo row** (2–4 up), with alternating captions.
- **Cards** on Conference ("Where the conversations went"): warm background, mono date, H3, short paragraph, no top border.
- **Next project band.**
- **Contact footer** (lilac): "Working on something public? *Let's talk.*" with Email, LinkedIn and Resume links.

### DAN page graphics (inline SVG, copy from `dan.html`)

1. **Flower model:**
   - six lilac petals with olive lead-pair dots and burgundy member dots
   - center label "WDC 2024 / Legacy / Committee / meets monthly"
   - dot-grid and grain background, legend underneath
2. **Dot-density map** of San Diego and Tijuana:
   - lilac project dots, olive leads, burgundy members
   - legend, plus a note that placement is approximate

Move both into components as-is. They're already accessible, with `role="img"` and descriptive labels.

## Home interactions (port `index.interactions.js`)

- **Tiles:**
  - six-column grid. DAN spans 4 columns at 360px tall, the Conference tile spans 2 at 360px, and the rest span 2 at 280px.
  - On phones (under 760px), stack to one column.
- **Hover/focus on a tile:** the photo fades out over 300ms to reveal the flat tile color, and grain drops from 0.75 to 0.45.
- **Cursor trail:**
  - While moving over the tile grid, up to 7 small grayscale stamps of the hovered tile's photo trail the cursor.
  - Each stamp is 112×80, placed 56px or more apart, with `mix-blend-mode: multiply`. Stamps fade and shrink with age and alternate ±3° rotation.
  - Turn the trail off for `prefers-reduced-motion` and on touch devices.
- **Dark mode toggle** in the nav, as a pill button with `aria-pressed`.

## Links and facts

- **Email:** ojgaledesigns@gmail.com
- **LinkedIn:** https://www.linkedin.com/in/oliviajgale
- **Resume (PDF on Google Drive):** https://drive.google.com/file/d/1722oxOGhjsyNumGE26PfF-IcE552Wh3X/view?usp=sharing
  - Linked from the About page as "Resume (PDF) ↗" and from the home footer as "Resume".
  - Open in a new tab with `rel="noopener"`.

## Writing and accessibility rules

- **No em dashes** anywhere in copy, alt text or metadata.
- **Keep alt text** from the reference. Add `alt=""` only to decorative layers.
- **Accessibility:**
  - one H1 per page and a logical heading order
  - visible focus states (2px outline)
  - links distinguishable without color alone
  - text contrast at AA
- **Meta for each page:**
  - `<title>` as "Page name · Olivia Gale"
  - a description of one or two sentences, drawn from the page subtitle
  - Open Graph image: the page's hero photo
- **Favicon:** a simple "OG" monogram in Instrument Serif, ink on paper.

## Domain and deploy

- Olivia owns **galeolivia.com** (Namecheap). She has set, or will set, these DNS records:
  - A records for `@` → 185.199.108.153, .109.153, .110.153, .111.153
  - CNAME for `www` → `ojgale.github.io`
- **Code changes for the domain:**
  - Set `site: 'https://galeolivia.com'` in `astro.config.mjs`.
  - Add `public/CNAME` containing `galeolivia.com`.
- **Repo:**
  - This folder is **not a git repo yet**. The GitHub repo is `ojgale/ojgale.github.io`, with a placeholder page live.
  - Initialize git here, connect to that remote, and confirm with Olivia before force-pushing over the placeholder.
- **Deploy:**
  - `.github/workflows/deploy.yml` already builds Astro to GitHub Pages; keep it.
  - Make sure Pages uses "GitHub Actions" as the source.
- **After the first deploy, tell Olivia to:**
  1. In GitHub, go to Settings → Pages → Custom domain, enter `galeolivia.com`, and save.
  2. When the DNS check passes, tick **Enforce HTTPS**.

## Before you call it done

1. `npm run build` passes, including the new contrast check.
2. Compare each page side by side with its screenshot at 1280px, then check 390px. Nothing overflows horizontally on phones.
3. All internal links work, and the Housing tile is not clickable.
4. Lighthouse accessibility is 95 or higher on every page; total image weight on the home page is reasonable (convert to WebP or AVIF with `astro:assets` if helpful).
5. Search the copy for "—" and for "[", which marked leftover placeholders. Neither should appear.
