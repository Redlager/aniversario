import Phaser from 'phaser';
import type { MusicTrack } from '../assets/levelMusic';
import { registerAudioSound, isAudioEnabled, type ManagedSound } from './audioSettings';

export const playLoopingMusic = (scene: Phaser.Scene, track: MusicTrack): void => {
  if (!track.url) return;

  let music: ManagedSound | undefined;
  let unregisterSound: (() => void) | undefined;
  const play = (): void => {
    if (!scene.cache.audio.exists(track.key)) return;
    music = scene.sound.add(track.key, { loop: true, volume: 0.45 }) as ManagedSound;
    unregisterSound = registerAudioSound('music', music);
    music.play();
  };
  const cleanup = (): void => {
    scene.load.off(Phaser.Loader.Events.COMPLETE, play);
    music?.stop();
    music?.destroy();
    unregisterSound?.();
  };

  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, cleanup);
  if (scene.cache.audio.exists(track.key)) {
    play();
    return;
  }

  scene.load.audio(track.key, track.url);
  scene.load.once(Phaser.Loader.Events.COMPLETE, play);
  scene.load.start();
};

export const playSoundEffect = (
  scene: Phaser.Scene,
  key: string,
  volume = 1,
): Phaser.Sound.BaseSound | undefined => {
  if (!isAudioEnabled('sfx') || !scene.cache.audio.exists(key)) return undefined;

  const effect = scene.sound.add(key, { volume }) as ManagedSound;
  const unregisterSound = registerAudioSound('sfx', effect);
  const cleanup = (): void => {
    effect.off(Phaser.Sound.Events.COMPLETE, cleanup);
    scene.events.off(Phaser.Scenes.Events.SHUTDOWN, onShutdown);
    unregisterSound();
    effect.destroy();
  };
  const onShutdown = (): void => {
    effect.stop();
    cleanup();
  };

  effect.once(Phaser.Sound.Events.COMPLETE, cleanup);
  scene.events.once(Phaser.Scenes.Events.SHUTDOWN, onShutdown);
  effect.play();
  return effect;
};
