import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig';
import './style.css';

const game = new Phaser.Game(gameConfig);

const app = document.querySelector<HTMLElement>('#app');
const orientationPrompt = document.querySelector<HTMLElement>('#mobile-orientation-prompt');
const orientationAction = document.querySelector<HTMLButtonElement>('#orientation-action');
const orientationStatus = document.querySelector<HTMLElement>('#orientation-status');
const fullscreenAction = document.querySelector<HTMLButtonElement>('#fullscreen-action');
const fullscreenStatus = document.querySelector<HTMLElement>('#fullscreen-status');
const isTouchDevice =
  navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
let fullscreenUnavailable = false;

if (
  !app ||
  !orientationPrompt ||
  !orientationAction ||
  !orientationStatus ||
  !fullscreenAction ||
  !fullscreenStatus
) {
  throw new Error('No se pudo inicializar la ayuda de orientación para móviles.');
}

const isLandscape = (): boolean => window.matchMedia('(orientation: landscape)').matches;
const isFullscreen = (): boolean => document.fullscreenElement === app;
const canRequestFullscreen = (): boolean =>
  !fullscreenUnavailable &&
  document.fullscreenEnabled &&
  typeof app.requestFullscreen === 'function' &&
  typeof document.exitFullscreen === 'function';

const showFullscreenStatus = (message: string): void => {
  fullscreenStatus.textContent = message;
  fullscreenStatus.classList.toggle('is-visible', message.length > 0);
};

const updateOrientationPrompt = (): void => {
  const showPrompt = isTouchDevice && !isLandscape();
  orientationPrompt.classList.toggle('is-visible', showPrompt);
  orientationPrompt.setAttribute('aria-hidden', String(!showPrompt));
  orientationAction.hidden = !canRequestFullscreen();
  fullscreenAction.textContent = isFullscreen() ? '×' : '⛶';
  fullscreenAction.setAttribute(
    'aria-label',
    isFullscreen() ? 'Salir de pantalla completa' : 'Activar pantalla completa',
  );
  fullscreenAction.classList.toggle(
    'is-visible',
    isTouchDevice && isLandscape() && canRequestFullscreen(),
  );
};

const enterLandscapeFullscreen = async (): Promise<void> => {
  orientationStatus.textContent = '';
  showFullscreenStatus('');

  try {
    if (isFullscreen()) {
      await document.exitFullscreen();
      updateOrientationPrompt();
      return;
    }
    if (!canRequestFullscreen()) {
      orientationStatus.textContent = 'Girá el teléfono para jugar en horizontal.';
      return;
    }
    await app.requestFullscreen();
  } catch {
    fullscreenUnavailable = true;
    updateOrientationPrompt();
    showFullscreenStatus(
      'Este navegador no permite pantalla completa desde la página. Podés jugar igual: girá el teléfono.',
    );
  }

  if (isFullscreen()) {
    try {
      const orientation = screen.orientation as ScreenOrientation & {
        lock?: (value: 'landscape') => Promise<void>;
      };
      if (orientation.lock) await orientation.lock('landscape');
      else orientationStatus.textContent = 'Girá el teléfono para jugar en horizontal.';
    } catch {
      orientationStatus.textContent = 'Girá el teléfono para jugar en horizontal.';
    }
  }

  updateOrientationPrompt();
};

orientationAction.addEventListener('click', () => void enterLandscapeFullscreen());
fullscreenAction.addEventListener('click', () => void enterLandscapeFullscreen());
document.addEventListener('fullscreenchange', updateOrientationPrompt);
window.addEventListener('orientationchange', updateOrientationPrompt);
window.addEventListener('resize', updateOrientationPrompt);
updateOrientationPrompt();

window.addEventListener('pagehide', () => game.destroy(true));
