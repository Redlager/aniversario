export interface Point {
  x: number;
  y: number;
}

export interface PlatformConfig {
  x: number;
  y: number;
  width: number;
  height?: number;
}

export interface CheckpointConfig extends Point {
  id: string;
}

export interface CollectibleConfig extends Point {
  id: string;
  kind: 'notes' | 'heart' | 'star';
}

export interface EnemyConfig extends Point {
  id: string;
  kind?: 'exam';
  patrolDistance?: number;
  speed?: number;
}

export interface NpcConfig extends Point {
  id: string;
  label: string;
  dialogue: string;
}

export interface ExitConfig extends Point {
  nextLevelId: string | null;
  dialogue?: string[];
  completionTitle?: string;
}

export type DecorationKind =
  | 'university'
  | 'tree'
  | 'bench'
  | 'sign'
  | 'books'
  | 'brain'
  | 'couch'
  | 'blackboard'
  | 'laptop'
  | 'phone'
  | 'cable'
  | 'social-icons'
  | 'terminal';

export interface DecorationConfig extends Point {
  kind: DecorationKind;
  label?: string;
}

export interface LevelConfig {
  id: string;
  name: string;
  objective: string;
  world: {
    width: number;
    height: number;
    backgroundColor?: string;
  };
  spawn: Point;
  platforms?: PlatformConfig[];
  checkpoints?: CheckpointConfig[];
  collectibles?: CollectibleConfig[];
  enemies?: EnemyConfig[];
  npcs?: NpcConfig[];
  decorations?: DecorationConfig[];
  exit: ExitConfig;
}

export interface CheckpointState extends Point {
  id: string;
  levelId: string;
}

export class PlayerProgress {
  health = 3;
  collectibles = 0;
  notes = 0;
  hearts = 0;
  stars = 0;
  checkpoint: CheckpointState = { id: 'start', levelId: '', x: 0, y: 0 };
  collectedIds: string[] = [];
  currentLevelId = '';

  reset(): void {
    this.health = 3;
    this.collectibles = 0;
    this.notes = 0;
    this.hearts = 0;
    this.stars = 0;
    this.checkpoint = { id: 'start', levelId: '', x: 0, y: 0 };
    this.collectedIds = [];
    this.currentLevelId = '';
  }
}
