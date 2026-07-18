import type { MapLabelPlacement, TerrainContour } from '../../../types';

/** 지도 편집값 — 스타일 표준: 전체 보기 사건 라벨 ≤5, 이동축 ≤3 */
export const eventLabels: Record<string, MapLabelPlacement> = {};
export const movementLabels: Record<string, MapLabelPlacement> = {};
export const terrainPointLabels: Record<string, MapLabelPlacement> = {};
export const terrainLineLabels: Record<string, MapLabelPlacement> = {};
export const terrainContours: Record<string, TerrainContour> = {};
export const emphasizedTerrainLines = new Set<string>();
