const assert = require('node:assert/strict');
const { test } = require('node:test');
const load = require('./load-typescript.cjs');

function setup(sendMail) {
  const updates = [];
  const model = load('src/services/model/UserModel.ts', {
    '@/utils/session': { getAuthenticatedUser: async () => null },
    '@/utils/prisma': { md_users: {
      findFirst: async () => ({ id: 75 }),
      update: async (query) => { updates.push(query); return { id: 75 }; },
    } },
    '@/utils/sendMail': { sendMail },
    '@/utils/helper-mail': {},
  });
  return { model, updates };
}

test('password stays unchanged when the reset mail cannot be sent', async () => {
  const { model, updates } = setup(async () => { throw new Error('SMTP down'); });
  await assert.rejects(model.forgotPasswordModel('user@example.test'));
  assert.equal(updates.length, 0);
});

test('password is replaced after the reset mail is sent', async () => {
  const sent = [];
  const { model, updates } = setup(async (mail) => { sent.push(mail); return { status: true }; });
  assert.deepEqual(await model.forgotPasswordModel('user@example.test'), { status: true });
  assert.equal(sent.length, 1);
  assert.equal(updates.length, 1);
});
