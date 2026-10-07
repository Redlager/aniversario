import type { LevelConfig } from './LevelTypes';

export const LEVEL_7_ID = 'level-7-una-hamburguesa-nunca-cae-mal';

export const level7: LevelConfig = {
  id: LEVEL_7_ID,
  name: 'Nivel 7 · Una hamburguesa nunca cae mal',
  objective:
    'Llegá a la hamburguesa gigante y dejá que Vicky cierre la noche con la comida que más necesita.',
  world: {
    width: 3300,
    height: 760,
    backgroundColor: '#f7d4a3',
    backgroundStyle: 'home',
  },
  spawn: { x: 70, y: 548 },
  platforms: [
    { x: 260, y: 600, width: 520 },
    { x: 760, y: 540, width: 120, height: 24 },
    { x: 1120, y: 600, width: 420 },
    { x: 1510, y: 520, width: 140, height: 24 },
    { x: 1810, y: 600, width: 350 },
    { x: 2160, y: 520, width: 150, height: 24 },
    { x: 2440, y: 600, width: 460 },
    { x: 2800, y: 520, width: 160, height: 24 },
    { x: 3060, y: 600, width: 420 },
  ],
  checkpoints: [
    { id: 'entrada-hamburgueseria', x: 900, y: 548 },
    { id: 'antes-de-la-hamburguesa', x: 2520, y: 548 },
  ],
  collectibles: [
    { id: 'nota-mostrador', kind: 'notes', x: 300, y: 548 },
    { id: 'nota-mesas', kind: 'notes', x: 810, y: 485 },
    { id: 'corazon-papas', kind: 'heart', x: 1180, y: 550 },
    { id: 'nota-caja', kind: 'notes', x: 1840, y: 548 },
    { id: 'corazon-cocina', kind: 'heart', x: 2210, y: 470 },
    { id: 'nota-ingredientes', kind: 'notes', x: 2480, y: 548 },
    { id: 'corazon-final', kind: 'heart', x: 2880, y: 470 },
  ],
  npcs: [
    {
      id: 'renzo-llega-a-comer',
      label: 'RENZO',
      visual: 'renzo',
      x: 380,
      y: 548,
      dialogue:
        'Si la noche anterior fue una pesadilla, creo que esta es la parte en la que se empieza a recuperar el sentido común.',
    },
    {
      id: 'renzo-gag-hamburguesa',
      label: 'RENZO',
      visual: 'renzo',
      x: 2220,
      y: 548,
      dialogue: 'Eso no es una hamburguesa, eso es un objetivo.',
    },
  ],
  decorations: [
    { kind: 'door', x: 90, y: 588 },
    { kind: 'mailboxes', x: 220, y: 470, label: 'LA BURGERIA' },
    { kind: 'box', x: 420, y: 588 },
    { kind: 'bench', x: 630, y: 588 },
    { kind: 'lamp', x: 860, y: 588 },
    { kind: 'window', x: 1180, y: 405 },
    { kind: 'box', x: 1440, y: 588 },
    { kind: 'toybox', x: 1725, y: 588 },
    { kind: 'door', x: 1970, y: 588 },
    { kind: 'window', x: 2280, y: 410 },
    { kind: 'box', x: 2610, y: 588 },
    { kind: 'bench', x: 2820, y: 588 },
    { kind: 'lamp', x: 2995, y: 588 },
  ],
  exit: {
    x: 3100,
    y: 548,
    nextLevelId: 'level8',
    completionTitle: '¡UNA HAMBURGUESA NUNCA CAE MAL! ❤️',
    dialogue: [
      'Vicky: Una hamburguesa nunca cae mal.',
      'Renzo: Está bien. Lo admito. Eso sí tenía sentido.',
      'Y, mientras la noche seguía, una pregunta quedaba flotando en el aire…',
      '¿Qué pasa cuando una pareja comparte todo, hasta sus diferencias? ',
    ],
  },
};
