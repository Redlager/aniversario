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
          ? 'ghost-alive-sheet'
          : config.kind === 'cockroach'
            ? 'cockroach-alive-sheet'
            : config.kind === 'scorpion'
              ? 'scorpion-alive-sheet'
              : 'enemy';
    super(scene, config.x, config.y, texture);
    this.startX = config.x;
    this.patrolDistance = config.patrolDistance ?? 80;
    this.speed = config.speed ?? 65;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    const animatedKind =
      config.kind === 'ghost' || config.kind === 'cockroach' || config.kind === 'scorpion';
    const spriteScale =
      config.kind === 'ghost'
        ? 0.11
        : config.kind === 'cockroach' || config.kind === 'scorpion'
          ? 0.083
          : config.kind === 'exam'
            ? 1.5
            : 1;
    const bodyScale =
      config.kind === 'exam' || config.kind === 'ghost'
        ? 1.5
        : config.kind === 'cockroach' || config.kind === 'scorpion'
          ? 1.2
          : 1;
    this.setScale(spriteScale);
    this.setSize((30 * bodyScale) / spriteScale, (34 * bodyScale) / spriteScale).setOffset(
      (3 * bodyScale) / spriteScale,
      (7 * bodyScale) / spriteScale,
    );
    this.setCollideWorldBounds(true);
    this.setVelocityX(this.speed);
    if (config.kind === 'exam' && scene.anims.exists('exam-float')) this.play('exam-float');
    if (animatedKind && scene.anims.exists(`${config.kind}-alive`)) {
      this.play(`${config.kind}-alive`);
    }
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
    const enemyKind = this.getData('enemyKind') as string;
    const defeatAnimation = `${enemyKind}-defeat`;
    if (this.scene.anims.exists(defeatAnimation)) {
      this.play(defeatAnimation);
      this.once(`animationcomplete-${defeatAnimation}`, () => this.destroy());
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
