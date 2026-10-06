# Character sprite sheets

Place optional character art in this folder. Each PNG is a horizontal,
left-to-right strip with transparent background and equally sized frames.
Frames should use the same canvas size for every animation belonging to a
character. Keep the character centered and aligned to the bottom of each frame.

| File | Frame size | Frames | Animation |
| --- | ---: | ---: | --- |
| `vicky/idle.png` | 40 x 50 | 4 | idle loop |
| `vicky/walk.png` | 40 x 50 | 6 | walk loop |
| `vicky/jump.png` | 40 x 50 | 3 | jump |
| `vicky/fall.png` | 40 x 50 | 2 | fall loop |
| `vicky/damage.png` | 40 x 50 | 3 | damage |
| `renzo/idle.png` | 40 x 50 | 4 | idle loop |
| `renzo/appear.png` | 40 x 50 | 6 | final-scene appearance |
| `el-parcial/patrol.png` | 44 x 48 | 4 | patrol / floating loop |
| `el-parcial/defeat.png` | 44 x 48 | 4 | defeat |

The loader reads animation and frame details from
`../characterSpriteSheets.ts`. Vite includes only PNG files actually present,
so missing art uses the generated placeholders without failed network requests.
No final art is included yet.
