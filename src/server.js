import fs from 'node:fs/promises';
import http from 'node:http';
import open from 'open';

export const interpolate = (html, data) => {
  return html.replace(/\{\{\s*(\w+)\s*\}\}/g, (match, placeholder) => {
    return data[placeholder] || '';
  });
};

export const formatNotes = (notes) => {
  return notes
    .map((note) => {
      return `
    <div class="note">
      <p>${note.content}</p>
      <div>
      ${note.tags.map((tag) => `<span class="tag">${tag}</span>`)}
      </div>
    </div>
    `;
    })
    .join('\n');
};

export const createServer = (notes) => {
  return http.createServer(async (req, res) => {
    const html = await fs.readFile('./src/template.html', 'utf-8');
    const notesHtml = formatNotes(notes);
    const response = interpolate(html, { notes: notesHtml });
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(response);
  });
};

export const start = (notes, port) => {
  const server = createServer(notes);

  server.listen(port, () => {
    const address = `http:localhost:${port}`;
    console.log(`server on ${address}`);
    open(address);
  });
};
