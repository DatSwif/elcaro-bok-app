const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const distPath = path.join(__dirname, 'dist/elcaro-bok-app/browser');

async function forwardRequest(req, res, targetBase) {
  try {
    const cleanPath = req.originalUrl.replace(/^\/(pl|en)\//, '/');
    const url = `${targetBase}${cleanPath}`;

    console.log(`[Manual Proxy] Forwarding: ${req.method} ${req.originalUrl} -> ${url}`);

    const proxyHeaders = { ...req.headers };
    delete proxyHeaders.origin;
    delete proxyHeaders.referer;
    delete proxyHeaders.host;

    const isPdfRequest =
      req.originalUrl.includes('/api/documents/') &&
      req.originalUrl.endsWith('/pdf') ||
      req.originalUrl.includes('/api/billing/') &&
      req.originalUrl.endsWith('/download');

    delete proxyHeaders['content-length'];

    const response = await axios({
      method: req.method,
      url,
      data: ['GET', 'HEAD'].includes(req.method) ? undefined : req.body,
      headers: {
        ...proxyHeaders,
        host: new URL(targetBase).host,
        accept: isPdfRequest ? 'application/pdf' : proxyHeaders.accept,
      },
      responseType: isPdfRequest ? 'arraybuffer' : 'json',
      validateStatus: () => true,
      timeout: 10000,
    });

    for (const [key, value] of Object.entries(response.headers)) {
      if (key.toLowerCase() !== 'transfer-encoding') {
        res.setHeader(key, value);
      }
    }

    if (isPdfRequest) {
      res.setHeader('Content-Type', 'application/pdf');

      if (response.headers['content-disposition']) {
        res.setHeader('Content-Disposition', response.headers['content-disposition']);
      }

      res.setHeader('Content-Length', Buffer.byteLength(response.data));
      return res.status(response.status).end(Buffer.from(response.data));
    }

    return res.status(response.status).send(response.data);
  } catch (error) {
    console.error(`[Proxy Error] ${error.message}`);
    const status = error.code === 'ECONNABORTED' ? 504 : 500;
    res.status(status).send({ error: 'Proxy failed', details: error.message });
  }
}

function getPreferredLanguage(req) {
  const matchedLang = req.acceptsLanguages('en', 'pl');
  return matchedLang || 'pl'; 
}

/* Endpoint categories that aren't implemented
app.all(
  [
  ],
  (req, res) => {
    forwardRequest(req, res, 'http://127.0.0.1:4010');
  }
);
*/

// The rest is implemented
app.all('/api/*path', (req, res) => {
  forwardRequest(req, res, 'http://127.0.0.1:8080');
});

app.get('/', (req, res) => {
  const targetLang = getPreferredLanguage(req);
  res.redirect(301, `/${targetLang}/`);
});

app.use(express.static(distPath));

app.get('/en/*path', (req, res) => res.sendFile(path.join(distPath, 'en/index.html')));
app.get('/pl/*path', (req, res) => res.sendFile(path.join(distPath, 'pl/index.html')));

app.get('/*path', (req, res) => {
  const targetLang = getPreferredLanguage(req);
  res.redirect(301, `/${targetLang}${req.url}`);
});

app.listen(3000, () => console.log('Manual Proxy Server running on http://localhost:3000'));