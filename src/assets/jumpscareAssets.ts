export const jumpscareImageUrls = import.meta.glob<string>(
  [
    './characters/carasTenebrosas/cara 1.jpeg',
    './characters/carasTenebrosas/cara 2.jpeg',
    './characters/carasTenebrosas/cara 3.jpg',
    './characters/carasTenebrosas/cara 4.jpeg',
    './characters/carasTenebrosas/cara 5.jpeg',
    './characters/carasTenebrosas/cara 6.jpeg',
  ],
  { eager: true, query: '?url', import: 'default' },
);

export const jumpscareImagePaths = [
  './characters/carasTenebrosas/cara 1.jpeg',
  './characters/carasTenebrosas/cara 2.jpeg',
  './characters/carasTenebrosas/cara 3.jpg',
  './characters/carasTenebrosas/cara 4.jpeg',
  './characters/carasTenebrosas/cara 5.jpeg',
  './characters/carasTenebrosas/cara 6.jpeg',
] as const;
