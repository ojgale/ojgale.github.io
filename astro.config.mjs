import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Lays out a project's Markdown the way the design does:
// - each "## Heading" starts a numbered section (01, 02...) with the heading on the
//   left and the paragraphs that follow in a column on the right;
// - <Stats>, <Cards> and <Lead> go full width inside their section;
// - <Photo> and <PhotoRow> break out between sections, unless marked `inSection`.
const WIDE = new Set(['Stats', 'Cards']);
const BREAKOUT = new Set(['Photo', 'PhotoRow']);

function rehypeSections() {
  const el = (tagName, className, children = []) => ({ type: 'element', tagName, properties: { className: [className] }, children });
  const has = (node, name) => node.attributes?.some((a) => a.name === name);
  return (tree) => {
    const out = [];
    let sec = null;
    let n = 0;
    for (const node of tree.children) {
      const name = node.type === 'mdxJsxFlowElement' ? node.name : null;
      if (name === 'PhotoRow') {
        // Tell each photo how many share the row, so it loads a suitably small file.
        const photos = node.children.filter((c) => c.name === 'Photo');
        for (const p of photos) p.attributes.push({ type: 'mdxJsxAttribute', name: 'inRow', value: { type: 'mdxJsxAttributeValueExpression', value: String(photos.length), data: { estree: { type: 'Program', sourceType: 'module', body: [{ type: 'ExpressionStatement', expression: { type: 'Literal', value: photos.length, raw: String(photos.length) } }] } } } });
      }
      if (node.type === 'mdxjsEsm' || (node.type === 'text' && !node.value.trim())) { out.push(node); continue; }
      if (node.type === 'element' && node.tagName === 'h2') {
        n++;
        const title = el('div', 'sec-title', [el('span', 'sec-num', [{ type: 'text', value: String(n).padStart(2, '0') }]), node]);
        const body = el('div', 'sec-body');
        const head = el('div', 'sec-head', [title, body]);
        sec = { node: el('section', 'sec', [head]), head, body };
        out.push(sec.node);
        continue;
      }
      if (!sec) { out.push(node); continue; }
      if (name === 'Lead') { sec.head.children[1] = node; sec.head.properties.className.push('has-lead'); continue; }
      if (BREAKOUT.has(name) && !has(node, 'inSection')) { out.push(node); sec = null; continue; }
      if (WIDE.has(name) || BREAKOUT.has(name)) { sec.node.children.push(node); continue; }
      sec.body.children.push(node);
    }
    tree.children = out;
  };
}

export default defineConfig({
  site: 'https://galeolivia.com',
  trailingSlash: 'ignore',
  integrations: [mdx()],
  markdown: { rehypePlugins: [rehypeSections] },
  redirects: { '/work': '/#work' },
});
