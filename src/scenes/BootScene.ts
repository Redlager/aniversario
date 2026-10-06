import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  create(): void {
    this.createPlayerTexture();
    this.createPlatformTexture();
    this.scene.start('Menu');
  }

  private createPlayerTexture(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0xe977ad);
    graphics.fillRoundedRect(2, 1, 34, 46, 9);
    graphics.fillStyle(0x38243e);
    graphics.fillCircle(13, 18, 2);
    graphics.fillCircle(25, 18, 2);
    graphics.fillStyle(0xffffff);
    graphics.fillRoundedRect(10, 32, 18, 5, 2);
    graphics.generateTexture('player', 38, 48);
    graphics.destroy();
  }

  private createPlatformTexture(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0x754c71);
    graphics.fillRoundedRect(0, 5, 96, 19, 5);
    graphics.fillStyle(0x9ad17b);
    graphics.fillRoundedRect(0, 0, 96, 10, 4);
    graphics.generateTexture('platform', 96, 24);
    graphics.destroy();
  }
}
