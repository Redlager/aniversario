import type Phaser from 'phaser';

export type AudioChannel = 'music' | 'sfx';
export type ManagedSound = Phaser.Sound.BaseSound & {
  setMute(value: boolean): unknown;
};

interface AudioPreferences {
  music: boolean;
  sfx: boolean;
}

const STORAGE_KEY = 'vicky-audio-preferences';
const enabledByDefault: AudioPreferences = { music: true, sfx: true };
const activeSounds: Record<AudioChannel, Set<ManagedSound>> = {
  music: new Set(),
  sfx: new Set(),
};

const loadPreferences = (): AudioPreferences => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return { ...enabledByDefault };
    const parsed: Partial<AudioPreferences> = JSON.parse(stored);
    return {
      music: typeof parsed.music === 'boolean' ? parsed.music : true,
      sfx: typeof parsed.sfx === 'boolean' ? parsed.sfx : true,
    };
  } catch {
    return { ...enabledByDefault };
  }
};

let preferences = loadPreferences();

const savePreferences = (): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
  } catch {
    // Audio toggles still work for this session when storage is unavailable.
  }
};

export const isAudioEnabled = (channel: AudioChannel): boolean => preferences[channel];

export const toggleAudio = (channel: AudioChannel): boolean => {
  preferences = { ...preferences, [channel]: !preferences[channel] };
  savePreferences();
  activeSounds[channel].forEach((sound) => {
    sound.setMute(!preferences[channel]);
  });
  return preferences[channel];
};

export const registerAudioSound = (channel: AudioChannel, sound: ManagedSound): (() => void) => {
  activeSounds[channel].add(sound);
  sound.setMute(!preferences[channel]);
  return () => activeSounds[channel].delete(sound);
};
