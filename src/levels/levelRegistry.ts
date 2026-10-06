import type { LevelConfig } from './LevelTypes';
import { level1, LEVEL_1_ID } from './level1';

export const FIRST_LEVEL_ID = LEVEL_1_ID;

export const levels: Record<string, LevelConfig> = {
  [LEVEL_1_ID]: level1,
};
