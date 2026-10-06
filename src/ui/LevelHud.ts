import Phaser from 'phaser';
import type { PlayerProgress } from '../levels/LevelTypes';

export class LevelHud {
  private readonly text: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    this.text = scene.add
      .text(18, 16, '', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '16px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#452d4a',
        strokeThickness: 4,
      })
      .setScrollFactor(0)
      .setDepth(20);
  }

  update(levelName: string, objective: string, progress: PlayerProgress): void {
    const hearts = '♥'.repeat(progress.health) + '♡'.repeat(Math.max(0, 3 - progress.health));
    this.text.setText(
      `${levelName}   ${hearts}   📚 ${progress.notes}   ♥ ${progress.hearts}   ★ ${progress.stars}\n${objective}\nCheckpoint: ${progress.checkpoint.id}`,
    );
  }
}
