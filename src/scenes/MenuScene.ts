import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('Menu');
  }

  create(): void {
    const { width, height } = this.scale.gameSize;
    const centerX = width / 2;

    this.cameras.main.setBackgroundColor('#9bdaf4');
    this.add.circle(125, 105, 43, 0xffe7a0);
    this.add.ellipse(centerX, height - 16, width + 180, 155, 0xa5d889);
    this.add.ellipse(centerX - 230, height + 12, 430, 120, 0x8bc97c);
    this.add.ellipse(centerX + 270, height + 16, 510, 120, 0x8bc97c);

    this.add
      .text(centerX, 155, 'Vicky', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '68px',
        fontStyle: 'bold',
        color: '#fff8fc',
        stroke: '#a34279',
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, 217, 'La Aventura de 7 Años', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '30px',
        fontStyle: 'bold',
        color: '#452d4a',
      })
      .setOrigin(0.5);

    const startButton = this.add
      .text(centerX, 330, 'JUGAR · PRUEBA DE MOVIMIENTO', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '20px',
        fontStyle: 'bold',
        color: '#ffffff',
        backgroundColor: '#d34f91',
        padding: { x: 22, y: 16 },
      })
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    const startGame = (): void => {
      this.scene.start('Game');
    };
    startButton.on('pointerdown', startGame);
    this.input.keyboard?.once('keydown-SPACE', startGame);
    this.input.keyboard?.once('keydown-ENTER', startGame);

    this.add
      .text(centerX, 405, 'A / D o ← / → para moverte · Espacio para saltar', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '16px',
        color: '#452d4a',
      })
      .setOrigin(0.5);

    this.add
      .text(centerX, 435, 'En móvil, usá los botones de la pantalla', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '15px',
        color: '#452d4a',
      })
      .setOrigin(0.5);
  }
}
