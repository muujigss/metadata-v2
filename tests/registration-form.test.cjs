const assert = require('node:assert/strict');
const { test } = require('node:test');
const load = require('./load-typescript.cjs');
const { createRegistrationFormData } = load('src/utils/registrationForm.ts');

test('767 KB decree and 182 KB logo are sent once and fit in a 1 MiB multipart request', async () => {
  const values = {
    org_name: 'Байгууллага', user_email: 'user@example.test',
    file: new File([new Uint8Array(186953)], 'logo.jpg', { type: 'image/jpeg' }),
    file_id: new File([new Uint8Array(786097)], 'decree.pdf', { type: 'application/pdf' }),
  };
  const form = createRegistrationFormData(values);
  assert.equal(form.getAll('file').length, 1);
  assert.equal(form.getAll('file_id').length, 1);
  assert.equal(form.get('file').size, 186953);
  assert.equal(form.get('file_id').size, 786097);
  assert.equal(form.get('org_name'), values.org_name);
  const corrected = await new Response(form).arrayBuffer();
  assert.ok(corrected.byteLength < 1024 * 1024);
  // Reproduce the old serializer: file_id was included in the field loop,
  // then appended again along with the logo.
  form.append('file_id', values.file_id);
  const duplicated = await new Response(form).arrayBuffer();
  assert.ok(duplicated.byteLength > 1024 * 1024);
});
