const { readdirSync } = require('node:fs');
const { join } = require('node:path');
const { spawnSync } = require('node:child_process');

const files = readdirSync(__dirname).filter(name => name.endsWith('.test.cjs')).sort();
const result = spawnSync(process.execPath, ['--test', ...files.map(name => join(__dirname, name))], { stdio: 'inherit' });
if (result.error) console.error(result.error.message);
process.exit(result.status ?? 1);
