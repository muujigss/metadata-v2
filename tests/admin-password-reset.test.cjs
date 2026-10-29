const assert = require('node:assert/strict');
const { test } = require('node:test');
const bcrypt = require('bcrypt');
const load = require('./load-typescript.cjs');
const routePath = 'src/app/api/admin/users/reset-password/route.ts';

test('password reset rejects anonymous, ordinary users, and invalid IDs before database writes', async () => {
  for (const [actor, body, status] of [[null, {userId: 2}, 401], [{id: 1, user_level: 3}, {userId: 2}, 403], [{id: 1, user_level: 1}, {userId: '2'}, 400]]) {
    const { POST } = load(routePath, { '@/utils/session': {getAuthenticatedUser: async () => actor}, '@/utils/prisma': {} });
    assert.equal((await POST({json: async () => body})).status, status);
  }
});

test('organization admin resets only an active level-3 account in their own organization', async () => {
  let write;
  const { POST } = load(routePath, {
    '@/utils/session': {getAuthenticatedUser: async () => ({id: 1, user_level: 2, org_id: 7})},
    '@/utils/prisma': { md_users: {
      findFirst: async ({where}) => {
        assert.deepEqual(where, {id: 2, is_active: true, user_level: 3, org_id: 7});
        return {id: 2, email: 'user@example.test'};
      },
      updateMany: async args => {write = args; return {count: 1};},
    } },
  });
  const response = await POST({json: async () => ({userId: 2})});
  assert.equal(response.status, 200);
  assert.equal(await bcrypt.compare('12345678', write.data.password), true);
  assert.deepEqual(write.where, {id: 2, is_active: true, user_level: 3, org_id: 7});
  assert.equal((await response.json()).password, undefined);
});

test('out-of-scope accounts cannot be reset and superadmin scope excludes level-1 accounts', async () => {
  for (const level of [1, 2]) {
    const { POST } = load(routePath, {
      '@/utils/session': {getAuthenticatedUser: async () => ({id: 1, user_level: level, org_id: 7})},
      '@/utils/prisma': {md_users: {findFirst: async ({where}) => {
        if (level === 1) assert.deepEqual(where.user_level, {in: [2, 3]});
        else assert.equal(where.org_id, 7);
        return null;
      }, updateMany: () => {throw new Error('Must not update');}}},
    });
    assert.equal((await POST({json: async () => ({userId: 2})})).status, 404);
  }
});

test('login suggests a password change only after successful authentication with the temporary password', async () => {
  let authenticated = true;
  const { POST } = load('src/app/api/user/route.ts', {
    '@/services/model/UserModel': {loginUserModel: async () => authenticated ? {id: 2, user_level: 2, org_id: 7, password: 'hash'} : null},
    '@/utils/auth': {signAccessToken: async () => 'signed-token'}, '@/utils/session': {},
  });
  for (const password of ['12345678', 'a-new-private-password']) {
    const response = await POST({json: async () => ({username: 'user@example.test', password})});
    const body = await response.json();
    assert.equal(body.passwordChangeSuggested, password === '12345678');
    assert.equal(body.user.password, undefined);
  }
  authenticated = false;
  assert.equal((await POST({json: async () => ({username: 'user@example.test', password: '12345678'})})).status, 401);
});
