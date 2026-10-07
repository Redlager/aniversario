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

    const vicky = this.scene.add
      .sprite(width / 2 - 100, height / 2 - 10, 'vicky-idle')
      .setScale(1.5)
      .setScrollFactor(0)
      .setDepth(42);
    if (this.scene.anims.exists('vicky-idle')) vicky.play('vicky-idle');

    const renzo = this.scene.add
      .sprite(width / 2 + 100, height / 2 - 10, 'renzo')
      .setScale(1.5)
      .setScrollFactor(0)
      .setDepth(42);
    if (this.scene.anims.exists('renzo-idle')) renzo.play('renzo-idle');
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

  showFinalAnniversaryCard(onRestart: () => void): void {
    const { width, height } = this.scene.scale.gameSize;
    const backdrop = this.scene.add
      .rectangle(width / 2, height / 2, width, height, 0x241d35, 0.9)
      .setScrollFactor(0)
      .setDepth(40)
      .setInteractive();
    const card = this.scene.add
      .rectangle(width / 2, height / 2, Math.min(700, width - 28), 500, 0xfff5f7)
      .setStrokeStyle(5, 0xd34f91)
      .setScrollFactor(0)
      .setDepth(41);

    this.scene.add
      .text(width / 2, height / 2 - 198, 'VICKY — LA AVENTURA DE 7 AÑOS', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: width < 540 ? '22px' : '30px',
        fontStyle: 'bold',
        color: '#a34279',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(42);

    const lines = [
      '7 años juntos.',
      '5 años de casados.',
      'Una familia.',
      'Una historia que recién continúa.',
      '',
      'Feliz aniversario, Vicky. ❤️',
    ];

    lines.forEach((line, index) => {
      const baseY = height / 2 - 118 + index * 28;
      this.scene.add
        .text(width / 2, baseY, line, {
          fontFamily: 'Trebuchet MS, Arial, sans-serif',
          fontSize: line.includes('Feliz') ? (width < 540 ? '18px' : '20px') : (width < 540 ? '16px' : '18px'),
          fontStyle: line.includes('Feliz') ? 'bold' : 'normal',
          color: '#452d4a',
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(42);
    });

    this.scene.add
      .text(width / 2, height / 2 + 100, '“Y todavía nos queda muchísimo por vivir.”', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: width < 540 ? '16px' : '18px',
        fontStyle: 'italic',
        color: '#d34f91',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(42);

    const shareButton = this.scene.add
      .text(width / 2 - 120, height / 2 + 160, 'Compartir ❤️', {
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

    const restartButton = this.scene.add
      .text(width / 2 + 120, height / 2 + 160, 'Volver a jugar', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '19px',
        fontStyle: 'bold',
        color: '#d34f91',
        backgroundColor: '#ffffff',
        padding: { x: 20, y: 13 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(43)
      .setInteractive({ useHandCursor: true });

    const statusText = this.scene.add
      .text(width / 2, height / 2 + 208, '', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '14px',
        color: '#643a51',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(43);

    let isProcessing = false;

    const finishShareFlow = (): void => {
      statusText.setText('¡Tu recuerdo está listo! ❤️');
      statusText.setColor('#643a51');
      statusText.setVisible(true);
    };

    const downloadCard = async (): Promise<void> => {
      const image = await this.createAnniversaryCard();
      const anchor = document.createElement('a');
      anchor.href = image;
      anchor.download = 'vicky-aniversario-7-anos.png';
      anchor.click();
      finishShareFlow();
    };

    const shareCard = async (): Promise<void> => {
      if (isProcessing) return;
      isProcessing = true;
      statusText.setText('Preparando tu recuerdo... ❤️');
      statusText.setVisible(true);
      try {
        const image = await this.createAnniversaryCard();
        const file = await this.dataUrlToFile(image, 'vicky-aniversario-7-anos.png');

        if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: '7 años juntos ❤️',
            text: 'Feliz aniversario, Vicky.',
            files: [file],
          });
          finishShareFlow();
          return;
        }

        if (navigator.share) {
          await navigator.share({
            title: '7 años juntos ❤️',
            text: 'Feliz aniversario, Vicky.',
            url: window.location.href,
          });
          finishShareFlow();
          return;
        }

        const fallback = this.scene.add
          .rectangle(width / 2, height / 2 + 230, 410, 120, 0xfff2f6)
          .setStrokeStyle(2, 0xd34f91)
          .setScrollFactor(0)
          .setDepth(44);
        const downloadButton = this.scene.add
          .text(width / 2 - 110, height / 2 + 230, 'Descargar imagen', {
            fontFamily: 'Trebuchet MS, Arial, sans-serif',
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#ffffff',
            backgroundColor: '#d34f91',
            padding: { x: 16, y: 12 },
          })
          .setOrigin(0.5)
          .setScrollFactor(0)
          .setDepth(45)
          .setInteractive({ useHandCursor: true });
        const shareFallbackButton = this.scene.add
          .text(width / 2 + 110, height / 2 + 230, 'Compartir', {
            fontFamily: 'Trebuchet MS, Arial, sans-serif',
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#d34f91',
            backgroundColor: '#ffffff',
            padding: { x: 18, y: 12 },
          })
          .setOrigin(0.5)
          .setScrollFactor(0)
          .setDepth(45)
          .setInteractive({ useHandCursor: true });

        downloadButton.once('pointerdown', () => {
          void downloadCard();
          fallback.destroy();
          downloadButton.destroy();
          shareFallbackButton.destroy();
        });

        shareFallbackButton.once('pointerdown', async () => {
          try {
            await navigator.share({
              title: '7 años juntos ❤️',
              text: 'Feliz aniversario, Vicky.',
              url: window.location.href,
            });
            finishShareFlow();
          } catch {
            finishShareFlow();
          }
          fallback.destroy();
          downloadButton.destroy();
          shareFallbackButton.destroy();
        });

        statusText.setText('¡Tu recuerdo está listo! ❤️');
      } catch {
        statusText.setText('No pudimos compartir, pero podés descargar la imagen.');
        statusText.setColor('#643a51');
      } finally {
        isProcessing = false;
      }
    };

    shareButton.once('pointerdown', () => {
      void shareCard();
    });
    restartButton.once('pointerdown', onRestart);
    this.scene.input.keyboard?.once('keydown-ENTER', onRestart);
    this.scene.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      backdrop.destroy();
      card.destroy();
    });
  }

  private async createAnniversaryCard(): Promise<string> {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No se pudo crear el canvas para la tarjeta.');

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#fff1f5');
    gradient.addColorStop(0.35, '#ffe3ea');
    gradient.addColorStop(1, '#f7d8b6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffffff';
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 28; i += 1) {
      const x = (i * 97) % canvas.width;
      const y = ((i * 131) % canvas.height) + 20;
      ctx.beginPath();
      ctx.arc(x, y, 38 + (i % 5) * 12, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    ctx.fillStyle = '#f2b3c7';
    ctx.fillRect(60, 60, canvas.width - 120, canvas.height - 120);
    ctx.fillStyle = '#fff9fb';
    ctx.fillRect(90, 90, canvas.width - 180, canvas.height - 180);

    const heart = (x: number, y: number, scale: number): void => {
      ctx.save();
      ctx.translate(x, y);
      ctx.scale(scale, scale);
      ctx.beginPath();
      ctx.moveTo(0, 10);
      ctx.bezierCurveTo(-18, -18, -58, -10, -58, 20);
      ctx.bezierCurveTo(-58, 48, -30, 70, 0, 94);
      ctx.bezierCurveTo(30, 70, 58, 48, 58, 20);
      ctx.bezierCurveTo(58, -10, 18, -18, 0, 10);
      ctx.fillStyle = '#ef5c8d';
      ctx.fill();
      ctx.restore();
    };

    heart(150, 240, 0.7);
    heart(930, 260, 0.7);
    heart(150, 1050, 0.72);
    heart(930, 1120, 0.72);

    ctx.fillStyle = '#a34279';
    ctx.font = '700 42px Trebuchet MS';
    ctx.textAlign = 'center';
    ctx.fillText('Vicky — La aventura de 7 años', 540, 240);

    ctx.font = '700 72px Trebuchet MS';
    ctx.fillStyle = '#d34f91';
    ctx.fillText('7 años juntos', 540, 390);

    ctx.font = '600 48px Trebuchet MS';
    ctx.fillStyle = '#452d4a';
    ctx.fillText('5 años de casados', 540, 470);
    ctx.fillText('Una familia', 540, 550);

    ctx.font = 'italic 34px Trebuchet MS';
    ctx.fillStyle = '#7f4d61';
    ctx.fillText('“Y todavía nos queda muchísimo por vivir.”', 540, 660);

    ctx.font = '700 40px Trebuchet MS';
    ctx.fillStyle = '#a34279';
    ctx.fillText('Feliz aniversario, Vicky. ❤️', 540, 810);

    ctx.strokeStyle = '#f7d5d5';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(240, 910);
    ctx.lineTo(840, 910);
    ctx.stroke();

    ctx.font = '600 26px Trebuchet MS';
    ctx.fillStyle = '#643a51';
    ctx.fillText('Una historia que recién continúa.', 540, 990);

    const star = (x: number, y: number, radius: number): void => {
      ctx.beginPath();
      for (let i = 0; i < 5; i += 1) {
        const outerX = x + Math.cos(((Math.PI * 2) / 5) * i - Math.PI / 2) * radius;
        const outerY = y + Math.sin(((Math.PI * 2) / 5) * i - Math.PI / 2) * radius;
        const innerX = x + Math.cos(((Math.PI * 2) / 5) * i - Math.PI / 2 + Math.PI / 5) * (radius * 0.45);
        const innerY = y + Math.sin(((Math.PI * 2) / 5) * i - Math.PI / 2 + Math.PI / 5) * (radius * 0.45);
        if (i === 0) {
          ctx.moveTo(outerX, outerY);
        } else {
          ctx.lineTo(outerX, outerY);
        }
        ctx.lineTo(innerX, innerY);
      }
      ctx.closePath();
      ctx.fillStyle = '#ffe38c';
      ctx.fill();
    };

    for (let i = 0; i < 16; i += 1) {
      const x = 160 + ((i * 53) % 700);
      const y = 120 + ((i * 71) % 980);
      star(x, y, 10 + (i % 4));
    }

    return canvas.toDataURL('image/png');
  }

  private async dataUrlToFile(dataUrl: string, fileName: string): Promise<File> {
    const response = await fetch(dataUrl);
    const blob = await response.blob();
    return new File([blob], fileName, { type: 'image/png' });
  }
}
