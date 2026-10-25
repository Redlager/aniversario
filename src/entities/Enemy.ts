import Phaser from 'phaser';
import type { EnemyConfig, PlatformConfig } from '../levels/LevelTypes';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private readonly startX: number;
  private readonly patrolDistance: number;
  private readonly speed: number;
  private readonly target?: Phaser.Physics.Arcade.Sprite;
  private readonly platforms: PlatformConfig[];
  private readonly refereeDebugEnabled: boolean;

  constructor(
    scene: Phaser.Scene,
    config: EnemyConfig,
    target?: Phaser.Physics.Arcade.Sprite,
    platforms: PlatformConfig[] = [],
  ) {
    const texture =
      config.kind === 'exam'
        ? 'exam'
        : config.kind === 'ghost'
          ? 'ghost-alive-sheet'
          : config.kind === 'cockroach'
            ? 'cockroach-alive-sheet'
            : config.kind === 'scorpion'
              ? 'scorpion-alive-sheet'
              : config.kind === 'beetle'
                ? 'beetle-alive-sheet'
                : config.kind === 'referee'
                  ? 'referee-alive-sheet'
                  : config.kind === 'musician'
                    ? 'musician-alive-sheet'
                    : config.kind === 'singer'
                      ? 'singer-alive-sheet'
                      : config.kind === 'waitress'
                        ? 'waitress-alive-sheet'
                        : 'enemy';
    super(scene, config.x, config.y, texture);
    this.startX = config.x;
    this.patrolDistance = config.patrolDistance ?? 80;
    this.speed = config.speed ?? 65;
    this.target = target;
    this.platforms = platforms;
    this.refereeDebugEnabled =
      config.kind === 'referee' &&
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('debugReferee') === '1';

    scene.add.existing(this);
    scene.physics.add.existing(this);
    const animatedKind =
      config.kind === 'ghost' ||
      config.kind === 'cockroach' ||
      config.kind === 'scorpion' ||
      config.kind === 'beetle' ||
      config.kind === 'referee' ||
      config.kind === 'musician' ||
      config.kind === 'singer' ||
      config.kind === 'waitress';
    const spriteScale =
      config.kind === 'ghost'
        ? 0.11
        : config.kind === 'cockroach' ||
            config.kind === 'scorpion' ||
            config.kind === 'beetle' ||
            config.kind === 'referee' ||
            config.kind === 'musician' ||
            config.kind === 'singer' ||
            config.kind === 'waitress'
          ? 0.083
          : config.kind === 'exam'
            ? 1.5
            : 1;
    const bodyScale =
      config.kind === 'exam' || config.kind === 'ghost'
        ? 1.5
        : config.kind === 'cockroach' ||
            config.kind === 'scorpion' ||
            config.kind === 'beetle' ||
            config.kind === 'referee' ||
            config.kind === 'musician' ||
            config.kind === 'singer' ||
            config.kind === 'waitress'
          ? 1.2
          : 1;
    const displayScale = config.kind === 'referee' ? spriteScale * 1.1 : spriteScale;
    this.setScale(displayScale);
    if (config.kind === 'referee') this.setDepth(3);
    this.setSize((30 * bodyScale) / displayScale, (34 * bodyScale) / displayScale).setOffset(
      (3 * bodyScale) / displayScale,
      (7 * bodyScale) / displayScale,
    );
    this.setCollideWorldBounds(true);
    this.setVelocityX(this.speed);
    if (config.kind === 'exam' && scene.anims.exists('exam-float')) this.play('exam-float');
    if (animatedKind && scene.anims.exists(`${config.kind}-alive`)) {
      this.play(`${config.kind}-alive`);
    }
    if (config.kind === 'referee' && this.body instanceof Phaser.Physics.Arcade.Body) {
      this.setVisible(false);
      this.body.enable = false;
      this.setVelocity(0, 0);
    }
    if (this.refereeDebugEnabled) {
      scene.input.keyboard?.on('keydown-F8', this.captureRefereeSnapshot, this);
      console.info('[referee-debug] Diagnóstico activo. F8 captura la escena.');
    }
    if (config.kind === 'ghost') {
      this.setData('enemyKind', 'ghost');
      scene.tweens.add({
        targets: this,
        y: config.y - 9,
        duration: 720,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.InOut',
      });
    } else {
      this.setData('enemyKind', config.kind ?? 'enemy');
    }
  }

  override preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    if (!this.active || this.getData('defeated')) return;
    const body = this.body;
    const isReferee = this.getData('enemyKind') === 'referee';
    if (isReferee) {
      if (!this.target?.active) return;
      if (!this.visible) {
        if (Math.abs(this.target.x - this.x) > 450) return;
        this.setVisible(true);
        if (body instanceof Phaser.Physics.Arcade.Body) body.enable = true;
      }
      if (!(body instanceof Phaser.Physics.Arcade.Body) || !body.enable) return;
      const horizontalDistance = this.target.x - this.x;
      const direction = Math.abs(horizontalDistance) < 8 ? 0 : Math.sign(horizontalDistance);
      this.setVelocityX(direction * this.speed);
      this.jumpBetweenPlatforms(direction);
    } else {
      if (!(body instanceof Phaser.Physics.Arcade.Body) || !body.enable) return;
      if (this.x >= this.startX + this.patrolDistance) {
        this.setVelocityX(-this.speed);
      } else if (this.x <= this.startX - this.patrolDistance) {
        this.setVelocityX(this.speed);
      }
    }
    this.setFlipX(body instanceof Phaser.Physics.Arcade.Body && body.velocity.x < 0);
  }

  private jumpBetweenPlatforms(direction: number): void {
    const body = this.body;
    if (
      direction === 0 ||
      !(body instanceof Phaser.Physics.Arcade.Body) ||
      (!body.blocked.down && !body.touching.down)
    ) {
      return;
    }

    const currentPlatform = this.platforms
      .filter((platform) => {
        const platformLeft = platform.x - platform.width / 2;
        const platformRight = platform.x + platform.width / 2;
        const platformTop = platform.y - (platform.height ?? 24) / 2;
        return (
          this.x >= platformLeft - 4 &&
          this.x <= platformRight + 4 &&
          Math.abs(body.bottom - platformTop) <= 28
        );
      })
      .sort((a, b) => {
        const topA = a.y - (a.height ?? 24) / 2;
        const topB = b.y - (b.height ?? 24) / 2;
        return Math.abs(body.bottom - topA) - Math.abs(body.bottom - topB);
      })[0];
    if (!currentPlatform) return;

    const currentLeft = currentPlatform.x - currentPlatform.width / 2;
    const currentRight = currentPlatform.x + currentPlatform.width / 2;
    const currentTop = currentPlatform.y - (currentPlatform.height ?? 24) / 2;
    const nextPlatform = this.platforms
      .filter((platform) => {
        if (platform === currentPlatform || (platform.x - currentPlatform.x) * direction <= 0) {
          return false;
        }
        const left = platform.x - platform.width / 2;
        const right = platform.x + platform.width / 2;
        const gap = direction > 0 ? left - currentRight : currentLeft - right;
        const top = platform.y - (platform.height ?? 24) / 2;
        const isHigher = top < currentTop - 12;
        return (gap > 12 && gap <= 180) || (isHigher && Math.abs(platform.x - currentPlatform.x) <= 360);
      })
      .sort((a, b) => Math.abs(a.x - currentPlatform.x) - Math.abs(b.x - currentPlatform.x))[0];
    if (!nextPlatform) return;

    const nextLeft = nextPlatform.x - nextPlatform.width / 2;
    const nextRight = nextPlatform.x + nextPlatform.width / 2;
    const nextTop = nextPlatform.y - (nextPlatform.height ?? 24) / 2;
    const gap = direction > 0 ? nextLeft - currentRight : currentLeft - nextRight;
    const nextSurfaceEdge = direction > 0 ? nextLeft : nextRight;
    const jumpEdge = gap > 12 ? (direction > 0 ? currentRight : currentLeft) : nextSurfaceEdge;
    const distanceToJumpEdge = (jumpEdge - this.x) * direction;
    const needsJump = gap > 12 || nextTop < currentTop - 12;

    if (needsJump && distanceToJumpEdge >= -45 && distanceToJumpEdge <= 30) {
      this.setVelocityY(-470);
    }
  }

  playDefeatAnimation(): void {
    if (this.getData('defeated')) return;
    this.setData('defeated', true);
    if (this.body instanceof Phaser.Physics.Arcade.Body) {
      if (this.body.enable) this.setVelocity(0, 0);
      this.body.enable = false;
    }
    this.scene.tweens.killTweensOf(this);
    const enemyKind = this.getData('enemyKind') as string;
    const defeatAnimation = `${enemyKind}-defeat`;
    if (this.refereeDebugEnabled) {
      console.info('[referee-debug] Inicio de derrota', {
        animation: defeatAnimation,
        exists: this.scene.anims.exists(defeatAnimation),
        frame: this.frame.name,
      });
      this.scene.time.delayedCall(180, this.captureRefereeSnapshot, [], this);
    }
    if (this.scene.anims.exists(defeatAnimation)) {
      this.play(defeatAnimation);
      let finished = false;
      let fallback: Phaser.Time.TimerEvent | undefined;
      const finishDefeat = (reason: 'animationcomplete' | 'timeout'): void => {
        if (finished || !this.active) return;
        finished = true;
        fallback?.remove(false);
        if (this.refereeDebugEnabled) {
          console.info('[referee-debug] Fin de derrota', {
            reason,
            animation: this.anims.currentAnim?.key,
            frame: this.frame.name,
          });
        }
        this.destroy();
      };
      this.once(`animationcomplete-${defeatAnimation}`, () => finishDefeat('animationcomplete'));
      // A corrupted or interrupted spritesheet must not leave a defeated enemy in the scene.
      fallback = this.scene.time.delayedCall(900, () => finishDefeat('timeout'));
      return;
    }
    if (!this.scene.anims.exists('exam-defeat')) {
      this.destroy();
      return;
    }
    this.play('exam-defeat');
    this.once('animationcomplete-exam-defeat', () => this.destroy());
  }

  override destroy(fromScene?: boolean): void {
    if (this.refereeDebugEnabled) {
      this.scene.input.keyboard?.off('keydown-F8', this.captureRefereeSnapshot, this);
    }
    super.destroy(fromScene);
  }

  private captureRefereeSnapshot(): void {
    if (!this.refereeDebugEnabled) return;
    console.info('[referee-debug] Captura de estado', {
      x: this.x,
      y: this.y,
      visible: this.visible,
      active: this.active,
      defeated: this.getData('defeated'),
      animation: this.anims.currentAnim?.key,
      frame: this.frame.name,
      bodyEnabled: this.body instanceof Phaser.Physics.Arcade.Body && this.body.enable,
    });
    this.scene.game.canvas.toBlob((blob) => {
      if (!blob) {
        console.error('[referee-debug] No se pudo crear la captura del canvas.');
        return;
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `referee-debug-${Date.now()}.png`;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, 'image/png');
  }
}
