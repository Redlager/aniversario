export interface CharacterSpriteSheet {
  animationKey: string;
  frameCount: number;
  frameHeight: number;
  frameRate: number;
  frameWidth: number;
  path: string;
  repeat: number;
  textureKey: string;
  yoyo?: boolean;
}

export const characterSpriteSheetUrls = import.meta.glob<string>(
  [
    './characters/**/*.png',
    '!./characters/el-parcial/parcial vivo.png',
    '!./characters/el-parcial/parcial muerto.png',
  ],
  { eager: true, query: '?url', import: 'default' },
);

export const characterSpriteSheets: CharacterSpriteSheet[] = [
  {
    animationKey: 'vicky-idle',
    textureKey: 'vicky-idle-sheet',
    path: './characters/vicky/idle.png',
    frameWidth: 40,
    frameHeight: 50,
    frameCount: 4,
    frameRate: 4,
    repeat: -1,
  },
  {
    animationKey: 'vicky-walk',
    textureKey: 'vicky-walk-sheet',
    path: './characters/vicky/walk.png',
    frameWidth: 40,
    frameHeight: 50,
    frameCount: 6,
    frameRate: 10,
    repeat: -1,
  },
  {
    animationKey: 'vicky-jump',
    textureKey: 'vicky-jump-sheet',
    path: './characters/vicky/jump.png',
    frameWidth: 40,
    frameHeight: 50,
    frameCount: 3,
    frameRate: 8,
    repeat: 0,
  },
  {
    animationKey: 'vicky-fall',
    textureKey: 'vicky-fall-sheet',
    path: './characters/vicky/fall.png',
    frameWidth: 40,
    frameHeight: 50,
    frameCount: 2,
    frameRate: 6,
    repeat: -1,
  },
  {
    animationKey: 'vicky-damage',
    textureKey: 'vicky-damage-sheet',
    path: './characters/vicky/damage.png',
    frameWidth: 40,
    frameHeight: 50,
    frameCount: 3,
    frameRate: 10,
    repeat: 0,
  },
  {
    animationKey: 'renzo-idle',
    textureKey: 'renzo-idle-sheet',
    path: './characters/renzo/idle.png',
    frameWidth: 40,
    frameHeight: 50,
    frameCount: 4,
    frameRate: 4,
    repeat: -1,
  },
  {
    animationKey: 'renzo-appear',
    textureKey: 'renzo-appear-sheet',
    path: './characters/renzo/appear.png',
    frameWidth: 40,
    frameHeight: 50,
    frameCount: 6,
    frameRate: 8,
    repeat: 0,
  },
  {
    animationKey: 'exam-float',
    textureKey: 'exam-patrol-sheet',
    path: './characters/el-parcial/patrol.png',
    frameWidth: 44,
    frameHeight: 48,
    frameCount: 4,
    frameRate: 6,
    repeat: -1,
    yoyo: true,
  },
  {
    animationKey: 'exam-defeat',
    textureKey: 'exam-defeat-sheet',
    path: './characters/el-parcial/defeat.png',
    frameWidth: 44,
    frameHeight: 48,
    frameCount: 4,
    frameRate: 10,
    repeat: 0,
  },
];
