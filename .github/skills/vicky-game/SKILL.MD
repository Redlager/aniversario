# Vicky Game Development Skill

## Role

Act as a senior Phaser 3 + TypeScript game developer.

This project is a small personalized 2D platform game for Vicky.

The project is web-first and mobile-first.

## Stack

* Phaser 3
* TypeScript
* Vite
* HTML/CSS
* Git
* Vercel for deployment

Do not introduce additional dependencies unless clearly necessary.

## Development philosophy

Keep the project:

* simple
* modular
* maintainable
* performant
* mobile-friendly

Avoid overengineering.

Prefer small reusable systems over duplicated code.

Do not create abstractions before they are useful.

## AI workflow

Before modifying code:

1. Inspect the existing implementation.
2. Identify relevant files.
3. Explain the intended change briefly.
4. Implement only the requested scope.
5. Verify TypeScript compilation.
6. Verify runtime behavior.
7. Report modified files and next step.

Never rewrite working systems unnecessarily.

Never regenerate the entire project for a small change.

## Scope control

Do not implement future features unless explicitly requested.

The project is developed incrementally:

1. Foundation
2. Level system
3. Gameplay systems
4. Level 1
5. Remaining levels
6. Art
7. Audio
8. Polish
9. Mobile optimization
10. Deployment

## Mobile-first requirements

The game must work correctly in mobile browsers.

Consider:

* responsive canvas
* touch controls
* different aspect ratios
* safe screen areas
* performance
* readable UI
* avoiding tiny interactive elements

Desktop keyboard controls should remain available.

## Gameplay architecture

Prefer reusable systems for:

* Player
* Levels
* Platforms
* Enemies
* Collectibles
* Checkpoints
* Dialogues
* HUD
* Level transitions

Level-specific content should be separated from reusable gameplay logic.

## Assets

Use placeholders until the gameplay is stable.

Do not block gameplay development waiting for final artwork.

Do not assume an asset exists unless it is actually present in the repository.

## Code quality

Use TypeScript types.

Avoid `any` unless there is a specific reason.

Keep functions focused.

Avoid giant classes.

Avoid unnecessary global state.

Keep Phaser-specific logic close to the relevant game systems.

## Token efficiency

Responses and implementation plans must be concise.

Do not repeat the project history unless explicitly requested.

Do not explain unchanged code.

When modifying a file, inspect only the relevant sections when possible.

Prefer targeted patches over rewriting complete files.

Do not output large amounts of code unless necessary.

When reporting progress use:

* Changed
* Added
* Tested
* Next

## Important rule

The developer controls scope.

If a requested feature could significantly increase project complexity, explain the tradeoff briefly and recommend the simplest viable implementation.

The goal is to finish a polished small anniversary game, not build a general-purpose game engine.
