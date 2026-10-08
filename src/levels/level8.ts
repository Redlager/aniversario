import type { LevelConfig } from './LevelTypes';

export const LEVEL_8_ID = 'level-8-boca-vs-river';

export const level8: LevelConfig = {
  id: LEVEL_8_ID,
  name: 'Nivel 8 · Boca vs River',
  objective:
    'Señalá tu color, aceptá el debate absurdo y cerrá la noche entendiendo que lo más importante es seguir juntos.',
  world: {
    width: 3000,
    height: 760,
    backgroundColor: '#dfe7ff',
    backgroundStyle: 'sunset',
  },
  spawn: { x: 70, y: 548 },
  platforms: [
    //x posicion horizontal, y posicion vertical, width ancho, height alto
    { x: 220, y: 600, width: 340 },
    { x: 620, y: 560, width: 220, height: 24 },
    { x: 900, y: 600, width: 360 },
    { x: 1360, y: 540, width: 320, height: 24 },
    { x: 1600, y: 600, width: 360 },
    { x: 2050, y: 540, width: 320, height: 24 },
    { x: 2280, y: 600, width: 420 },
    { x: 2770, y: 540, width: 320, height: 24 },
    { x: 2970, y: 600, width: 220 },
  ],
  checkpoints: [
    { id: 'discusion-inicial', x: 930, y: 548 },
    { id: 'antes-del-cierre', x: 2360, y: 548 },
  ],
  collectibles: [
    {
      id: 'nota-discusion',
      kind: 'notes',
      x: 280,
      y: 548,
      message:
        'Hay parejas que discuten por dinero, por quién dejó algo fuera de lugar o por quién tiene razón.\nNosotros tenemos un método más simple: Boca vs River. 😂',
    },
    { id: 'corazon-azul', kind: 'heart', x: 930, y: 480 },
    {
      id: 'nota-territorio-vicky',
      kind: 'notes',
      x: 1180,
      y: 548,
      message: 'Territorio de Vicky: azul y amarillo.\nEntrar bajo su propio riesgo. 😏',
    },
    { id: 'corazon-rojo', kind: 'heart', x: 1800, y: 548 },
    {
      id: 'nota-partido',
      kind: 'notes',
      x: 2380,
      y: 548,
      message:
        'Después de tantos años juntos, algunas cosas nunca cambiaron.\nElla sigue siendo de Boca.\nY yo sigo creyendo que algún día va a entrar en razón. 😂',
    },
    { id: 'corazon-cierre', kind: 'heart', x: 2780, y: 470 },
  ],
  npcs: [
    {
      id: 'renzo-discusion',
      label: 'RENZO',
      visual: 'renzo',
      x: 420,
      y: 548,
      dialogue:
        'No voy a discutir de fútbol con vos.\nTenemos demasiados años juntos como para caer en esa trampa. 😂',
    },
    {
      id: 'renzo-azul',
      label: 'RENZO',
      visual: 'renzo',
      x: 1620,
      y: 548,
      dialogue:
        'A ver, a ver...\nYo no dije nada.\nVos empezaste a hablar de Boca.\nY ahora resulta que yo soy el problema. 😂',
    },
    {
      id: 'renzo-cierre',
      label: 'RENZO',
      visual: 'renzo',
      x: 2560,
      y: 548,
      dialogue:
        'Eso es exactamente lo que diría alguien que sabe que está equivocada.\nPero bueno...\nte voy a dejar disfrutar esta pequeña victoria. 😏',
    },
  ],
  decorations: [
    { kind: 'box', x: 130, y: 588 },
    { kind: 'bench', x: 420, y: 588 },
    { kind: 'lamp', x: 620, y: 588 },
    { kind: 'sign', x: 920, y: 590, label: 'AZUL · AMARILLO' },
    { kind: 'mailboxes', x: 1100, y: 470, label: 'TERRITORIO VICKY' },
    { kind: 'door', x: 1380, y: 588 },
    { kind: 'window', x: 1580, y: 410 },
    { kind: 'box', x: 1860, y: 588 },
    { kind: 'lamp', x: 2050, y: 588 },
    { kind: 'sign', x: 2330, y: 590, label: 'ROJO · BLANCO' },
    { kind: 'window', x: 2680, y: 420 },
    { kind: 'bench', x: 2850, y: 588 },
    { kind: 'toybox', x: 3010, y: 588 },
  ],
  exit: {
    x: 2860,
    y: 548,
    nextLevelId: 'final',
    completionTitle: '¿Podemos estar de acuerdo en algo? ❤️',
    dialogue: [
      'Vicky: Boca.',
      'Renzo: River.',
      'Vicky: Boca.',
      'Renzo: River.',
      'Vicky: ¿Vas a seguir con eso?',
      'Renzo: Vos empezaste.',
      'Vicky: Mentira.',
      'Renzo: Prueba número uno: acabás de decir “Boca”.',
      'Vicky: ...',
      'Vicky: Bueno. Puede ser. 😂',
      'Después de tantos años juntos...',
      'hay cosas en las que probablemente nunca vamos a estar de acuerdo.',
      'Pero también hay muchas otras en las que sí.',
      'Compartimos una vida.',
      'Una casa.',
      'Una familia.',
      'Un montón de recuerdos.',
      'Y hasta sobrevivimos a fantasmas y discusiones por fútbol. 😂',
      'Así que, después de todo...',
      'hay algo en lo que siempre estamos de acuerdo.',
      'Que seguimos eligiéndonos.',
      'Y ahora sí...',
      'vamos a recordar cómo empezó todo. ❤️',
    ],
  },
};
