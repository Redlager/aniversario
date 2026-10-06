import Phaser from 'phaser';

export class LevelCompletePanel {
  private readonly scene: Phaser.Scene;
  private readonly title: string;

  constructor(scene: Phaser.Scene, title = '¡NIVEL COMPLETADO! ❤️') {
    this.scene = scene;
    this.title = title;
  }

  show(onContinue: () => void): void {
    const { width, height } = this.scene.scale.gameSize;
    const backdrop = this.scene.add
      .rectangle(width / 2, height / 2, width, height, 0x241d35, 0.88)
      .setScrollFactor(0)
      .setDepth(40)
      .setInteractive();
    const card = this.scene.add
      .rectangle(width / 2, height / 2, Math.min(620, width - 44), 370, 0xfff3f7)
      .setStrokeStyle(5, 0xd34f91)
      .setScrollFactor(0)
      .setDepth(41);

    this.scene.add
      .text(width / 2, height / 2 - 142, this.title, {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: width < 540 ? '25px' : '34px',
        fontStyle: 'bold',
        color: '#a34279',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(42);

    this.scene.add
      .text(width / 2, height / 2 - 96, '¡NIVEL COMPLETADO! ❤️', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: width < 540 ? '18px' : '22px',
        fontStyle: 'bold',
        color: '#d34f91',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(42);

    this.scene.add
      .image(width / 2 - 100, height / 2 - 10, 'vicky-idle')
      .setScale(1.5)
      .setScrollFactor(0)
      .setDepth(42);
    this.scene.add
      .image(width / 2 + 100, height / 2 - 10, 'renzo')
      .setScale(1.5)
      .setScrollFactor(0)
      .setDepth(42);
    this.scene.add
      .text(width / 2, height / 2 - 28, '♥     ♥     ♥', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '25px',
        color: '#e75d86',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(43);

    const button = this.scene.add
      .text(width / 2, height / 2 + 124, 'CONTINUAR', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '19px',
        fontStyle: 'bold',
        color: '#ffffff',
        backgroundColor: '#d34f91',
        padding: { x: 24, y: 13 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(43)
      .setInteractive({ useHandCursor: true });

    button.once('pointerdown', onContinue);
    this.scene.input.keyboard?.once('keydown-ENTER', onContinue);
    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      backdrop.destroy();
      card.destroy();
    });
  }
}
