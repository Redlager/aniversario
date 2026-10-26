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
  sizeMultiplier?: number;
}

export interface CollectibleConfig extends Point {
  id: string;
  kind: 'notes' | 'heart' | 'star' | 'burger';
  message?: string;
  sizeMultiplier?: number;
  renderDepth?: number;
}

export interface EnemyConfig extends Point {
  id: string;
  kind?:
    | 'exam'
    | 'ghost'
    | 'cockroach'
    | 'scorpion'
    | 'beetle'
    | 'chef'
    | 'referee'
    | 'musician'
    | 'singer'
    | 'waitress';
  patrolDistance?: number;
  speed?: number;
  sizeMultiplier?: number;
  renderDepth?: number;
  defeatMessage?: string;
  displayLabel?: string;
}

export interface NpcConfig extends Point {
  id: string;
  label: string;
  dialogue: string;
  visual?: 'renzo' | 'phone' | 'elevator' | PetVisual;
  sizeMultiplier?: number;
  effect?: 'jumpscare';
}

export type PetVisual =
  'panchito' | 'oliver' | 'rex' | 'silvestre' | 'peach' | 'chocolatin' | 'canelo';

export interface ExitConfig extends Point {
  nextLevelId: string | null;
  dialogue?: string[];
  completionTitle?: string;
  completionScene?: 'family';
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
  | 'terminal'
  | 'box'
  | 'sofa'
  | 'bed'
  | 'lamp'
  | 'toybox'
  | 'door'
  | 'window'
  | 'pet-bed'
  | 'pet'
  | 'house'
  | 'mailboxes'
  | 'family-photo'
  | 'pigeons';

export interface DecorationConfig extends Point {
  kind: DecorationKind;
  label?: string;
  pet?: PetVisual;
  sizeMultiplier?: number;
}

export interface LevelConfig {
  id: string;
  name: string;
  objective: string;
  world: {
    width: number;
    height: number;
    backgroundColor?: string;
    backgroundStyle?: 'university' | 'sunset' | 'home' | 'apartment' | 'yard';
    backgroundImage?: string;
    backgroundMode?: 'stretch' | 'repeat';
  };
  surfaceTheme?: 'interior';
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

export interface MessageHistoryEntry {
  levelName: string;
  message: string;
  category: 'Nota' | 'Diálogo';
  detail?: string;
}

export class PlayerProgress {
  health = 3;
  collectibles = 0;
  notes = 0;
  hearts = 0;
  stars = 0;
  score = 0;
  enemiesDefeated = 0;
  checkpoint: CheckpointState = { id: 'start', levelId: '', x: 0, y: 0 };
  collectedIds: string[] = [];
  readMessageIds: string[] = [];
  currentLevelId = '';
  messageHistory: MessageHistoryEntry[] = [];

  reset(): void {
    this.health = 3;
    this.collectibles = 0;
    this.notes = 0;
    this.hearts = 0;
    this.stars = 0;
    this.score = 0;
    this.enemiesDefeated = 0;
    this.checkpoint = { id: 'start', levelId: '', x: 0, y: 0 };
    this.collectedIds = [];
    this.readMessageIds = [];
    this.currentLevelId = '';
    this.messageHistory = [];
  }
}
