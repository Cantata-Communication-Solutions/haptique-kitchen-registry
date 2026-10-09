const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {test} = require('node:test');
const {generateKeyPairSync, sign} = require('node:crypto');
const Ajv = require('ajv/dist/2020');
const addFormats = require('ajv-formats');

const root = path.resolve(__dirname, '..');
const schema = JSON.parse(fs.readFileSync(path.join(root, 'schemas/haptique.package.schema.json')));
const ajv = new Ajv({allErrors: true, strict: false});
addFormats(ajv);
const validate = ajv.compile(schema);
const source = JSON.parse(fs.readFileSync(path.join(root, 'packages/drivers/com.haptique.community.byd-vehicle.json')));
delete source.artifact; // Keep source-only coverage after BYD gains a release artifact.

const signedListing = () => {
  const pkg = structuredClone(source);
  const sha256 = 'a'.repeat(64);
  const {privateKey} = generateKeyPairSync('ed25519');
  const payload = ['haptique-app-v1', `id:${pkg.id}`, `type:${pkg.type}`,
    `version:${pkg.version}`, `sha256:${sha256}`].join('\n');
  pkg.artifact = {
    downloadUrl: 'https://github.com/Cantata-Communication-Solutions/haptique-byd-vehicle/releases/download/v0.1.0-beta.1/haptique-byd-vehicle-0.1.0-beta.1.zip',
    sha256,
    signature: sign(null, Buffer.from(payload), privateKey).toString('base64'),
    signingKeyId: 'contract-fixture-key',
  };
  return pkg;
};

test('source-only community listings remain valid', () => {
  assert.equal(validate(source), true, JSON.stringify(validate.errors));
});

test('accepts the signed driver metadata required by HOS', () => {
  assert.equal(validate(signedListing()), true, JSON.stringify(validate.errors));
});

test('accepts unsigned community drivers', () => {
  const pkg = signedListing();
  delete pkg.artifact.signature;
  delete pkg.artifact.signingKeyId;
  assert.equal(validate(pkg), true, JSON.stringify(validate.errors));
});

test('requires both signature fields for other trust levels and non-driver packages', () => {
  for (const trustLevel of ['verified', 'core-candidate', 'built-in', 'deprecated', 'blocked']) {
    const pkg = signedListing();
    pkg.trustLevel = trustLevel;
    delete pkg.artifact.signature;
    delete pkg.artifact.signingKeyId;
    assert.equal(validate(pkg), false, trustLevel);
  }
  const pkg = signedListing();
  pkg.type = 'widget';
  delete pkg.artifact.signature;
  delete pkg.artifact.signingKeyId;
  assert.equal(validate(pkg), false);
});

test('rejects artifacts missing checksum, URL, or one half of a signature', () => {
  for (const field of ['downloadUrl', 'sha256', 'signature', 'signingKeyId']) {
    const pkg = signedListing();
    delete pkg.artifact[field];
    assert.equal(validate(pkg), false, `missing ${field}`);
    assert.ok(validate.errors.some(error => ['required', 'dependentRequired'].includes(error.keyword)
      && error.params.missingProperty === field), JSON.stringify(validate.errors));
  }
});

test('rejects malformed checksums and Ed25519 signatures', () => {
  for (const signature of ['', 'not base64', 'AAAA', 'A'.repeat(88), 'A'.repeat(85) + 'B==']) {
    const pkg = signedListing();
    pkg.artifact.signature = signature;
    assert.equal(validate(pkg), false, `invalid signature ${signature}`);
  }
  for (const sha256 of ['', 'b'.repeat(63), 'g'.repeat(64)]) {
    const pkg = signedListing();
    pkg.artifact.sha256 = sha256;
    assert.equal(validate(pkg), false, `invalid checksum ${sha256}`);
  }
});

test('rejects empty or malformed signing key identifiers', () => {
  for (const signingKeyId of ['', ' ', 'key/id', 'key\nsecret']) {
    const pkg = signedListing();
    pkg.artifact.signingKeyId = signingKeyId;
    assert.equal(validate(pkg), false);
  }
});

test('rejects unknown artifact metadata and insecure download URLs', () => {
  const unknown = signedListing();
  unknown.artifact.privateKey = 'forbidden';
  assert.equal(validate(unknown), false);
  const insecure = signedListing();
  insecure.artifact.downloadUrl = 'http://github.com/example/driver/releases/download/v1/package.zip';
  assert.equal(validate(insecure), false);
});
