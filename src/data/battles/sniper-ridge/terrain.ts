import type { TerrainPoint, TerrainLine, LngLat } from '../../../types';

export const terrainPoints: TerrainPoint[] = [];
export const terrainLines: TerrainLine[] = [];
/** 전투권에 38선이 지나지 않으면 빈 배열 유지 */
export const boundary38: LngLat[] = [];
