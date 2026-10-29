const assert = require('node:assert/strict');
const { test } = require('node:test');
const load = require('./load-typescript.cjs');

test('anonymous and non-admin users cannot manage registrations or rebuild the search index', async () => {
  for (const actor of [null, { id: 12, user_level: 2, org_id: 8 }]) {
    const mocks = {
      '@/utils/session': { getAuthenticatedUser: async () => actor },
      '@/utils/prisma': { prisma: {} },
      '@/utils/sendMail': {},
      '@/utils/helper-mail': {},
    };
    const registration = load('src/app/api/admin/org-request/route.ts', mocks);
    for (const method of ['GET', 'PUT', 'DELETE']) {
      const response = await registration[method]({ json: () => { throw new Error('Body must not be read'); } });
      assert.equal(response.status, actor ? 403 : 401);
    }
    const indexing = load('src/app/api/elastic_index/route.ts', mocks);
    assert.equal((await indexing.POST()).status, actor ? 403 : 401);
    const mail = load('src/app/api/send-mail/route.ts', mocks);
    assert.equal((await mail.POST({})).status, actor ? 403 : 401);
  }
});

test('login sets secure session cookies; server-side user deletion uses DELETE with the session', async () => {
  const savedCookies = [];
  const requests = [];
  const originalFetch = global.fetch;
  const originalEnvironment = process.env.NODE_ENV;
  const originalHttpLogin = process.env.ALLOW_INSECURE_HTTP_LOGIN;
  delete process.env.ALLOW_INSECURE_HTTP_LOGIN;
  process.env.NODE_ENV = 'production';
  global.fetch = async (url, options) => {
    requests.push(options);
    return { ok: true, json: async () => ({ success: true, token: 'signed-session', user: { id: 12, org_id: 8, user_level: 2, roles: [], organization: { name: 'Example' } } }) };
  };
  try {
    const service = load('src/services/UserService.ts', {
      'next/headers': { cookies: async () => ({
        set: (...args) => savedCookies.push(args), toString: () => 'access-token=signed-session',
      }) },
      '@/utils/auth': { ACCESS_TOKEN_MAX_AGE: 86400 },
    });
    const result = await service.loginWithUser('user@example.test', 'password');
    assert.equal(result.status, true);
    assert.equal(result.token, undefined);
    const tokenCookie = savedCookies.find(([name]) => name === 'access-token');
    assert.deepEqual(tokenCookie[2], { httpOnly: true, secure: true, sameSite: 'lax', path: '/', maxAge: 86400 });
    await service.deleteUserDetailService(12);
    assert.equal(requests[1].method, 'DELETE');
    assert.equal(requests[1].headers.Cookie, 'access-token=signed-session');
    for (const [flag, secure] of [['true', false], ['false', true], ['TRUE', true], ['', true]]) {
      process.env.ALLOW_INSECURE_HTTP_LOGIN = flag;
      savedCookies.length = 0;
      const login = await service.loginWithUser('user@example.test', 'password');
      assert.equal(login.status, true);
      for (const [, , options] of savedCookies) {
        assert.deepEqual(options, { httpOnly: true, secure, sameSite: 'lax', path: '/', maxAge: 86400 });
      }
    }
  } finally {
    global.fetch = originalFetch;
    if (originalEnvironment === undefined) delete process.env.NODE_ENV; else process.env.NODE_ENV = originalEnvironment;
    if (originalHttpLogin === undefined) delete process.env.ALLOW_INSECURE_HTTP_LOGIN; else process.env.ALLOW_INSECURE_HTTP_LOGIN = originalHttpLogin;
  }
});

test('reference writes require an administrator and a permitted table', async () => {
  for (const actor of [null, { id: 12, user_level: 2 }, { id: 1, user_level: 1 }]) {
    const { createDynamicModel } = load('src/services/model/DynamicModel.ts', {
      '@/utils/session': { getAuthenticatedUser: async () => actor },
      '@/utils/prisma': {},
    });
    await assert.rejects(createDynamicModel('md_users', { name: 'invalid' }));
  }
});
