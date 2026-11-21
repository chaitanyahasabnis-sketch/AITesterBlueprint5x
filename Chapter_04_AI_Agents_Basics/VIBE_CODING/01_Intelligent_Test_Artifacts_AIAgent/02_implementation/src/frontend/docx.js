// Markdown (as produced by the generator) -> Word document, built in the browser with the `docx` library.
import { marked } from 'marked';

const decode = (s = '') => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');

export function buildDocument(md, title, d) {
  const { Document, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle, ShadingType } = d;
  const HEADINGS = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4, HeadingLevel.HEADING_5, HeadingLevel.HEADING_6];
  const line = { style: BorderStyle.SINGLE, size: 4, color: 'D1D5DB' };

  const inline = (tokens = [], style = {}) => tokens.flatMap((t) => {
    switch (t.type) {
      case 'strong': return inline(t.tokens, { ...style, bold: true });
      case 'em': return inline(t.tokens, { ...style, italics: true });
      case 'del': return inline(t.tokens, { ...style, strike: true });
      case 'codespan': return [new TextRun({ text: decode(t.text), font: 'Consolas', ...style })];
      case 'br': return [new TextRun({ break: 1 })];
      case 'html': return /^<br\s*\/?>$/i.test(t.text.trim()) ? [new TextRun({ break: 1 })] : [new TextRun({ text: t.text, ...style })];
      case 'link': return inline(t.tokens, { ...style, color: '4F46E5', underline: {} });
      case 'text': return t.tokens ? inline(t.tokens, style) : [new TextRun({ text: decode(t.text), ...style })];
      default: return [new TextRun({ text: decode(t.text ?? t.raw ?? ''), ...style })];
    }
  });

  const cell = (tokens, header) => new TableCell({
    children: [new Paragraph({ children: inline(tokens, header ? { bold: true } : {}) })],
    shading: header ? { type: ShadingType.CLEAR, fill: 'F3F4F6', color: 'auto' } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
  });

  const children = [];
  const block = (t, level = 0) => {
    switch (t.type) {
      case 'heading':
        children.push(new Paragraph({ heading: HEADINGS[t.depth - 1], children: inline(t.tokens), spacing: { before: 240, after: 120 } }));
        break;
      case 'paragraph':
        children.push(new Paragraph({ children: inline(t.tokens), spacing: { after: 120 } }));
        break;
      case 'list':
        t.items.forEach((item, i) => {
          const [first, ...rest] = item.tokens;
          const runs = first && ['text', 'paragraph'].includes(first.type) ? inline(first.tokens || [{ type: 'text', text: first.text }]) : [];
          children.push(t.ordered
            ? new Paragraph({ children: [new TextRun(`${(Number(t.start) || 1) + i}. `), ...runs], indent: { left: 360 * (level + 1) } })
            : new Paragraph({ children: runs, bullet: { level } }));
          (first && !['text', 'paragraph'].includes(first.type) ? item.tokens : rest).forEach((r) => block(r, r.type === 'list' ? level + 1 : level));
        });
        break;
      case 'table':
        children.push(new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: { top: line, bottom: line, left: line, right: line, insideHorizontal: line, insideVertical: line },
          rows: [
            new TableRow({ tableHeader: true, children: t.header.map((h) => cell(h.tokens, true)) }),
            ...t.rows.map((r) => new TableRow({ children: r.map((c) => cell(c.tokens, false)) })),
          ],
        }));
        children.push(new Paragraph({ text: '' }));
        break;
      case 'blockquote':
        t.tokens.forEach((b) => (b.type === 'paragraph'
          ? children.push(new Paragraph({ children: inline(b.tokens, { italics: true }), indent: { left: 360 }, spacing: { after: 120 } }))
          : block(b, level)));
        break;
      case 'hr':
        children.push(new Paragraph({ border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: 'D1D5DB', space: 1 } } }));
        break;
      case 'code':
        children.push(new Paragraph({ children: [new TextRun({ text: t.text, font: 'Consolas' })] }));
        break;
      case 'space':
        break;
      default:
        if (t.text) children.push(new Paragraph({ text: decode(t.text) }));
    }
  };
  marked.lexer(md, { gfm: true }).forEach((t) => block(t));

  return new Document({
    creator: 'Test Artifacts Studio',
    title,
    styles: { default: { document: { run: { font: 'Calibri', size: 20 } } } },
    sections: [{ properties: { page: { margin: { top: 720, bottom: 720, left: 720, right: 720 } } }, children }],
  });
}

export async function markdownToDocxBlob(md, title) {
  const d = await import('docx'); // loaded only when exporting
  return d.Packer.toBlob(buildDocument(md, title, d));
}
