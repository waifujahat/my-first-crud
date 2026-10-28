import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';
import { SAMPLE_USERS } from '../assets/js/data/sample-users.js';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

test('data contoh lama tetap berjumlah 50', () => {
  assert.equal(SAMPLE_USERS.length, 50);
  assert.equal(
    SAMPLE_USERS.every((row) => Array.isArray(row) && row.length === 5),
    true,
  );
});

test('semua file CSS/JS lokal yang dirujuk HTML tersedia', () => {
  const html = readFileSync(join(root, 'index.html'), 'utf8');
  for (const [, relative] of html.matchAll(/(?:src|href)="(\.?\/[^"\s]+)"/g)) {
    assert.ok(existsSync(resolve(root, relative)), `File tidak ditemukan: ${relative}`);
  }
  assert.match(html, /<script type="module" src="\.\/assets\/js\/main\.js"/);
});

test('seluruh import JavaScript menggunakan file yang tersedia', () => {
  function walk(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) walk(path);
      else if (entry.name.endsWith('.js')) {
        const source = readFileSync(path, 'utf8');
        for (const [, specifier] of source.matchAll(/from\s+"(\.\.?\/[^"\s]+)"/g)) {
          assert.ok(existsSync(resolve(dir, specifier)), `Import rusak: ${path} -> ${specifier}`);
        }
      }
    }
  }
  walk(join(root, 'assets/js'));
});
