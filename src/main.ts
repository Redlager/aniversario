import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig';
import './style.css';

const game = new Phaser.Game(gameConfig);

const app = document.querySelector<HTMLElement>('#app');
const orientationPrompt = document.querySelector<HTMLElement>('#mobile-orientation-prompt');
const orientationAction = document.querySelector<HTMLButtonElement>('#orientation-action');
const orientationStatus = document.querySelector<HTMLElement>('#orientation-status');
const fullscreenAction = document.querySelector<HTMLButtonElement>('#fullscreen-action');
const isTouchDevice =
  navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;

if (
  !app ||
  !orientationPrompt ||
  !orientationAction ||
  !orientationStatus ||
  !fullscreenAction
) {
  throw new Error('No se pudo inicializar la ayuda de orientación para móviles.');
}

const isLandscape = (): boolean => window.matchMedia('(orientation: landscape)').matches;
const isFullscreen = (): boolean => document.fullscreenElement === app;

const updateOrientationPrompt = (): void => {
  const showPrompt = isTouchDevice && !isLandscape();
  orientationPrompt.classList.toggle('is-visible', showPrompt);
  orientationPrompt.setAttribute('aria-hidden', String(!showPrompt));
  fullscreenAction.classList.toggle('is-visible', isTouchDevice && isLandscape() && !isFullscreen());
};

const enterLandscapeFullscreen = async (): Promise<void> => {
  orientationStatus.textContent = '';

  try {
    if (!isFullscreen()) await app.requestFullscreen();
  } catch {
    orientationStatus.textContent =
      'El navegador no habilitó pantalla completa. Girá el teléfono manualmente.';
    return;
  }

  try {
    const orientation = screen.orientation as ScreenOrientation & {
      lock?: (value: 'landscape') => Promise<void>;
    };
    if (orientation.lock) await orientation.lock('landscape');
    else orientationStatus.textContent = 'Girá el teléfono para jugar en horizontal.';
  } catch {
    orientationStatus.textContent = 'Girá el teléfono para jugar en horizontal.';
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
