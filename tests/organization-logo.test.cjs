const assert = require('node:assert/strict');
const { test } = require('node:test');
const { organizationLogoUrl } = require('./load-typescript.cjs')('src/utils/organizationLogo.ts');

test('maps legacy upload filesystem paths to the download endpoint', () => {
  for (const value of ['/home/ndc-user/git-directory/uploads//logo.jpg', 'public/uploads/logo.jpg', 'uploads/logo.jpg', 'D:\\uploads\\logo.jpg']) {
    assert.equal(organizationLogoUrl(value), '/api/download/logo.jpg');
  }
  assert.equal(organizationLogoUrl('/uploads/logo%20name.jpg'), '/api/download/logo%20name.jpg');
  for (const value of ['https://res.cloudinary.com/example/logo.png', '/api/download/logo.jpg', '/logo/default.png']) {
    assert.equal(organizationLogoUrl(value), value);
  }
});
