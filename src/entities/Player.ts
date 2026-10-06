import Phaser from 'phaser';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private damageAnimationUntil = 0;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'vicky-idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(false);
    this.setSize(28, 42).setOffset(5, 4);
    this.setMaxVelocity(280, 850);
  }

  move(direction: number): void {
    this.setVelocityX(direction * 240);
  }

  updateAnimation(horizontalDirection: number): void {
    const body = this.body;
    if (!(body instanceof Phaser.Physics.Arcade.Body)) return;
    if (horizontalDirection !== 0) this.setFlipX(horizontalDirection < 0);
    if (this.scene.time.now < this.damageAnimationUntil) return;
    if (!body.onFloor()) {
      this.play(body.velocity.y < 0 ? 'vicky-jump' : 'vicky-fall', true);
    } else if (horizontalDirection !== 0) {
      this.play('vicky-walk', true);
    } else {
      this.play('vicky-idle', true);
    }
  }

  playDamageAnimation(): void {
    if (!this.scene.anims.exists('vicky-damage')) return;
    this.damageAnimationUntil = this.scene.time.now + 350;
    this.play('vicky-damage', true);
  }

  jump(): void {
    const body = this.body;
    if (body instanceof Phaser.Physics.Arcade.Body && body.onFloor()) {
      this.setVelocityY(-470);
    }
  }

  resetAt(x: number, y: number): void {
    this.setPosition(x, y);
    this.setVelocity(0, 0);
  }
}
