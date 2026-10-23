const assert = require('node:assert/strict');
const { test } = require('node:test');
const { Prisma } = require('@prisma/client');
const load = require('./load-typescript.cjs');

test('dashboard binds the authenticated organization and skips empty queries for super-admins', async () => {
  for (const level of [1, 2, 3]) {
    const queries = [];
    const { getDashboardDatabaseModel } = load('src/services/model/DashboardDatabaseModel.ts', {
      '@/utils/session': { getAuthenticatedUser: async () => ({ id: 5, user_level: level, org_id: 17 }) },
      '@/utils/prisma': {
        md_organization: { findUnique: async () => ({ org_short_name: 'Example' }) },
        md_users: { findUnique: async () => ({ user_level: level }) },
        $queryRaw: async (strings, ...values) => { queries.push(Prisma.sql(strings, ...values)); return []; },
      },
    });
    await getDashboardDatabaseModel();
    assert.ok(queries.length > 0);
    for (const query of queries) assert.ok(query.text.trim());
    if (level !== 1) assert.ok(queries.some((query) => query.values.includes(17)));
  }
});
