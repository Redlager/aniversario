import Phaser from 'phaser';
import type { PlayerProgress } from '../levels/LevelTypes';

interface AnniversaryPortrait {
  label: string;
  textureKey: string;
  frame: number;
  kind: 'person' | 'pet';
}

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

    const isMultilineTitle = this.title.includes('\n');
    this.scene.add
      .text(width / 2, height / 2 - (isMultilineTitle ? 154 : 142), this.title, {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: isMultilineTitle
          ? width < 540
            ? '21px'
            : '28px'
          : width < 540
            ? '25px'
            : '34px',
        fontStyle: 'bold',
        color: '#a34279',
        align: isMultilineTitle ? 'center' : 'left',
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

    const hasVickySpriteSheet = this.scene.textures.exists('vicky-idle-sheet');
    const vicky = this.scene.add.sprite(
      width / 2 - 100,
      height / 2 - 10,
      hasVickySpriteSheet ? 'vicky-idle-sheet' : 'vicky-idle',
    );
    vicky
      .setScale(hasVickySpriteSheet ? 0.19 : 1.5)
      .setScrollFactor(0)
      .setDepth(42);
    if (this.scene.anims.exists('vicky-idle')) vicky.play('vicky-idle');

    const hasRenzoSpriteSheet = this.scene.textures.exists('renzo-idle-sheet');
    const renzo = this.scene.add.sprite(
      width / 2 + 100,
      height / 2 - 10,
      hasRenzoSpriteSheet ? 'renzo-idle-sheet' : 'renzo',
    );
    const renzoScale = renzo.texture.getSourceImage().height > 50 ? 0.19 : 1.5;
    renzo.setScale(renzoScale);
    renzo.setScrollFactor(0).setDepth(42);
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

  showFinalAnniversaryCard(
    onRestart: () => void,
    progress: PlayerProgress,
    totalCollectibles: number,
  ): void {
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
      .text(width / 2, height / 2 - 219, 'VICKY — LA AVENTURA DE 7 AÑOS', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: width < 540 ? '19px' : '27px',
        fontStyle: 'bold',
        color: '#a34279',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(42);

    this.scene.add
      .text(width / 2, height / 2 - 188, '7 años juntos · 5 años de casados · Una familia', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: width < 540 ? '14px' : '17px',
        color: '#452d4a',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(42);

    this.scene.add
      .text(width / 2, height / 2 - 153, 'NUESTRA FAMILIA', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: width < 540 ? '12px' : '14px',
        fontStyle: 'bold',
        color: '#a34279',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(42);

    const portraits = this.getAnniversaryPortraits();
    const portraitSpacing = Math.min(66, (width - 100) / portraits.length);
    portraits.forEach((portrait, index) => {
      const x = width / 2 + (index - (portraits.length - 1) / 2) * portraitSpacing;
      const y = height / 2 - 111;
      this.scene.add
        .circle(x, y, 29, 0xffe3ec)
        .setStrokeStyle(2, 0xf2b3c7)
        .setScrollFactor(0)
        .setDepth(42);

      if (portrait.kind === 'person') {
        const sprite = this.scene.add
          .sprite(x, y + 8, portrait.textureKey, portrait.frame)
          .setScale(portrait.label === 'Vicky' ? 0.12 : 0.11)
          .setScrollFactor(0)
          .setDepth(43);
        const animationKey = portrait.label === 'Vicky' ? 'vicky-idle' : 'renzo-idle';
        if (this.scene.anims.exists(animationKey)) sprite.play(animationKey);
      } else {
        this.scene.add
          .image(x, y, portrait.textureKey, portrait.frame)
          .setDisplaySize(54, 44)
          .setScrollFactor(0)
          .setDepth(43);
      }

      this.scene.add
        .text(x, height / 2 - 72, portrait.label, {
          fontFamily: 'Trebuchet MS, Arial, sans-serif',
          fontSize: width < 540 ? '8px' : '10px',
          fontStyle: 'bold',
          color: '#643a51',
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(43);
    });

    this.scene.add
      .rectangle(width / 2, height / 2 - 48, Math.min(width - 82, 570), 2, 0xf2b3c7)
      .setScrollFactor(0)
      .setDepth(42);

    this.scene.add
      .text(width / 2, height / 2 - 25, 'TU AVENTURA', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: width < 540 ? '12px' : '14px',
        fontStyle: 'bold',
        color: '#a34279',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(42);

    this.scene.add
      .text(
        width / 2,
        height / 2 + 1,
        `Coleccionables: ${progress.collectibles} / ${totalCollectibles}`,
        {
          fontFamily: 'Trebuchet MS, Arial, sans-serif',
          fontSize: width < 540 ? '14px' : '17px',
          fontStyle: 'bold',
          color: '#452d4a',
        },
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(42);

    this.scene.add
      .text(
        width / 2,
        height / 2 + 27,
        `📚 ${progress.notes} notas   ♥ ${progress.hearts} corazones   ★ ${progress.stars} estrellas`,
        {
          fontFamily: 'Trebuchet MS, Arial, sans-serif',
          fontSize: width < 540 ? '10px' : '13px',
          color: '#643a51',
        },
      )
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(42);

    this.scene.add
      .text(width / 2, height / 2 + 57, '“Y todavía nos queda muchísimo por vivir.”', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: width < 540 ? '13px' : '16px',
        fontStyle: 'italic',
        color: '#d34f91',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(42);

    this.scene.add
      .text(width / 2, height / 2 + 84, 'Feliz aniversario, Vicky. ❤️', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: width < 540 ? '14px' : '17px',
        fontStyle: 'bold',
        color: '#a34279',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(42);

    const shareButton = this.scene.add
      .text(width / 2 - 120, height / 2 + 151, 'Compartir ❤️', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: width < 540 ? '14px' : '17px',
        fontStyle: 'bold',
        color: '#ffffff',
        backgroundColor: '#d34f91',
        padding: { x: 18, y: 10 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(43)
      .setInteractive({ useHandCursor: true });

    const restartButton = this.scene.add
      .text(width / 2 + 120, height / 2 + 151, 'Volver a jugar', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: width < 540 ? '14px' : '17px',
        fontStyle: 'bold',
        color: '#d34f91',
        backgroundColor: '#ffffff',
        padding: { x: 16, y: 10 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(43)
      .setInteractive({ useHandCursor: true });

    const statusText = this.scene.add
      .text(width / 2, height / 2 + 191, '', {
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
      const image = await this.createAnniversaryCard(progress, totalCollectibles);
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
        const image = await this.createAnniversaryCard(progress, totalCollectibles);
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
          .rectangle(width / 2, height / 2 + 220, 410, 120, 0xfff2f6)
          .setStrokeStyle(2, 0xd34f91)
          .setScrollFactor(0)
          .setDepth(44);
        const downloadButton = this.scene.add
          .text(width / 2 - 110, height / 2 + 220, 'Descargar imagen', {
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
          .text(width / 2 + 110, height / 2 + 220, 'Compartir', {
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

  private getAnniversaryPortraits(): AnniversaryPortrait[] {
    const portraits: AnniversaryPortrait[] = [
      {
        label: 'Vicky',
        textureKey: this.scene.textures.exists('vicky-idle-sheet')
          ? 'vicky-idle-sheet'
          : 'vicky-idle',
        frame: 0,
        kind: 'person',
      },
      {
        label: 'Renzo',
        textureKey: this.scene.textures.exists('renzo-idle-sheet') ? 'renzo-idle-sheet' : 'renzo',
        frame: 0,
        kind: 'person',
      },
    ];
    const pets: Array<{ label: string; key: string; frame: number }> = [
      { label: 'Panchito', key: 'panchito', frame: 0 },
      { label: 'Oliver', key: 'oliver', frame: 0 },
      { label: 'Rex', key: 'rex', frame: 0 },
      { label: 'Silvestre', key: 'silvestre', frame: 1 },
      { label: 'Peach', key: 'peach', frame: 0 },
      { label: 'Chocolatín', key: 'chocolatin', frame: 0 },
      { label: 'Canelo', key: 'canelo', frame: 0 },
    ];

    for (const pet of pets) {
      const sheetKey = `${pet.key}-sheet`;
      const hasSheet = this.scene.textures.exists(sheetKey);
      portraits.push({
        label: pet.label,
        textureKey: hasSheet ? sheetKey : `pet-${pet.key}`,
        frame: hasSheet ? pet.frame : 0,
        kind: 'pet',
      });
    }
    return portraits;
  }

  private async createAnniversaryCard(
    progress: PlayerProgress,
    totalCollectibles: number,
  ): Promise<string> {
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

    ctx.fillStyle = '#a34279';
    ctx.font = '700 42px Trebuchet MS, Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Vicky — La aventura de 7 años', 540, 175);

    ctx.font = '700 62px Trebuchet MS, Arial, sans-serif';
    ctx.fillStyle = '#d34f91';
    ctx.fillText('7 años juntos', 540, 270);

    ctx.font = '600 38px Trebuchet MS, Arial, sans-serif';
    ctx.fillStyle = '#452d4a';
    ctx.fillText('5 años de casados · Una familia', 540, 330);

    ctx.fillStyle = '#fff1f5';
    ctx.strokeStyle = '#f2b3c7';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(125, 375, 830, 300, 28);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#a34279';
    ctx.font = '700 25px Trebuchet MS, Arial, sans-serif';
    ctx.fillText('NUESTRA FAMILIA', 540, 420);

    const portraits = this.getAnniversaryPortraits();
    const portraitSpacing = 94;
    portraits.forEach((portrait, index) => {
      const x = 540 + (index - (portraits.length - 1) / 2) * portraitSpacing;
      const frame = this.scene.textures.get(portrait.textureKey).get(portrait.frame);
      const image = frame.source.image;
      if (!(image instanceof HTMLImageElement || image instanceof HTMLCanvasElement)) return;

      const maxWidth = portrait.kind === 'person' ? 82 : 86;
      const maxHeight = portrait.kind === 'person' ? 142 : 100;
      const scale = Math.min(maxWidth / frame.cutWidth, maxHeight / frame.cutHeight);
      const drawWidth = frame.cutWidth * scale;
      const drawHeight = frame.cutHeight * scale;
      ctx.drawImage(
        image,
        frame.cutX,
        frame.cutY,
        frame.cutWidth,
        frame.cutHeight,
        x - drawWidth / 2,
        510 - drawHeight / 2,
        drawWidth,
        drawHeight,
      );

      ctx.fillStyle = '#643a51';
      ctx.font = '700 18px Trebuchet MS, Arial, sans-serif';
      ctx.fillText(portrait.label, x, 635);
    });

    ctx.fillStyle = '#a34279';
    ctx.font = '700 28px Trebuchet MS, Arial, sans-serif';
    ctx.fillText('TU AVENTURA', 540, 755);

    ctx.fillStyle = '#fff1f5';
    ctx.strokeStyle = '#f2b3c7';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(155, 790, 770, 210, 26);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#452d4a';
    ctx.font = '700 42px Trebuchet MS, Arial, sans-serif';
    ctx.fillText(`Coleccionables: ${progress.collectibles} / ${totalCollectibles}`, 540, 855);
    ctx.font = '600 27px Trebuchet MS, Arial, sans-serif';
    ctx.fillText(`📚 ${progress.notes} notas`, 300, 925);
    ctx.fillText(`♥ ${progress.hearts} corazones`, 540, 925);
    ctx.fillText(`★ ${progress.stars} estrellas`, 780, 925);

    ctx.font = 'italic 30px Trebuchet MS, Arial, sans-serif';
    ctx.fillStyle = '#7f4d61';
    ctx.fillText('“Y todavía nos queda muchísimo por vivir.”', 540, 1080);

    heart(225, 1150, 0.48);
    heart(855, 1150, 0.48);
    ctx.font = '700 38px Trebuchet MS, Arial, sans-serif';
    ctx.fillStyle = '#a34279';
    ctx.fillText('Feliz aniversario, Vicky. ❤️', 540, 1170);
    ctx.font = '600 27px Trebuchet MS, Arial, sans-serif';
    ctx.fillStyle = '#643a51';
    ctx.fillText('Una historia que recién continúa.', 540, 1230);

    const star = (x: number, y: number, radius: number): void => {
      ctx.beginPath();
      for (let i = 0; i < 5; i += 1) {
        const outerX = x + Math.cos(((Math.PI * 2) / 5) * i - Math.PI / 2) * radius;
        const outerY = y + Math.sin(((Math.PI * 2) / 5) * i - Math.PI / 2) * radius;
        const innerX =
          x + Math.cos(((Math.PI * 2) / 5) * i - Math.PI / 2 + Math.PI / 5) * (radius * 0.45);
        const innerY =
          y + Math.sin(((Math.PI * 2) / 5) * i - Math.PI / 2 + Math.PI / 5) * (radius * 0.45);
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
      const x = 150 + ((i * 53) % 780);
      const y = 130 + ((i * 71) % 1080);
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
