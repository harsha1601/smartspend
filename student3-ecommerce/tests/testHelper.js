const app = require('../../student2-backend/server');
const http = require('http');

let server = null;
let baseUrl = '';

const startTestServer = () => {
  return new Promise((resolve, reject) => {
    // Port 5099 for testing
    const port = 5099;
    server = http.createServer(app);
    server.listen(port, () => {
      baseUrl = `http://localhost:${port}`;
      resolve({ server, baseUrl });
    });
    server.on('error', reject);
  });
};

const stopTestServer = () => {
  return new Promise((resolve) => {
    if (server) {
      server.close(resolve);
    } else {
      resolve();
    }
  });
};

const apiRequest = async (path, options = {}) => {
  const url = `${baseUrl}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const response = await fetch(url, {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    data = null;
  }

  return {
    status: response.status,
    ok: response.ok,
    data
  };
};

module.exports = {
  startTestServer,
  stopTestServer,
  apiRequest
};
