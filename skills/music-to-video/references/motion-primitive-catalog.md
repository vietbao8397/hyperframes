# Motion-primitive catalog — the free-compose menu

The atomic layer: one anchor → one micro-move. Templates ([`template-catalog.md`](template-catalog.md))
are built from these; when no template fits a group, the planner **free-composes** by naming
primitives from here, and the frame-worker realizes them. Two readers, one file:

- **Planner (Step 3)** — scan **what it does** + **anchor** to pick the primitives a free group rides. Selection only.
- **Frame-worker (Step 4)** — open the cited recipe and lift its tweens. Build only.

The **recipe** column says what to lift:

- **✓** — a runnable, lint-clean composition at `motion-primitives/<id>/index.html`. Open it and lift the tweens.
- **≈ `<id>`** — no separate file; use that recipe, it's the same idea.
- **—** — no file; implement inline from the description (a one-liner, e.g. a 0ms `tl.set`, or a move a template realizes internally).

## Timing & latency (applies to every primitive)

Quantified from frame-accurate reverse engineering of beat-synced reels:

- **Hard hits are 0ms.** Cuts, palette flips, content swaps, freezes are `tl.set(...)` with no duration — the percussion _is_ the motion. Easing a hit kills it.
- **Lead the anchor.** A move that must _land_ on a beat (a wipe covering the frame, a count-up locking, two blocks colliding) starts **~40–190ms early** so it completes ON the anchor. Reactive entrances (something appearing _because_ of the hit) fire 0–45ms after.
- **Eased entrances: 300–500ms** (scale punch, slides, camera pushes). **Macro builds: 800–2000ms** spanning a whole roll / silence.
- **Magnitudes:** scale-punch 0→1; weight pulse 1→1.06; hero fill up to 1→5; chromatic split ~20px, resolve clean in ≤150ms.
- **Per-bar caps:** one accumulating element per hit (not a burst); a camera move at most once per phrase, never per beat; a dense flip/strobe system runs ≤2–3s.
- **Tension-builds lock.** A count-up / sequential build / morph must _resolve on_ a downbeat or hard_stop, never trail off mid-bar.

## Catalog

Each runnable recipe is self-contained and lint-clean: showcase chrome stripped, system-font
fallback, shared `../assets/gsap.min.js`, one paused timeline on `window.__timelines["main"]`.

| id                    | anchor                           | what it does                                                                                                                                     | recipe                  |
| --------------------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------- |
| `hypercut-whip`       | beat / hard_stop                 | fast whip-pan hard cut between frames                                                                                                            | ✓                       |
| `kinetic-letter-in`   | downbeat / phrase                | per-letter kinetic entrance                                                                                                                      | ✓                       |
| `braam-punch`         | drop / surge                     | big "braam" impact — scale + weight slam                                                                                                         | ✓                       |
| `chromatic-split`     | snare / glitch / surge           | RGB channel split / glitch on a word                                                                                                             | ✓                       |
| `mask-reveal`         | section_start / downbeat         | clip-path mask wipe reveal                                                                                                                       | ✓                       |
| `screen-shake`        | drop / crash / kick              | camera / screen shake jitter                                                                                                                     | ✓                       |
| `binary-decrypt`      | roll / build                     | scramble→decode text (binary → word)                                                                                                             | ✓                       |
| `dolly-zoom`          | phrase / build                   | vertigo dolly-zoom (scale vs perspective)                                                                                                        | ✓                       |
| `iris-open`           | section_start / reveal           | circular iris-open reveal                                                                                                                        | ✓                       |
| `electric-arc`        | accent / glitch                  | electric arc / lightning accent                                                                                                                  | ✓                       |
| `neon-flicker`        | hold / texture                   | neon-sign flicker                                                                                                                                | ✓                       |
| `chrome-sweep`        | downbeat / reveal                | metallic specular sweep across text                                                                                                              | ✓                       |
| `slot-machine-reveal` | roll → downbeat                  | slot-machine spin-to-land character reveal                                                                                                       | ✓                       |
| `liquid-morph`        | phrase / transition              | liquid / blob morph                                                                                                                              | ✓                       |
| `gooey-metaball`      | build / drop                     | gooey metaball merge field                                                                                                                       | ✓                       |
| `3d-card-flip`        | downbeat / swap                  | 3D card flip (rotateY)                                                                                                                           | ✓                       |
| `crash-zoom-in`       | drop / surge                     | violent crash zoom-in                                                                                                                            | ✓                       |
| `spotlight-sweep`     | reveal / hold                    | spotlight / gradient sweep over text                                                                                                             | ✓                       |
| `outline-to-fill`     | downbeat / reveal                | stroke outline → solid fill                                                                                                                      | ✓                       |
| `counting-punch`      | roll → downbeat                  | number count-up that punches & locks                                                                                                             | ✓                       |
| `particle-burst`      | drop / crash                     | particle explosion burst                                                                                                                         | ✓                       |
| `radial-burst-lines`  | drop / surge                     | radial speed-lines burst                                                                                                                         | ✓                       |
| `pixel-dissolve`      | transition / hard_stop           | pixelated dissolve                                                                                                                               | ✓                       |
| `datamosh-smear`      | glitch / transition              | datamosh / motion smear                                                                                                                          | ✓                       |
| `text-wave-distort`   | hold / texture                   | wavy text distortion                                                                                                                             | ✓                       |
| `bg-flow-field`       | energy / whole span (bed)        | generative WebGL curl-noise flow-field **background bed** — palette-driven, breathes on the energy envelope; compose any foreground move over it | ✓                       |
| `blur-resolve`        | stop / final hold                | blur-in to crisp focus, then blur-out on the cut                                                                                                 | ✓                       |
| `chromatic-pressure`  | snare / glitch                   | RGB split / digital tension on a transient                                                                                                       | ≈ `chromatic-split`     |
| `color-grid-shuffle`  | onset                            | grid of cells recoloured by a deterministic index per onset                                                                                      | —                       |
| `content-swap`        | beat                             | 0ms swap of stacked nodes — the workhorse percussive move                                                                                        | ≈ `slot-machine-reveal` |
| `directional-fill`    | beat / reveal                    | directional wipe-fill (scaleX) sweeping across bars                                                                                              | ✓                       |
| `flash-cut`           | drop / crash                     | full-frame flash masking a word / colour state change                                                                                            | ✓                       |
| `freeze-hold`         | hard_stop                        | freeze the moving system and hold it (desaturate + vignette)                                                                                     | —                       |
| `hard-cut`            | beat / hard_stop                 | sample-accurate 0ms colour-block + word cut                                                                                                      | ✓                       |
| `mosaic-pack`         | beat / build                     | scattered tiles fly in and pack into a grid                                                                                                      | ✓                       |
| `negative-space-hold` | silence / hard_stop / final hold | kill busy layers, hold one readable mark in empty space                                                                                          | —                       |
| `overlay-pop`         | accent                           | badge / lower-third overlay pops in over a base                                                                                                  | —                       |
| `palette-flip`        | section change                   | same layout re-skins via 0ms palette-variable flips                                                                                              | ✓                       |
| `staggered-exit`      | phrase / transition              | ordered cascade-out clearing the frame                                                                                                           | ✓                       |
| `staggered-reveal`    | build                            | ordered cascade-in of a stack / list                                                                                                             | —                       |
| `system-replace`      | drop / regime change             | hard-cut the entire visual system, then boot the new one                                                                                         | —                       |
| `text-spectral-rays`  | phrase / sweep (hero text)       | volumetric spectral light-rays cast by a wordmark toward a sweeping light cursor — grain + RGB-split; **WebGL hero-text system**                 | ✓                       |
| `tile-mosaic`         | build / reveal                   | grid of tiles revealed in a diagonal sweep, assembling a poster                                                                                  | ✓                       |
| `typewriter-reveal`   | roll / build                     | char / word type-on, explicit per-span set (no `stagger`) + caret                                                                                | ✓                       |
| `value-counter`       | roll → downbeat                  | count-up that locks on a downbeat / hard_stop                                                                                                    | ≈ `counting-punch`      |
| `word-grid-burst`     | onsets → downbeat                | grid of words revealed per onset, refocus one on a downbeat                                                                                      | ✓                       |

> **Template-private verbs.** Some templates declare moves realized only inside their own
> impl — `held_lockup`, `anchor_pop_in`, `word_slot_cycle`, `per_line_color`,
> `scene_palette_flip`, `beat_jitter_shake`, `box_zoom_wipe` (`split-anchor-word-slot`),
> `motion-blur` (`logo-split-lockup-pulse`). Those live in the template's `index.html`, not here.

## How to combine

- One dominant system per group; layer at most one texture recipe over one structural recipe.
- Structure on strong beats (cuts, camera, `system-replace` → downbeat / phrase / section_start); texture on weak / syncopated hits (`content-swap`, typewriter letters, chromatic accents).
- A roll is an accumulation container — build during it, hard-cut to a clean layout on the downbeat that ends it.
- `drop` ≠ `downbeat`: a downbeat is a cut within the regime; a drop is a regime change (`system-replace`, total clear, element-count jump).
- Let silence remove density (`negative-space-hold`).
- **Background beds are a layer, not a move.** A bed (`bg-flow-field`) runs the whole span on the **energy / phrase** channel, leaving the **beat anchors** free for the foreground — so it composes cleanly _under_ any discrete primitive. One bed at a time; merge the bed's uniform tweens onto the group's master timeline (don't run a second timeline), bundle a local `three`/WebGL (no CDN), repaint via the timeline's `onUpdate` (no rAF).
- **WebGL "system" primitives come in two roles:** a **bed** (`bg-flow-field`, behind everything) and a **hero-text treatment** (`text-spectral-rays`, which rasterizes the wordmark and _is_ the hero). Use at most one of each; feed text/raster locally (no CDN fonts), repaint via `onUpdate`.
- **`text-spectral-rays` renders its OWN wordmark — never give the word a second source.** It draws the solid letters AND the rays from one glyph mask (perfectly registered). Do NOT use it as a "rays-only" layer behind a separate DOM logo (or stack `content-swap` / `chromatic-pressure` on the same word): the two fonts/positions won't match and you get a doubled / ghosted wordmark — deleting the shader's letter terms does not fix it (the ray mask is still the second, misaligned copy). Let the shader be the wordmark; hide any DOM logo (keep it only as an invisible layout spacer). If you move the word off frame-center, move the light cursor's `y` by the same amount. Full recipe: [`motion-primitives/text-spectral-rays/USAGE.md`](motion-primitives/text-spectral-rays/USAGE.md).
