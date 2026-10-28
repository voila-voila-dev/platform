export {
	onReducedMotionChange,
	prefersReducedMotion,
	type ReducedMotionPolicy,
	reducedMotionPolicy,
	setReducedMotion,
	shouldReduceMotion,
} from "#/accessibility/reduced-motion.ts";
export { type Animate, animate, createAnimate } from "#/animate/animate.ts";
export type {
	AnimationControls,
	AnimationOptions,
	AnimationState,
	DOMKeyframes,
	ElementTarget,
	Keyframes,
	ValueAnimationOptions,
} from "#/animate/types.ts";
export { cubicBezier } from "#/easing/cubic-bezier.ts";
export { linearEasing } from "#/easing/linear-css.ts";
export {
	anticipate,
	backIn,
	backInOut,
	backOut,
	circIn,
	circInOut,
	circOut,
	easeIn,
	easeInOut,
	easeOut,
	linear,
	resolveEasing,
} from "#/easing/named.ts";
export { type SpringEasing, springEasing } from "#/easing/spring.ts";
export { steps } from "#/easing/steps.ts";
export type {
	CubicBezier,
	Easing,
	EasingDefinition,
	EasingName,
} from "#/easing/types.ts";
export {
	cancelFrame,
	type FrameCallback,
	type FrameData,
	frame,
	frameData,
} from "#/frame/frame.ts";
export { type InertiaOptions, inertia } from "#/generators/inertia.ts";
export { spring, springPhysics } from "#/generators/spring.ts";
export { type TweenOptions, tween } from "#/generators/tween.ts";
export type {
	Generator,
	GeneratorState,
	SpringOptions,
} from "#/generators/types.ts";
export { mixColor } from "#/interpolate/color.ts";
export {
	type InterpolateOptions,
	interpolate,
} from "#/interpolate/interpolate.ts";
export { type Mixer, mix } from "#/interpolate/mix.ts";
export { mixPath } from "#/interpolate/path/morph.ts";
export type {
	Segment,
	SegmentOptions,
	SequenceAt,
} from "#/sequence/sequence.ts";
export { type StaggerOptions, stagger } from "#/stagger/stagger.ts";
export {
	isMotionValue,
	type MotionValue,
	type MotionValueEvent,
	motionValue,
} from "#/value/motion-value.ts";
export { transformValue } from "#/value/transform.ts";
export {
	type InViewOptions,
	inView,
	type OnViewEnd,
	type OnViewStart,
} from "#/view/in-view.ts";
export { resize, type Size } from "#/view/resize.ts";
export {
	type OnScroll,
	type ScrollDrivable,
	type ScrollInfo,
	type ScrollOptions,
	scroll,
} from "#/view/scroll.ts";
