import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import gsap from 'gsap';

import Experience from './three/Experience.js';
import { VEHICLES, VEHICLE_COUNT, paintVars } from './data/vehicles.js';
import { DUR, EASE, scaled } from './lib/motion.js';
import useReducedMotion from './lib/useReducedMotion.js';
import { buildContentEnter, buildContentExit, buildIntro } from './lib/transitions.js';

import BackgroundType from './components/BackgroundType.jsx';
import CinematicOverlay from './components/CinematicOverlay.jsx';
import HeadlineStats from './components/HeadlineStats.jsx';
import Header from './components/Header.jsx';
import Loader from './components/Loader.jsx';
import MediaPreview from './components/MediaPreview.jsx';
import MenuOverlay from './components/MenuOverlay.jsx';
import ProjectIndicators from './components/ProjectIndicators.jsx';
import ProjectInfo from './components/ProjectInfo.jsx';

const WHEEL_THRESHOLD = 64;
const WHEEL_COOLDOWN = 1100;

const indexFromHash = () => {
  const id = window.location.hash.replace('#/', '').trim();
  const found = VEHICLES.findIndex((vehicle) => vehicle.id === id);
  return found >= 0 ? found : 0;
};

export default function App() {
  const reducedMotion = useReducedMotion();

  const rootRef = useRef(null);
  const canvasRef = useRef(null);
  const experienceRef = useRef(null);
  const transitionRef = useRef(false);
  const activeRef = useRef(0);

  const initialIndex = useMemo(indexFromHash, []);

  /** What the dots and counter show — updates the instant a project is picked. */
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  /** What the copy shows — swaps at the midpoint of the transition. */
  const [displayIndex, setDisplayIndex] = useState(initialIndex);
  const [locked, setLocked] = useState(false);

  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [readyIds, setReadyIds] = useState(() => new Set());

  /** One borrowed frame per car, for the card in the corner. */
  const [stills, setStills] = useState({});

  const [menuOpen, setMenuOpen] = useState(false);
  const [cinematicOpen, setCinematicOpen] = useState(false);

  const displayed = VEHICLES[displayIndex];

  /* --- boot ---------------------------------------------------------------- */

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const first = VEHICLES[initialIndex];
    const progressTarget = { value: 0 };
    // A GLB served without a content-length reports nothing useful, so the bar
    // creeps on its own and the real signal only ever pulls it forward.
    const creep = gsap.to(progressTarget, {
      value: 0.82,
      duration: 5,
      ease: 'power2.out',
      onUpdate: () => setProgress((current) => Math.max(current, progressTarget.value)),
    });

    const experience = new Experience(canvas, {
      reducedMotion,
      // The 3D layer asks the interface where it may put the vehicle, rather
      // than guessing from the viewport. `stacked` is the layout's own answer
      // to whether the rails still sit either side of the hero.
      measureStage: () => {
        // The interface sits in a band across the foot of the frame rather than
        // in rails either side, so the car is free to use the full width and is
        // limited by the top of that band instead.
        const root = rootRef.current;
        const sheet = root?.querySelector('.sheet');
        if (!sheet) return null;
        const stacked = window.matchMedia('(max-width: 900px)').matches;
        return { stacked, left: 0, right: window.innerWidth, floor: sheet.getBoundingClientRect().top };
      },
      onProgress: (id, ratio) => {
        if (id !== first.id) return;
        setProgress((current) => Math.max(current, ratio * 0.9));
      },
      onVehicleReady: (id) => {
        setReadyIds((current) => new Set(current).add(id));
      },
    });
    experienceRef.current = experience;

    // Handles for profiling and for stepping transitions frame by frame in
    // development only — neither is shipped.
    if (import.meta.env.DEV) {
      window.__experience = experience;
      window.__gsap = gsap;
    }

    let cancelled = false;

    (async () => {
      try {
        const entry = await experience.load(first);
        if (cancelled) return;

        creep.kill();
        setProgress(1);
        setReadyIds((current) => new Set(current).add(first.id));

        experience.commit(first, entry);
        experience.start();

        // One frame of settled render before the curtain lifts, so the reveal
        // never shows a half-composed scene.
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        if (cancelled) return;

        setReady(true);

        const q = gsap.utils.selector(rootRef.current);
        const intro = gsap.timeline({ delay: scaled(0.25, reducedMotion) });
        intro.add(experience.createEnterTimeline(1), 0);
        intro.add(buildIntro(q, reducedMotion), 0.18);

        experience.preload(VEHICLES.filter((vehicle) => vehicle.id !== first.id));
      } catch (error) {
        console.error('[app] failed to start the experience', error);
        creep.kill();
        setProgress(1);
        setReady(true);
      }
    })();

    return () => {
      cancelled = true;
      creep.kill();
      experience.dispose();
      experienceRef.current = null;
    };
    // Built once: the experience owns its own lifecycle from here.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    experienceRef.current?.setReducedMotion(reducedMotion);
  }, [reducedMotion]);

  /**
   * The card in the corner borrows a frame of the car once it has settled.
   * Driven by a timer rather than by the entrance timeline's completion: the
   * timeline's clock stops in a suspended tab, and a card that never fills in
   * is worse than one that fills in a beat early.
   */
  useEffect(() => {
    if (!ready) return undefined;
    const vehicle = VEHICLES[displayIndex];
    if (stills[vehicle.id]) return undefined;

    const timer = setTimeout(() => {
      const url = experienceRef.current?.captureStill();
      if (url) setStills((current) => (current[vehicle.id] ? current : { ...current, [vehicle.id]: url }));
      // Long enough for the entrance to have landed — a frame taken mid-fade
      // would put a half-transparent car on the card.
    }, 2800);

    return () => clearTimeout(timer);
  }, [ready, displayIndex, stills]);

  /* --- project switching --------------------------------------------------- */

  const goTo = useCallback(
    async (index) => {
      const experience = experienceRef.current;
      const target = ((index % VEHICLE_COUNT) + VEHICLE_COUNT) % VEHICLE_COUNT;
      if (!experience || transitionRef.current || target === activeRef.current) return;

      const previous = activeRef.current;
      const direction = target > previous ? 1 : -1;
      transitionRef.current = true;
      setLocked(true);
      setActiveIndex(target);
      activeRef.current = target;

      const vehicle = VEHICLES[target];
      const entryPromise = experience.load(vehicle);
      const q = gsap.utils.selector(rootRef.current);

      // One master timeline. The vehicle, the word behind it and every line of
      // copy are children of the same clock, which is what stops a project
      // change from reading as several animations that happen to overlap.
      const master = gsap.timeline({
        onComplete: () => {
          transitionRef.current = false;
          setLocked(false);
        },
      });

      const exit3D = experience.createExitTimeline(direction);
      const exitContent = buildContentExit(q, direction, reducedMotion);
      master.add(exit3D, 0).add(exitContent, 0);

      // Hand over slightly before the exit fully lands: by then the outgoing
      // model has already dissolved, and the overlap keeps the change fluid.
      const swapAt = Math.max(exit3D.duration(), exitContent.duration()) * 0.88;

      let reachedSwap;
      const swapReady = new Promise((resolve) => { reachedSwap = resolve; });
      master.addPause(swapAt, reachedSwap);

      try {
        const [entry] = await Promise.all([entryPromise, swapReady]);

        // flushSync so the copy is already updated when the entrance tween reads
        // the DOM — otherwise React would batch the swap into the next frame and
        // the first frame of the entrance would animate stale text.
        flushSync(() => setDisplayIndex(target));
        setReadyIds((current) => new Set(current).add(vehicle.id));
        experience.commit(vehicle, entry);

        master.add(experience.createEnterTimeline(direction), swapAt);
        master.add(buildContentEnter(q, direction, reducedMotion), swapAt + 0.06);
        master.resume();

        window.history.replaceState(null, '', `#/${vehicle.id}`);
      } catch (error) {
        // A model that never arrives must not leave the interface mid-exit and
        // permanently locked; put the previous project back and hand control
        // over to the user again.
        console.error(`[app] could not switch to ${vehicle.id}`, error);
        master.kill();
        setActiveIndex(previous);
        activeRef.current = previous;
        transitionRef.current = false;
        setLocked(false);
        experience.restore();
      }
    },
    [reducedMotion],
  );

  const advance = useCallback(() => goTo(activeRef.current + 1), [goTo]);

  /* --- wheel and keyboard navigation --------------------------------------- */

  useEffect(() => {
    if (menuOpen || cinematicOpen) return undefined;

    let accumulated = 0;
    let cooldownUntil = 0;

    const onWheel = (event) => {
      if (transitionRef.current) return;
      // Inside the mobile sheet a wheel gesture means "read on", not "next".
      if (event.target instanceof Node && rootRef.current?.querySelector('.sheet')?.contains(event.target)) {
        return;
      }
      const now = performance.now();
      if (now < cooldownUntil) return;

      accumulated += event.deltaY;
      if (Math.abs(accumulated) < WHEEL_THRESHOLD) return;

      goTo(activeRef.current + Math.sign(accumulated));
      accumulated = 0;
      cooldownUntil = now + WHEEL_COOLDOWN;
    };

    const onKey = (event) => {
      if (transitionRef.current) return;
      if (event.target instanceof HTMLElement && event.target.closest('.stage-canvas')) return;
      if (event.key === 'ArrowRight' || event.key === 'PageDown') goTo(activeRef.current + 1);
      else if (event.key === 'ArrowLeft' || event.key === 'PageUp') goTo(activeRef.current - 1);
    };

    window.addEventListener('wheel', onWheel, { passive: true });
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKey);
    };
  }, [goTo, menuOpen, cinematicOpen]);

  /* --- overlays ------------------------------------------------------------ */

  const onMenuSelect = useCallback(
    (index) => {
      setMenuOpen(false);
      goTo(index);
    },
    [goTo],
  );

  // The interface steps back behind the menu. Driven by GSAP rather than a
  // class, because the intro and the project transitions leave inline opacity
  // on these elements that a stylesheet rule could not override.
  useEffect(() => {
    if (!ready) return;
    const q = gsap.utils.selector(rootRef.current);
    gsap.to(q('[data-menu-hide]'), {
      opacity: menuOpen ? 0 : 1,
      duration: scaled(menuOpen ? DUR.micro : DUR.short, reducedMotion),
      ease: menuOpen ? EASE.in : EASE.out,
      overwrite: 'auto',
    });
  }, [menuOpen, ready, reducedMotion]);

  const toggleCinematic = useCallback(
    (open) => {
      const experience = experienceRef.current;
      if (!experience || transitionRef.current) return;
      setCinematicOpen(open);
      experience.setCinematic(open);

      const q = gsap.utils.selector(rootRef.current);
      gsap.to(q('[data-cinematic-hide]'), {
        opacity: open ? 0 : 1,
        y: open ? 10 : 0,
        pointerEvents: open ? 'none' : 'auto',
        duration: scaled(open ? DUR.short : DUR.base, reducedMotion),
        ease: open ? EASE.in : EASE.out,
        stagger: reducedMotion ? 0 : 0.02,
      });
    },
    [reducedMotion],
  );

  return (
    <div
      className={`app${ready ? ' is-ready' : ''}${locked ? ' is-locked' : ''}${
        cinematicOpen ? ' is-cinematic' : ''
      }${menuOpen ? ' is-menu-open' : ''}`}
      ref={rootRef}
      /* The page takes its accent from whichever car is on the stage. Set on
         the root so the room, the model number, the tick and the call to
         action all change together — and set from `displayed` rather than the
         active index, so the colour swaps at the midpoint of a transition,
         while everything that shows it is faded out. */
      style={paintVars(displayed)}
    >
      <div className="atmosphere" aria-hidden="true" />

      <BackgroundType code={displayed.code} scale={displayed.presentation.typeScale} />

      <canvas
        className="stage-canvas"
        ref={canvasRef}
        tabIndex={0}
        role="application"
        aria-label={`${displayed.name} — drag to rotate the vehicle, arrow keys to inspect`}
      />

      <div className="ui">
        <Header
          menuOpen={menuOpen}
          onMenuToggle={() => setMenuOpen((open) => !open)}
          onHome={() => goTo(0)}
        />

        <ProjectIndicators
          activeIndex={activeIndex}
          readyIds={readyIds}
          onSelect={goTo}
          disabled={locked}
        />

        {/* Reserves the upper half of a portrait layout for the car. */}
        <div className="stage-gap" aria-hidden="true" />

        {/* One band across the foot of the frame: figures, name, card. */}
        <div className="sheet">
          <div className="sheet__stats" data-cinematic-hide data-menu-hide>
            <HeadlineStats vehicle={displayed} />
          </div>

          <div className="sheet__info" data-cinematic-hide data-menu-hide>
            <ProjectInfo vehicle={displayed} />
          </div>

          <div className="sheet__preview" data-cinematic-hide data-menu-hide>
            <MediaPreview
              vehicle={displayed}
              still={stills[displayed.id]}
              onPlay={() => toggleCinematic(true)}
              onExplore={advance}
              disabled={locked}
            />
          </div>
        </div>
      </div>

      <MenuOverlay
        open={menuOpen}
        activeIndex={activeIndex}
        onSelect={onMenuSelect}
        onClose={() => setMenuOpen(false)}
        reducedMotion={reducedMotion}
      />

      <CinematicOverlay
        open={cinematicOpen}
        vehicle={displayed}
        onClose={() => toggleCinematic(false)}
        reducedMotion={reducedMotion}
      />

      <Loader progress={progress} done={ready} />
    </div>
  );
}
