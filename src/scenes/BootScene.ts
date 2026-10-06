import Phaser from 'phaser';
import {
  characterSpriteSheets,
  characterSpriteSheetUrls,
} from '../assets/characterSpriteSheets';
import { levelArtAssets, levelArtUrls } from '../assets/levelArt';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload(): void {
    for (const sheet of characterSpriteSheets) {
      const url = characterSpriteSheetUrls[sheet.path];
      if (!url) continue;
      this.load.spritesheet(sheet.textureKey, url, {
        frameWidth: sheet.frameWidth,
        frameHeight: sheet.frameHeight,
      });
    }

    for (const asset of levelArtAssets) {
      const url = levelArtUrls[asset.path];
      if (!url) continue;
      if (asset.type === 'spritesheet') {
        this.load.spritesheet(asset.key, url, {
          frameWidth: asset.frameWidth,
          frameHeight: asset.frameHeight,
        });
      } else {
        this.load.image(asset.key, url);
      }
    }
  }

  create(): void {
    this.createCharacterTexture('vicky-idle', 'vicky', 'idle');
    this.createCharacterTexture('player', 'vicky', 'idle');
    this.createCharacterTexture('vicky-walk-1', 'vicky', 'walk-1');
    this.createCharacterTexture('vicky-walk-2', 'vicky', 'walk-2');
    this.createCharacterTexture('vicky-jump', 'vicky', 'jump');
    this.createCharacterTexture('vicky-fall', 'vicky', 'fall');
    this.createCharacterTexture('vicky-damage', 'vicky', 'damage');
    this.createCharacterTexture('renzo', 'renzo', 'idle');
    this.createExamTexture();
    this.createPlatformTexture();
    this.createPlaceholderTexture('collectible', 0xffcf5c, 24, 24);
    this.createCollectibleTextures();
    this.createPlaceholderTexture('enemy', 0x7961a8, 36, 42);
    this.createPlaceholderTexture('checkpoint', 0x6b9ce8, 34, 48);
    this.createPlaceholderTexture('npc', 0xf0a66b, 36, 48);
    this.createPlaceholderTexture('exit', 0x54b889, 40, 56);
    this.createAnimations();
    this.scene.start('Menu');
  }

  private createCharacterTexture(
    key: string,
    character: 'vicky' | 'renzo',
    pose: 'idle' | 'walk-1' | 'walk-2' | 'jump' | 'fall' | 'damage',
  ): void {
    if (this.textures.exists(key)) return;
    const graphics = this.make.graphics({ x: 0, y: 0 });
    const jumping = pose === 'jump' || pose === 'fall';
    const legOffset = pose === 'walk-1' ? -2 : pose === 'walk-2' ? 2 : 0;
    const skin = character === 'vicky' ? 0xf3c8a4 : 0xc9916e;
    const hair = character === 'vicky' ? 0x70452f : 0x211d27;
    const top = character === 'vicky' ? 0xe977ad : 0x557fc1;
    const legY = jumping ? 38 : 39;

    graphics.fillStyle(hair);
    graphics.fillRect(9, 3, 20, 7);
    graphics.fillRect(7, 8, 6, character === 'vicky' ? 20 : 7);
    graphics.fillRect(25, 8, 6, character === 'vicky' ? 17 : 7);
    if (character === 'vicky') graphics.fillRect(25, 17, 6, 14);
    graphics.fillStyle(skin);
    graphics.fillRect(12, 9, 14, 15);
    graphics.fillStyle(0x493126);
    graphics.fillRect(16, 15, 2, 2);
    graphics.fillRect(21, 15, 2, 2);
    graphics.fillStyle(top);
    graphics.fillRect(9, 24, 21, 14);
    if (character === 'vicky') {
      graphics.fillStyle(0xffd9ee);
      graphics.fillRect(17, 27, 6, 3);
    }
    graphics.fillStyle(0x463c48);
    graphics.fillRect(11, legY, 6, Math.max(4, 8 + legOffset));
    graphics.fillRect(22, legY, 6, Math.max(4, 8 - legOffset));
    if (pose === 'jump') {
      graphics.fillRect(3, 26, 7, 4);
      graphics.fillRect(30, 26, 7, 4);
    }
    if (pose === 'damage') {
      graphics.fillStyle(0xffffff);
      graphics.fillRect(8, 14, 3, 3);
      graphics.fillRect(29, 14, 3, 3);
    }
    graphics.generateTexture(key, 40, 50);
    graphics.destroy();
  }

  private createExamTexture(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0x5b4b58);
    graphics.fillRect(3, 5, 38, 40);
    graphics.fillStyle(0xfff8e8);
    graphics.fillRect(1, 2, 38, 40);
    graphics.fillStyle(0xe2d5c4);
    graphics.fillRect(7, 8, 23, 2);
    graphics.fillRect(7, 13, 18, 2);
    graphics.fillRect(7, 18, 21, 2);
    graphics.fillStyle(0x463c48);
    graphics.fillRect(11, 26, 3, 3);
    graphics.fillRect(25, 26, 3, 3);
    graphics.generateTexture('exam', 44, 48);
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

  private createPlaceholderTexture(
    key: string,
    color: number,
    width: number,
    height: number,
  ): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(color);
    graphics.fillRoundedRect(1, 1, width - 2, height - 2, 7);
    graphics.fillStyle(0xffffff, 0.8);
    graphics.fillCircle(width * 0.35, height * 0.35, 3);
    graphics.generateTexture(key, width, height);
    graphics.destroy();
  }

  private createCollectibleTextures(): void {
    const notes = this.make.graphics({ x: 0, y: 0 });
    notes.fillStyle(0xfff4c7);
    notes.fillRect(3, 2, 20, 25);
    notes.fillStyle(0xd28753);
    notes.fillRect(7, 8, 12, 2);
    notes.fillRect(7, 13, 10, 2);
    notes.fillRect(7, 18, 12, 2);
    notes.generateTexture('notes', 26, 30);
    notes.destroy();

    const heart = this.make.graphics({ x: 0, y: 0 });
    heart.fillStyle(0xe75d86);
    heart.fillRect(3, 5, 8, 8);
    heart.fillRect(15, 5, 8, 8);
    heart.fillRect(1, 9, 24, 8);
    heart.fillRect(5, 17, 16, 5);
    heart.fillRect(9, 22, 8, 5);
    heart.generateTexture('heart', 26, 29);
    heart.destroy();

    const star = this.make.graphics({ x: 0, y: 0 });
    star.fillStyle(0xffd04e);
    star.fillPoints(
      [
        new Phaser.Math.Vector2(14, 1),
        new Phaser.Math.Vector2(18, 10),
        new Phaser.Math.Vector2(28, 11),
        new Phaser.Math.Vector2(20, 18),
        new Phaser.Math.Vector2(22, 28),
        new Phaser.Math.Vector2(14, 23),
        new Phaser.Math.Vector2(6, 28),
        new Phaser.Math.Vector2(8, 18),
        new Phaser.Math.Vector2(1, 11),
        new Phaser.Math.Vector2(11, 10),
      ],
      true,
    );
    star.generateTexture('star', 30, 30);
    star.destroy();
  }

  private createAnimations(): void {
    const loadedAnimations = new Set<string>();
    for (const sheet of characterSpriteSheets) {
      if (!this.textures.exists(sheet.textureKey)) continue;
      this.anims.create({
        key: sheet.animationKey,
        frames: this.anims.generateFrameNumbers(sheet.textureKey, {
          start: 0,
          end: sheet.frameCount - 1,
        }),
        frameRate: sheet.frameRate,
        repeat: sheet.repeat,
        yoyo: sheet.yoyo,
      });
      loadedAnimations.add(sheet.animationKey);
    }

    const createFallbackAnimation = (
      key: string,
      frames: Phaser.Types.Animations.AnimationFrame[],
      frameRate?: number,
      repeat?: number,
    ): void => {
      if (loadedAnimations.has(key)) return;
      this.anims.create({ key, frames, frameRate, repeat });
    };
    createFallbackAnimation('vicky-idle', [{ key: 'vicky-idle' }, { key: 'vicky-walk-1' }], 2, -1);
    createFallbackAnimation('vicky-walk', [{ key: 'vicky-walk-1' }, { key: 'vicky-walk-2' }], 8, -1);
    createFallbackAnimation('vicky-jump', [{ key: 'vicky-jump' }]);
    createFallbackAnimation('vicky-fall', [{ key: 'vicky-fall' }]);
    createFallbackAnimation('vicky-damage', [{ key: 'vicky-damage' }]);
    createFallbackAnimation('renzo-idle', [{ key: 'renzo' }], 1, -1);
    createFallbackAnimation('renzo-appear', [{ key: 'renzo' }, { key: 'renzo' }], 8, 0);
    createFallbackAnimation('exam-float', [{ key: 'exam' }, { key: 'exam' }], 2, -1);
  }
}
