export const levelMusicUrls = import.meta.glob<string>(
  ['./music/musica nivel terror.mp3'],
  { eager: true, query: '?url', import: 'default' },
);
