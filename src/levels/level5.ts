import type { LevelConfig } from './LevelTypes';
import { LEVEL_5_ID } from './level4';
import { LEVEL_6_ID } from './level6';

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
  enemies: [
    { id: 'cucaracha-mudanza', kind: 'cockroach', x: 820, y: 558, patrolDistance: 38, speed: 48 },
    { id: 'alacran-patio', kind: 'scorpion', x: 1320, y: 558, patrolDistance: 42, speed: 42 },
    { id: 'cucaracha-cajas', kind: 'cockroach', x: 2180, y: 558, patrolDistance: 38, speed: 50 },
    { id: 'alacran-salida', kind: 'scorpion', x: 2780, y: 558, patrolDistance: 42, speed: 44 },
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
        'Vic... ¿y este conejo?\nVos lo trajiste, yo dije que no...\ny mirá cómo terminamos. 😅',
    },
    {
      id: 'canelo',
      label: 'CANELO',
      visual: 'canelo',
      x: 2390,
      y: 566,
      dialogue:
        'Este es Canelo. ❤️\nVicky decidió que tenía que formar parte de la familia.\nRenzo se hizo el difícil al principio... pero terminó aceptándome.',
    },
    {
      id: 'renzo-canelo-cierre',
      label: 'RENZO',
      visual: 'renzo',
      x: 2520,
      y: 548,
      dialogue:
        'Bueno... sí.\nMe negué un poquito.\nPero miralo. ¿Cómo le iba a decir que no para siempre? 😂',
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
