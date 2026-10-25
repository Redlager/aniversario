export const sfxUrls = import.meta.glob<string>(
  [
    './sfx/gameOver.wav',
    './sfx/jump.wav',
    './sfx/deathEnemym4a.m4a',
    './sfx/soundColleccionable.wav',
  ],
  { eager: true, query: '?url', import: 'default' },
);

export const sfxAssets = [
  { key: 'sfx-game-over', path: './sfx/gameOver.wav' },
  { key: 'sfx-jump', path: './sfx/jump.wav' },
  { key: 'sfx-enemy-death', path: './sfx/deathEnemym4a.m4a' },
  { key: 'sfx-collectible', path: './sfx/soundColleccionable.wav' },
] as const;
