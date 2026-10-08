import type { LevelConfig } from './LevelTypes';
import { LEVEL_5_ID } from './level4';
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
        'Vicky... esto está raro.\nDecime que vos también viste esa sombra moverse.\nPorque si la viste, tenemos un problema.\nY si no la viste... tenemos un problema peor. 😂',
    },
    {
      id: 'fantasma-sala',
      label: 'FANTASMA',
      x: 1450,
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
        'Vicky, yo te acompaño, pero dejame aclarar algo.\nSi ese fantasma vuelve a aparecer...\nvos vas adelante. 😂\nYo te sigo desde una distancia prudente.',
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

export const level5: LevelConfig = {
  id: LEVEL_5_ID,
  name: 'Nivel 5 · La casa con patio',
  objective: 'Explorá la casa y el patio, y conocé al nuevo integrante de la familia.',
  world: {
    width: 3400,
    height: 760,
    backgroundColor: '#a9def2',
    backgroundStyle: 'yard',
  },
  spawn: { x: 70, y: 548 },
  platforms: [
    { x: 1700, y: 600, width: 3400 },
    { x: 570, y: 535, width: 130, height: 24 },
    { x: 1120, y: 520, width: 150, height: 24 },
    { x: 1530, y: 545, width: 135, height: 24 },
    { x: 1900, y: 525, width: 150, height: 24 },
    { x: 2580, y: 525, width: 145, height: 24 },
  ],
  checkpoints: [
    { id: 'llegada-al-patio', x: 760, y: 548 },
    { id: 'antes-de-canelo', x: 2110, y: 548 },
  ],
  collectibles: [
    {
      id: 'mudanza-patio',
      kind: 'notes',
      x: 500,
      y: 550,
      message:
        'Después de tantos cambios, por fin teníamos un lugar con un poquito más de espacio para todos.',
    },
    {
      id: 'recuerdo-jardin',
      kind: 'notes',
      x: 940,
      y: 550,
      message:
        'Un patio parecía un detalle... pero terminó convirtiéndose en uno de nuestros lugares favoritos.',
    },
    { id: 'corazon-ruta-elevada', kind: 'heart', x: 1190, y: 470 },
    {
      id: 'recuerdo-familia',
      kind: 'notes',
      x: 1690,
      y: 550,
      message:
        'Panchito, Oliver, Rex, Silvestre, Peach y Chocolatín. La casa ya estaba bastante llena. ❤️',
    },
    { id: 'corazon-canelo', kind: 'heart', x: 2645, y: 475 },
  ],
  npcs: [
    {
      id: 'renzo-casa-patio',
      label: 'RENZO',
      visual: 'renzo',
      x: 375,
      y: 548,
      dialogue:
        'Por fin una casa con un poquito más de espacio.\nPodemos caminar sin esquivar cajas, muebles y animales.\nBueno... casi. 😂',
    },
    {
      id: 'renzo-familia',
      label: 'RENZO',
      visual: 'renzo',
      x: 1760,
      y: 548,
      dialogue:
        'Mirá cómo estamos ahora.\nCada uno ya encontró su rincón, su lugar y su manera de hacer lío.\nCreo que finalmente tenemos una familia bastante completa. ❤️',
    },
    {
      id: 'renzo-presenta-canelo',
      label: 'RENZO',
      visual: 'renzo',
      x: 2240,
      y: 548,
      dialogue:
        'Vicky, quería presentarte a alguien.\nEncontró su lugar acá y parece bastante decidido a quedarse.\nAunque... técnicamente todavía no te lo presenté. 😅',
    },
    {
      id: 'canelo',
      label: 'CANELO',
      visual: 'canelo',
      x: 2390,
      y: 566,
      dialogue:
        'Este es Canelo. ❤️\nBlanco, marrón y bastante tranquilo.\nBueno... tranquilo hasta que decide que algo es suyo.',
    },
    {
      id: 'renzo-canelo-cierre',
      label: 'RENZO',
      visual: 'renzo',
      x: 2520,
      y: 548,
      dialogue:
        'Sí... creo que ya decidió que el patio es suyo.\nY nosotros simplemente vivimos acá. 😂',
    },
  ],
  decorations: [
    { kind: 'house', x: 250, y: 588 },
    { kind: 'box', x: 505, y: 588 },
    { kind: 'sofa', x: 650, y: 588 },
    { kind: 'tree', x: 880, y: 588 },
    { kind: 'bench', x: 1040, y: 588 },
    { kind: 'tree', x: 1350, y: 588 },
    { kind: 'pet-bed', x: 1510, y: 588 },
    { kind: 'toybox', x: 1640, y: 588 },
    { kind: 'pet', pet: 'panchito', x: 1690, y: 588 },
    { kind: 'pet', pet: 'oliver', x: 1750, y: 588 },
    { kind: 'pet', pet: 'rex', x: 1815, y: 588 },
    { kind: 'pet', pet: 'silvestre', x: 1880, y: 588 },
    { kind: 'pet', pet: 'peach', x: 1940, y: 588 },
    { kind: 'pet', pet: 'chocolatin', x: 2000, y: 588 },
    { kind: 'tree', x: 2160, y: 588 },
    { kind: 'pet-bed', x: 2390, y: 588 },
    { kind: 'toybox', x: 2460, y: 588 },
    { kind: 'tree', x: 2770, y: 588 },
    { kind: 'bench', x: 2900, y: 588 },
  ],
  exit: {
    x: 3050,
    y: 548,
    nextLevelId: LEVEL_6_ID,
    completionTitle: '¡NUESTRO LUGAR! ❤️',
    completionScene: 'family',
    dialogue: [
      'Después de tantos cambios, llegamos a un lugar que sentíamos realmente nuestro.',
      'Una casa con espacio para nosotros...',
      '...y para todos los animales que habían ido apareciendo por el camino. 😂',
      'Panchito, Oliver, Rex, Silvestre, Peach y Chocolatín.',
      'Y cuando parecía que finalmente estábamos completos...',
      'apareció Canelo. ❤️',
      'A esta altura ya habíamos aprendido algo importante.',
      'Cada vez que decíamos “este es el último”...',
      '...claramente no era el último. 😂',
      'Pero cada nuevo integrante hacía que nuestra casa se sintiera un poquito más como hogar.',
      'Y ahora sí teníamos nuestro lugar.',
      'Nuestra casa.',
      'Nuestra familia.',
      'Y todavía quedaban muchas historias por vivir.',
    ],
  },
};
