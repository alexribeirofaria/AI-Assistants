const fs = require('fs');
const path = require('path');
const { responseInterceptor } = require('http-proxy-middleware');

const TARGET = 'http://localhost:5000';
const LOG_DIR = path.resolve(__dirname, '.log_erros');

const DEFAULT_ERROR_MESSAGE = 'Serviço indisponível no momento';
const SOURCE = 'AngularDevServerProxy';

// ---------- Utils ----------

const ensureLogDir = () => {
  if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
  }
};

const sanitize = (value) =>
  String(value ?? 'erro')
    .trim()
    .replace(/[^a-zA-Z0-9_-]+/g, '_')
    .replace(/^_+|_+$/g, '') || 'erro';

const getDateStamp = (date) =>
  date.toISOString().slice(0, 10).replace(/-/g, '');

const getNextSequence = (source, errorName, dateStamp) => {
  ensureLogDir();

  const prefix = `log_${source}_${errorName}_${dateStamp}_`;
  const matcher = new RegExp(`^${prefix}(\\d{4})\\.md$`);

  const sequences = fs.readdirSync(LOG_DIR)
    .map((file) => file.match(matcher)?.[1])
    .filter(Boolean)
    .map(Number);

  const next = sequences.length ? Math.max(...sequences) + 1 : 0;
  return String(next).padStart(4, '0');
};

// ---------- Logging ----------

const writeErrorLog = ({ endpoint, method, error, statusCode, reqUrl }) => {
  ensureLogDir();

  const now = new Date();
  const dateStamp = getDateStamp(now);

  const safeSource = sanitize(SOURCE);
  const safeError = sanitize(
    error?.name || error?.code || `http_${statusCode || 500}`
  );

  const sequence = getNextSequence(safeSource, safeError, dateStamp);

  const fileName = `log_${safeSource}_${safeError}_${dateStamp}_${sequence}.md`;
  const filePath = path.join(LOG_DIR, fileName);

  const content = [
    '# Log de Erro',
    '',
    `- Fonte: \`${SOURCE}\``,
    `- Endpoint: \`${endpoint}\``,
    `- Método: \`${method}\``,
    `- URL: \`${reqUrl}\``,
    `- Timestamp: \`${now.toISOString()}\``,
    statusCode && `- Status: \`${statusCode}\``,
    error?.code && `- Code: \`${error.code}\``,
    '',
    '## Erro',
    '',
    '```text',
    error?.message || `Falha na requisição ${endpoint}`,
    '```',
    '',
  ]
    .filter(Boolean)
    .join('\n');

  fs.writeFileSync(filePath, content, 'utf8');
};

// ---------- Response Helpers ----------

const createErrorPayload = (req, error, statusCode = 503) => {
  writeErrorLog({
    endpoint: req.path || req.url,
    method: req.method,
    reqUrl: req.originalUrl || req.url,
    statusCode,
    error,
  });

  return {
    error: DEFAULT_ERROR_MESSAGE,
    status: statusCode,
  };
};

const toJsonBuffer = (payload) =>
  Buffer.from(JSON.stringify(payload), 'utf8');

const sendJsonResponse = (res, payload) => {
  if (!res.headersSent) {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
    });
  }
  res.end(toJsonBuffer(payload));
};

module.exports = {
  '/api': {
    target: TARGET,
    changeOrigin: true,
    secure: false,
    logLevel: 'silent',
    proxyTimeout: 5000,
    timeout: 5000,
    pathRewrite: {
      '^/api': '',
    },
    selfHandleResponse: true,
    onError(err, req, res) {
      const payload = createErrorPayload(req, err, 503);
      sendJsonResponse(res, payload);
    },
    onProxyRes: responseInterceptor(async (buffer, proxyRes, req, res) => {
      const status = proxyRes.statusCode || 500;

      if (status >= 500) {
        const payload = createErrorPayload(
          req,
          {
            name: 'UpstreamHttpError',
            code: `HTTP_${status}`,
            message: `Upstream retornou ${status}`,
          },
          status
        );

        sendJsonResponse(res, payload);
        return toJsonBuffer(payload);
      }

      return buffer;
    }),
  },
};
