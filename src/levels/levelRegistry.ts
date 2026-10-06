import type { LevelConfig } from './LevelTypes';
import { level1, LEVEL_1_ID } from './level1';
import { level2, LEVEL_2_ID } from './level2';
import { level3, LEVEL_3_ID } from './level3';
import { level4, LEVEL_4_ID } from './level4';

export const FIRST_LEVEL_ID = LEVEL_1_ID;

export const levels: Record<string, LevelConfig> = {
  [LEVEL_1_ID]: level1,
  [LEVEL_2_ID]: level2,
  [LEVEL_3_ID]: level3,
  [LEVEL_4_ID]: level4,
};
