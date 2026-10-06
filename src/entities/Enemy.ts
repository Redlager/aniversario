import Phaser from 'phaser';
import type { EnemyConfig } from '../levels/LevelTypes';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private readonly startX: number;
  private readonly patrolDistance: number;
  private readonly speed: number;

  constructor(scene: Phaser.Scene, config: EnemyConfig) {
    super(scene, config.x, config.y, config.kind === 'exam' ? 'exam' : 'enemy');
    this.startX = config.x;
    this.patrolDistance = config.patrolDistance ?? 80;
    this.speed = config.speed ?? 65;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setSize(30, 34).setOffset(3, 7);
    this.setCollideWorldBounds(true);
    this.setVelocityX(this.speed);
    if (config.kind === 'exam' && scene.anims.exists('exam-float')) this.play('exam-float');
  }

  override preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (this.getData('defeated')) return;
    if (this.x >= this.startX + this.patrolDistance) {
      this.setVelocityX(-this.speed);
    } else if (this.x <= this.startX - this.patrolDistance) {
      this.setVelocityX(this.speed);
    }
    this.setFlipX(this.body instanceof Phaser.Physics.Arcade.Body && this.body.velocity.x < 0);
  }

  playDefeatAnimation(): void {
    if (this.getData('defeated')) return;
    this.setData('defeated', true);
    this.setVelocity(0, 0);
    if (this.body instanceof Phaser.Physics.Arcade.Body) this.body.enable = false;
    if (!this.scene.anims.exists('exam-defeat')) {
      this.destroy();
      return;
    }
    this.play('exam-defeat');
    this.once('animationcomplete-exam-defeat', () => this.destroy());
  }
}
