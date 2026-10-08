import type { LevelConfig } from './LevelTypes';
import { level1, LEVEL_1_ID } from './level1';
import { level2, LEVEL_2_ID } from './level2';
import { level3, LEVEL_3_ID } from './level3';
import { level4, LEVEL_4_ID } from './level4';
import { level5 } from './level5';
import { level6, LEVEL_6_ID } from './level6';
import { level7, LEVEL_7_ID } from './level7';
import { level8, LEVEL_8_ID } from './level8';
import { finalLevel, LEVEL_FINAL_ID } from './finalLevel';

export const FIRST_LEVEL_ID = LEVEL_1_ID;

export const levels: Record<string, LevelConfig> = {
  [LEVEL_1_ID]: level1,
  [LEVEL_2_ID]: level2,
  [LEVEL_3_ID]: level3,
  [LEVEL_4_ID]: level4,
  [level5.id]: level5,
  [LEVEL_6_ID]: level6,
  [LEVEL_7_ID]: level7,
  [LEVEL_8_ID]: level8,
  [LEVEL_FINAL_ID]: finalLevel,
};
