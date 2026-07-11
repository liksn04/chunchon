import type { FrontLine } from '../types';

/** 전선은 도식화된 근사 폴리라인(W→E). 날짜마다 남하. 구현 중 시각 보정. */
export const frontLines: FrontLine[] = [
  { date: '1950-06-25', approx: true, coordinates: [[127.60, 37.96], [127.734, 37.92], [127.90, 37.97], [128.10, 38.02]] },
  { date: '1950-06-26', approx: true, coordinates: [[127.60, 37.91], [127.734, 37.88], [127.90, 37.90], [128.10, 37.96]] },
  { date: '1950-06-27', approx: true, coordinates: [[127.60, 37.86], [127.700, 37.83], [127.889, 37.78], [128.05, 37.88]] },
  { date: '1950-06-28', approx: true, coordinates: [[127.60, 37.80], [127.75, 37.79], [127.889, 37.72], [128.02, 37.82]] },
  { date: '1950-06-29', approx: true, coordinates: [[127.60, 37.66], [127.889, 37.62], [128.05, 37.70]] },
  { date: '1950-06-30', approx: true, coordinates: [[127.70, 37.54], [127.985, 37.50], [128.15, 37.55]] },
  { date: '1950-07-01', approx: true, coordinates: [[127.80, 37.34], [127.926, 37.10], [128.19, 37.14]] },
];

export const frontLineByDate = new Map(frontLines.map((f) => [f.date, f]));
