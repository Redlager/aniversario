import Phaser from 'phaser';

export class DialogBox {
  private readonly background: Phaser.GameObjects.Rectangle;
  private readonly text: Phaser.GameObjects.Text;
  private onDismiss?: () => void;

  constructor(scene: Phaser.Scene) {
    const { width, height } = scene.scale.gameSize;
    this.background = scene.add
      .rectangle(width / 2, height - 76, width - 64, 104, 0x38243e, 0.94)
      .setScrollFactor(0)
      .setDepth(30)
      .setStrokeStyle(2, 0xffffff);
    this.text = scene.add
      .text(width / 2, height - 76, '', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '18px',
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: width - 110 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(31);

    this.background.setInteractive().on('pointerdown', () => this.dismiss());
    this.text.setInteractive().on('pointerdown', () => this.dismiss());
    this.setVisible(false);
  }

  get isOpen(): boolean {
    return this.background.visible;
  }

  show(message: string, onDismiss?: () => void): void {
    this.onDismiss = onDismiss;
    this.text.setText(`${message}\n\nTocá para continuar`);
    this.setVisible(true);
  }

  dismiss(): void {
    if (!this.isOpen) return;
    this.setVisible(false);
    const callback = this.onDismiss;
    this.onDismiss = undefined;
    callback?.();
  }

  private setVisible(visible: boolean): void {
    this.background.setVisible(visible);
    this.text.setVisible(visible);
  }
}
