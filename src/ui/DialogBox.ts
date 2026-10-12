import Phaser from 'phaser';

export class DialogBox {
  private readonly tapArea: Phaser.GameObjects.Rectangle;
  private readonly background: Phaser.GameObjects.Rectangle;
  private readonly text: Phaser.GameObjects.Text;
  private onDismiss?: () => void;

  constructor(scene: Phaser.Scene) {
    const { width, height } = scene.scale.gameSize;
    this.tapArea = scene.add
      .rectangle(width / 2, height / 2, width, height, 0x000000, 0)
      .setScrollFactor(0)
      .setDepth(30)
      .setInteractive();
    this.background = scene.add
      .rectangle(width / 2, height - 76, width - 64, 104, 0x38243e, 0.94)
      .setScrollFactor(0)
      .setDepth(31)
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
      .setDepth(32);

    this.tapArea.on('pointerdown', () => this.dismiss());
    this.setVisible(false);
  }

  get isOpen(): boolean {
    return this.background.visible;
  }

  show(message: string, onDismiss?: () => void, showContinueHint = false): void {
    this.onDismiss = onDismiss;
    this.text.setText(showContinueHint ? `${message}\n\nTocá para continuar` : message);
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
    this.tapArea.setVisible(visible);
    this.background.setVisible(visible);
    this.text.setVisible(visible);
  }
}
