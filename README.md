# ojgale.github.io

Olivia Gale's personal site. Built with Astro to the approved "Visual direction v3".

## Editing content (right on GitHub)

| What | File |
| --- | --- |
| Homepage statement, "Now" line, email, LinkedIn | `src/site.config.json` |
| A project | `src/content/projects/<name>.md` |
| What I'm Learning | `src/content/pages/learning.md` |
| About | `src/content/pages/about.md` |

Open the file on GitHub, click the pencil, edit, and commit. The site rebuilds and goes live in a minute or two.
Anything in [brackets] is a placeholder.

### Project files

The block between the `---` lines sets the title, metadata and colors. Below it, each `## Heading`
becomes a chapter (Context, Insight, Intervention, Outcome, What I'd do next). A line starting with `>`
becomes the pull quote. Set `draft: true` to hide a project, `featured: true` to put it on the homepage,
and `order` to sort.

Colors: `ground` is cobalt, marigold or pink. `accent` must be an approved pairing:
cobalt takes marigold or pink; marigold and pink take plum or cobalt. The build stops if a pairing fails WCAG.

## Photos

Originals stay out of the repo. To add one: put it in `images-src/`, list it under `images:` in the project
file as `/images/<name>.jpg`, run `npm run images` (applies that project's duotone), and commit the file it
writes to `public/images/`.

## Running locally

```
npm install
npm run dev
```

`npm run build` runs the contrast check first, then builds to `dist/`.
