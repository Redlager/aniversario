import Phaser from 'phaser';
import type { MessageHistoryEntry } from '../levels/LevelTypes';

export class MessageHistory {
  private readonly button: Phaser.GameObjects.Container;
  private readonly buttonLabel: Phaser.GameObjects.Text;
  private readonly backdrop: Phaser.GameObjects.Rectangle;
  private readonly panel: Phaser.GameObjects.Rectangle;
  private readonly title: Phaser.GameObjects.Text;
  private readonly counter: Phaser.GameObjects.Text;
  private readonly message: Phaser.GameObjects.Text;
  private readonly previousButton: Phaser.GameObjects.Text;
  private readonly nextButton: Phaser.GameObjects.Text;
  private readonly closeButton: Phaser.GameObjects.Text;
  private readonly scene: Phaser.Scene;
  private readonly getEntries: () => MessageHistoryEntry[];
  private readonly onOpenChange: (isOpen: boolean) => void;
  private entries: MessageHistoryEntry[] = [];
  private selectedIndex = -1;

  constructor(
    scene: Phaser.Scene,
    getEntries: () => MessageHistoryEntry[],
    onOpenChange: (isOpen: boolean) => void,
  ) {
    this.scene = scene;
    this.getEntries = getEntries;
    this.onOpenChange = onOpenChange;
    const { width, height } = scene.scale.gameSize;
    const buttonBackground = scene.add
      .rectangle(0, 0, 136, 42, 0x38243e, 0.92)
      .setStrokeStyle(2, 0xffffff);
    this.buttonLabel = scene.add
      .text(0, 0, '📖 LEER (0)', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '14px',
        fontStyle: 'bold',
        color: '#ffffff',
      })
      .setOrigin(0.5);
    this.button = scene.add
      .container(width - 82, 32, [buttonBackground, this.buttonLabel])
      .setScrollFactor(0)
      .setDepth(22)
      .setSize(136, 42)
      .setInteractive({ useHandCursor: true });
    this.button.on('pointerdown', () => this.open());

    this.backdrop = scene.add
      .rectangle(width / 2, height / 2, width, height, 0x171322, 0.78)
      .setScrollFactor(0)
      .setDepth(40)
      .setInteractive();
    this.panel = scene.add
      .rectangle(
        width / 2,
        height / 2,
        Math.min(width - 36, 680),
        Math.min(height - 36, 390),
        0xfff7fb,
        1,
      )
      .setScrollFactor(0)
      .setDepth(41)
      .setStrokeStyle(3, 0xd34f91);
    this.title = scene.add
      .text(width / 2, height / 2 - 150, 'NOTAS Y DIÁLOGOS', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: width < 540 ? '16px' : '22px',
        fontStyle: 'bold',
        color: '#452d4a',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(42);
    this.counter = scene.add
      .text(width / 2, height / 2 - 115, '', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '13px',
        color: '#745b78',
        align: 'center',
        lineSpacing: 4,
        wordWrap: { width: Math.min(width - 70, 610) },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(42);
    this.message = scene.add
      .text(width / 2, height / 2 + 4, '', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '20px',
        color: '#33243e',
        align: 'center',
        wordWrap: { width: Math.min(width - 100, 560) },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(42);
    this.previousButton = this.createButton(width / 2 - 120, height / 2 + 128, '‹ ANTERIOR');
    this.nextButton = this.createButton(width / 2 + 120, height / 2 + 128, 'SIGUIENTE ›');
    this.closeButton = this.createButton(width / 2, height / 2 + 174, 'CERRAR');

    this.previousButton.on('pointerdown', () => this.selectEntry(this.selectedIndex - 1));
    this.nextButton.on('pointerdown', () => this.selectEntry(this.selectedIndex + 1));
    this.closeButton.on('pointerdown', () => this.close());
    scene.input.keyboard?.on('keydown-ESC', this.close, this);
    scene.input.keyboard?.on('keydown-LEFT', () => this.selectEntry(this.selectedIndex - 1));
    scene.input.keyboard?.on('keydown-RIGHT', () => this.selectEntry(this.selectedIndex + 1));
    scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      scene.input.keyboard?.off('keydown-ESC', this.close, this);
      this.destroy();
    });
    this.setVisible(false);
    this.updateCount();
  }

  get isOpen(): boolean {
    return this.backdrop.visible;
  }

  refresh(): void {
    this.entries = this.getEntries();
    this.updateCount();
    if (this.isOpen) this.renderSelectedEntry();
  }

  private createButton(x: number, y: number, label: string): Phaser.GameObjects.Text {
    return this.scene.add
      .text(x, y, label, {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '15px',
        fontStyle: 'bold',
        color: '#ffffff',
        backgroundColor: '#d34f91',
        padding: { x: 14, y: 10 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(43)
      .setInteractive({ useHandCursor: true });
  }

  private open(): void {
    this.entries = this.getEntries();
    this.selectedIndex = this.entries.length - 1;
    this.renderSelectedEntry();
    this.setVisible(true);
    this.onOpenChange(true);
  }

  private close(): void {
    if (!this.isOpen) return;
    this.setVisible(false);
    this.onOpenChange(false);
  }

  private selectEntry(index: number): void {
    if (index < 0 || index >= this.entries.length) return;
    this.selectedIndex = index;
    this.renderSelectedEntry();
  }

  private renderSelectedEntry(): void {
    const entry = this.entries[this.selectedIndex];
    if (!entry) {
      this.counter.setText('Todavía no hay mensajes guardados.');
      this.message.setText('');
      return;
    }
    this.title.setText(
      entry.category === 'Nota'
        ? `📜 ${entry.detail ?? 'Nota'}`
        : `💬 Diálogo${entry.detail ? ` · ${entry.detail}` : ''}`,
    );
    const levelEntries = this.entries.filter((candidate) => candidate.levelName === entry.levelName);
    const entryNumber =
      levelEntries.findIndex((candidate) => candidate === entry) + 1;
    this.counter.setText(
      `${entry.levelName}\nRegistro ${entryNumber} de ${levelEntries.length} de este nivel`,
    );
    this.message.setText(entry.message);
  }

  private updateCount(): void {
    this.buttonLabel.setText(`📖 LEER (${this.getEntries().length})`);
  }

  private setVisible(visible: boolean): void {
    this.backdrop.setVisible(visible);
    this.panel.setVisible(visible);
    this.title.setVisible(visible);
    this.counter.setVisible(visible);
    this.message.setVisible(visible);
    this.previousButton.setVisible(visible);
    this.nextButton.setVisible(visible);
    this.closeButton.setVisible(visible);
  }

  private destroy(): void {
    this.button.destroy();
    this.backdrop.destroy();
    this.panel.destroy();
    this.title.destroy();
    this.counter.destroy();
    this.message.destroy();
    this.previousButton.destroy();
    this.nextButton.destroy();
    this.closeButton.destroy();
  }
}
