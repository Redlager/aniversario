import Phaser from 'phaser';
import { isAudioEnabled, toggleAudio, type AudioChannel } from '../audio/audioSettings';

export class AudioControls {
  constructor(scene: Phaser.Scene, top = 23) {
    const right = scene.scale.gameSize.width - 12;
    this.createButton(scene, 'music', right - 54, top);
    this.createButton(scene, 'sfx', right - 54, top + 34);
  }

  private createButton(scene: Phaser.Scene, channel: AudioChannel, x: number, y: number): void {
    const button = scene.add
      .rectangle(x, y, 108, 28, 0x633d58, 0.96)
      .setStrokeStyle(2, 0xffdfc1)
      .setScrollFactor(0)
      .setDepth(40)
      .setInteractive({ useHandCursor: true });
    const label = scene.add
      .text(x, y, '', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '12px',
        fontStyle: 'bold',
        color: '#fff4df',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(41);

    const update = (): void => {
      const enabled = isAudioEnabled(channel);
      button.setFillStyle(enabled ? 0x633d58 : 0x514956, 0.96);
      label.setText(
        channel === 'music'
          ? `♫ MÚSICA ${enabled ? 'ON' : 'OFF'}`
          : `SFX ${enabled ? 'ON' : 'OFF'}`,
      );
    };

    button.on('pointerover', () => button.setStrokeStyle(2, 0xffffff));
    button.on('pointerout', () => button.setStrokeStyle(2, 0xffdfc1));
    button.on('pointerdown', () => {
      toggleAudio(channel);
      update();
    });
    update();
  }
}
