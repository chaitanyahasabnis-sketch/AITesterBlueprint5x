// Test case Markdown -> Excel workbook. Each "## Section …" becomes a sheet; tables keep the template's columns.
// Minimal SpreadsheetML writer on top of fflate (no extra spreadsheet dependency).
import { marked } from 'marked';
import { zipSync, strToU8 } from 'fflate';

const decode = (s = '') => s.replace(/<br\s*\/?>/gi, '\n').replace(/\\\|/g, '|')
  .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
const xml = (s) => String(s).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '')
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const col = (i) => {
  let s = '';
  for (let n = i + 1; n; n = Math.floor((n - 1) / 26)) s = String.fromCharCode(65 + ((n - 1) % 26)) + s;
  return s;
};

/** Splits the generated Markdown into sheets: [{ name, rows: string[][], header: boolean }]. */
export function sheetsFromMarkdown(md) {
  const sheets = [];
  let cur = null;
  for (const t of marked.lexer(md, { gfm: true })) {
    if (t.type === 'heading' && t.depth === 2) {
      cur = { name: decode(t.text).replace(/^Section [A-Z]\s*-\s*/i, ''), rows: [], header: false };
      sheets.push(cur);
    } else if (cur && t.type === 'table') {
      if (!cur.rows.length) {
        cur.rows.push(t.header.map((h) => decode(h.text)));
        cur.header = true;
      }
      t.rows.forEach((r) => cur.rows.push(r.map((c) => decode(c.text))));
    } else if (cur && t.type === 'paragraph' && !cur.header) {
      cur.rows.push([decode(t.text)]);
    }
  }
  // Valid, unique Excel sheet names (max 31 chars, no []:*?/\).
  const used = new Set();
  return sheets.filter((s) => s.rows.length).map((s) => {
    const base = (s.name.replace(/[[\]:*?/\\]/g, ' ').trim() || 'Sheet').slice(0, 28);
    let name = base;
    for (let i = 2; used.has(name.toLowerCase()); i++) name = `${base} ${i}`;
    used.add(name.toLowerCase());
    return { ...s, name };
  });
}

function sheetXml({ rows, header }) {
  const width = Math.max(...rows.map((r) => r.length));
  const cols = Array.from({ length: width }, (_, c) => {
    const longest = Math.max(...rows.map((r) => Math.max(0, ...String(r[c] ?? '').split('\n').map((l) => l.length))));
    return `<col min="${c + 1}" max="${c + 1}" width="${Math.min(60, Math.max(10, longest + 2))}" customWidth="1"/>`;
  }).join('');
  const data = rows.map((r, ri) => `<row r="${ri + 1}">${r.map((v, ci) => {
    const style = header && ri === 0 ? 1 : 2;
    return `<c r="${col(ci)}${ri + 1}" t="inlineStr" s="${style}"><is><t xml:space="preserve">${xml(v ?? '')}</t></is></c>`;
  }).join('')}</row>`).join('');
  const pane = header ? '<pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/>' : '';
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0">${pane}</sheetView></sheetViews><cols>${cols}</cols><sheetData>${data}</sheetData></worksheet>`;
}

const STYLES = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
<fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><name val="Calibri"/></font></fonts>
<fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FFE5E7EB"/><bgColor indexed="64"/></patternFill></fill></fills>
<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>
<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
<cellXfs count="3"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/><xf numFmtId="0" fontId="1" fillId="2" borderId="0" xfId="0" applyFont="1" applyFill="1" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0" applyAlignment="1"><alignment vertical="top" wrapText="1"/></xf></cellXfs>
<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>
</styleSheet>`;

/** Builds an .xlsx file (Uint8Array) from sheets. */
export function buildXlsx(sheets) {
  if (!sheets.length) throw new Error('No tables found to export.');
  const head = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n';
  const files = {
    '[Content_Types].xml': head + `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')}</Types>`,
    '_rels/.rels': head + '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>',
    'xl/workbook.xml': head + `<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets.map((s, i) => `<sheet name="${xml(s.name)}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets></workbook>`,
    'xl/_rels/workbook.xml.rels': head + `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('')}<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`,
    'xl/styles.xml': STYLES,
  };
  sheets.forEach((s, i) => { files[`xl/worksheets/sheet${i + 1}.xml`] = sheetXml(s); });
  return zipSync(Object.fromEntries(Object.entries(files).map(([k, v]) => [k, strToU8(v)])));
}

export const markdownToXlsxBlob = (md) =>
  new Blob([buildXlsx(sheetsFromMarkdown(md))], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
