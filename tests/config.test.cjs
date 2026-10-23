const assert = require('node:assert/strict');
const { test } = require('node:test');
const config = require('../next.config.js');

test('client configuration excludes database, signing and service credentials', () => {
  const publicKeys = new Set(['BASE_URL', 'CLOUDINARY_CLOUD_NAME', 'CLOUDINARY_API_KEY', 'CLOUDINARY_UPLOAD_PRESET', 'GOOGLE_ANALYTICS_MEASUREMENT_ID']);
  for (const key of Object.keys(config.env)) assert.ok(publicKeys.has(key), `Unexpected public environment key: ${key}`);
});

test('responses prevent MIME sniffing', async () => {
  const headers = await config.headers();
  assert.ok(headers.some((rule) => rule.headers.some((header) => header.key === 'X-Content-Type-Options' && header.value === 'nosniff')));
});

test('multipart request limits accommodate two maximum-size uploads', () => {
  const fs = require('node:fs');
  const path = require('node:path');
  const load = require('./load-typescript.cjs');
  const { MAX_UPLOAD_SIZE } = load('src/utils/uploadLimits.ts');
  const bytes = require('next/dist/compiled/bytes');
  assert.ok(bytes.parse(config.experimental.serverActions.bodySizeLimit) > 2 * MAX_UPLOAD_SIZE);
  const ingress = fs.readFileSync(path.join(__dirname, '../deployment.yaml'), 'utf8');
  const [, nginxMegabytes] = ingress.match(/nginx\.ingress\.kubernetes\.io\/proxy-body-size: "(\d+)m"/);
  assert.ok(Number(nginxMegabytes) * 1024 * 1024 > 2 * MAX_UPLOAD_SIZE);
});
