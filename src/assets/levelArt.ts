interface LevelArtAssetBase {
  key: string;
  path: string;
}

export type LevelArtAsset =
  | (LevelArtAssetBase & { type: 'image' })
  | (LevelArtAssetBase & {
      type: 'spritesheet';
      frameWidth: number;
      frameHeight: number;
    });

export const levelArtUrls = import.meta.glob<string>(
  ['./ornamentacion/*.png', './ornamentacion/backgroaunds/*.png'],
  {
    eager: true,
    query: '?url',
    import: 'default',
  },
);

export const levelArtAssets: LevelArtAsset[] = [
  {
    key: 'level-ground-atlas',
    path: './ornamentacion/tierra.png',
    type: 'spritesheet',
    frameWidth: 362,
    frameHeight: 362,
  },
  {
    key: 'level-platform-atlas',
    path: './ornamentacion/plataformas.png',
    type: 'spritesheet',
    frameWidth: 443,
    frameHeight: 443,
  },
  {
    key: 'level-wall-atlas',
    path: './ornamentacion/pared.png',
    type: 'spritesheet',
    frameWidth: 362,
    frameHeight: 362,
  },
  {
    key: 'level-tree',
    path: './ornamentacion/arbol.png',
    type: 'image',
  },
  {
    key: 'level-bench',
    path: './ornamentacion/asiento banqueta parque.png',
    type: 'image',
  },
  {
    key: 'level-university-background',
    path: './ornamentacion/fodo del juego.png',
    type: 'image',
  },
  {
    key: 'level-2-background',
    path: './ornamentacion/backgroaunds/fondo nivel 2.png',
    type: 'image',
  },
  {
    key: 'level-3-background',
    path: './ornamentacion/backgroaunds/fondo nivel 3.png',
    type: 'image',
  },
  {
    key: 'level-4-background',
    path: './ornamentacion/backgroaunds/fondo nivel 4.png',
    type: 'image',
  },
  {
    key: 'level-5-background',
    path: './ornamentacion/backgroaunds/fondo nivel 5.png',
    type: 'image',
  },
  {
    key: 'level-6-background',
    path: './ornamentacion/backgroaunds/fondo nivel 6.png',
    type: 'image',
  },
  {
    key: 'level-7-background',
    path: './ornamentacion/backgroaunds/fondo nivel 7.png',
    type: 'image',
  },
  {
    key: 'level-8-background',
    path: './ornamentacion/backgroaunds/fondo nivel 8.png',
    type: 'image',
  },
  {
    key: 'level-final-background',
    path: './ornamentacion/backgroaunds/fondo nivel final.png',
    type: 'image',
  },
];
