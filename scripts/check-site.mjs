// Проверка сайта без внешних зависимостей:
//  - все якоря href="#id" ведут на существующий id
//  - все локальные файлы из href/src существуют
//  - у страницы есть <title>, description и viewport
import { readFileSync, existsSync } from 'node:fs';

const html = readFileSync('index.html', 'utf8');
const errors = [];

const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
for (const [, target] of html.matchAll(/href="#([^"]*)"/g)) {
  if (target && !ids.has(target)) errors.push(`Якорь #${target} никуда не ведёт`);
}

for (const [, url] of html.matchAll(/(?:href|src)="([^"#][^"]*)"/g)) {
  if (/^(https?:|mailto:|tel:|\/\/)/.test(url)) continue;
  const path = url.split(/[?#]/)[0];
  if (!existsSync(path)) errors.push(`Файл не найден: ${path}`);
}

if (!/<title>[^<]+<\/title>/.test(html)) errors.push('Нет <title>');
if (!/name="description"/.test(html)) errors.push('Нет meta description');
if (!/name="viewport"/.test(html)) errors.push('Нет meta viewport');

if (errors.length) {
  console.error('Ошибки:\n - ' + errors.join('\n - '));
  process.exit(1);
}
console.log(`OK: ${ids.size} id, все ссылки и файлы на месте`);
