import { defineConfig } from 'astro/config';

// Wraps each "## Heading" in a project's Markdown, plus everything under it,
// in <section class="chapter">. The project page uses these sections to
// switch the sticky image as you scroll.
function rehypeChapters() {
  return (tree) => {
    const out = [];
    let current = null;
    let n = 0;
    for (const node of tree.children) {
      if (node.type === 'element' && node.tagName === 'h2') {
        current = {
          type: 'element',
          tagName: 'section',
          properties: { className: ['chapter'], dataChapter: String(n++) },
          children: [node],
        };
        out.push(current);
      } else if (current) {
        current.children.push(node);
      } else {
        out.push(node);
      }
    }
    tree.children = out;
  };
}

export default defineConfig({
  site: 'https://ojgale.github.io',
  markdown: { rehypePlugins: [rehypeChapters] },
});
