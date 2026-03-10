import fs from 'node:fs';
import path from 'node:path';

const [, , inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
  console.error('Usage: node scripts/sanitize-n8n-workflow.mjs <input> <output>');
  process.exit(1);
}

const source = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

const redactCredential = (credentialName) => ({
  id: '__REDACTED__',
  name: `${credentialName} (redacted)`,
});

const sanitizeValue = (value) => {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  const output = {};

  for (const [key, raw] of Object.entries(value)) {
    let next = sanitizeValue(raw);

    if (key === 'access_token') {
      next = '__REDACTED_ACCESS_TOKEN__';
    }

    if (key === 'instanceId') {
      next = '__REDACTED_INSTANCE_ID__';
    }

    if (key === 'documentId' && raw && typeof raw === 'object') {
      next = {
        ...next,
        value: '__REDACTED_DOCUMENT_ID__',
        cachedResultName: 'Redacted Google Sheet',
        cachedResultUrl: 'https://docs.google.com/spreadsheets/d/__REDACTED__/edit',
      };
    }

    if (key === 'sheetName' && raw && typeof raw === 'object') {
      next = {
        ...next,
        value: '__REDACTED_SHEET_REF__',
        cachedResultName: 'Redacted Sheet',
        cachedResultUrl: 'https://docs.google.com/spreadsheets/d/__REDACTED__/edit#gid=__REDACTED__',
      };
    }

    if (key === 'modelId' && raw && typeof raw === 'object') {
      next = {
        ...next,
        cachedResultName: 'Configured model',
      };
    }

    if (key === 'credentials' && raw && typeof raw === 'object') {
      next = Object.fromEntries(
        Object.keys(raw).map((credentialKey) => [
          credentialKey,
          redactCredential(credentialKey),
        ]),
      );
    }

    if (key === 'url' && typeof raw === 'string' && raw.includes('graph.threads.net')) {
      next = raw.replace(/\/v[\d.]+\/\d+\//, '/v1.0/__REDACTED_USER_ID__/');
    }

    if (key === 'name' && typeof raw === 'string' && raw.includes('takalovideo')) {
      next = raw.replace(/takalovideo/g, 'example-account');
    }

    if (key === 'cachedResultUrl' && typeof raw === 'string' && raw.includes('docs.google.com')) {
      next = raw
        .replace(/\/d\/[^/]+/g, '/d/__REDACTED__')
        .replace(/gid=\d+/g, 'gid=__REDACTED__');
    }

    if (key === 'cachedResultName' && typeof raw === 'string') {
      next = raw
        .replace(/takalovideo/gi, 'example-account')
        .replace(/\d{4}年\d{1,2}月\d{1,2}日時点/g, '公開用サンプル');
    }

    output[key] = next;
  }

  if (output.name === 'access_token' && typeof output.value === 'string') {
    output.value = '__REDACTED_ACCESS_TOKEN__';
  }

  return output;
};

const sanitized = sanitizeValue(source);

sanitized.name = 'Threads and X Auto Post Workflow (Sanitized)';

if (sanitized.meta && typeof sanitized.meta === 'object') {
  sanitized.meta = {
    ...sanitized.meta,
    instanceId: '__REDACTED_INSTANCE_ID__',
  };
}

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(sanitized, null, 2)}\n`);
