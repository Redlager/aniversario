import Phaser from 'phaser';
import { menuMusicTrack } from '../assets/levelMusic';
import { playLoopingMusic } from '../audio/loopingMusic';
import { PlayerProgress } from '../levels/LevelTypes';
import { FIRST_LEVEL_ID, levels } from '../levels/levelRegistry';
import { AudioControls } from '../ui/AudioControls';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create(): void {
    playLoopingMusic(this, menuMusicTrack);
    new AudioControls(this);

    const { width, height } = this.scale.gameSize;
    const centerX = width / 2;
    const levelEntries = Object.entries(levels);

    this.add
      .image(0, 0, 'main-menu-background')
      .setOrigin(0)
      .setDisplaySize(width, height)
      .setDepth(-10);

    let selectedLevelId = FIRST_LEVEL_ID;
    let isStarting = false;
    const keyboard = this.input.keyboard;

    // The supplied menu artwork includes a static level label; cover it with a live label.
    this.add.rectangle(centerX, 360, 178, 21, 0xffdfc1).setDepth(1);
    const levelLabel = this.add
      .text(centerX, 360, '', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '11px',
        fontStyle: 'bold',
        color: '#492b39',
      })
      .setOrigin(0.5)
      .setDepth(2);

    const updateLevelLabel = (): void => {
      const levelIndex = levelEntries.findIndex(([id]) => id === selectedLevelId);
      const entry = levelEntries[levelIndex];
      if (!entry) return;

      const levelTitle = entry[1].name.replace(/^Nivel\s*(?:\d+|final)\s*[·.-]\s*/i, '');
      const fullLabel = `Nivel ${levelIndex + 1} · ${levelTitle}`;
      let label = fullLabel;
      let fontSize = 11;
      levelLabel.setFontSize(fontSize);
      levelLabel.setText(label);

      while (levelLabel.width > 158 && fontSize > 9) {
        fontSize -= 1;
        levelLabel.setFontSize(fontSize);
      }

      if (levelLabel.width > 158) {
        const maxLength = Math.max(12, Math.floor((fullLabel.length * 158) / levelLabel.width) - 1);
        label = `${fullLabel.slice(0, maxLength).trimEnd()}…`;
        levelLabel.setText(label);
      }
    };

    const selectRelativeLevel = (direction: number): void => {
      const currentIndex = levelEntries.findIndex(([id]) => id === selectedLevelId);
      const nextIndex = (currentIndex + direction + levelEntries.length) % levelEntries.length;
      selectedLevelId = levelEntries[nextIndex][0];
      updateLevelLabel();
    };

    const startGame = (): void => {
      if (isStarting) return;
      isStarting = true;
      keyboard?.off('keydown-SPACE', startGame);
      keyboard?.off('keydown-ENTER', startGame);
      this.registry.set('playerProgress', new PlayerProgress());
      this.scene.start('Level', { levelId: selectedLevelId });
    };

    const playButton = this.add
      .rectangle(centerX, 290, 252, 76, 0xffffff, 0)
      .setInteractive({ useHandCursor: true });
    playButton.on('pointerover', () => playButton.setFillStyle(0xffffff, 0.12));
    playButton.on('pointerout', () => playButton.setFillStyle(0xffffff, 0));
    playButton.on('pointerdown', startGame);

    this.add
      .zone(360, 365, 58, 58)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => selectRelativeLevel(-1));

    this.add
      .zone(600, 365, 58, 58)
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => selectRelativeLevel(1));

    keyboard?.on('keydown-SPACE', startGame);
    keyboard?.on('keydown-ENTER', startGame);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      keyboard?.off('keydown-SPACE', startGame);
      keyboard?.off('keydown-ENTER', startGame);
    });
    updateLevelLabel();
  }
}
