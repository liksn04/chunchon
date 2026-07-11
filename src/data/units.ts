import type { MilitaryUnit } from '../types';

export const units: MilitaryUnit[] = [
  // ── 국군 제6사단 ──
  { id: 'rok-6div',  faction: 'ROK', designation: '국군 제6사단',    echelon: 'division',  commander: '대령 김종오', symbol: 'infantry' },
  { id: 'rok-7reg',  faction: 'ROK', designation: '제7연대',         echelon: 'regiment',  parent: 'rok-6div', commander: '중령 임부택', symbol: 'infantry' },
  { id: 'rok-2reg',  faction: 'ROK', designation: '제2연대',         echelon: 'regiment',  parent: 'rok-6div', commander: '대령 함병선', symbol: 'infantry' },
  { id: 'rok-19reg', faction: 'ROK', designation: '제19연대',        echelon: 'regiment',  parent: 'rok-6div', commander: '중령 민병권', symbol: 'infantry' },
  { id: 'rok-16art', faction: 'ROK', designation: '제16포병대대',    echelon: 'battalion', parent: 'rok-6div', commander: '소령 김성', symbol: 'artillery' },

  // ── 북한 제2군단 ──
  { id: 'nk-2corps', faction: 'NK', designation: '북한 제2군단',       echelon: 'corps',    commander: '중장 김광협', symbol: 'infantry' },
  { id: 'nk-2div',   faction: 'NK', designation: '제2사단',           echelon: 'division', parent: 'nk-2corps', commander: '소장 리청송', symbol: 'armor' },
  { id: 'nk-12div',  faction: 'NK', designation: '제12사단',          echelon: 'division', parent: 'nk-2corps', commander: '소장 전우', symbol: 'armor' },
  { id: 'nk-15div',  faction: 'NK', designation: '제15사단',          echelon: 'division', parent: 'nk-2corps', commander: '소장 박성철', symbol: 'infantry' },
  { id: 'nk-603mot', faction: 'NK', designation: '제603 모터찌클연대', echelon: 'regiment', parent: 'nk-2corps', symbol: 'motorized' },
];

export const unitById = new Map(units.map((u) => [u.id, u]));
