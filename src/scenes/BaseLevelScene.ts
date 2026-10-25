import Phaser from 'phaser';
import { getLevelMusicTrack } from '../assets/levelMusic';
import { playLoopingMusic, playSoundEffect } from '../audio/loopingMusic';
import { Enemy } from '../entities/Enemy';
import { Player } from '../entities/Player';
import { DialogBox } from '../ui/DialogBox';
import { MessageHistory } from '../ui/MessageHistory';
import { LevelHud } from '../ui/LevelHud';
import { LevelCompletePanel } from '../ui/LevelCompletePanel';
import { AudioControls } from '../ui/AudioControls';
import {
  PlayerProgress,
  type DecorationConfig,
  type LevelConfig,
  type PetVisual,
} from '../levels/LevelTypes';
import { FIRST_LEVEL_ID, levels } from '../levels/levelRegistry';

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
  private messageHistory!: MessageHistory;
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
  private knockbackUntil = 0;
  private transitioning = false;
  private exitTriggered = false;
  private jumpscareActive = false;

  protected abstract getLevel(levelId: string): LevelConfig;

  init(data: LevelStartData = {}): void {
    this.level = this.getLevel(data.levelId ?? '');
    this.exitNearby = false;
    this.exitPrompt = undefined;
    this.interactionButton = undefined;
    this.interactionLabel = undefined;
    this.completionPanel = undefined;
    this.visitedNpcs.clear();
    this.touchPointers.clear();
    this.damageAvailableAt = 0;
    this.knockbackUntil = 0;
    this.transitioning = false;
    this.exitTriggered = false;
    this.jumpscareActive = false;
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
    const musicTrack = getLevelMusicTrack(this.level.id);
    if (musicTrack) playLoopingMusic(this, musicTrack);

    const { width, height } = this.level.world;
    this.physics.world.setBounds(0, 0, width, height);
    this.cameras.main.setBounds(0, 0, width, height);
    this.cameras.main.setBackgroundColor(this.level.world.backgroundColor ?? '#9bdaf4');
    this.drawBackdrop(width, height);
    this.drawPitGradient(width, height);
    this.createPlatforms();
    this.drawDecorations();
    this.createPlayer();
    this.createLevelObjects();
    this.createControls();
    this.hud = new LevelHud(this);
    new AudioControls(this);
    this.dialog = new DialogBox(this);
    this.hud.update(this.level.name, this.level.objective, this.progress);
    this.messageHistory = new MessageHistory(
      this,
      () => this.progress.messageHistory,
      () => undefined,
    );
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.touchPointers.clear());
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.enemies, this.platforms);
    this.physics.add.overlap(
      this.player,
      this.checkpoints,
      this.activateCheckpoint,
      undefined,
      this,
    );
    this.physics.add.overlap(this.player, this.collectibles, this.collectItem, undefined, this);
    this.physics.add.overlap(this.player, this.enemies, this.hitEnemy, undefined, this);
    this.physics.add.overlap(this.player, this.npcs, this.talkToNpc, undefined, this);
  }

  override update(): void {
    if (
      this.transitioning ||
      this.jumpscareActive ||
      this.dialog?.isOpen ||
      this.messageHistory?.isOpen
    ) {
      this.player.setVelocityX(0);
      return;
    }

    const direction =
      Number(this.cursors.right.isDown || this.keyD.isDown || this.isTouching('right')) -
      Number(this.cursors.left.isDown || this.keyA.isDown || this.isTouching('left'));
    if (this.time.now >= this.knockbackUntil) {
      this.player.move(direction);
    }
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
    const backgroundImage = this.level.world.backgroundImage;
    if (backgroundImage && this.textures.exists(backgroundImage)) {
      if (this.level.world.backgroundMode === 'repeat') {
        const imageHeight = this.textures.get(backgroundImage).getSourceImage().height;
        const backgroundHeight = height * 0.9;
        const scale = backgroundHeight / imageHeight;
        this.add
          .tileSprite(0, height - backgroundHeight, width, backgroundHeight, backgroundImage)
          .setOrigin(0)
          .setTileScale(scale)
          .setScrollFactor(1)
          .setDepth(-20);
        return;
      }

      this.add
        .image(0, 0, backgroundImage)
        .setOrigin(0)
        .setDisplaySize(width, height)
        .setScrollFactor(1)
        .setDepth(-20);
      return;
    }

    if (
      this.level.world.backgroundStyle === 'university' &&
      this.textures.exists('level-university-background')
    ) {
      const scale =
        height / this.textures.get('level-university-background').getSourceImage().height;
      this.add
        .tileSprite(0, 0, width, height, 'level-university-background')
        .setOrigin(0)
        .setTileScale(scale)
        .setScrollFactor(0.25)
        .setDepth(-20);
      return;
    }

    const graphics = this.add.graphics();
    if (this.level.world.backgroundStyle === 'apartment') {
      graphics.fillStyle(0xe7e0df);
      graphics.fillRect(0, 0, width, height * 0.78);
      graphics.fillStyle(0xc8bcb8);
      graphics.fillRect(0, height * 0.75, width, 18);
      graphics.fillStyle(0xd7cdca);
      for (let x = 0; x < width; x += 210) {
        graphics.fillRect(x, 0, 4, height * 0.75);
      }
      graphics.fillStyle(0x827b80);
      graphics.fillRect(0, height * 0.75 + 18, width, 10);
      graphics.setDepth(-20);
    } else if (this.level.world.backgroundStyle === 'yard') {
      graphics.fillStyle(0xa9def2);
      graphics.fillRect(0, 0, width, height);
      graphics.fillStyle(0xffe6a0);
      graphics.fillCircle(width * 0.76, height * 0.22, 48);
      graphics.fillStyle(0x91c98b);
      graphics.fillEllipse(width * 0.25, height * 0.72, width * 0.75, 190);
      graphics.fillStyle(0x7fb47d);
      graphics.fillEllipse(width * 0.76, height * 0.78, width * 0.82, 220);
      graphics.setDepth(-20);
    } else if (this.level.world.backgroundStyle === 'home') {
      graphics.fillStyle(0xf4e4d5);
      graphics.fillRect(0, 0, width, height * 0.78);
      graphics.fillStyle(0xd7b9a6);
      graphics.fillRect(0, height * 0.75, width, 18);
      graphics.fillStyle(0xead1be);
      for (let x = 0; x < width; x += 280) {
        graphics.fillRect(x, 0, 3, height * 0.75);
      }
      graphics.fillStyle(0x8f6d68);
      graphics.fillRect(0, height * 0.75 + 18, width, 9);
      graphics.setDepth(-20);
    } else if (this.level.world.backgroundStyle === 'sunset') {
      graphics.fillStyle(0xffdf9c, 0.9);
      graphics.fillCircle(width * 0.78, height * 0.3, 48);
      graphics.fillStyle(0x9a7186);
      graphics.fillEllipse(width * 0.38, height - 30, width * 0.8, 130);
      graphics.fillStyle(0x6e8a75);
      graphics.fillEllipse(width * 0.8, height - 12, width * 0.75, 115);
    } else {
      graphics.fillStyle(0xffffff, 0.48);
      graphics.fillCircle(180, 100, 31);
      graphics.fillCircle(218, 96, 41);
      graphics.fillCircle(255, 105, 30);
      graphics.fillStyle(0x8bc97c);
      graphics.fillEllipse(width * 0.45, height - 30, width * 0.8, 130);
    }
    graphics.setScrollFactor(0.25);
  }

  private drawPitGradient(width: number, height: number): void {
    const platforms = this.level.platforms ?? [];
    if (platforms.length === 0) return;

    const groundTop = Math.max(
      ...platforms.map((platform) => platform.y - (platform.height ?? 24) / 2),
    );
    const gradientTop = Math.max(0, groundTop - 20);
    const gradient = this.add.graphics();
    gradient
      .fillGradientStyle(0x241b2a, 0x241b2a, 0x241b2a, 0x241b2a, 0, 0, 0.92, 0.92)
      .fillRect(0, gradientTop, width, height - gradientTop)
      .setScrollFactor(1)
      .setDepth(-19);
  }

  private createPlatforms(): void {
    this.platforms = this.physics.add.staticGroup();
    for (const platformConfig of this.level.platforms ?? []) {
      const platform = this.platforms.create(platformConfig.x, platformConfig.y, 'platform');
      platform.setDisplaySize(platformConfig.width, platformConfig.height ?? 24);
      platform.refreshBody();

      const ground = platformConfig.width >= this.level.world.width;
      const textureKey = ground ? 'level-ground-atlas' : 'level-platform-atlas';
      if (this.textures.exists(textureKey)) {
        const bodyHeight = platformConfig.height ?? 24;
        const visualHeight = 48;
        const colliderTop = platformConfig.y - bodyHeight / 2;
        const artFrameTop = ground ? 6 / 362 : 9 / 443;
        const visualTop = colliderTop - artFrameTop * visualHeight;
        const visualY = visualTop + visualHeight / 2;

        if (ground) {
          this.add
            .tileSprite(
              platformConfig.x,
              visualY,
              platformConfig.width,
              visualHeight,
              textureKey,
              9,
            )
            .setTileScale(0.9, visualHeight / 362)
            .setDepth(0);
        } else {
          this.add
            .image(platformConfig.x, visualY, textureKey, 1)
            .setDisplaySize(platformConfig.width, visualHeight)
            .setDepth(0);
        }
        platform.setVisible(false);
      }
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
      const isActive =
        this.progress.checkpoint.levelId === this.level.id &&
        this.progress.checkpoint.id === checkpoint.id;
      const marker = this.checkpoints.create(
        checkpoint.x,
        checkpoint.y,
        isActive ? 'checkpoint-on' : 'checkpoint-off',
      );
      marker.setFrame(0).setDisplaySize(50, 75).setSize(64, 48).refreshBody();
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
      if (item.message) sprite.setData('message', item.message);
    }

    this.enemies = (this.level.enemies ?? []).map((enemyConfig) => {
      const enemy = new Enemy(this, enemyConfig, this.player, this.level.platforms);
      enemy.setData('enemyId', enemyConfig.id);
      if (enemyConfig.kind === 'exam') {
        this.add
          .text(enemyConfig.x, enemyConfig.y - 52, 'EL PARCIAL', {
            fontFamily: 'Trebuchet MS, Arial, sans-serif',
            fontSize: '14px',
            fontStyle: 'bold',
            color: '#452d4a',
            backgroundColor: '#ffffffcc',
            padding: { x: 4, y: 2 },
          })
          .setOrigin(0.5)
          .setDepth(3);
      }
      return enemy;
    });
    this.npcs = this.physics.add.staticGroup();
    for (const npc of this.level.npcs ?? []) {
      const texture =
        npc.visual === 'renzo' && this.textures.exists('renzo-idle-sheet')
          ? 'renzo-idle-sheet'
          : npc.visual === 'renzo'
            ? 'renzo'
            : npc.visual === 'panchito' && this.textures.exists('panchito-sheet')
              ? 'panchito-sheet'
              : npc.visual === 'oliver' && this.textures.exists('oliver-sheet')
                ? 'oliver-sheet'
                : npc.visual === 'peach' && this.textures.exists('peach-sheet')
                  ? 'peach-sheet'
                  : npc.visual === 'rex' && this.textures.exists('rex-sheet')
                    ? 'rex-sheet'
                    : npc.visual === 'silvestre' && this.textures.exists('silvestre-sheet')
                      ? 'silvestre-sheet'
                      : npc.visual === 'chocolatin' && this.textures.exists('chocolatin-sheet')
                        ? 'chocolatin-sheet'
                        : npc.visual === 'canelo' && this.textures.exists('canelo-sheet')
                          ? 'canelo-sheet'
                          : npc.visual === 'phone'
                            ? 'phone-interaction'
                            : npc.visual === 'elevator'
                              ? 'elevator-interaction'
                              : npc.visual
                                ? `pet-${npc.visual}`
                                : 'npc';
      const sprite = this.npcs.create(npc.x, npc.y, texture);
      sprite.setDepth(2);
      if (npc.visual === 'renzo') {
        const scale = this.textures.get(texture).getSourceImage().height > 50 ? 0.19 : 1.5;
        sprite
          .setScale(scale)
          .setSize(20 / scale, 42 / scale)
          .refreshBody();
        if (this.anims.exists('renzo-idle')) sprite.play('renzo-idle');
      } else if (npc.visual === 'panchito' && this.textures.exists('panchito-sheet')) {
        const size = this.petDisplaySize(npc.visual);
        sprite
          .setDisplaySize(size.width, size.height)
          .setSize(size.width * 0.8, size.height * 0.8)
          .refreshBody();
        if (this.anims.exists('panchito-idle')) sprite.play('panchito-idle');
      } else if (npc.visual === 'oliver' && this.textures.exists('oliver-sheet')) {
        const size = this.petDisplaySize(npc.visual);
        sprite
          .setDisplaySize(size.width, size.height)
          .setSize(size.width * 0.8, size.height * 0.8)
          .refreshBody();
        if (this.anims.exists('oliver-idle')) sprite.play('oliver-idle');
      } else if (npc.visual === 'peach' && this.textures.exists('peach-sheet')) {
        const size = this.petDisplaySize(npc.visual);
        sprite
          .setDisplaySize(size.width, size.height)
          .setSize(size.width * 0.8, size.height * 0.8)
          .refreshBody();
        if (this.anims.exists('peach-idle')) sprite.play('peach-idle');
      } else if (npc.visual === 'rex' && this.textures.exists('rex-sheet')) {
        const size = this.petDisplaySize(npc.visual);
        sprite
          .setDisplaySize(size.width, size.height)
          .setSize(size.width * 0.8, size.height * 0.8)
          .refreshBody();
        if (this.anims.exists('rex-idle')) sprite.play('rex-idle');
      } else if (npc.visual === 'silvestre' && this.textures.exists('silvestre-sheet')) {
        const size = this.petDisplaySize(npc.visual);
        sprite
          .setDisplaySize(size.width, size.height)
          .setSize(size.width * 0.8, size.height * 0.8)
          .refreshBody();
        if (this.anims.exists('silvestre-idle')) sprite.play('silvestre-idle');
      } else if (npc.visual === 'chocolatin' && this.textures.exists('chocolatin-sheet')) {
        const size = this.petDisplaySize(npc.visual);
        sprite
          .setDisplaySize(size.width, size.height)
          .setSize(size.width * 0.8, size.height * 0.8)
          .refreshBody();
        if (this.anims.exists('chocolatin-idle')) sprite.play('chocolatin-idle');
      } else if (npc.visual === 'canelo' && this.textures.exists('canelo-sheet')) {
        const size = this.petDisplaySize(npc.visual);
        sprite
          .setDisplaySize(size.width, size.height)
          .setSize(size.width * 0.8, size.height * 0.8)
          .refreshBody();
        if (this.anims.exists('canelo-idle')) sprite.play('canelo-idle');
      } else if (this.isPetVisual(npc.visual)) {
        const size = this.petDisplaySize(npc.visual);
        sprite.setSize(size.width * 0.8, size.height * 0.8).refreshBody();
      } else if (npc.visual === 'elevator') {
        sprite.setSize(50, 48).refreshBody();
      } else {
        sprite.setSize(32, 44);
        sprite.refreshBody();
      }
      sprite.setData('npcId', npc.id);
      sprite.setData('dialogue', npc.dialogue);
      sprite.setData('label', npc.label);
      sprite.setData('npcVisual', npc.visual);
      sprite.setData('effect', npc.effect);
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
      if (this.jumpscareActive) return;
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
      .rectangle(
        x,
        y,
        action === 'jump' ? 126 : action === 'interact' ? 150 : 78,
        72,
        0x38243e,
        0.62,
      )
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
        if (!this.transitioning && !this.jumpscareActive && !this.dialog.isOpen) {
          this.player.jump();
        }
      } else if (action === 'interact') {
        if (this.exitNearby && !this.transitioning) this.reachExit();
      } else {
        this.touchPointers.set(pointer.id, action);
      }
    });
  }

  private activateCheckpoint(_player: ArcadeOverlapObject, checkpoint: ArcadeOverlapObject): void {
    if (!(checkpoint instanceof Phaser.GameObjects.Sprite)) return;
    const id = checkpoint.getData('checkpointId') as string;
    if (this.progress.checkpoint.id === id) return;
    this.progress.checkpoint = {
      id,
      levelId: this.level.id,
      x: checkpoint.x,
      y: checkpoint.y - 42,
    };
    checkpoint.setTexture('checkpoint-on', 0);
    this.hud.update(this.level.name, this.level.objective, this.progress);
    if (this.level.id === 'level-6-el-mundo-sobrenatural') {
      const faceByCheckpoint: Record<string, string> = {
        'entrada-sobrenatural': 'scary-face-jumpscare-5',
        'antes-del-final': 'scary-face-jumpscare-6',
      };
      const faceTexture = faceByCheckpoint[id];
      if (faceTexture) this.showGhostJumpscare(() => undefined, faceTexture);
    }
  }

  private collectItem(_player: ArcadeOverlapObject, item: ArcadeOverlapObject): void {
    if (!(item instanceof Phaser.GameObjects.Sprite)) return;
    const collectibleId = item.getData('collectibleId') as string;
    const kind = item.getData('collectibleKind') as 'notes' | 'heart' | 'star';
    const message = item.getData('message');
    this.progress.collectedIds.push(collectibleId);
    this.progress.collectibles += 1;
    if (kind === 'notes') this.progress.notes += 1;
    else if (kind === 'heart') {
      this.progress.hearts += 1;
      this.progress.health = Math.min(3, this.progress.health + 1);
    } else this.progress.stars += 1;
    if (kind === 'heart' || kind === 'star') {
      playSoundEffect(this, 'sfx-collectible', 0.55);
    }
    item.destroy();
    this.hud.update(this.level.name, this.level.objective, this.progress);
    if (kind === 'notes' && typeof message === 'string') {
      this.showDialog(message);
    }
  }

  private hitEnemy(_player: ArcadeOverlapObject, other: ArcadeOverlapObject): void {
    if (
      this.jumpscareActive ||
      !(other instanceof Enemy) ||
      !other.active ||
      other.getData('defeated')
    ) {
      return;
    }
    const body = this.player.body;
    if (
      body instanceof Phaser.Physics.Arcade.Body &&
      body.velocity.y > 0 &&
      this.player.y < other.y - 10
    ) {
      const { x, y } = other;
      const enemyKind = other.getData('enemyKind') as string;
      const defeatMessage =
        enemyKind === 'ghost'
          ? '¡FANTASMITA ESPANTADO!'
          : enemyKind === 'cockroach'
            ? '¡CUCARACHA ESPANTADA!'
            : enemyKind === 'scorpion'
              ? '¡ALACRÁN ESPANTADO!'
              : '¡APROBADO!';
      other.playDefeatAnimation();
      playSoundEffect(this, 'sfx-enemy-death', 0.58);
      body.setVelocityY(-260);
      const approved = this.add
        .text(x, y - 35, defeatMessage, {
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
      if (enemyKind === 'ghost') {
        const faceByGhostId: Record<string, string> = {
          'fantasmita-entrada': 'scary-face-jumpscare-2',
          'fantasmita-pasillo': 'scary-face-jumpscare-3',
          'fantasmita-salida': 'scary-face-jumpscare-4',
        };
        const enemyId = other.getData('enemyId') as string;
        const faceTexture =
          this.level.id === 'level-6-el-mundo-sobrenatural' ? faceByGhostId[enemyId] : undefined;
        if (faceTexture) this.showGhostJumpscare(() => undefined, faceTexture);
      }
      return;
    }
    this.loseLife(other.x);
  }

  private loseLife(enemyX?: number): void {
    if (this.time.now < this.damageAvailableAt || this.transitioning) return;
    this.damageAvailableAt = this.time.now + 900;
    this.progress.health -= 1;
    if (enemyX !== undefined) playSoundEffect(this, 'sfx-damage-hit', 0.6);
    this.hud.update(this.level.name, this.level.objective, this.progress);

    if (this.progress.health <= 0) {
      playSoundEffect(this, 'sfx-game-over', 0.68);
      this.progress.health = 3;
      this.progress.currentLevelId = this.level.id;
      this.progress.checkpoint = {
        id: 'start',
        levelId: this.level.id,
        ...this.level.spawn,
      };
      this.showDialog('Sin vidas. El nivel se reinicia desde el comienzo.', () => {
        this.scene.restart({ levelId: this.level.id });
      });
      return;
    }

    if (enemyX === undefined) {
      this.player.resetAt(this.progress.checkpoint.x, this.progress.checkpoint.y);
    } else {
      const direction = Math.sign(this.player.x - enemyX) || (this.player.flipX ? 1 : -1);
      this.knockbackUntil = this.time.now + 350;
      this.player.setVelocityX(direction * 300);
    }
    this.player.setTint(0xffffff);
    this.player.playDamageAnimation();
    this.time.delayedCall(350, () => this.player.clearTint());
  }

  private talkToNpc(_player: ArcadeOverlapObject, npc: ArcadeOverlapObject): void {
    if (!(npc instanceof Phaser.GameObjects.Sprite)) return;
    const id = npc.getData('npcId') as string;
    if (this.visitedNpcs.has(id) || this.dialog.isOpen) return;
    this.visitedNpcs.add(id);
    const label = npc.getData('label') as string;
    const dialogue = npc.getData('dialogue') as string;
    if (npc.getData('effect') === 'jumpscare') {
      this.showGhostJumpscare(() => this.showDialog(`${label}: ${dialogue}`));
      return;
    }
    if (npc.getData('npcVisual') === 'panchito' && this.anims.exists('panchito-surprised')) {
      npc.play('panchito-surprised');
      npc.once('animationcomplete-panchito-surprised', () => {
        if (npc.active && this.anims.exists('panchito-idle')) npc.play('panchito-idle');
      });
    }
    if (npc.getData('npcVisual') === 'rex' && this.anims.exists('rex-surprised')) {
      npc.play('rex-surprised');
      npc.once('animationcomplete-rex-surprised', () => {
        if (npc.active && this.anims.exists('rex-idle')) npc.play('rex-idle');
      });
    }
    if (npc.getData('npcVisual') === 'chocolatin' && this.anims.exists('chocolatin-play')) {
      npc.play('chocolatin-play');
      npc.once('animationcomplete-chocolatin-play', () => {
        if (npc.active && this.anims.exists('chocolatin-idle')) npc.play('chocolatin-idle');
      });
    }
    if (npc.getData('npcVisual') === 'canelo' && this.anims.exists('canelo-treat')) {
      npc.play('canelo-treat');
      npc.once('animationcomplete-canelo-treat', () => {
        if (npc.active && this.anims.exists('canelo-idle')) npc.play('canelo-idle');
      });
    }
    if (npc.getData('npcVisual') === 'renzo' && this.anims.exists('renzo-interact')) {
      npc.play('renzo-interact');
      npc.once('animationcomplete-renzo-interact', () => {
        if (!npc.active) return;
        if (this.textures.exists('renzo-idle-sheet')) {
          npc.setTexture('renzo-idle-sheet', 0);
        }
        if (this.anims.exists('renzo-idle')) npc.play('renzo-idle');
      });
    }
    this.showDialog(`${label}: ${dialogue}`);
  }

  private showGhostJumpscare(onDismiss: () => void, faceTexture = 'scary-face-jumpscare'): void {
    const { width, height } = this.scale.gameSize;
    const body = this.player.body;
    const previousBodyState =
      body instanceof Phaser.Physics.Arcade.Body
        ? {
            allowGravity: body.allowGravity,
            velocityX: body.velocity.x,
            velocityY: body.velocity.y,
          }
        : undefined;

    this.jumpscareActive = true;
    if (body instanceof Phaser.Physics.Arcade.Body) {
      body.setAllowGravity(false);
      body.setVelocity(0, 0);
    }

    const backdrop = this.add
      .rectangle(width / 2, height / 2, width, height, 0x08030e, 0.97)
      .setScrollFactor(0)
      .setDepth(70)
      .setInteractive();
    const face = this.add
      .image(width / 2, height / 2, faceTexture)
      .setScrollFactor(0)
      .setDepth(71)
      .setScale(0.02);
    const prompt = this.add
      .text(width / 2, height - 52, this.level.id === FIRST_LEVEL_ID ? '¡BU!' : '¡BU!', {
        fontFamily: 'Trebuchet MS, Arial, sans-serif',
        fontSize: width < 540 ? '16px' : '20px',
        fontStyle: 'bold',
        color: '#ffffff',
        backgroundColor: '#3a1028',
        padding: { x: 14, y: 9 },
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(72)
      .setAlpha(0);

    let readyToDismiss = false;
    let dismissed = false;
    let dismiss = (): void => undefined;
    let onKeyDown = (_event: KeyboardEvent): void => undefined;
    const removeDismissListeners = (): void => {
      this.input.off('pointerdown', dismiss);
      this.input.keyboard?.off('keydown', onKeyDown);
    };
    dismiss = (): void => {
      if (!readyToDismiss || dismissed) return;
      dismissed = true;
      removeDismissListeners();
      this.tweens.add({
        targets: [backdrop, face, prompt],
        alpha: 0,
        duration: 220,
        onComplete: () => {
          backdrop.destroy();
          face.destroy();
          prompt.destroy();
          this.jumpscareActive = false;
          if (body instanceof Phaser.Physics.Arcade.Body && previousBodyState) {
            body.setAllowGravity(previousBodyState.allowGravity);
            body.setVelocity(previousBodyState.velocityX, previousBodyState.velocityY);
          }
          onDismiss();
        },
      });
    };
    onKeyDown = (event: KeyboardEvent): void => {
      if (event.code === 'Space' || event.code === 'Enter' || event.code === 'Escape') {
        dismiss();
      }
    };
    this.input.on('pointerdown', dismiss);
    this.input.keyboard?.on('keydown', onKeyDown);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, removeDismissListeners);

    this.cameras.main.flash(140, 210, 0, 35);
    this.cameras.main.shake(520, 0.016);
    this.tweens.add({
      targets: face,
      scale: Math.min((width * 0.76) / face.width, (height * 0.76) / face.height),
      duration: 560,
      ease: 'Back.Out',
      onComplete: () => {
        readyToDismiss = true;
        this.tweens.add({ targets: prompt, alpha: 1, duration: 180 });
      },
    });
    this.tweens.add({
      targets: face,
      angle: { from: -3, to: 3 },
      duration: 75,
      yoyo: true,
      repeat: 5,
    });
  }

  private showDialog(message: string, onDismiss?: () => void): void {
    this.progress.messageHistory.push({
      levelName: this.level.name,
      message,
    });
    this.messageHistory.refresh();
    const body = this.player.body;
    const previousState =
      body instanceof Phaser.Physics.Arcade.Body
        ? {
            allowGravity: body.allowGravity,
            velocityX: body.velocity.x,
            velocityY: body.velocity.y,
          }
        : undefined;

    if (body instanceof Phaser.Physics.Arcade.Body) {
      body.setAllowGravity(false);
      body.setVelocity(0, 0);
    }

    this.dialog.show(
      message,
      () => {
        if (body instanceof Phaser.Physics.Arcade.Body && previousState) {
          body.setAllowGravity(previousState.allowGravity);
          body.setVelocity(previousState.velocityX, previousState.velocityY);
        }
        onDismiss?.();
      },
      this.level.id === FIRST_LEVEL_ID,
    );
  }

  private reachExit(): void {
    if (this.transitioning || this.exitTriggered) return;
    this.transitioning = true;
    this.exitTriggered = true;
    this.player.resetAt(this.level.exit.x - 210, this.level.exit.y - 27);
    this.player.setDepth(26).playIdleAnimation();
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

      if (this.level.id === 'final') {
        const totalCollectibles = Object.values(levels).reduce(
          (total, level) => total + (level.collectibles?.length ?? 0),
          0,
        );
        this.completionPanel.showFinalAnniversaryCard(
          () => {
            this.cameras.main.fadeOut(250, 36, 29, 53);
            this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
              this.scene.start('Menu');
            });
          },
          this.progress,
          totalCollectibles,
        );
        return;
      }

      this.completionPanel.show(() => {
        this.cameras.main.fadeOut(250, 36, 29, 53);
        this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
          if (this.level.exit.nextLevelId) {
            if (levels[this.level.exit.nextLevelId]) {
              this.scene.restart({ levelId: this.level.exit.nextLevelId });
            } else {
              this.scene.start('Menu');
            }
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
    this.showDialog(lines[index], () => this.playExitDialogue(index + 1));
  }

  private showRenzoScene(): void {
    const { x, y } = this.level.exit;
    const texture = this.textures.exists('renzo-idle-sheet') ? 'renzo-idle-sheet' : 'renzo';
    const scale = this.textures.get(texture).getSourceImage().height > 50 ? 0.19 : 1.5;
    const renzo = this.add
      .sprite(x - 105, y - 27, texture)
      .setDepth(26)
      .setScale(scale);
    if (this.anims.exists('renzo-interact')) {
      renzo.play('renzo-interact');
      renzo.once('animationcomplete-renzo-interact', () => {
        if (this.textures.exists('renzo-idle-sheet')) {
          renzo.setTexture('renzo-idle-sheet', 0);
        }
        if (this.anims.exists('renzo-idle')) renzo.play('renzo-idle');
      });
    } else if (this.anims.exists('renzo-idle')) {
      if (this.textures.exists('renzo-idle-sheet')) {
        renzo.setTexture('renzo-idle-sheet', 0);
      }
      renzo.play('renzo-idle');
    }
    if (this.level.exit.completionScene === 'family') {
      this.showFamilyCompletionScene(x, y);
      this.tweens.add({
        targets: renzo,
        y: renzo.y - 5,
        duration: 750,
        yoyo: true,
        repeat: -1,
      });
      return;
    }

    const graphics = this.add.graphics().setDepth(4);
    if (this.level.world.backgroundStyle === 'apartment') {
      graphics.fillStyle(0x936e78);
      graphics.fillRoundedRect(x - 160, y + 7, 120, 34, 9);
      graphics.fillStyle(0xb18b94);
      graphics.fillRoundedRect(x - 150, y - 7, 48, 25, 7);
      const chocolatinTexture = this.textures.exists('chocolatin-sheet')
        ? 'chocolatin-sheet'
        : 'pet-chocolatin';
      const chocolatin = this.add
        .sprite(x - 35, y + 17, chocolatinTexture)
        .setOrigin(0.5, 1)
        .setDisplaySize(54, 40)
        .setDepth(26);
      if (this.anims.exists('chocolatin-idle')) chocolatin.play('chocolatin-idle');
      this.add
        .text(x - 35, y - 34, 'CHOCOLATÍN', {
          fontFamily: 'Trebuchet MS, Arial, sans-serif',
          fontSize: '12px',
          fontStyle: 'bold',
          color: '#452d4a',
          backgroundColor: '#ffffffcc',
          padding: { x: 5, y: 3 },
        })
        .setOrigin(0.5)
        .setDepth(27);
    } else {
      graphics.fillStyle(0x443d52);
      graphics.fillRect(x - 155, y + 10, 92, 12);
      graphics.fillRect(x - 120, y + 22, 22, 33);
      graphics.fillStyle(0xa9dcdf);
      graphics.fillRect(x - 149, y - 31, 80, 42);
      graphics.fillStyle(0x566878);
      graphics.fillRect(x - 158, y + 11, 98, 6);
      this.add
        .text(x - 105, y - 88, 'RENZO', {
          fontFamily: 'Trebuchet MS, Arial, sans-serif',
          fontSize: '12px',
          fontStyle: 'bold',
          color: '#452d4a',
          backgroundColor: '#ffffffcc',
          padding: { x: 5, y: 3 },
        })
        .setOrigin(0.5)
        .setDepth(27);
    }
    this.tweens.add({
      targets: renzo,
      y: renzo.y - 5,
      duration: 750,
      yoyo: true,
      repeat: -1,
    });
  }

  private showFamilyCompletionScene(x: number, y: number): void {
    const pets: PetVisual[] = [
      'panchito',
      'oliver',
      'rex',
      'silvestre',
      'peach',
      'chocolatin',
      'canelo',
    ];
    const graphics = this.add.graphics().setDepth(4);
    graphics.fillStyle(0x79b976, 0.9);
    graphics.fillEllipse(x + 145, y + 14, 390, 48);
    pets.forEach((pet, index) => {
      const size = this.petDisplaySize(pet);
      const animatedTexture =
        pet === 'rex' && this.textures.exists('rex-sheet')
          ? 'rex-sheet'
          : pet === 'chocolatin' && this.textures.exists('chocolatin-sheet')
            ? 'chocolatin-sheet'
            : pet === 'canelo' && this.textures.exists('canelo-sheet')
              ? 'canelo-sheet'
              : `pet-${pet}`;
      const petSprite = this.add
        .sprite(x - 20 + index * 50, y + 12, animatedTexture)
        .setOrigin(0.5, 1)
        .setDisplaySize(size.width * 0.72, size.height * 0.72)
        .setDepth(26);
      if (pet === 'rex' && this.anims.exists('rex-idle')) petSprite.play('rex-idle');
      if (pet === 'chocolatin' && this.anims.exists('chocolatin-idle')) {
        petSprite.play('chocolatin-idle');
      }
      if (pet === 'canelo' && this.anims.exists('canelo-idle')) petSprite.play('canelo-idle');
    });

    const glow = this.add.circle(x + 350, y - 80, 9, 0xe9ddff, 0.8).setDepth(8);
    this.tweens.add({
      targets: glow,
      alpha: 0.25,
      scale: 1.5,
      duration: 950,
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

  private drawDecoration({ kind, x, y, label, pet }: DecorationConfig): void {
    const groundOffset = kind === 'university' ? 18 : 0;
    if (kind === 'pigeons') {
      const flock = this.add.container(x, y).setDepth(1.7);
      const birdPositions = [
        { x: -24, y: 5, scale: 0.75 },
        { x: 0, y: -6, scale: 1 },
        { x: 25, y: 4, scale: 0.68 },
      ];

      for (const position of birdPositions) {
        const bird = this.add
          .image(position.x, position.y, 'level-pigeon')
          .setFrame(0)
          .setDisplaySize(25 * position.scale, 20 * position.scale);
        flock.add(bird);

        this.tweens.add({
          targets: bird,
          angle: { from: -8, to: 8 },
          duration: 230 + Math.abs(position.x) * 2,
          yoyo: true,
          repeat: -1,
        });
      }

      this.tweens.add({
        targets: flock,
        x: x + 72,
        y: y - 12,
        duration: 4200,
        ease: 'Sine.InOut',
        yoyo: true,
        repeat: -1,
        delay: Math.abs(x) % 900,
      });
      return;
    }
    if (kind === 'pet') {
      if (!this.isPetVisual(pet)) return;
      const size = this.petDisplaySize(pet);
      const animatedTexture =
        pet === 'panchito' && this.textures.exists('panchito-sheet')
          ? 'panchito-sheet'
          : pet === 'oliver' && this.textures.exists('oliver-sheet')
            ? 'oliver-sheet'
            : pet === 'peach' && this.textures.exists('peach-sheet')
              ? 'peach-sheet'
              : pet === 'rex' && this.textures.exists('rex-sheet')
                ? 'rex-sheet'
                : pet === 'silvestre' && this.textures.exists('silvestre-sheet')
                  ? 'silvestre-sheet'
                  : pet === 'chocolatin' && this.textures.exists('chocolatin-sheet')
                    ? 'chocolatin-sheet'
                    : pet === 'canelo' && this.textures.exists('canelo-sheet')
                      ? 'canelo-sheet'
                      : undefined;
      const sprite = this.add
        .sprite(x, y, animatedTexture ?? `pet-${pet}`)
        .setOrigin(0.5, 1)
        .setDisplaySize(size.width, size.height)
        .setDepth(1.5);
      const animation =
        pet === 'panchito'
          ? 'panchito-idle'
          : pet === 'oliver'
            ? 'oliver-idle'
            : pet === 'peach'
              ? 'peach-idle'
              : pet === 'rex'
                ? 'rex-idle'
                : pet === 'silvestre'
                  ? 'silvestre-idle'
                  : pet === 'chocolatin'
                    ? 'chocolatin-idle'
                    : 'canelo-idle';
      if (animatedTexture && this.anims.exists(animation)) {
        sprite.play(animation);
      }
      return;
    }
    if (kind === 'tree' && this.textures.exists('level-tree')) {
      this.add
        .image(x, y, 'level-tree')
        .setY(y + 22)
        .setOrigin(0.5, 1)
        .setDisplaySize(120, 160)
        .setDepth(1);
      return;
    }
    if (kind === 'bench' && this.textures.exists('level-bench')) {
      this.add
        .image(x, y, 'level-bench')
        .setY(y + 22)
        .setOrigin(0.5, 1)
        .setDisplaySize(116, 58)
        .setDepth(1);
      return;
    }

    const graphics = this.add.graphics().setDepth(1);
    const rectangle = (
      color: number,
      rx: number,
      ry: number,
      width: number,
      height: number,
    ): void => {
      graphics.fillStyle(color);
      graphics.fillRect(x + rx, y + groundOffset + ry, width, height);
    };

    switch (kind) {
      case 'house':
        rectangle(0xf5e6cc, -112, -164, 224, 164);
        graphics.fillStyle(0x9b655e);
        graphics.fillPoints(
          [
            new Phaser.Math.Vector2(x - 132, y - 164),
            new Phaser.Math.Vector2(x, y - 252),
            new Phaser.Math.Vector2(x + 132, y - 164),
          ],
          true,
        );
        rectangle(0x9bdaf4, -91, -139, 54, 48);
        rectangle(0xfff0c2, -65, -139, 4, 48);
        rectangle(0xfff0c2, -91, -116, 54, 4);
        rectangle(0x9bdaf4, 37, -139, 54, 48);
        rectangle(0xfff0c2, 63, -139, 4, 48);
        rectangle(0xfff0c2, 37, -116, 54, 4);
        rectangle(0x9b655e, -22, -82, 44, 82);
        rectangle(0xe5bf94, -17, -77, 34, 77);
        rectangle(0x805b55, 10, -42, 4, 4);
        break;
      case 'university':
        if (this.textures.exists('level-wall-atlas')) {
          this.add
            .tileSprite(x, y + groundOffset - 114, 264, 228, 'level-wall-atlas', 3)
            .setTileScale(0.55)
            .setDepth(0.5);
        } else {
          rectangle(0xe9c98d, -132, -228, 264, 228);
        }
        rectangle(0x805b55, -142, -20, 284, 20);
        rectangle(0xfff0c2, -112, -190, 224, 62);
        rectangle(0x74555d, -82, -108, 45, 108);
        rectangle(0x74555d, 37, -108, 45, 108);
        rectangle(0xb8d6dc, -113, -115, 54, 48);
        rectangle(0xb8d6dc, 59, -115, 54, 48);
        this.add
          .text(x, y + groundOffset - 158, label ?? 'UNIVERSIDAD', {
            fontFamily: 'Trebuchet MS, Arial, sans-serif',
            fontSize: '18px',
            fontStyle: 'bold',
            color: '#513b42',
          })
          .setOrigin(0.5)
          .setDepth(2);
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
        this.add
          .text(x, y - 72, label ?? 'CAMPUS', {
            fontFamily: 'Trebuchet MS, Arial, sans-serif',
            fontSize: '13px',
            fontStyle: 'bold',
            color: '#513b42',
          })
          .setOrigin(0.5)
          .setDepth(2);
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
        this.add
          .text(x, y - 57, label ?? 'IDEAS', {
            fontFamily: 'Trebuchet MS, Arial, sans-serif',
            fontSize: '17px',
            color: '#ffffff',
          })
          .setOrigin(0.5)
          .setDepth(2);
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
          this.add
            .text(x, y - 60, label, {
              fontFamily: 'Trebuchet MS, Arial, sans-serif',
              fontSize: '12px',
              fontStyle: 'bold',
              color: '#452d4a',
              backgroundColor: '#ffffffbb',
              padding: { x: 4, y: 2 },
            })
            .setOrigin(0.5)
            .setDepth(2);
        }
        break;
      case 'terminal':
        rectangle(0x443d52, -118, -188, 236, 170);
        rectangle(0xb5e2e8, -108, -178, 216, 148);
        rectangle(0x566878, -80, -25, 160, 18);
        rectangle(0x443d52, -64, -7, 128, 25);
        rectangle(0x729b91, -39, -61, 78, 7);
        this.add
          .text(x, y - 147, label ?? 'RED SOCIAL', {
            fontFamily: 'Trebuchet MS, Arial, sans-serif',
            fontSize: '18px',
            fontStyle: 'bold',
            color: '#452d4a',
          })
          .setOrigin(0.5)
          .setDepth(2);
        this.add
          .text(x, y - 95, 'FaceWorld', {
            fontFamily: 'Trebuchet MS, Arial, sans-serif',
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#527eae',
            backgroundColor: '#ffffff',
            padding: { x: 8, y: 5 },
          })
          .setOrigin(0.5)
          .setDepth(2);
        break;
      case 'box':
        rectangle(0xb98558, -38, -46, 76, 46);
        rectangle(0xe1bf88, -34, -42, 68, 38);
        rectangle(0xb98558, -3, -42, 6, 38);
        break;
      case 'sofa':
        rectangle(0x936e78, -60, -44, 120, 34);
        rectangle(0x765762, -68, -36, 16, 36);
        rectangle(0x765762, 52, -36, 16, 36);
        rectangle(0xb18b94, -48, -38, 44, 24);
        rectangle(0xb18b94, 4, -38, 44, 24);
        rectangle(0x765762, -48, -8, 9, 8);
        rectangle(0x765762, 39, -8, 9, 8);
        break;
      case 'bed':
        rectangle(0x805b55, -66, -36, 132, 28);
        rectangle(0xfff0e5, -60, -52, 120, 19);
        rectangle(0xe977ad, -10, -34, 70, 15);
        rectangle(0xfff8fc, -57, -48, 37, 15);
        rectangle(0x805b55, -57, -8, 8, 8);
        rectangle(0x805b55, 49, -8, 8, 8);
        break;
      case 'lamp':
        rectangle(0x805b55, -3, -51, 6, 51);
        rectangle(0xffd88a, -23, -73, 46, 25);
        rectangle(0xb98558, -14, -4, 28, 5);
        break;
      case 'toybox':
        rectangle(0x68958c, -43, -38, 86, 38);
        rectangle(0x8ab6a5, -46, -45, 92, 10);
        rectangle(0xe977ad, -17, -58, 13, 16);
        rectangle(0xffd04e, 9, -55, 17, 13);
        break;
      case 'door':
        rectangle(0x805b55, -40, -120, 80, 120);
        rectangle(0xe5bf94, -33, -113, 66, 113);
        rectangle(0x805b55, 20, -60, 5, 5);
        break;
      case 'window':
        rectangle(0x805b55, -53, -42, 106, 84);
        rectangle(0xa9dcdf, -46, -35, 92, 70);
        rectangle(0xfff0c2, -3, -35, 6, 70);
        rectangle(0xfff0c2, -46, -3, 92, 6);
        break;
      case 'pet-bed':
        graphics.fillStyle(0x9f7080);
        graphics.fillEllipse(x, y - 8, 90, 30);
        graphics.fillStyle(0xe7b6c3);
        graphics.fillEllipse(x, y - 10, 64, 16);
        break;
      case 'mailboxes':
        rectangle(0x69626e, -50, -76, 100, 76);
        rectangle(0xb9b2ad, -44, -69, 88, 62);
        for (let row = 0; row < 3; row += 1) {
          for (let column = 0; column < 2; column += 1) {
            rectangle(0x716b75, -38 + column * 44, -61 + row * 19, 38, 14);
            rectangle(0xffd88a, -8 + column * 44, -55 + row * 19, 4, 3);
          }
        }
        if (label) {
          this.add
            .text(x, y - 91, label, {
              fontFamily: 'Trebuchet MS, Arial, sans-serif',
              fontSize: '12px',
              fontStyle: 'bold',
              color: '#452d4a',
              backgroundColor: '#ffffffbb',
              padding: { x: 4, y: 2 },
            })
            .setOrigin(0.5)
            .setDepth(2);
        }
        break;
      case 'family-photo': {
        rectangle(0x805b55, -72, -54, 144, 108);
        rectangle(0xfff3e7, -65, -47, 130, 94);
        rectangle(0x9bb39a, -58, -39, 116, 75);
        const furColors = [0x9f4d32, 0xf4f0e9, 0xc89b69, 0x888994, 0xf3e7d2];
        for (let index = 0; index < furColors.length; index += 1) {
          const offsetX = -43 + index * 21;
          graphics.fillStyle(furColors[index]);
          graphics.fillEllipse(x + offsetX, y + 9, 18, 15);
          graphics.fillCircle(x + offsetX, y - 1, 8);
          graphics.fillStyle(0x4a3028);
          graphics.fillCircle(x + offsetX + 3, y - 2, 1);
        }
        if (label) {
          this.add
            .text(x, y + 65, label, {
              fontFamily: 'Trebuchet MS, Arial, sans-serif',
              fontSize: '11px',
              color: '#452d4a',
              backgroundColor: '#ffffffcc',
              padding: { x: 4, y: 2 },
            })
            .setOrigin(0.5)
            .setDepth(2);
        }
        break;
      }
    }
  }

  private isPetVisual(visual: string | undefined): visual is PetVisual {
    return (
      visual === 'panchito' ||
      visual === 'oliver' ||
      visual === 'rex' ||
      visual === 'silvestre' ||
      visual === 'peach' ||
      visual === 'chocolatin' ||
      visual === 'canelo'
    );
  }

  private petDisplaySize(pet: PetVisual): { width: number; height: number } {
    switch (pet) {
      case 'panchito':
        return { width: 60, height: 45 };
      case 'oliver':
        return { width: 48, height: 36 };
      case 'silvestre':
        return { width: 44, height: 36 };
      case 'peach':
        return { width: 48, height: 36 };
      case 'rex':
        return this.textures.exists('rex-sheet')
          ? { width: 72, height: 48 }
          : { width: 72, height: 52 };
      case 'chocolatin':
        return { width: 54, height: 40 };
      case 'canelo':
        return { width: 56, height: 46 };
    }
  }
}
