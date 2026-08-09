/*
  Proxy CORS local para desenvolvimento.
  - Recebe requests em http://localhost:3001/v1/*
  - Encaminha para https://api.abler.com.br/v1/*
  - Adiciona headers CORS para o navegador não bloquear

  Observações:
  - Isso NÃO é mock: o dado vem da API online.
  - Suporta preflight (OPTIONS).
  - Repassa method, headers e body.
*/

const http = require('http');
const { URL } = require('url');

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;
const UPSTREAM_ORIGIN = 'https://api.abler.com.br';
const ABLER_TOKEN = process.env.ABLER_TOKEN;

function setCors(res) {
  // Em dev, CRA roda em 3000.
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400');
}

const server = http.createServer(async (req, res) => {
  setCors(res);

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (!req.url) {
    res.statusCode = 400;
    res.end('Missing url');
    return;
  }

  // Mantém querystring e path. Ex: /v1/vacancies?... => encaminha igual.
  const targetUrl = new URL(req.url, UPSTREAM_ORIGIN);

  // Monta headers (remove host pra evitar conflitos)
  const headers = { ...req.headers };
  delete headers.host;

  // Alguns proxies/CDNs se confundem com encoding; manter simples.
  delete headers['accept-encoding'];

  // Injeta Authorization aqui no servidor (não passa pelo browser, então não tem preflight).
  // Se já vier Authorization do client, preferimos o do proxy.
  if (ABLER_TOKEN) {
    headers.authorization = `Bearer ${ABLER_TOKEN}`;
  }

  try {
    const fetchRes = await fetch(targetUrl.toString(), {
      method: req.method,
      headers,
      body:
        req.method && ['GET', 'HEAD'].includes(req.method.toUpperCase())
          ? undefined
          : req,
      redirect: 'manual',
    });

    // Copia status
    res.statusCode = fetchRes.status;

    // Copia headers de resposta (exceto os que conflitam com CORS do nosso server)
    fetchRes.headers.forEach((value, key) => {
      const lower = key.toLowerCase();
      if (lower === 'access-control-allow-origin') return;
      if (lower === 'access-control-allow-credentials') return;
      // Evita erro de decoding no browser quando a gente streama o body.
      if (lower === 'content-encoding') return;
      if (lower === 'content-length') return;
      res.setHeader(key, value);
    });

    // Garante CORS (sobrescreve no final)
    setCors(res);

    // Stream do body
    if (fetchRes.body) {
      const reader = fetchRes.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
      res.end();
    } else {
      res.end();
    }
  } catch (e) {
    res.statusCode = 502;
    res.end(`Proxy error: ${e && e.message ? e.message : String(e)}`);
  }
});

server.listen(PORT, () => {
  console.log(`[proxy] listening on http://localhost:${PORT}`);
  console.log(`[proxy] forwarding to ${UPSTREAM_ORIGIN}`);
  if (!ABLER_TOKEN) {
    console.warn('[proxy] ABLER_TOKEN is not set. Requests to Abler will likely fail until you export a valid token server-side.');
  }
});
