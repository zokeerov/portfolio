// Сборка сайта в папку _site — только то, что должно попасть на хостинг.
// Служебные файлы (.claude, scripts, .github и т.д.) сюда не копируются.
import { rmSync, mkdirSync, cpSync, existsSync } from 'node:fs';

const OUT = '_site';
const FILES = ['index.html', 'styles.css', 'script.js'];
const DIRS = ['assets']; // сюда позже положим картинки, видео-превью, шрифты

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT);

for (const f of FILES) {
  if (!existsSync(f)) throw new Error(`Нет файла ${f}`);
  cpSync(f, `${OUT}/${f}`);
}
for (const d of DIRS) {
  if (existsSync(d)) cpSync(d, `${OUT}/${d}`, { recursive: true });
}

console.log(`Готово: ${OUT}/ (${FILES.join(', ')})`);
