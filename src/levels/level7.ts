import type { LevelConfig } from './LevelTypes';
import { LEVEL_8_ID } from './level8';

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
    {
      id: 'nota-mostrador',
      kind: 'notes',
      x: 300,
      y: 548,
      message:
        'Después de sobrevivir a una noche sobrenatural, había una prioridad bastante clara: conseguir algo rico para comer.',
    },
    {
      id: 'nota-mesas',
      kind: 'notes',
      x: 810,
      y: 485,
      message:
        'Una mesa vacía, una noche tranquila y una hamburguesa cerca. Por fin, un problema fácil de resolver. 😂',
    },
    { id: 'corazon-papas', kind: 'heart', x: 1180, y: 550 },
    {
      id: 'nota-caja',
      kind: 'notes',
      x: 1840,
      y: 548,
      message:
        'En algún lugar de esta cocina hay comida suficiente para alimentar a una familia entera. Probablemente también a algunos fantasmas.',
    },
    { id: 'corazon-cocina', kind: 'heart', x: 2210, y: 470 },
    {
      id: 'nota-ingredientes',
      kind: 'notes',
      x: 2480,
      y: 548,
      message:
        'Pan, carne, queso, papas... técnicamente no hacía falta nada más. Aunque siempre se puede pedir algo más. 😏',
    },
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
        'Después de fantasmas, sombras y una noche bastante cuestionable...\ncreo que necesitamos algo importante.\nComida. Mucha comida. 😂',
    },
    {
      id: 'renzo-gag-hamburguesa',
      label: 'RENZO',
      visual: 'renzo',
      x: 2220,
      y: 548,
      dialogue:
        '¡Che!... mira esa mac doble cuarto de libra y esa tasty doble \nY con la lija que tenemos, vamos a comerla en 5 segundos con papas incluidas. 😂',
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
    nextLevelId: LEVEL_8_ID,
    completionTitle: '¡UNA HAMBURGUESA DEL MAC\nNUNCA CAE MAL! ❤️',
    dialogue: [
      'Vicky: Una hamburguesa nunca cae mal.',
      'Renzo: Después de lo que vivimos hoy, no puedo discutir eso.',
      'Vicky: ¿Viste?',
      'Renzo: Igual hay algo que tenemos que decidir.',
      'Vicky: ¿Qué cosa?',
      'Renzo: ¿Qué acompañamiento va mejor con una hamburguesa?',
      'Vicky: Papas.',
      'Renzo: Obviamente.',
      'Vicky: ¿Obviamente?',
      'Renzo: Sí.',
      'Vicky: Bueno... por lo menos en eso estamos de acuerdo.',
      'Renzo: Por ahora.',
      'Porque después de la hamburguesa...',
      '...hay temas mucho más importantes que discutir. 😂',
    ],
  },
};
