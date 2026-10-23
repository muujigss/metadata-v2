const assert = require('node:assert/strict');
const { test } = require('node:test');
const load = require('./load-typescript.cjs');

function findForm(element) {
  if (!element || typeof element !== 'object') return null;
  if (element.type === 'test-formik') return element;
  for (const child of [element.props?.children].flat()) {
    const form = findForm(child);
    if (form) return form;
  }
  return null;
}

function setup(login) {
  const states = [];
  let hook = 0;
  const react = require('react');
  const { default: Login } = load('src/components/AuthLogin.tsx', {
    react: { ...react, useState: (value) => { const index = hook++; states[index] = []; return [value, (next) => states[index].push(next)]; } },
    '@/components/admin/form': { InputComponent: 'input' },
    '@/services/UserService': { loginWithUser: login },
    '@mui/material': Object.fromEntries(['Alert', 'Box', 'Button', 'Divider', 'FormLabel', 'Typography'].map((key) => [key, key])),
    'remixicon-react/EyeLineIcon': 'eye-icon',
    'remixicon-react/EyeOffLineIcon': 'eye-off-icon',
    formik: { Form: 'form', Formik: 'test-formik' },
    'next/link': 'a',
  });
  return { form: findForm(Login()), states };
}

test('successful login navigates with the new session and stays pending until the page changes', async () => {
  const previousWindow = global.window;
  const previousStorage = Object.getOwnPropertyDescriptor(global, 'localStorage');
  const stored = new Map();
  let destination;
  global.window = { location: { replace: (path) => { destination = path; } } };
  Object.defineProperty(global, 'localStorage', { configurable: true, value: { setItem: (key, value) => stored.set(key, value) } });
  try {
    for (const [level, path] of [[1, '/admin/org-request'], ['2', '/admin/user'], [3, '/admin/database']]) {
      const { form, states } = setup(async () => ({ status: true, user: { id: 5, user_level: level, roles: [], organization: { name: 'Example' } } }));
      await form.props.onSubmit({ email: 'user@example.test', password: 'existing-password' });
      assert.equal(destination, path);
      assert.deepEqual(states[2], [true]);
      assert.equal(stored.get('user_id'), 5);
    }
  } finally {
    if (previousWindow === undefined) delete global.window; else global.window = previousWindow;
    if (previousStorage) Object.defineProperty(global, 'localStorage', previousStorage); else delete global.localStorage;
  }
});

test('failed login restores the existing form instead of unmounting and resetting it', async () => {
  const { form, states } = setup(async () => ({ success: false }));
  assert.ok(form);
  await form.props.onSubmit({ email: 'user@example.test', password: 'invalid' });
  assert.deepEqual(states[2], [true, false]);
  assert.equal(states[0].at(-1), 'error');
});
