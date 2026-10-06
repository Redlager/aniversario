# Vicky — La Aventura de 7 Años

Base web del juego en Phaser 3, TypeScript y Vite. La escena `Level` consume
configuraciones de nivel; `level-1-el-match` es el primer nivel narrativo y usa
placeholders pixel-art generados desde código. La escena original `Game` se
conserva como prueba de movimiento.

## Desarrollo

```bash
npm install
npm run dev
```

Para validar la compilación de producción:

```bash
npm run build
```

## Controles de prueba

- Teclado: `A` / `D` o flechas para moverse; `W`, flecha arriba o `Espacio` para saltar.
- Táctil: botones en pantalla para izquierda, derecha y salto.
- `Espacio` / `Enter` cierra diálogos; tocá el panel en móvil.
- En el nivel, los marcadores celestes guardan el punto de reaparición.
- En El Match, acercate a la terminal y presioná `E` (o `INTERACTUAR` en móvil)
  para iniciar la escena narrativa.

## Sistema de niveles

- `src/levels/LevelTypes.ts`: tipos de plataformas, spawn, checkpoint, objetos,
  enemigos, NPC, objetivo y salida; también define el progreso del jugador.
- `src/levels/level1.ts`: configuración del campus, sus secciones y contenido.
- `src/levels/levelRegistry.ts`: registro de los niveles actualmente disponibles.
- `src/scenes/BaseLevelScene.ts`: lógica compartida de gameplay y transiciones.
- `src/scenes/LevelScene.ts`: resuelve la configuración activa por `levelId`.
- `src/entities/` y `src/ui/`: componentes reutilizables de jugador, enemigo,
  HUD y diálogo.

Para agregar otro nivel, creá su `LevelConfig`, registralo en
`src/levels/levelRegistry.ts` y configurá `exit.nextLevelId` con su id. Cada
nivel declara su propio spawn y contenido; no necesita duplicar la escena ni
los sistemas comunes.