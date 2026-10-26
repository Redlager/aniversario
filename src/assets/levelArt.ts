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
  [
    './ornamentacion/*.png',
    './ornamentacion/objetos/*.png',
    './ornamentacion/backgroaunds/*.png',
    '!./ornamentacion/backgroaunds/fondo menu principal.png',
  ],
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
    key: 'level-university-building',
    path: './ornamentacion/objetos/universidad.png',
    type: 'image',
  },
  {
    key: 'checkpoint-off',
    path: './ornamentacion/objetos/checkpoint apagado.png',
    type: 'spritesheet',
    frameWidth: 512,
    frameHeight: 768,
  },
  {
    key: 'checkpoint-on',
    path: './ornamentacion/objetos/checkpoint predido.png',
    type: 'spritesheet',
    frameWidth: 512,
    frameHeight: 768,
  },
  {
    key: 'level-pigeon',
    path: './ornamentacion/objetos/paloma.png',
    type: 'spritesheet',
    frameWidth: 543,
    frameHeight: 724,
  },
  {
    key: 'phone-unread-sheet',
    path: './ornamentacion/objetos/celular_sin_leer.png',
    type: 'spritesheet',
    frameWidth: 271,
    frameHeight: 724,
  },
  {
    key: 'phone-read-sheet',
    path: './ornamentacion/objetos/celular_leido.png',
    type: 'spritesheet',
    frameWidth: 271,
    frameHeight: 724,
  },
  {
    key: 'hamburger-power-up',
    path: './ornamentacion/objetos/hamburguesaPowerUp.png',
    type: 'image',
  },
  {
    key: 'collectible-star-art',
    path: './ornamentacion/objetos/estrella.png',
    type: 'image',
  },
  {
    key: 'collectible-heart-art',
    path: './ornamentacion/objetos/corazon.png',
    type: 'image',
  },
  {
    key: 'level-question-marker',
    path: './ornamentacion/objetos/pregunta.png',
    type: 'image',
  },
  {
    key: 'collectible-note',
    path: './ornamentacion/objetos/notas.png',
    type: 'image',
  },
  {
    key: 'level-bench',
    path: './ornamentacion/asiento banqueta parque.png',
    type: 'image',
  },
  {
    key: 'level-sign',
    path: './ornamentacion/objetos/letrero.png',
    type: 'image',
  },
  {
    key: 'level-faceworld-terminal',
    path: './ornamentacion/objetos/faceworld.png',
    type: 'image',
  },
  {
    key: 'level-exit-door',
    path: './ornamentacion/objetos/puertaNivel.png',
    type: 'image',
  },
  {
    key: 'level-ground-art',
    path: './ornamentacion/objetos/piso.png',
    type: 'image',
  },
  {
    key: 'level-indoor-ground-art',
    path: './ornamentacion/objetos/piso interior.png',
    type: 'image',
  },
  {
    key: 'level-platform-art',
    path: './ornamentacion/objetos/plataforma.png',
    type: 'image',
  },
  {
    key: 'level-indoor-platform-art',
    path: './ornamentacion/objetos/plataforma interior.png',
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
  {
    key: 'main-menu-background',
    path: './ornamentacion/backgroaunds/menuUltimaVersion.png',
    type: 'image',
  },
];
