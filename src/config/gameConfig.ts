import Phaser from 'phaser';
import { BootScene } from '../scenes/BootScene';
import { GameScene } from '../scenes/GameScene';
import { LevelScene } from '../scenes/LevelScene';
import { MenuScene } from '../scenes/MenuScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: 960,
  height: 540,
  backgroundColor: '#9bdaf4',
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: 950 },
      debug: false,
    },
  },
  input: {
    activePointers: 3,
  },
  scene: [BootScene, MenuScene, GameScene, LevelScene],
};
