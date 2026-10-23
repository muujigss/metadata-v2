const assert = require('node:assert/strict');
const { test } = require('node:test');
const bcrypt = require('bcrypt');
const load = require('./load-typescript.cjs');

function setup(actor = { id: 75, user_level: 3, org_id: 10 }) {
  const updates = [];
  const storedHash = bcrypt.hashSync('previous-password', 4);
  const model = load('src/services/model/UserModel.ts', {
    '@/utils/session': { getAuthenticatedUser: async () => actor },
    '@/utils/prisma': { md_users: {
      findUnique: async () => ({ password: storedHash }),
      update: async (query) => { updates.push(query); return { id: actor.id, ...query.data }; },
      findFirst: async (query) => query.where.is_active === true ? null : { id: 75, password: storedHash },
    } },
    '@/utils/sendMail': { sendMail: async () => ({ status: true }) },
    '@/utils/helper-mail': {},
  });
  return { ...model, updates };
}

test('users with IDs above 44 must supply their old password', async () => {
  const model = setup();
  const result = await model.updatePasswordModel({ id: 75, oldPassword: 'wrong', newPassword: 'new-strong-password' });
  assert.equal(result.status, false);
  assert.equal(model.updates.length, 0);
});

test('authenticated user can change only their own password and receives no hash', async () => {
  const model = setup();
  assert.equal((await model.updatePasswordModel({ id: 76, oldPassword: 'previous-password', newPassword: 'new-strong-password' })).status, false);
  const result = await model.updatePasswordModel({ id: 75, oldPassword: 'previous-password', newPassword: 'new-strong-password' });
  assert.deepEqual(result, { status: true });
  assert.equal(model.updates.length, 1);
  assert.equal(await bcrypt.compare('new-strong-password', model.updates[0].data.password), true);
  assert.equal(model.updates[0].data.updated_user, 75);
});

test('rejects anonymous password changes, short passwords and bcrypt truncation', async () => {
  assert.equal((await setup(null).updatePasswordModel({ id: 75 })).status, false);
  const model = setup();
  for (const password of ['short', 'а'.repeat(40)]) {
    assert.equal((await model.updatePasswordModel({ id: 75, oldPassword: 'previous-password', newPassword: password })).status, false);
  }
  assert.equal(model.updates.length, 0);
});

test('inactive accounts cannot sign in', async () => {
  assert.equal(await setup().loginUserModel('inactive@example.test', 'previous-password'), null);
});
