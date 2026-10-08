import type { LevelConfig } from './LevelTypes';
import { LEVEL_7_ID } from './level7';

export const LEVEL_6_ID = 'level-6-el-mundo-sobrenatural';

export const level6: LevelConfig = {
  id: LEVEL_6_ID,
  name: 'Nivel 6 · El mundo sobrenatural',
  objective:
    'Recorré la casa y el sendero extraño, superá la noche rara y salí con la historia viva.',
  world: {
    width: 3200,
    height: 760,
    backgroundColor: '#171a2b',
    backgroundStyle: 'home',
  },
  spawn: { x: 70, y: 548 },
  platforms: [
    { x: 350, y: 600, width: 700 },
    { x: 780, y: 520, width: 140, height: 24 },
    { x: 1080, y: 600, width: 520 },
    { x: 1425, y: 510, width: 150, height: 24 },
    { x: 1760, y: 600, width: 440 },
    { x: 2095, y: 520, width: 140, height: 24 },
    { x: 2410, y: 600, width: 520 },
    { x: 2715, y: 525, width: 140, height: 24 },
    { x: 2950, y: 600, width: 470 },
  ],
  checkpoints: [
    { id: 'entrada-sobrenatural', x: 980, y: 548 },
    { id: 'antes-del-final', x: 2440, y: 548 },
  ],
  collectibles: [
    {
      id: 'nota-ventana-rara',
      kind: 'notes',
      x: 260,
      y: 548,
      message:
        'La casa estaba tranquila... demasiado tranquila. Y esa ventana definitivamente no estaba así hace un rato. 👀',
    },
    {
      id: 'nota-sombra',
      kind: 'notes',
      x: 820,
      y: 470,
      message:
        'Hay cosas que uno prefiere no investigar. Esta vez, sin embargo, ya habíamos llegado demasiado lejos. 😂',
    },
    { id: 'corazon-puerta', kind: 'heart', x: 1200, y: 550 },
    {
      id: 'nota-porche',
      kind: 'notes',
      x: 1600,
      y: 548,
      message:
        'No sabemos qué era esa cosa. Pero al menos parecía tener mejores modales que algunos fantasmas de las películas. 👻',
    },
    { id: 'corazon-casa', kind: 'heart', x: 2120, y: 470 },
    {
      id: 'nota-fantasma',
      kind: 'notes',
      x: 2520,
      y: 548,
      message: 'Después de todo, hasta los fantasmas pueden necesitar un poquito de compañía.',
    },
    { id: 'corazon-salida', kind: 'heart', x: 2840, y: 475 },
  ],
  npcs: [
    {
      id: 'renzo-noche-rara',
      label: 'RENZO',
      visual: 'renzo',
      x: 420,
      y: 548,
      dialogue:
        'Vic... esto está raro. Decime que vos también viste esa sombra moverse.\nPorque si la viste, tenemos un problema.\nY si no la viste... tenemos un problema peor. 😂',
    },
    {
      id: 'fantasma-sala',
      label: 'FANTASMA',
      x: 1700,
      y: 560,
      dialogue:
        'Yo no quería asustarte...\nsolo quería que me vieras.\nHace bastante que intento llamar la atención por acá.',
    },
    {
      id: 'renzo-final',
      label: 'RENZO',
      visual: 'renzo',
      x: 2380,
      y: 548,
      dialogue:
        'Vic, yo te acompaño, pero dejame aclarar algo. Si ese fantasma vuelve a aparecer...\nvos vas adelante. 😂\nYo te sigo desde una distancia prudente.',
    },
  ],
  decorations: [
    { kind: 'house', x: 150, y: 588 },
    { kind: 'door', x: 420, y: 588 },
    { kind: 'window', x: 660, y: 420 },
    { kind: 'lamp', x: 880, y: 588 },
    { kind: 'box', x: 1090, y: 588 },
    { kind: 'bench', x: 1250, y: 588 },
    { kind: 'tree', x: 1520, y: 588 },
    { kind: 'window', x: 1860, y: 415 },
    { kind: 'door', x: 2140, y: 588 },
    { kind: 'mailboxes', x: 2280, y: 460, label: 'CASA EMBRUJADA' },
    { kind: 'box', x: 2480, y: 588 },
    { kind: 'lamp', x: 2660, y: 588 },
    { kind: 'window', x: 2920, y: 420 },
  ],
  exit: {
    x: 3000,
    y: 548,
    nextLevelId: LEVEL_7_ID,
    completionTitle: '¡NIVEL COMPLETADO! ❤️',
    dialogue: [
      'Esto fue horrible…',
      'pero lo hicimos juntos.',
      'Y después de una noche así…',
      'lo único que nos faltaba era comer algo.',
    ],
  },
};
