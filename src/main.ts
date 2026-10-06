import Phaser from 'phaser';
import { gameConfig } from './config/gameConfig';
import './style.css';

const game = new Phaser.Game(gameConfig);

window.addEventListener('pagehide', () => game.destroy(true));
