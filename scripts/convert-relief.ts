/**
 * public/relief/*.png → *.webp 일괄 변환.
 *
 * relief 래스터(전투당 light/dark 2장)는 히스토리적으로 PNG로 만들어졌지만
 * 무손실일 필요가 없는 반투명 hillshade 이미지라 WebP(손실, quality~82)로
 * 바꾸면 용량이 크게 줄어든다. 새 전투를 등록할 때도 이 스크립트로
 * `public/relief/<id>-{light,dark}.png` → `.webp`를 만들고, PNG는 지운 뒤
 * meta.ts의 relief 경로를 .webp로 등록한다.
 *
 * 사용법: npm run relief:webp
 *   - public/relief/ 안의 모든 *.png를 변환해 같은 이름의 .webp를 만든다.
 *   - 원본 PNG는 지우지 않는다 — 확인 후 별도로 git rm 한다.
 */
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const RELIEF_DIR = path.resolve(import.meta.dirname, '..', 'public', 'relief');
const QUALITY = 82;

async function main() {
  const entries = await readdir(RELIEF_DIR);
  const pngs = entries.filter((f) => f.toLowerCase().endsWith('.png'));

  if (pngs.length === 0) {
    console.log(`(변환할 PNG 없음: ${RELIEF_DIR})`);
    return;
  }

  let totalBefore = 0;
  let totalAfter = 0;

  for (const file of pngs) {
    const src = path.join(RELIEF_DIR, file);
    const dest = path.join(RELIEF_DIR, file.replace(/\.png$/i, '.webp'));

    const before = (await stat(src)).size;
    await sharp(src).webp({ quality: QUALITY }).toFile(dest);
    const after = (await stat(dest)).size;

    totalBefore += before;
    totalAfter += after;

    const pct = (((before - after) / before) * 100).toFixed(1);
    console.log(
      `${file} → ${path.basename(dest)}: ${(before / 1024).toFixed(0)}KB → ${(after / 1024).toFixed(0)}KB (-${pct}%)`,
    );
  }

  const totalPct = (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1);
  console.log(
    `\n합계: ${(totalBefore / 1024).toFixed(0)}KB → ${(totalAfter / 1024).toFixed(0)}KB (-${totalPct}%)`,
  );
  console.log('\n원본 PNG는 지우지 않았습니다. 확인 후 `git rm public/relief/*.png`로 정리하고');
  console.log('meta.ts의 relief 경로를 .webp로 갱신하세요.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
