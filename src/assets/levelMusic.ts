export interface MusicTrack {
  key: string;
  url?: string;
}

const musicUrls = import.meta.glob<string>(
  [
    './music/menu.mp3',
    './music/nivel 1.mp3',
    './music/nivel 2.mp3',
    './music/nivel 3.mp3',
    './music/nivel 4.mp3',
    './music/nivel 5.mp3',
    './music/musica nivel terror.mp3',
    './music/nivel 7.mp3',
    './music/nivel 8.mp3',
    './music/nivel final.mp3',
  ],
  { eager: true, query: '?url', import: 'default' },
);

export const menuMusicTrack: MusicTrack = {
  key: 'menu-background-music',
  url: musicUrls['./music/menu.mp3'],
};

const levelMusicPaths: Record<string, { key: string; path: string }> = {
  'level-1-el-match': { key: 'level-1-background-music', path: './music/nivel 1.mp3' },
  'level-2-nosotros-dos': { key: 'level-2-background-music', path: './music/nivel 2.mp3' },
  'level-3-la-primera-casa': { key: 'level-3-background-music', path: './music/nivel 3.mp3' },
  'level-4-el-departamento': { key: 'level-4-background-music', path: './music/nivel 4.mp3' },
  'level-5-la-casa-con-patio': { key: 'level-5-background-music', path: './music/nivel 5.mp3' },
  'level-6-el-mundo-sobrenatural': {
    key: 'level-6-terror-music',
    path: './music/musica nivel terror.mp3',
  },
  'level-7-una-hamburguesa-nunca-cae-mal': {
    key: 'level-7-background-music',
    path: './music/nivel 7.mp3',
  },
  'level-8-boca-vs-river': { key: 'level-8-background-music', path: './music/nivel 8.mp3' },
  final: { key: 'final-background-music', path: './music/nivel final.mp3' },
};

export const getLevelMusicTrack = (levelId: string): MusicTrack | undefined => {
  const track = levelMusicPaths[levelId];
  if (!track) return undefined;
  return { key: track.key, url: musicUrls[track.path] };
};
