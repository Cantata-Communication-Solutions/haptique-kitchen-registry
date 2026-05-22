const fs = require('fs');
const path = require('path');
const Ajv = require('ajv/dist/2020');
const addFormats = require('ajv-formats');

const root = path.resolve(__dirname, '..');
const writeCatalog = process.argv.includes('--write');
const registryUrl = 'https://github.com/Cantata-Communication-Solutions/haptique-kitchen-registry';

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf8'));
const listJsonFiles = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listJsonFiles(full);
    return entry.name.endsWith('.json') ? [full] : [];
  });
};

const ajv = new Ajv({allErrors: true, strict: false});
addFormats(ajv);
const packageSchema = readJson(path.join(root, 'schemas', 'haptique.package.schema.json'));
const catalogSchema = readJson(path.join(root, 'schemas', 'catalog.schema.json'));
ajv.addSchema(packageSchema, 'haptique.package.schema.json');
const validatePackage = ajv.compile(packageSchema);
const validateCatalog = ajv.compile(catalogSchema);

const packageFiles = listJsonFiles(path.join(root, 'packages'));
const packages = [];
const ids = new Set();
let failed = false;

for (const file of packageFiles) {
  const relative = path.relative(root, file);
  const data = readJson(file);
  if (!validatePackage(data)) {
    failed = true;
    console.error(`Invalid package ${relative}`);
    console.error(validatePackage.errors);
    continue;
  }
  if (ids.has(data.id)) {
    failed = true;
    console.error(`Duplicate package id ${data.id}`);
    continue;
  }
  ids.add(data.id);
  packages.push(data);
}

packages.sort((left, right) => left.id.localeCompare(right.id));

const catalog = {
  schemaVersion: '1.0',
  generatedAt: new Date().toISOString(),
  registryUrl,
  packages,
  blocked: readJson(path.join(root, 'blocked', 'packages.json')),
  deprecated: readJson(path.join(root, 'deprecated', 'packages.json')),
};

if (!validateCatalog(catalog)) {
  failed = true;
  console.error('Generated catalog is invalid');
  console.error(validateCatalog.errors);
}

if (failed) {
  process.exit(1);
}

if (writeCatalog) {
  fs.mkdirSync(path.join(root, 'catalog'), {recursive: true});
  fs.writeFileSync(path.join(root, 'catalog', 'index.json'), `${JSON.stringify(catalog, null, 2)}\n`);
}

console.log(`Validated ${packages.length} Kitchen package listing(s).`);
