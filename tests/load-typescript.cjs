const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');

// Compile isolated application modules without starting Next.js or a database.
module.exports = function loadTypescript(filename, mocks = {}) {
  const absolute = path.resolve(__dirname, '..', filename);
  const compiled = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
    fileName: absolute,
  });
  const loaded = new Module(absolute, module);
  loaded.filename = absolute;
  loaded.paths = Module._nodeModulePaths(path.dirname(absolute));
  const originalRequire = loaded.require.bind(loaded);
  loaded.require = (name) => Object.hasOwn(mocks, name) ? mocks[name] : originalRequire(name);
  loaded._compile(compiled.outputText, absolute);
  return loaded.exports;
};
