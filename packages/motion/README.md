# @voila.dev/motion

Animation with no dependency. Springs on elements become a CSS `linear()`
easing that the browser plays through the Web Animations API, off the main
thread. Everything the browser can't animate runs on one shared frame loop.
The API follows [Motion](https://motion.dev), and each module is short enough
to read in one sitting.

```ts
import { animate, stagger } from "@voila.dev/motion";

animate(element, { x: 120, opacity: 1 }, { duration: 0.4, bounce: 0.2 });
animate("li", { y: [20, 0], opacity: [0, 1] }, { delay: stagger(0.04) });
await animate(card, { scale: 1.05 });
```

```tsx
import { Presence, useAnimate, useSpring, useTransform } from "@voila.dev/motion/react";

const [scope, animate] = useAnimate();
const x = useSpring(target, { duration: 0.3 });
const opacity = useTransform(x, [0, 100], [1, 0]);

<Presence>{open && <Dialog key="d" exit={(element) => animate(element, { opacity: 0 })} />}</Presence>;
```

## Entries

| Import | What it brings | Gzip |
| --- | --- | --- |
| `@voila.dev/motion/dom` | `animate` for elements only, every property played by the browser, plus `spring` and `stagger` | ≤ 5 KB |
| `@voila.dev/motion` | The full `animate` (elements, motion values, plain values, objects, SVG morphing, sequences), interpolation, motion values, the frame loop, `inView`, `scroll`, `resize`, reduced motion | about 11 KB |
| `@voila.dev/motion/react` | `useAnimate`, `useMotionValue`, `useSpring`, `useTransform`, `useReducedMotion`, `Presence`, `usePresence` | about 12.5 KB with the core |

React 19 is an optional peer, used only by `/react`. The core never imports it.

## The engine

- **Elements.** Each property is one browser animation. Two numeric keyframes
  spring by default: the spring is sampled into a `linear()` easing, so the
  compositor plays the exact curve. Without `linear()` support, a numeric
  spring is sampled into keyframes instead. A tween uses its easing, written as CSS
  when CSS has it.
- **Independent transforms.** `x`, `y`, `z`, `scale`, `scaleX`, `scaleY` and
  `rotate` each animate the `translate`, `scale` or `rotate` property alone,
  with `composite: "add"`. They run on the compositor, add up, and stop
  independently. When they finish, their values are written into the
  element's inline `translate`, `scale` and `rotate`: those three styles
  belong to motion on an element it animates.
- **Interruption.** A new animation on a property starts from what is
  painted, at the speed the last one had. For numbers, motion keeps the
  generator behind each browser animation and reads both from it; for
  colours and other strings, it asks the browser what it painted.
- **The frame loop.** Motion values, plain values, objects, SVG attributes
  (`d` morphs between any two shapes) and CSS variables run on one
  `requestAnimationFrame` loop, in `read → update → render` phases.
- **Controls.** Every `animate` returns the same awaitable controls: `time`,
  `speed`, `duration`, `play`, `pause`, `stop`, `cancel`, `complete`,
  `finished`.

## Modules

```
src/
  easing/        cubicBezier, steps, the named easings, a spring as linear()
  generators/    spring (closed form), tween, inertia: (t) => { value, velocity, done }
  frame/         the shared loop and its injectable clock
  value/         motionValue, transformValue
  interpolate/   numbers, colours (oklab, or color-mix for var()), strings, arrays,
                 objects, path morphing, mix, interpolate
  animate/       routing, the WAAPI driver, the JS driver, controls
  sequence/      timelines with `at`
  stagger/       stagger(gap, { from, ease })
  view/          inView, scroll (ScrollTimeline when it can), resize
  accessibility/ the reduced-motion policy
  react/         the hooks and Presence
```

## Reduced motion

Under `prefers-reduced-motion: reduce`, movement jumps to its end. Opacity
and colours still animate as a short tween with no bounce. Values and objects
jump. `setReducedMotion("user" | "always" | "never")` sets the policy for the
whole page (`"user"` by default), and `{ reducedMotion }` overrides it for
one animation. `useReducedMotion()` follows both.

## Server rendering

Nothing touches `window` or `document` when a module loads, and the hooks
render on the server. Animations start in effects.

## Not in 1.0

- **Layout animations (FLIP, shared layout).** They are a module the size of
  this one. Worth adding once a kit component needs them, like an accordion
  or a tabs indicator.
- **Gestures (drag, hover, press).** They belong to the components that use
  them.
- **A `<motion.div>` component.** It is Motion's most popular API, but it
  doubles the surface. `useAnimate` and `Presence` cover the same needs with
  fewer concepts.

## Size budget

`bun run check-bundle` builds each entry in `scripts/bundle-entries` and fails
past its gzip budget, or when an entry outside the React layer imports React.
