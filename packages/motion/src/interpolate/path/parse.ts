/**
 * A path in four commands, all absolute: H and V become L, S and T their full
 * curves with the reflected control point, so the flattening downstream only
 * ever meets lines, curves, arcs and closes.
 */
export type PathCommand =
	| { readonly type: "M" | "L"; readonly values: readonly [number, number] }
	| { readonly type: "C"; readonly values: readonly number[] }
	| { readonly type: "Q"; readonly values: readonly number[] }
	| { readonly type: "A"; readonly values: readonly number[] }
	| { readonly type: "Z"; readonly values: readonly [] };

interface State {
	x: number;
	y: number;
	startX: number;
	startY: number;
	/** The last curve's second control point, for S and T to reflect. */
	controlX: number;
	controlY: number;
	previous: string;
}

type Handler = (args: number[], state: State) => PathCommand;

const ARGUMENTS: Readonly<Record<string, number>> = {
	M: 2,
	L: 2,
	H: 1,
	V: 1,
	C: 6,
	S: 4,
	Q: 4,
	T: 2,
	A: 7,
	Z: 0,
};
const NUMBER = /\s*,?\s*(-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?)/iy;
const FLAG = /\s*,?\s*([01])/y;
const COMMAND = /\s*,?\s*([MLHVCSQTAZ])/iy;

function reflect(state: State, curve: string): [number, number] {
	return state.previous === curve
		? [2 * state.x - state.controlX, 2 * state.y - state.controlY]
		: [state.x, state.y];
}

function moveTo(state: State, x: number, y: number) {
	state.x = x;
	state.y = y;
}

const HANDLERS: Readonly<Record<string, Handler>> = {
	M: ([x, y], state) => {
		moveTo(state, x as number, y as number);
		state.startX = state.x;
		state.startY = state.y;
		return { type: "M", values: [state.x, state.y] };
	},
	L: ([x, y], state) => {
		moveTo(state, x as number, y as number);
		return { type: "L", values: [state.x, state.y] };
	},
	H: ([x], state) => HANDLERS.L?.([x as number, state.y], state) as PathCommand,
	V: ([y], state) => HANDLERS.L?.([state.x, y as number], state) as PathCommand,
	C: (args, state) => {
		[state.controlX, state.controlY] = [args[2] as number, args[3] as number];
		moveTo(state, args[4] as number, args[5] as number);
		return { type: "C", values: args };
	},
	S: (args, state) =>
		HANDLERS.C?.([...reflect(state, "C"), ...args], state) as PathCommand,
	Q: (args, state) => {
		[state.controlX, state.controlY] = [args[0] as number, args[1] as number];
		moveTo(state, args[2] as number, args[3] as number);
		return { type: "Q", values: args };
	},
	T: (args, state) =>
		HANDLERS.Q?.([...reflect(state, "Q"), ...args], state) as PathCommand,
	A: (args, state) => {
		moveTo(state, args[5] as number, args[6] as number);
		return { type: "A", values: args };
	},
	Z: (_args, state) => {
		moveTo(state, state.startX, state.startY);
		return { type: "Z", values: [] };
	},
};

/** Each argument's axis when relative: 0 adds x, 1 adds y, -1 is not a coordinate. */
const AXES: Readonly<Record<string, readonly number[]>> = {
	M: [0, 1],
	L: [0, 1],
	H: [0],
	V: [1],
	C: [0, 1, 0, 1, 0, 1],
	S: [0, 1, 0, 1],
	Q: [0, 1, 0, 1],
	T: [0, 1],
	A: [-1, -1, -1, -1, -1, 0, 1],
	Z: [],
};
const CURVE_FAMILY: Readonly<Record<string, string>> = { S: "C", T: "Q" };

function absolute(type: string, args: number[], state: State): number[] {
	const axes = AXES[type] as readonly number[];
	return args.map((value, index) => {
		const axis = axes[index];
		return axis === -1 ? value : value + (axis === 0 ? state.x : state.y);
	});
}

function read(pattern: RegExp, text: string, at: number) {
	pattern.lastIndex = at;
	const match = pattern.exec(text);
	return match === null
		? undefined
		: { value: match[1] as string, end: pattern.lastIndex };
}

/** Parses `d` to absolute commands; `undefined` when it is not a valid path. */
export function parsePath(d: string): PathCommand[] | undefined {
	const state: State = {
		x: 0,
		y: 0,
		startX: 0,
		startY: 0,
		controlX: 0,
		controlY: 0,
		previous: "",
	};
	const commands: PathCommand[] = [];
	let at = 0;
	let command = read(COMMAND, d, at);
	if (command === undefined || command.value.toUpperCase() !== "M") {
		return undefined;
	}
	while (command !== undefined) {
		at = command.end;
		let letter = command.value;
		do {
			const type = letter.toUpperCase();
			const args: number[] = [];
			for (let index = 0; index < (ARGUMENTS[type] as number); index += 1) {
				const flag = type === "A" && (index === 3 || index === 4);
				const token = read(flag ? FLAG : NUMBER, d, at);
				if (token === undefined) {
					return undefined;
				}
				args.push(Number(token.value));
				at = token.end;
			}
			const values = letter === type ? args : absolute(type, args, state);
			commands.push((HANDLERS[type] as Handler)(values, state));
			state.previous = CURVE_FAMILY[type] ?? type;
			// After a moveto, further pairs are implicit linetos.
			letter = type === "M" ? (letter === "M" ? "L" : "l") : letter;
		} while (letter.toUpperCase() !== "Z" && read(NUMBER, d, at) !== undefined);
		command = read(COMMAND, d, at);
	}
	return /^\s*$/.test(d.slice(at)) ? commands : undefined;
}
