# galeolivia.com

Olivia Gale's personal site, built with Astro from the approved hi-fi design (October 2026,
see `design-reference/`). It deploys to GitHub Pages at **galeolivia.com** whenever `main` changes.

## Editing copy (right on GitHub)

Open a file on GitHub, click the pencil, edit, and commit. The site rebuilds and is live in a minute or two.

| What | File |
| --- | --- |
| Home: positioning line, numbers band, "coming soon" tile, email, LinkedIn, resume link | `src/site.config.json` |
| A project page | `src/content/projects/<name>.mdx` |
| About | `src/content/pages/about.md` |

Writing rules: no em dashes, and every photo needs alt text and a caption.

### Project files

The block between the `---` lines holds the page's details:

- `title`, `subtitle` (italic line under the title), `eyebrow` (small label above it)
- `role`, `partners`, `dates`, `methods`, `recognition` (optional): the list in the header
- `heroImage`, `heroAlt`, `heroCaption`, `heroPosition`, `heroHeight`: the big photo under the header
- `howMightWe`: the guiding question
- `tagline`: the italic phrase shown in the "Next project" band that links to this project
- `order`: position on the home page (1 is the big tile); `next`: the project linked at the bottom
- `headerColor`, `tileColor`: `lilac`, `oxblood`, `olive` or `ink`; `tint` (color behind photos): `lilac`, `oxblood` or `olive`
- `featured: false` hides a project from the home page; `draft: true` hides it everywhere

Below the `---`, write ordinary Markdown:

- `## Heading` starts a new numbered section (01, 02, ...). Paragraphs under it sit in the right-hand column.
- `**bold**`, `*italic*` and `[link text](https://...)` work as usual.
- A line starting with `>` becomes a pull quote.

Layout pieces are written as tags. Change the words inside them freely:

```mdx
<HowMightWe question={frontmatter.howMightWe} />

<PullQuote by="Name, Title" source="Publication">“The quote.”</PullQuote>

<Photo src="dan-network-meeting.jpg" alt="What's in the photo" caption="The caption" height={360} />

<PhotoRow alternate>
  <Photo src="a.jpg" alt="..." caption="..." height={320} />
  <Photo src="b.jpg" alt="..." caption="..." height={320} />
</PhotoRow>

<Stats>
  <Recognition>The 2024 Don Norman Design Award</Recognition>
  <Stat n="60+">community projects supported, and **8+** new grants</Stat>
</Stats>

<Lead>An italic line next to a section heading.</Lead>

<Cards>
  <Card date="July 2025" title="The Tijuana River.">Short paragraph with [a link](https://...).</Card>
</Cards>
```

Photo options: `height={400}` (px) or `aspect="3 / 2"`; `position="center 30%"` keeps part of the photo in
frame; `captionTop` puts the caption above; `maxWidth={600}` makes it narrower. On a `<PhotoRow>`,
`alternate` puts every other caption on top, and `inSection` keeps the row inside the section above it
instead of between sections. Inside `<Stat>`, `**bold**` numbers show large and oxblood.

The DAN page's flower model and map are fixed graphics in `src/components/dan/`.

### Home page

`src/site.config.json` holds the home copy. Project tiles come from the project files (title,
`tileColor`, `tileImage` or the hero photo). The Housing Design-a-thon tile lives under `comingSoon`
and doesn't link anywhere until it gets a page.

## Photos

Put new photos in `src/assets/images/` (about 1800px on the long edge is plenty) and refer to them by
file name. Astro makes resized WebP copies at build time. The duotone look (grayscale photo on a solid
color, plus grain) is applied by CSS, so upload ordinary color photos.

## Archived content

- `src/content/_archive/`: retired v3 project write-ups, including `housing-design-a-thon.md` for the coming-soon page.
- `src/content/pages/learning.md`: the "What I'm Learning" page, kept but not published.

## Running locally

```
npm install
npm run dev
```

`npm run build` checks every text and background color pair against WCAG AA first
(`scripts/check-contrast.mjs`, colors from `src/palette.json`), then builds to `dist/`.
`npm run favicon` redraws the "OG" favicon.
