import Phaser from 'phaser';
import { playSoundEffect } from '../audio/loopingMusic';

export class Player extends Phaser.Physics.Arcade.Sprite {
  private static readonly standardScale = 1.5;
  private static readonly sheetScale = 0.19;
  private static readonly landingAnimationDuration = 125;
  private damageAnimationUntil = 0;
  private landingAnimationUntil = 0;
  private hasBeenAirborne = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    const hasSpriteSheet = scene.textures.exists('vicky-idle-sheet');
    super(scene, x, y, hasSpriteSheet ? 'vicky-idle-sheet' : 'vicky-idle');
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setCollideWorldBounds(false);
    this.applyVisualScale(hasSpriteSheet);
    this.setMaxVelocity(280, 850);
  }

  move(direction: number): void {
    this.setVelocityX(direction * 240);
  }

  updateAnimation(horizontalDirection: number): void {
    const body = this.body;
    if (!(body instanceof Phaser.Physics.Arcade.Body)) return;
    const now = this.scene.time.now;
    if (horizontalDirection !== 0) this.setFlipX(horizontalDirection < 0);
    if (this.scene.time.now < this.damageAnimationUntil) return;

    if (!body.onFloor()) {
      this.hasBeenAirborne = true;
      this.landingAnimationUntil = 0;
      this.playAnimation(body.velocity.y < 0 ? 'vicky-jump' : 'vicky-fall');
      return;
    }

    if (this.hasBeenAirborne) {
      this.hasBeenAirborne = false;
      if (this.scene.anims.exists('vicky-land')) {
        this.landingAnimationUntil = now + Player.landingAnimationDuration;
        this.playAnimation('vicky-land');
        return;
      }
    }
    if (now < this.landingAnimationUntil) return;
    this.landingAnimationUntil = 0;

    const isMoving = Math.abs(body.velocity.x) > 0.01;
    if (isMoving) this.setFlipX(body.velocity.x < 0);
    if (isMoving) {
      this.playAnimation('vicky-walk');
    } else {
      this.playAnimation('vicky-idle');
    }
  }

  playDamageAnimation(): void {
    if (!this.scene.anims.exists('vicky-damage')) return;
    this.damageAnimationUntil = this.scene.time.now + 350;
    this.playAnimation('vicky-damage');
  }

  playIdleAnimation(): void {
    this.playAnimation('vicky-idle');
  }

  jump(): void {
    const body = this.body;
    if (body instanceof Phaser.Physics.Arcade.Body && body.onFloor()) {
      this.setVelocityY(-470);
      playSoundEffect(this.scene, 'sfx-jump', 0.38);
    }
  }

  resetAt(x: number, y: number): void {
    this.setPosition(x, y);
    this.setVelocity(0, 0);
    this.hasBeenAirborne = false;
    this.landingAnimationUntil = 0;
  }

  private playAnimation(key: string): void {
    if (this.anims.currentAnim?.key === key) return;
    this.play(key);
  }

  private applyVisualScale(usesLargeSpriteSheet: boolean): void {
    const scale = usesLargeSpriteSheet ? Player.sheetScale : Player.standardScale;
    if (this.scaleX === scale && this.scaleY === scale) return;

    this.setScale(scale)
      .setSize(42 / scale, 63 / scale)
      .setOffset(7.5 / scale, 6 / scale);
  }
}
