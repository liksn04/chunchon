/**
 * 음영기복 래스터 생성 — `npm run relief:make <battle-id>`
 * AWS 공개 표고 타일(terrarium, z12)을 meta.reliefBbox 범위로 수집해
 * Horn 힐셰이드를 계산하고, 춘천 래스터의 명암 팔레트를 샘플링해
 * 라이트/다크 PNG를 public/relief/에 출력한다. 이후 `npm run relief:webp` 실행.
 * 좌표계는 웹 메르카토르 타일 그대로이므로 reliefBbox와 자동으로 정합된다.
 */
import sharp from 'sharp';
import { battleMetas } from '../src/battles/registry';

const id = process.argv[2];
const meta = battleMetas.find((m) => m.id === id);
if (!id || !meta) {
  console.error('사용법: npm run relief:make <battle-id> — 등록된 id:', battleMetas.map((m) => m.id).join(', '));
  process.exit(1);
}
if (!meta.reliefBbox) {
  console.error(`${id}: meta.reliefBbox가 없습니다. 먼저 meta에 범위를 정의하세요.`);
  process.exit(1);
}
const BBOX = meta.reliefBbox;
const Z = 12;
const N = 2 ** Z;

const lng2x = (lng) => ((lng + 180) / 360) * N;
const lat2y = (lat) => {
  const r = (lat * Math.PI) / 180;
  return ((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2) * N;
};

const x0 = Math.floor(lng2x(BBOX.sw[0]));
const x1 = Math.floor(lng2x(BBOX.ne[0]));
const y0 = Math.floor(lat2y(BBOX.ne[1])); // 북쪽이 작은 y
const y1 = Math.floor(lat2y(BBOX.sw[1]));
const cols = x1 - x0 + 1, rows = y1 - y0 + 1;
const W = cols * 256, H = rows * 256;
console.log(`tiles x ${x0}-${x1} y ${y0}-${y1} (${cols}x${rows}), mosaic ${W}x${H}`);

// 1) 타일 수집 → 표고 그리드
const elev = new Float32Array(W * H);
let fetched = 0;
for (let ty = y0; ty <= y1; ty++) {
  await Promise.all(
    Array.from({ length: cols }, async (_, i) => {
      const tx = x0 + i;
      const url = `https://s3.amazonaws.com/elevation-tiles-prod/terrarium/${Z}/${tx}/${ty}.png`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`tile ${tx}/${ty}: ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const { data } = await sharp(buf).raw().toBuffer({ resolveWithObject: true });
      const ox = (tx - x0) * 256, oy = (ty - y0) * 256;
      for (let p = 0; p < 256; p++)
        for (let q = 0; q < 256; q++) {
          const s = (p * 256 + q) * 3;
          elev[(oy + p) * W + ox + q] = data[s] * 256 + data[s + 1] + data[s + 2] / 256 - 32768;
        }
      fetched++;
    }),
  );
  process.stdout.write(`\r${fetched}/${cols * rows}`);
}
console.log(' 타일 완료');

// 2) Horn 힐셰이드 (방위 315°, 고도 45°, 수직 과장 1.3)
const midLat = (BBOX.sw[1] + BBOX.ne[1]) / 2;
const res = (156543.03392 * Math.cos((midLat * Math.PI) / 180)) / N; // m/px
const zf = 1.3;
const az = (315 * Math.PI) / 180, alt = (45 * Math.PI) / 180;
const hs = new Float32Array(W * H).fill(Math.sin(alt));
const g = (x, y) => elev[Math.min(H - 1, Math.max(0, y)) * W + Math.min(W - 1, Math.max(0, x))];
for (let y = 0; y < H; y++)
  for (let x = 0; x < W; x++) {
    const dzdx = ((g(x + 1, y - 1) + 2 * g(x + 1, y) + g(x + 1, y + 1)) - (g(x - 1, y - 1) + 2 * g(x - 1, y) + g(x - 1, y + 1))) / (8 * res);
    const dzdy = ((g(x - 1, y + 1) + 2 * g(x, y + 1) + g(x + 1, y + 1)) - (g(x - 1, y - 1) + 2 * g(x, y - 1) + g(x + 1, y - 1))) / (8 * res);
    const slope = Math.atan(zf * Math.hypot(dzdx, dzdy));
    const aspect = Math.atan2(dzdy, -dzdx);
    hs[y * W + x] = Math.max(0, Math.sin(alt) * Math.cos(slope) + Math.cos(alt) * Math.sin(slope) * Math.cos(az - Math.PI / 2 - aspect));
  }

// 3) bbox 정밀 크롭 좌표
const cx0 = Math.round((lng2x(BBOX.sw[0]) - x0) * 256);
const cx1 = Math.round((lng2x(BBOX.ne[0]) - x0) * 256);
const cy0 = Math.round((lat2y(BBOX.ne[1]) - y0) * 256);
const cy1 = Math.round((lat2y(BBOX.sw[1]) - y0) * 256);
const CW = cx1 - cx0, CH = cy1 - cy0;
console.log(`crop ${CW}x${CH}`);

// 크롭 내 p2/p98로 대비 스트레치
const vals = [];
for (let y = cy0; y < cy1; y += 3) for (let x = cx0; x < cx1; x += 3) vals.push(hs[y * W + x]);
vals.sort((a, b) => a - b);
const p2 = vals[(vals.length * 0.02) | 0], p98 = vals[(vals.length * 0.98) | 0];

// 4) 춘천 래스터에서 테마별 색 범위 샘플링(p5=음영, p95=수광)
async function palette(file) {
  const { data, info } = await sharp(file).resize(200).raw().toBuffer({ resolveWithObject: true });
  const px = [];
  for (let i = 0; i < data.length; i += info.channels) {
    px.push([data[i], data[i + 1], data[i + 2], data[i] + data[i + 1] + data[i + 2]]);
  }
  px.sort((a, b) => a[3] - b[3]);
  const at = (f) => px[(px.length * f) | 0];
  return { dark: at(0.05), light: at(0.95) };
}
const palL = await palette('public/relief/chuncheon-light.webp');
const palD = await palette('public/relief/chuncheon-dark.webp');
console.log('palette light', palL, 'dark', palD);

// 5) 톤 매핑 렌더
async function render(pal, out) {
  const img = Buffer.alloc(CW * CH * 3);
  for (let y = 0; y < CH; y++)
    for (let x = 0; x < CW; x++) {
      let t = (hs[(cy0 + y) * W + cx0 + x] - p2) / (p98 - p2);
      t = Math.max(0, Math.min(1, t));
      t = Math.pow(t, 1.15); // 살짝 음영 쪽 강조
      const o = (y * CW + x) * 3;
      for (let c = 0; c < 3; c++) img[o + c] = Math.round(pal.dark[c] + (pal.light[c] - pal.dark[c]) * t);
    }
  await sharp(img, { raw: { width: CW, height: CH, channels: 3 } }).png().toFile(out);
  console.log('wrote', out);
}
await render(palL, `public/relief/${id}-light.png`);
await render(palD, `public/relief/${id}-dark.png`);
