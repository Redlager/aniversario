import Phaser from 'phaser';
import { Enemy } from '../entities/Enemy';
import { Player } from '../entities/Player';
import { DialogBox } from '../ui/DialogBox';
import { LevelHud } from '../ui/LevelHud';
import { LevelCompletePanel } from '../ui/LevelCompletePanel';
import { PlayerProgress, type DecorationConfig, type LevelConfig } from '../levels/LevelTypes';

interface LevelStartData {
  levelId?: string;
}

type HorizontalControl = 'left' | 'right';
type ArcadeOverlapObject =
  | Phaser.Types.Physics.Arcade.GameObjectWithBody
  | Phaser.Physics.Arcade.Body
  | Phaser.Physics.Arcade.StaticBody
  | Phaser.Tilemaps.Tile;

export abstract class BaseLevelScene extends Phaser.Scene {
  protected player!: Player;
  protected level!: LevelConfig;

  private progress!: PlayerProgress;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private checkpoints!: Phaser.Physics.Arcade.StaticGroup;
  private collectibles!: Phaser.Physics.Arcade.StaticGroup;
  private exits!: Phaser.Physics.Arcade.StaticGroup;
  private npcs!: Phaser.Physics.Arcade.StaticGroup;
  private enemies: Enemy[] = [];
  private hud!: LevelHud;
  private dialog!: DialogBox;
  private completionPanel?: LevelCompletePanel;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA!: Phaser.Input.Keyboard.Key;
  private keyD!: Phaser.Input.Keyboard.Key;
  private readonly touchPointers = new Map<number, HorizontalControl>();
  private exitNearby = false;
  private interactionButton?: Phaser.GameObjects.Rectangle;
  private interactionLabel?: Phaser.GameObjects.Text;
  private exitPrompt?: Phaser.GameObjects.Text;
  private readonly visitedNpcs = new Set<string>();
  private damageAvailableAt = 0;
  private transitioning = false;
  private exitTriggered = false;

  protected abstract getLevel(levelId: string): LevelConfig;

  init(data: LevelStartData = {}): void {
    this.level = this.getLevel(data.levelId ?? '');
  }

  create(): void {
    this.progress = this.getProgress();
    if (this.progress.currentLevelId !== this.level.id) {
      this.progress.currentLevelId = this.level.id;
      this.progress.checkpoint = {
        id: 'start',
        levelId: this.level.id,
        ...this.level.spawn,
      };
    }

    const { width, height } = this.level.world;
    this.physics.world.setBounds(0, 0, width, height);
    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.setBackgroundColor(this.level.world.backgroundColor ?? '#9bdaf4');
    this.drawBackdrop(width, height);
    this.drawDecorations();
    this.createPlatforms();
    this.createPlayer();
    this.createLevelObjects();
    this.createControls();
    this.hud = new LevelHud(this);
    this.dialog = new DialogBox(this);
    this.hud.update(this.level.name, this.level.objective, this.progress);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.touchPointers.clear());
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.overlap(this.player, this.checkpoints, this.activateCheckpoint, undefined, this);
    this.physics.add.overlap(this.player, this.collectibles, this.collectItem, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, undefined, this);
    this.physics.add.overlap(this.player, this.npcs, this.talkToNpc, undefined, this);
  }

  override update(): void {
    if (this.transitioning || this.dialog?.isOpen) {
      this.player.setVelocityX(0);
      return;
    }

    const direction =
      Number(this.cursors.right.isDown || this.keyD.isDown || this.isTouching('right')) -
      Number(this.cursors.left.isDown || this.keyA.isDown || this.isTouching('left'));
    this.player.move(direction);
    this.player.updateAnimation(direction);
    this.updateExitPrompt();

    if (this.player.x < 19) {
      this.player.setX(19).setVelocityX(0);
    } else if (this.player.x > this.level.world.width - 19) {
      this.player.setX(this.level.world.width - 19).setVelocityX(0);
    }

    if (this.player.y > this.level.world.height + 60) {
      this.loseLife();
    }
  }

  private getProgress(): PlayerProgress {
    const current = this.registry.get('playerProgress');
    if (current instanceof PlayerProgress) return current;
    const progress = new PlayerProgress();
    this.registry.set('playerProgress', progress);
    return progress;
  }

  private drawBackdrop(width: number, height: number): void {
    const graphics = this.add.graphics();
    graphics.fillStyle(0xffffff, 0.48);
    graphics.fillCircle(180, 100, 31);
    graphics.fillCircle(218, 96, 41);
    graphics.fillCircle(255, 105, 30);
    graphics.fillStyle(0x8bc97c);
    graphics.fillEllipse(width * 0.45, height - 30, width * 0.8, 130);
    graphics.setScrollFactor(0.25);
  }

  private createPlatforms(): void {
    this.platforms = this.physics.add.staticGroup();
    for (const platformConfig of this.level.platforms ?? []) {
      const platform = this.platforms.create(platformConfig.x, platformConfig.y, 'platform');
      platform.setDisplaySize(platformConfig.width, platformConfig.height ?? 24);
      platform.refreshBody();
    }
  }

  private createPlayer(): void {
    const spawn =
      this.progress.checkpoint.levelId === this.level.id
        ? this.progress.checkpoint
        : this.level.spawn;
    this.player = new Player(this, spawn.x, spawn.y);
    this.player.setDepth(2);
    this.cameras.main.startFollow(this.player, true, 0.08, 0.08);
  }

  private createLevelObjects(): void {
    this.checkpoints = this.physics.add.staticGroup();
    for (const checkpoint of this.level.checkpoints ?? []) {
      const marker = this.checkpoints.create(checkpoint.x, checkpoint.y, 'checkpoint');
      marker.setSize(34, 48).refreshBody();
      marker.setData('checkpointId', checkpoint.id);
    }

    this.collectibles = this.physics.add.staticGroup();
    for (const item of this.level.collectibles ?? []) {
      const collectibleId = `${this.level.id}:${item.id}`;
      if (this.progress.collectedIds.includes(collectibleId)) continue;
      const sprite = this.collectibles.create(item.x, item.y, item.kind);
      sprite.setSize(28, 28).refreshBody();
      sprite.setData('collectibleId', collectibleId);
      sprite.setData('collectibleKind', item.kind);
    }

    this.enemies = (this.level.enemies ?? []).map((enemyConfig) => {
      const enemy = new Enemy(this, enemyConfig);
      enemy.setData('enemyId', enemyConfig.id);
      if (enemyConfig.kind === 'exam') {
        this.add.text(enemyConfig.x, enemyConfig.y - 39, 'EL PARCIAL', {
          fontFamily: 'Trebuchet MS, Arial, sans-serif',
          fontSize: '12px',
          fontStyle: 'bold',
          color: '#452d4a',
          backgroundColor: '#ffffffcc',
          padding: { x: 4, y: 2 },
        }).setOrigin(0.5).setDepth(3);
      }
      return enemy;
    });
    this.npcs = this.physics.add.staticGroup();
    for (const npc of this.level.npcs ?? []) {
      const sprite = this.npcs.create(npc.x, npc.y, 'npc');
      sprite.setSize(32, 44).refreshBody();
      sprite.setData('npcId', npc.id);
      sprite.setData('dialogue', npc.dialogue);
      sprite.setData('label', npc.label);
      this.add
        .text(npc.x, npc.y - 39, npc.label, {
          fontFamily: 'Trebuchet MS, Arial, sans-serif',
          fontSize: '13px',
          color: '#452d4a',
          backgroundColor: '#ffffffbb',
          padding: { x: 4, y: 2 },
        })
        .setOrigin(0.5)
        .setDepth(3);
    }

    this.exits = this.physics.add.staticGroup();
    const exit = this.exits.create(this.level.exit.x, this.level.exit.y, 'exit');
    exit.setSize(38, 54).refreshBody();
    if (this.level.decorations?.some(({ kind }) => kind === 'terminal')) exit.setAlpha(0);
  }

  private createControls(): void {
    if (!this.input.keyboard) {
      throw new Error('No se pudo inicializar el teclado del nivel.');
    }
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.input.keyboard.on('keydown', (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'KeyW') {
        if (this.dialog?.isOpen) this.dialog.dismiss();
        else if (!this.transitioning) this.player.jump();
      } else if (event.code === 'KeyE' && this.exitNearby) {
        this.reachExit();
      } else if ((event.code === 'Enter' || event.code === 'Escape') && this.dialog?.isOpen) {
        this.dialog.dismiss();
      }
    });
    this.input.addPointer(2);
    this.input.on('pointerup', (pointer: Phaser.Input.Pointer) => {
      this.touchPointers.delete(pointer.id);
    });
    this.input.on('gameout', () => this.touchPointers.clear());
    this.createTouchButton(66, 452, '◀', 'left');
    this.createTouchButton(164, 452, '▶', 'right');
    this.createTouchButton(875, 452, 'SALTAR', 'jump');
    this.createTouchButton(715, 452, 'INTERACTUAR', 'interact');
  }

  private createTouchButton(
    x: number,
    y: number,
    label: string,
    action: HorizontalControl | 'jump' | 'interact',
  ): void {
    const button = this.add
      .rectangle(x, y, action === 'jump' ? 126 : action === 'interact' ? 150 : 78, 72, 0x38243e, 0.62)
      .setStrokeStyle(2, 0xffffff, 0.72)
      .setScrollFactor(0)
      .setDepth(15)
      .setInteractive();
    const buttonText = this.add
      .text(x, y, label, {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: action === 'jump' || action === 'interact' ? '13px' : '30px',
        fontStyle: 'bold',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(16);
    if (action === 'interact') {
      this.interactionButton = button;
      this.interactionLabel = buttonText;
      button.setVisible(false);
      buttonText.setVisible(false);
    }
    button.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (action === 'jump') {
        if (!this.transitioning && !this.dialog.isOpen) this.player.jump();
      } else if (action === 'interact') {
        if (this.exitNearby && !this.transitioning) this.reachExit();
      } else {
        this.touchPointers.set(pointer.id, action);
      }
    });
  }

  private activateCheckpoint(
    _player: ArcadeOverlapObject,
    checkpoint: ArcadeOverlapObject,
  ): void {
    if (!(checkpoint instanceof Phaser.GameObjects.Sprite)) return;
    const id = checkpoint.getData('checkpointId') as string;
    if (this.progress.checkpoint.id === id) return;
    this.progress.checkpoint = {
      id,
      levelId: this.level.id,
      x: checkpoint.x,
      y: checkpoint.y - 42,
    };
    checkpoint.setTint(0xffe7a0);
    this.hud.update(this.level.name, this.level.objective, this.progress);
  }

  private collectItem(
    _player: ArcadeOverlapObject,
    item: ArcadeOverlapObject,
  ): void {
    if (!(item instanceof Phaser.GameObjects.Sprite)) return;
    const collectibleId = item.getData('collectibleId') as string;
    const kind = item.getData('collectibleKind') as 'notes' | 'heart' | 'star';
    this.progress.collectedIds.push(collectibleId);
    this.progress.collectibles += 1;
    if (kind === 'notes') this.progress.notes += 1;
    else if (kind === 'heart') this.progress.hearts += 1;
    else this.progress.stars += 1;
    item.destroy();
    this.hud.update(this.level.name, this.level.objective, this.progress);
  }

  private hitEnemy(_player: ArcadeOverlapObject, other: ArcadeOverlapObject): void {
    if (!(other instanceof Enemy) || !other.active) return;
    const body = this.player.body;
    if (
      body instanceof Phaser.Physics.Arcade.Body &&
      body.velocity.y > 0 &&
      this.player.y < other.y - 10
    ) {
      const { x, y } = other;
      other.playDefeatAnimation();
      body.setVelocityY(-260);
      const approved = this.add
        .text(x, y - 35, '¡APROBADO!', {
          fontFamily: 'Trebuchet MS, Arial, sans-serif',
          fontSize: '18px',
          fontStyle: 'bold',
          color: '#ffffff',
          stroke: '#452d4a',
          strokeThickness: 4,
        })
        .setDepth(12);
      this.tweens.add({
        targets: approved,
        y: y - 75,
        alpha: 0,
        duration: 1000,
        onComplete: () => approved.destroy(),
      });
      return;
    }
    this.loseLife();
  }

  private loseLife(): void {
    if (this.time.now < this.damageAvailableAt || this.transitioning) return;
    this.damageAvailableAt = this.time.now + 900;
    this.progress.health -= 1;
    this.hud.update(this.level.name, this.level.objective, this.progress);

    if (this.progress.health <= 0) {
      this.progress.reset();
      this.progress.currentLevelId = this.level.id;
      this.progress.checkpoint = {
        id: 'start',
        levelId: this.level.id,
        ...this.level.spawn,
      };
      this.dialog.show('Sin vidas. El nivel se reinicia desde el comienzo.', () => {
        this.scene.restart({ levelId: this.level.id });
      });
      return;
    }

    this.player.resetAt(this.progress.checkpoint.x, this.progress.checkpoint.y);
    this.player.setTint(0xffffff);
    this.player.playDamageAnimation();
    this.time.delayedCall(350, () => this.player.clearTint());
  }

  private talkToNpc(
    _player: ArcadeOverlapObject,
    npc: ArcadeOverlapObject,
  ): void {
    if (!(npc instanceof Phaser.GameObjects.Sprite)) return;
    const id = npc.getData('npcId') as string;
    if (this.visitedNpcs.has(id) || this.dialog.isOpen) return;
    this.visitedNpcs.add(id);
    this.dialog.show(`${npc.getData('label')}: ${npc.getData('dialogue') as string}`);
  }

  private reachExit(): void {
    if (this.transitioning || this.exitTriggered) return;
    this.transitioning = true;
    this.exitTriggered = true;
    this.player.setVelocity(0, 0);
    this.player.setVisible(false);
    this.showRenzoScene();
    this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x171322, 0.34)
      .setOrigin(0)
      .setScrollFactor(0)
      .setDepth(25);
    this.cameras.main.flash(250, 255, 255, 255);
    this.playExitDialogue(0);
  }

  private playExitDialogue(index: number): void {
    const lines = this.level.exit.dialogue ?? [`${this.level.name} completado.`];
    if (index >= lines.length) {
      this.cameras.main.flash(250, 231, 119, 173);
      this.completionPanel = new LevelCompletePanel(this, this.level.exit.completionTitle);
      this.completionPanel.show(() => {
        this.cameras.main.fadeOut(250, 36, 29, 53);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
          if (this.level.exit.nextLevelId) {
            this.scene.restart({ levelId: this.level.exit.nextLevelId });
          } else {
            this.scene.start('Menu');
          }
        });
      });
      return;
    }
    if (lines[index] === '❤️ MATCH') {
      this.showMatchEffect();
    }
    this.dialog.show(lines[index], () => this.playExitDialogue(index + 1));
  }

  private showRenzoScene(): void {
    const { x, y } = this.level.exit;
    const renzo = this.add.sprite(x - 105, y - 27, 'renzo').setDepth(5).setScale(1.5);
    if (this.anims.exists('renzo-appear')) {
      renzo.play('renzo-appear');
      renzo.once('animationcomplete-renzo-appear', () => {
        if (this.anims.exists('renzo-idle')) renzo.play('renzo-idle');
      });
    } else if (this.anims.exists('renzo-idle')) {
      renzo.play('renzo-idle');
    }
    const graphics = this.add.graphics().setDepth(4);
    graphics.fillStyle(0x443d52);
    graphics.fillRect(x - 155, y + 10, 92, 12);
    graphics.fillRect(x - 120, y + 22, 22, 33);
    graphics.fillStyle(0xa9dcdf);
    graphics.fillRect(x - 149, y - 31, 80, 42);
    graphics.fillStyle(0x566878);
    graphics.fillRect(x - 158, y + 11, 98, 6);
    this.add
      .text(x - 105, y - 88, 'ESTUDIANTE DE INFORMÁTICA', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '12px',
        fontStyle: 'bold',
        color: '#452d4a',
        backgroundColor: '#ffffffcc',
        padding: { x: 5, y: 3 },
      })
      .setOrigin(0.5)
      .setDepth(6);
    this.tweens.add({
      targets: renzo,
      y: renzo.y - 5,
      duration: 750,
      yoyo: true,
      repeat: -1,
    });
  }

  private showMatchEffect(): void {
    const { x, y } = this.level.exit;
    const hearts = this.add
      .text(x, y - 110, '♥  ♥  ♥', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: '32px',
        fontStyle: 'bold',
        color: '#e75d86',
        stroke: '#ffffff',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setPosition(this.scale.width / 2, this.scale.height / 2 - 76)
      .setDepth(35);
    this.tweens.add({
      targets: hearts,
      scale: 1.45,
      alpha: 0,
      duration: 900,
      onComplete: () => hearts.destroy(),
    });
  }

  private isTouching(action: HorizontalControl): boolean {
    return [...this.touchPointers.values()].includes(action);
  }

  private updateExitPrompt(): void {
    const exit = this.level.exit;
    this.exitNearby =
      Phaser.Math.Distance.Between(this.player.x, this.player.y, exit.x, exit.y) < 112;
    if (!this.exitPrompt) {
      this.exitPrompt = this.add
        .text(this.scale.width / 2, 84, 'E · INTERACTUAR', {
          fontFamily: 'Trebuchet MS, Arial, sans-serif',
          fontSize: '17px',
          fontStyle: 'bold',
          color: '#ffffff',
          backgroundColor: '#452d4a',
          padding: { x: 12, y: 8 },
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(20);
    }
    this.exitPrompt.setVisible(this.exitNearby);
    this.interactionButton?.setVisible(this.exitNearby);
    this.interactionLabel?.setVisible(this.exitNearby);
  }

  private drawDecorations(): void {
    for (const decoration of this.level.decorations ?? []) {
      this.drawDecoration(decoration);
    }
  }

  private drawDecoration({ kind, x, y, label }: DecorationConfig): void {
    const graphics = this.add.graphics().setDepth(1);
    const rectangle = (color: number, rx: number, ry: number, width: number, height: number): void => {
      graphics.fillStyle(color);
      graphics.fillRect(x + rx, y + ry, width, height);
    };

    switch (kind) {
      case 'university':
        rectangle(0xe9c98d, -132, -228, 264, 228);
        rectangle(0x805b55, -142, -20, 284, 20);
        rectangle(0xfff0c2, -112, -190, 224, 62);
        rectangle(0x74555d, -82, -108, 45, 108);
        rectangle(0x74555d, 37, -108, 45, 108);
        rectangle(0xb8d6dc, -113, -115, 54, 48);
        rectangle(0xb8d6dc, 59, -115, 54, 48);
        this.add.text(x, y - 158, label ?? 'UNIVERSIDAD', {
          fontFamily: 'Trebuchet MS, Arial, sans-serif',
          fontSize: '18px',
          fontStyle: 'bold',
          color: '#513b42',
        }).setOrigin(0.5).setDepth(2);
        break;
      case 'tree':
        rectangle(0x80533c, -8, -56, 16, 56);
        rectangle(0x559668, -42, -110, 84, 68);
        rectangle(0x559668, -30, -132, 60, 38);
        rectangle(0x79b976, -24, -118, 22, 17);
        break;
      case 'bench':
        rectangle(0x995e4e, -48, -28, 96, 12);
        rectangle(0xc18357, -48, -43, 96, 12);
        rectangle(0x74555d, -38, -16, 8, 17);
        rectangle(0x74555d, 30, -16, 8, 17);
        break;
      case 'sign':
        rectangle(0x80533c, -5, -56, 10, 56);
        rectangle(0xe9c98d, -62, -91, 124, 38);
        this.add.text(x, y - 72, label ?? 'CAMPUS', {
          fontFamily: 'Trebuchet MS, Arial, sans-serif',
          fontSize: '13px',
          fontStyle: 'bold',
          color: '#513b42',
        }).setOrigin(0.5).setDepth(2);
        break;
      case 'books':
        rectangle(0xe977ad, -31, -36, 21, 36);
        rectangle(0x7896d0, -8, -44, 20, 44);
        rectangle(0xe8bd61, 14, -31, 20, 31);
        rectangle(0xfff0c2, -31, -31, 4, 26);
        break;
      case 'brain':
        rectangle(0xef9caa, -30, -44, 60, 50);
        rectangle(0xef9caa, -42, -31, 84, 26);
        rectangle(0xc87894, -4, -39, 8, 42);
        rectangle(0xc87894, -26, -23, 18, 5);
        rectangle(0xc87894, 9, -30, 18, 5);
        break;
      case 'couch':
        rectangle(0x729b91, -56, -50, 112, 40);
        rectangle(0x588176, -67, -39, 14, 39);
        rectangle(0x588176, 53, -39, 14, 39);
        rectangle(0x80533c, -48, -10, 8, 12);
        rectangle(0x80533c, 40, -10, 8, 12);
        break;
      case 'blackboard':
        rectangle(0x80533c, -92, -106, 184, 101);
        rectangle(0x477968, -82, -96, 164, 81);
        this.add.text(x, y - 57, label ?? 'IDEAS', {
          fontFamily: 'Trebuchet MS, Arial, sans-serif',
          fontSize: '17px',
          color: '#ffffff',
        }).setOrigin(0.5).setDepth(2);
        break;
      case 'laptop':
        rectangle(0x566878, -35, -42, 70, 42);
        rectangle(0xa9dcdf, -29, -36, 58, 30);
        rectangle(0x7a8793, -44, 0, 88, 7);
        break;
      case 'phone':
        rectangle(0x443d52, -20, -48, 40, 62);
        rectangle(0x9bdaf4, -15, -40, 30, 43);
        rectangle(0xe977ad, -7, -34, 14, 14);
        rectangle(0xffd04e, 2, -10, 7, 7);
        break;
      case 'cable':
        graphics.lineStyle(5, 0x443d52);
        graphics.beginPath();
        graphics.moveTo(x - 88, y - 10);
        graphics.lineTo(x - 56, y - 10);
        graphics.lineTo(x - 40, y + 2);
        graphics.lineTo(x + 30, y + 2);
        graphics.lineTo(x + 48, y - 10);
        graphics.lineTo(x + 82, y - 10);
        graphics.strokePath();
        break;
      case 'social-icons':
        rectangle(0x6b9ce8, -47, -40, 30, 30);
        rectangle(0xe977ad, -7, -40, 30, 30);
        rectangle(0x82bb82, 33, -40, 30, 30);
        if (label) {
          this.add.text(x, y - 60, label, {
            fontFamily: 'Trebuchet MS, Arial, sans-serif',
            fontSize: '12px',
            fontStyle: 'bold',
            color: '#452d4a',
            backgroundColor: '#ffffffbb',
            padding: { x: 4, y: 2 },
          }).setOrigin(0.5).setDepth(2);
        }
        break;
      case 'terminal':
        rectangle(0x443d52, -118, -188, 236, 170);
        rectangle(0xb5e2e8, -108, -178, 216, 148);
        rectangle(0x566878, -80, -25, 160, 18);
        rectangle(0x443d52, -64, -7, 128, 25);
        rectangle(0x729b91, -39, -61, 78, 7);
        this.add.text(x, y - 147, label ?? 'RED SOCIAL', {
          fontFamily: 'Trebuchet MS, Arial, sans-serif',
          fontSize: '18px',
          fontStyle: 'bold',
          color: '#452d4a',
        }).setOrigin(0.5).setDepth(2);
        this.add.text(x, y - 95, 'FaceWorld', {
          fontFamily: 'Trebuchet MS, Arial, sans-serif',
          fontSize: '16px',
          fontStyle: 'bold',
          color: '#527eae',
          backgroundColor: '#ffffff',
          padding: { x: 8, y: 5 },
        }).setOrigin(0.5).setDepth(2);
        break;
    }
  }
}
