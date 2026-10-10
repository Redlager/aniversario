# Character sprite sheets

Place optional character art in this folder. Sprite sheets may be horizontal,
left-to-right strips or grids, with transparent backgrounds and equally sized
frames. Frames should use the same canvas size for every animation belonging
to a character. Keep the character centered and aligned to the bottom of each
frame.

| File                    | Frame size | Frames | Animation                                           |
| ----------------------- | ---------: | -----: | --------------------------------------------------- |
| `vicky/idle.png`        |  256 x 396 |      4 | idle                                                |
| `vicky/walk.png`        |  256 x 396 |      6 | walk                                                |
| `vicky/jump.png`        |  256 x 396 |      1 | jump                                                |
| `vicky/land.png`        |  256 x 396 |      1 | landing                                             |
| `vicky/fall.png`        |  256 x 396 |      2 | fall loop                                           |
| `vicky/damage.png`      |  256 x 396 |      2 | damage / stun                                       |
| `renzo/idle.png`        |    40 x 50 |      4 | subtle passive NPC idle                             |
| `renzo/appear.png`      |    40 x 50 |      6 | brief NPC interaction / final-scene appearance      |
| `pets/panchito.png`     |  724 x 543 |      4 | 2x2 pose grid; top row idle, bottom-right surprised |
| `pets/oliver.png`       |  724 x 543 |      4 | 2x2 pose grid; frames 0 and 2 used for idle         |
| `pets/peach.png`        |  724 x 543 |      4 | 2x2 pose grid; frames 0 and 2 used for idle         |
| `pets/rex.png`          |  768 x 512 |      4 | 2x2 poses; standing, running, surprised             |
| `pets/silvestre.png`    |  724 x 543 |      4 | 2x2 poses; frames 1 and 3 used for idle             |
| `pets/chocolatin.png`   |  724 x 543 |      4 | 2x2 poses; neutral pose and ball-play reaction      |
| `pets/canelo.png`       |  724 x 543 |      4 | 2x2 poses; neutral pose and carrot reaction         |
| `el-parcial/patrol.png` |    44 x 48 |      4 | patrol / floating loop                              |
| `el-parcial/defeat.png` |    44 x 48 |      4 | defeat                                              |

The loader reads animation and frame details from
`../characterSpriteSheets.ts`. Vite includes only PNG files actually present,
so missing art uses the generated placeholders without failed network requests.
Panchito's 1448 x 1086 image is a 2x2 grid, read in row-major order. Its two
similar top-row poses are used for a subtle idle loop; the bottom-right pose is
used when the player interacts. It has no continuous walking frames.
Oliver's 1448 x 1086 image is also a 2x2 grid, read in row-major order. Frames
0 and 2 provide a subtle idle loop; there are no separate walk or interact
sheets.
Peach's 1448 x 1086 image is a 2x2 grid, also read in row-major order. Frames
0 and 2 provide the idle loop; no separate movement or interaction sheets are
available.
Rex's 1536 x 1024 image is a 2x2 grid, read in row-major order. Frame 0 is used
for his standing pose and frame 3 for his interaction reaction. The running
poses are not played in place because Rex is a stationary pet in current levels.
Silvestre's 1448 x 1086 image is a 2x2 grid, read in row-major order. Frames 1
and 3 provide a subtle seated idle loop; there are no separate walking or
interaction sheets.
Chocolatin's 1448 x 1086 image is a 2x2 grid, read in row-major order. Frame 0
is his neutral standing pose and frame 3 is used briefly when interacting.
Frames 1 and 2 are distinct poses, not a continuous movement sequence, so no
walk or looping motion is inferred.
Canelo's 1448 x 1086 image is a 2x2 grid, read in row-major order. Frame 0 is
used as the neutral pose and frame 3, with the carrot, as a brief interaction
reaction. The other poses are not treated as a continuous movement animation.
Victoria's `vic1.png` measures 1983 x 793 and is an irregular collage, not a
10x2 frame grid. Alpha-connected silhouette analysis identifies 10 upper-row
poses and 8 lower-row poses; each is isolated into a transparent, 256 x 396
frame without resizing. The original is unchanged. Upper poses 0-3 drive idle
and 4-9 walking. Lower pose 1 is the single jump pose, pose 2 the single
landing pose, poses 3-4 the fall loop, and poses 6-7 the damage/stun reaction
(stars followed by a crouched pose). Each frame is centered and aligned to a
shared foot baseline. The lower-row running pose and surprised pose remain
unused because their intended gameplay role is unclear. The source has no
multi-frame jump-up sequence; the jump state therefore holds its one genuine
pose instead of repeating invented artwork.
Renzo's original `renzo1.png` is 1983 x 793 and contains mixed poses; it is not
loaded as an evenly spaced grid. The prepared `idle.png` is a 4-frame,
40 x 50 strip used for the passive NPC idle loop. `appear.png` is a separate
6-frame strip with the same frame size and is used only for the existing
one-time proximity interaction and final-scene arrival. The source also
contains walking and other expressive poses; they are not played during
gameplay because Renzo remains stationary, and the other poses are not
assigned an animation without a clear sequence.
El Parcial's `patrol.png` is a 4-frame sheet adapted from the supplied
`el-parcial/parcial vivo.png` artwork.
Its `defeat.png` is adapted from `el-parcial/parcial muerto.png`, keeping the
same frame dimensions and visual scale as the patrol sheet.
