# Luxeria — The Collection

Five cars presented as a single immersive screen: a dark room lit in the car's
own colour, its model number set enormous behind it, and the car itself
rendered in front in real time.

Three.js draws the car into a **transparent** canvas that sits above the page's
typography layer, so the model genuinely occludes the number behind it and its
shadow genuinely falls across the digits. Nothing about the layering is faked,
and nothing about the car is a pre-rendered image.

```
npm install
npm run optimize   # source GLBs -> public/models  (run once; output is committed)
npm run dev
```

If `npm install` warns about install scripts, approve them — `esbuild` and
`sharp` both need their native binaries:

```
npm approve-scripts --allow-scripts-pending
```

---

## Getting around

| | |
|---|---|
| Change car | `Explore`, the ticks down the right edge, `←` / `→`, or a scroll gesture |
| Rotate the car | drag it |
| Preview it | the play button on the card — the interface clears, letterbox bars close in and the camera takes a slow pass around the model. `Esc` or `Close` returns |
| The collection | the menu, top left |

`#/aurum` in the URL opens on that car.

## Layout

```
src/
  App.jsx                 which car is current, and every way of changing it
  data/vehicles.js        THE COLLECTION — copy, figures, framing, model number
  components/             the interface, one file per piece
  three/
    Experience.js         owns the scene: loading, framing, transitions, tick
    VehicleManager.js     load, normalise, cache, and condition materials
    CameraRig.js          framing maths and the view offset
    Lighting.js           key, fill, rim, bounce
    ContactShadow.js      the shadow the car drops on the floor
    PostFX.js             multisampled target, bloom, exposure, composite
    quality.js            tier detection and the frame-time governor
  styles/
    tokens.css            every colour, size and page inset
    app.css               layout only
scripts/optimize-models.mjs   source GLBs -> public/models
```

**Adding a car** is one entry in `src/data/vehicles.js` — including its `paint`,
which the whole page recolours itself from — one in
`scripts/optimize-models.mjs`, and, if its bodywork needs different treatment,
one in `MATERIAL_CONFIG`. Nothing else knows how many cars there are.

## The cars

| Car | Code | Year | Source | Shipped | Triangles |
|---|---|---|---:|---:|---:|
| `aurum` — grand tourer | 1180S | 2024 | 12.21 MB | **4.64 MB** | 495,520 |
| `nocturne` — coupé | 1020S | 2025 | 12.05 MB | **4.57 MB** | 496,382 |
| `vermilion` — track special | 980R | 2026 | 11.89 MB | **4.46 MB** | 482,343 |
| `solaire` — gilded one-off | 1250G | 2026 | 12.39 MB | **4.87 MB** | 487,140 |
| `viridian` — open-top | 940T | 2027 | 12.42 MB | **4.72 MB** | 490,388 |

**61 MB → 23.3 MB**, all five preloaded, with no visible loss at the framing the
page actually uses.

The sources are Tripo exports living one directory above this one: single mesh,
single material, 4K atlases and ~1.9 M triangles each. `optimize-models.mjs`
resizes the atlases per material slot, decimates to a quarter of the triangle
count, welds and prunes, and re-encodes geometry as `EXT_meshopt_compression`.

Two things worth knowing about the settings:

- **Base colour stays at 4096.** These bakes pack their UV islands tightly and
  have specular streaks painted into the albedo; at 2048 the mip chain smears
  island edges together and the bodywork reads as crumpled foil. The ORM and
  normal maps have no such problem and drop to 1024 / 2048.
- **The triangle budget is a quarter of the source.** At ~250 k these bodies
  start to facet along the shoulder line where the light runs; ~495 k holds the
  reflection smooth and still loads in a couple of seconds. Override it for a
  one-off run with `SIMPLIFY_RATIO=0.4 npm run optimize`.

## The composition

The layout follows a supplied reference: menu, marque and sections across the
top; the model number filling the middle with the car overlapping its lower
half; and one band across the foot of the frame carrying the two headline
figures on the left, the car's name and story in the centre, and a preview card
above the call to action on the right.

The card carries two controls and they do different things: **play** hands the
frame to the car itself, **Explore** moves on to the next car.

### The page takes the car's colour

Each car carries one authored colour in `paint`, taken off its own bodywork.
`paintVars` derives the rest — a lit variant, and the channel triple that lets
the gradients tint through `rgb(var(--accent-rgb) / a)` — and `App` sets all
three as custom properties on the root element. The room's wash and pool of
light, the model number, the tick, the brand mark and the call to action then
change together as the car does.

| Car | Paint | |
|---|---|---|
| Aurum | `#e8dfcd` | warm platinum — the body is white, but every highlight on it is champagne |
| Nocturne | `#c8d2da` | cool silver, against the Aurum's warm one: same white paint, different light in it |
| Vermilion | `#d8291c` | straight off the bodywork |
| Solaire | `#e2952a` | the plating |
| Viridian | `#1ea34b` | the one finish offered |

Two details that make it hold up across five very different colours:

- **The gradients keep their shape.** Only the colour is substituted; the
  stops, positions and alphas are the ones the layout was designed with.
- **The number takes the lit variant, not the paint.** The room is tinted with
  the same colour, and a dark paint — the red especially — sinks into its own
  haze otherwise.

The colour is set from the *displayed* car rather than the active index, so it
swaps at the midpoint of a transition, while everything showing it is faded out.

The scene lighting in `Lighting.js` sits under all of it, unchanged per car: a
warm key, a cool fill, a warm rim, and a bounce off a dark floor rather than a
bright one.

Type is two faces doing two jobs. DM Sans carries every functional label and all
running copy; Archivo, heavy, appears only where the page speaks as the marque —
the model number, the car's name, the figures, the wordmark.

### Framing

A car is a long, thin object, which is the one assumption the framing code had
to have rebuilt. Both numbers live in `Experience#horizontalFill`:

- **Silhouette 0.95.** A compact upright vehicle hides most of its rotational
  diagonal, so 0.707 of it estimates what the eye sees. A car at a three-quarter
  yaw shows nearly the whole diagonal.
- **Ceiling 0.74.** The interface sits *under* the car rather than in rails
  either side, so `measureStage` reports the full width and the car is free to
  use most of it.

The framing offset then drops the car slightly (`-0.03`) so the number reads
over its roofline; in the stacked layout it lifts it instead (`0.2`), into the
band the copy leaves free.

### Bodywork

Every car arrives as one `MeshStandardMaterial` at metalness 1 / roughness 1
driven by an ORM atlas, and left as authored they read as moulded plastic.
`MATERIAL_CONFIG` in `VehicleManager` fixes that per car:

- **A roughness floor** (0.2 – 0.3). The authored map bottoms out near zero on
  the panels, which turns them into mirrors and lifts every wobble in the
  generated mesh into a crease. The floor settles the bodywork without dulling
  it — lowest on Solaire, which is plated metal rather than paint.
- **A clearcoat** (0.7 – 0.95). Car paint is lacquer over pigment and a plain
  metal/rough model has no way to say so. The material is promoted to
  `MeshPhysicalMaterial` and given a second, much smoother reflective layer —
  most of the difference between moulded and painted. Viridian carries the most:
  a deep metallic green reads almost black until the lacquer catches something.
- **Anisotropic filtering** at 16× on the high tier. Nearly free on desktop, and
  what keeps a 4K atlas sharp where the bodywork turns away from the camera.

The promotion copies through `MeshStandardMaterial.prototype.copy` rather than
the physical material's own: that one reads clearcoat, sheen and transmission
fields a standard material does not have, and throws.

### The preview card

There is no photography for these cars, so the card borrows a frame from the
scene. `Experience#captureStill` renders one extra frame on demand and reads the
canvas back as a data URL, which the card then crops in on.

Two details that are easy to get wrong:

- **The draw is repeated, not reused.** Outside a render tick the drawing buffer
  has already been composited and cleared, so reading the canvas returns nothing.
- **The capture is on a timer, not on the entrance timeline's completion.** A
  timeline's clock stops in a suspended tab, and a card that never fills in is
  worse than one that fills in a beat early. 2.8 s after the car is staged.

## Known trade-offs

- **Copy and figures are invented.** Luxeria is not a real marque; the cars, the
  numbers and the statements are placeholder brand fiction written to fit the
  layout. Replace `src/data/vehicles.js` with real content before this goes
  anywhere near a customer.
- **The still is a whole frame, cropped.** It is captured at the hero's own
  camera and framing, so the card is a crop of that view rather than a second
  angle. A dedicated capture pass with its own camera would be the fix.
- **The preview is not a film.** There is no video for these cars, so the play
  control gives the thing a film would have been about: the real model, the
  interface cleared, and a slow camera pass.
- **All five preload.** The first car gates the curtain and the other four
  arrive behind it, which is ~23 MB over a session. Fine on a desk, worth making
  lazy before this meets a phone on mobile data.
- **No deep-linking beyond the hash.** `#/aurum` restores a car on load, but
  each change replaces the history entry rather than pushing one.
- **A stalled transition stays locked.** The interface unlocks on the master
  timeline's `onComplete`; if the animation clock is suspended mid-transition —
  as happens in a throttled or backgrounded tab — the controls stay disabled
  until it resumes.
