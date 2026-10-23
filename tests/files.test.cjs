const assert = require('node:assert/strict');
const { test } = require('node:test');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const load = require('./load-typescript.cjs');
const limits = load('src/utils/uploadLimits.ts');
const files = load('src/utils/files.ts', { './uploadLimits': limits });

test('rejects traversal and header injection in both path formats', () => {
  for (const name of ['../.env', '..\\.env', '/etc/passwd', 'C:\\secret', '.', '..', 'x\r\nInjected: header', '']) {
    assert.throws(() => files.resolveUploadPath('./uploads', name), files.InvalidUploadError);
  }
  assert.equal(path.basename(files.resolveUploadPath('./uploads', 'Тушаал 2026.pdf')), 'Тушаал 2026.pdf');
});

test('validates upload size, extension and declared MIME type', () => {
  const file = { name: 'document.pdf', size: 10, type: 'application/pdf', arrayBuffer: async () => new ArrayBuffer(10) };
  assert.doesNotThrow(() => files.validateUpload(file));
  assert.equal(files.MAX_UPLOAD_SIZE, 50 * 1024 * 1024);
  for (const size of [20 * 1024 * 1024, 40 * 1024 * 1024, 50 * 1024 * 1024]) {
    assert.doesNotThrow(() => files.validateUpload({ ...file, size }));
  }
  for (const changed of [{ size: 0 }, { size: files.MAX_UPLOAD_SIZE + 1 }, { name: '../file.pdf' },
    { name: 'script.html', type: 'text/html' }, { type: 'text/html' }, { name: 'image.svg', type: 'image/svg+xml' }]) {
    assert.throws(() => files.validateUpload({ ...file, ...changed }), files.InvalidUploadError);
  }
});

test('download supports async params, Unicode names and missing files without leaking paths', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'metadata-download-'));
  const previous = process.env.UPLOAD_DIR;
  process.env.UPLOAD_DIR = root;
  try {
    const { GET } = load('src/app/api/download/[id]/route.ts', { '@/utils/files': files });
    const name = 'Тушаал.pdf';
    await fs.writeFile(path.join(root, name), 'example');
    const response = await GET({}, { params: Promise.resolve({ id: name }) });
    assert.equal(response.status, 200);
    assert.equal(await response.text(), 'example');
    assert.match(response.headers.get('content-disposition'), /filename\*=UTF-8''/);
    await fs.writeFile(path.join(root, 'logo.PNG'), Buffer.from([137, 80, 78, 71]));
    const logo = await GET({}, { params: Promise.resolve({ id: 'logo.PNG' }) });
    assert.equal(logo.headers.get('content-type'), 'image/png');
    assert.match(logo.headers.get('content-disposition'), /^inline;/);
    assert.equal(logo.headers.get('x-content-type-options'), 'nosniff');
    assert.match(response.headers.get('content-disposition'), /^attachment;/);
    assert.equal((await GET({}, { params: Promise.resolve({ id: '../.env' }) })).status, 400);
    assert.equal((await GET({}, { params: Promise.resolve({ id: 'missing.pdf' }) })).status, 404);
  } finally {
    if (previous === undefined) delete process.env.UPLOAD_DIR; else process.env.UPLOAD_DIR = previous;
    await fs.rm(root, { recursive: true, force: true });
  }
});
