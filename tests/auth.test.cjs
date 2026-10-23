const assert = require('node:assert/strict');
const { test, beforeEach, after } = require('node:test');
const jwt = require('jsonwebtoken');
const load = require('./load-typescript.cjs');

const originalSecret = process.env.JWT_SECRET;
const secret = 'regression-tests-only-secret-32-characters';
beforeEach(() => { process.env.JWT_SECRET = secret; });
after(() => {
  if (originalSecret === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = originalSecret;
});

const auth = () => load('src/utils/auth.ts');
const claims = { user_id: 5, user_level: 2, org_id: 8 };

test('accepts existing HS256 login tokens and issues compatible tokens', async () => {
  const { verifyAccessToken, signAccessToken } = auth();
  const token = jwt.sign(claims, secret, { expiresIn: '1d' });
  assert.equal((await verifyAccessToken(token)).user_id, 5);
  assert.equal(jwt.verify(await signAccessToken(claims), secret).org_id, 8);
});

test('rejects tampering, wrong signatures, expired tokens and missing claims', async () => {
  const { verifyAccessToken } = auth();
  const valid = jwt.sign(claims, secret, { expiresIn: '1d' });
  const [header, , signature] = valid.split('.');
  const tampered = [header, Buffer.from(JSON.stringify({ ...claims, user_level: 1, exp: 9999999999 })).toString('base64url'), signature].join('.');
  for (const token of [tampered, jwt.sign(claims, 'another-secret', { expiresIn: '1d' }),
    jwt.sign(claims, secret, { expiresIn: -1 }), jwt.sign(claims, secret),
    jwt.sign({ user_level: 1 }, secret, { expiresIn: '1d' }),
    jwt.sign({ ...claims, user_level: 99 }, secret, { expiresIn: '1d' }),
    jwt.sign(claims, secret, { algorithm: 'HS384', expiresIn: '1d' }), 'invalid', '']) {
    assert.equal(await verifyAccessToken(token), null);
  }
  delete process.env.JWT_SECRET;
  assert.equal(await verifyAccessToken(valid), null);
});

test('enforces the navigation roles on actual admin paths and nested pages', () => {
  const { canAccessPath } = auth();
  assert.equal(canAccessPath(2, '/admin/org/12'), false);
  assert.equal(canAccessPath(3, '/admin/org-request'), false);
  assert.equal(canAccessPath(3, '/admin/user/12'), false);
  assert.equal(canAccessPath(2, '/admin/user/12'), true);
  assert.equal(canAccessPath(3, '/admin/user/change-password'), true);
  assert.equal(canAccessPath(3, '/admin/database'), true);
  assert.equal(canAccessPath(1, '/admin/reference'), true);
});
