import Phaser from 'phaser';
import type { EnemyConfig } from '../levels/LevelTypes';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private readonly startX: number;
  private readonly patrolDistance: number;
  private readonly speed: number;

  constructor(scene: Phaser.Scene, config: EnemyConfig) {
    const texture =
      config.kind === 'exam'
        ? 'exam'
        : config.kind === 'ghost'
          ? 'ghost-enemy'
          : config.kind === 'cockroach'
            ? 'cockroach-enemy'
            : config.kind === 'scorpion'
              ? 'scorpion-enemy'
              : 'enemy';
    super(scene, config.x, config.y, texture);
    this.startX = config.x;
    this.patrolDistance = config.patrolDistance ?? 80;
    this.speed = config.speed ?? 65;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setSize(30, 34).setOffset(3, 7);
    if (config.kind === 'exam' || config.kind === 'ghost') this.setScale(1.5);
    if (config.kind === 'cockroach' || config.kind === 'scorpion') this.setScale(1.2);
    this.setCollideWorldBounds(true);
    this.setVelocityX(this.speed);
    if (config.kind === 'exam' && scene.anims.exists('exam-float')) this.play('exam-float');
    if (config.kind === 'ghost') {
      this.setData('enemyKind', 'ghost');
      scene.tweens.add({
        targets: this,
        y: config.y - 9,
        duration: 720,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });
    } else {
      this.setData('enemyKind', config.kind ?? 'enemy');
    }
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
    this.scene.tweens.killTweensOf(this);
    if (['ghost', 'cockroach', 'scorpion'].includes(this.getData('enemyKind'))) {
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        scale: 0.25,
        y: this.y - 35,
        duration: 420,
        onComplete: () => this.destroy(),
      });
      return;
    }
    if (!this.scene.anims.exists('exam-defeat')) {
      this.destroy();
      return;
    }
    this.play('exam-defeat');
    this.once('animationcomplete-exam-defeat', () => this.destroy());
  }
}
