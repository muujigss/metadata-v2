const assert = require('node:assert/strict');
const { test } = require('node:test');
const { Prisma } = require('@prisma/client');
const load = require('./load-typescript.cjs');

for (const directory of ['src/services/model', 'src/services/model/site']) {
  for (const [filename, functionName] of [
    ['DatabaseModel.ts', 'getDatabasesByFilter'], ['ClassificationModel.ts', 'getClassificationByFilter'],
    ['IndicatorModel.ts', 'getIndicatorByFilter'], ['FormModel.ts', 'getFormByFilter'], ['TableModel.ts', 'getTableByFilter'],
  ]) {
    test(`${directory}/${filename} binds search text and numeric filters`, async () => {
      const queries = [];
      const model = load(`${directory}/${filename}`, {
        '@/utils/prisma': { $queryRaw: async (strings, ...values) => { queries.push(Prisma.sql(strings, ...values)); return []; } },
      });
      const attack = "' OR 1=1; --";
      await model[functionName](attack);
      const siteForm = directory.endsWith('/site') && filename === 'FormModel.ts';
      assert.equal(queries.length, siteForm ? 1 : filename === 'DatabaseModel.ts' ? 3 : 2);
      for (const query of queries) {
        assert.equal(query.text.includes(attack), false);
        assert.ok(query.values.includes(`%${attack}%`));
      }
      queries.length = 0;
      await model[functionName]('', '12');
      assert.ok(queries.some((query) => query.values.includes(12)));
      queries.length = 0;
      await model[functionName]('', '', '34');
      // The existing public form endpoint returns only organization facets.
      if (!siteForm) assert.ok(queries.some((query) => query.values.includes(34)));
      if (filename === 'DatabaseModel.ts') {
        queries.length = 0;
        await model[functionName]('', '', '', '2');
        assert.ok(queries.some((query) => query.values.includes(2)));
      }
    });
  }
}
