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
    if (config.kind === 'exam') this.play('exam-float');
  }

  override preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (this.x >= this.startX + this.patrolDistance) {
      this.setVelocityX(-this.speed);
    } else if (this.x <= this.startX - this.patrolDistance) {
      this.setVelocityX(this.speed);
    }
  }
}
