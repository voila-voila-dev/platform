export type Easing = (progress: number) => number;

export type CubicBezier = readonly [number, number, number, number];

export type EasingName =
	| "linear"
	| "easeIn"
	| "easeOut"
	| "easeInOut"
	| "circIn"
	| "circOut"
	| "circInOut"
	| "backIn"
	| "backOut"
	| "backInOut"
	| "anticipate";

export type EasingDefinition = EasingName | CubicBezier | Easing;
