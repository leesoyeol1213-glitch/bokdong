// Capacitor webDir(www) 번들러 — 앱에 필요한 정적 파일만 www/로 복사.
// 사용: node build-www.js  (이후 npx cap sync)
const fs = require('fs');
const path = require('path');
const root = __dirname;
const out = path.join(root, 'www');

// 복사 대상(앱 실행에 필요한 것만). node_modules/android/ios/.git/원본소재 등은 제외.
const FILES = ['index.html', 'manifest.json', 'sw.js', 'privacy.html'];
const DIRS = ['src', 'assets'];

fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });

for (const f of FILES) {
  const p = path.join(root, f);
  if (fs.existsSync(p)) fs.copyFileSync(p, path.join(out, f));
}
for (const d of DIRS) {
  const p = path.join(root, d);
  if (fs.existsSync(p)) fs.cpSync(p, path.join(out, d), { recursive: true });
}
console.log('www/ 번들 완료:', fs.readdirSync(out).join(', '));
