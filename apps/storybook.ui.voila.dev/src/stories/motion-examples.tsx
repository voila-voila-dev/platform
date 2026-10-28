// The docs examples (apps/ui.voila.dev/src/examples/motion), mirrored: the two apps
// share no source, and the stories should show what the docs show.
import {
	type AnimationControls,
	animate,
	interpolate,
	inView,
	mix,
	type ReducedMotionPolicy,
	resize,
	scroll,
	setReducedMotion,
	stagger,
} from "@voila.dev/motion";
import { animate as animateDom } from "@voila.dev/motion/dom";
import {
	Presence,
	useAnimate,
	useMotionValue,
	usePresence,
	useReducedMotion,
	useSpring,
	useTransform,
} from "@voila.dev/motion/react";
import { Button } from "@voila.dev/ui/button";
import { type PointerEvent, useEffect, useRef, useState } from "react";

const BOX =
	"size-12 rounded-lg bg-[var(--chart-1)] shadow-sm will-change-transform";
const TRACK = "relative h-16 w-full max-w-md rounded-xl border p-2";
const ROW = "flex flex-wrap items-center gap-3";
const LABEL = "text-muted-foreground text-sm tabular-nums";

export function QuickStart() {
	const box = useRef<HTMLDivElement>(null);
	const [right, setRight] = useState(false);
	function move() {
		const next = !right;
		setRight(next);
		if (box.current) animateDom(box.current, { x: next ? 240 : 0 });
	}
	return (
		<div className="grid w-full gap-3">
			<div className={TRACK}>
				<div ref={box} className={BOX} />
			</div>
			<div className={ROW}>
				<Button onClick={move}>Move</Button>
				<span className={LABEL}>
					Click again mid-flight: it turns around without a kink.
				</span>
			</div>
		</div>
	);
}

export function SpringBounce() {
	const [scope, animate] = useAnimate<HTMLDivElement>();
	const [bounce, setBounce] = useState(0.3);
	const [duration, setDuration] = useState(0.5);
	const [right, setRight] = useState(false);
	function move() {
		const next = !right;
		setRight(next);
		animate(
			scope.current as HTMLDivElement,
			{ x: next ? 240 : 0 },
			{ bounce, duration },
		);
	}
	return (
		<div className="grid w-full gap-3">
			<div className={TRACK}>
				<div ref={scope} className={BOX} />
			</div>
			<div className={ROW}>
				<Button onClick={move}>Move</Button>
				<label className={`${ROW} ${LABEL}`}>
					bounce
					<input
						type="range"
						min={0}
						max={0.8}
						step={0.05}
						value={bounce}
						onChange={(event) => setBounce(Number(event.target.value))}
					/>
					{bounce.toFixed(2)}
				</label>
				<label className={`${ROW} ${LABEL}`}>
					duration
					<input
						type="range"
						min={0.1}
						max={1.5}
						step={0.05}
						value={duration}
						onChange={(event) => setDuration(Number(event.target.value))}
					/>
					{duration.toFixed(2)} s
				</label>
			</div>
		</div>
	);
}

export function SpringOrTween() {
	const [scope, animate] = useAnimate<HTMLDivElement>();
	const [right, setRight] = useState(false);
	function move() {
		const x = right ? 0 : 240;
		setRight(!right);
		animate("[data-spring]", { x }, { duration: 0.5, bounce: 0.25 });
		animate(
			"[data-tween]",
			{ x },
			{ type: "tween", duration: 0.5, ease: "easeInOut" },
		);
	}
	return (
		<div ref={scope} className="grid w-full gap-3">
			<div className={TRACK}>
				<div data-spring className={BOX} />
			</div>
			<div className={TRACK}>
				<div data-tween className={`${BOX} bg-[var(--chart-2)]`} />
			</div>
			<div className={ROW}>
				<Button onClick={move}>Move both</Button>
				<span className={LABEL}>Top: spring. Bottom: tween.</span>
			</div>
		</div>
	);
}

const ITEMS = ["Design", "Build", "Review", "Ship", "Measure"];

export function StaggerList() {
	const [scope, animate] = useAnimate<HTMLUListElement>();
	const [from, setFrom] = useState<"first" | "center" | "last">("first");
	function play() {
		animate(
			"li",
			{ y: [16, 0], opacity: [0, 1] },
			{ duration: 0.4, delay: stagger(0.06, { from }) },
		);
	}
	useEffect(play, []);
	return (
		<div className="grid w-full gap-3">
			<ul ref={scope} className="grid max-w-xs gap-2">
				{ITEMS.map((item) => (
					<li key={item} className="rounded-lg border px-3 py-2 text-sm">
						{item}
					</li>
				))}
			</ul>
			<div className={ROW}>
				{(["first", "center", "last"] as const).map((origin) => (
					<Button
						key={origin}
						variant={origin === from ? "default" : "outline"}
						size="sm"
						onClick={() => setFrom(origin)}
					>
						from {origin}
					</Button>
				))}
				<Button variant="outline" size="sm" onClick={play}>
					Replay
				</Button>
			</div>
		</div>
	);
}

export function Sequence() {
	const [scope, animate] = useAnimate<HTMLDivElement>();
	function play() {
		const root = scope.current;
		if (!root) return;
		const part = (name: string) =>
			root.querySelector(`[data-part="${name}"]`) as Element;
		animate([
			[part("card"), { scale: [0.94, 1], opacity: [0, 1] }, { duration: 0.4 }],
			[
				part("title"),
				{ y: [10, 0], opacity: [0, 1] },
				{ at: "-0.2", duration: 0.35 },
			],
			[
				part("body"),
				{ y: [10, 0], opacity: [0, 1] },
				{ at: "-0.25", duration: 0.35 },
			],
			[
				part("action"),
				{ scale: [0.8, 1], opacity: [0, 1] },
				{ at: "+0.05", bounce: 0.4 },
			],
		]);
	}
	useEffect(play, []);
	return (
		<div ref={scope} className="grid w-full gap-3">
			<div
				data-part="card"
				className="grid max-w-sm gap-2 rounded-xl border p-4 shadow-sm"
			>
				<p data-part="title" className="font-medium">
					A sequence
				</p>
				<p data-part="body" className="text-muted-foreground text-sm">
					Each segment starts relative to the one before.
				</p>
				<div data-part="action" className="justify-self-start">
					<Button size="sm">Continue</Button>
				</div>
			</div>
			<div className={ROW}>
				<Button variant="outline" size="sm" onClick={play}>
					Replay
				</Button>
			</div>
		</div>
	);
}

export function Counter() {
	const count = useMotionValue(0);
	const label = useRef<HTMLSpanElement>(null);
	const [target, setTarget] = useState(1280);
	useEffect(
		() =>
			count.on("change", (value) => {
				if (label.current)
					label.current.textContent = Math.round(value).toLocaleString("en-GB");
			}),
		[count],
	);
	useEffect(() => {
		animate(count, target, { duration: 0.8 });
	}, [count, target]);
	return (
		<div className={ROW}>
			<span
				ref={label}
				className="min-w-28 font-semibold text-3xl tabular-nums"
			>
				0
			</span>
			<Button
				variant="outline"
				onClick={() => setTarget(Math.round(Math.random() * 5000))}
			>
				New target
			</Button>
		</div>
	);
}

const STOPS = [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];

export function ColourMix() {
	const resolved = mix("#2563eb", "#e11d48");
	const tokens = mix("var(--chart-1)", "var(--chart-2)");
	return (
		<div className="grid w-full gap-2">
			{[resolved, tokens].map((colourAt, row) => (
				<div key={row === 0 ? "resolved" : "tokens"} className="flex gap-1">
					{STOPS.map((stop) => (
						<div
							key={stop}
							className="h-10 flex-1 rounded"
							style={{ background: colourAt(stop) }}
						/>
					))}
				</div>
			))}
		</div>
	);
}

const gradient = interpolate([0, 50, 100], ["#2563eb", "#16a34a", "#e11d48"]);
const lift = interpolate([0, 100], [0, -24], { ease: "easeOut" });

export function Interpolate() {
	const [value, setValue] = useState(30);
	return (
		<div className="grid w-full gap-3">
			<div className="flex h-16 items-end">
				<div
					className="size-10 rounded-full"
					style={{
						background: gradient(value),
						translate: `0 ${lift(value)}px`,
					}}
				/>
			</div>
			<label className={`${ROW} ${LABEL}`}>
				input
				<input
					type="range"
					min={0}
					max={100}
					value={value}
					onChange={(event) => setValue(Number(event.target.value))}
				/>
				{value}
			</label>
		</div>
	);
}

const SHAPES = {
	square: "M20 20 L80 20 L80 80 L20 80 Z",
	circle: "M50 15 A35 35 0 1 1 50 85 A35 35 0 1 1 50 15 Z",
	star: "M50 12 L60 38 L88 38 L65 55 L74 84 L50 66 L26 84 L35 55 L12 38 L40 38 Z",
} as const;

export function PathMorph() {
	const path = useRef<SVGPathElement>(null);
	const [shape, setShape] = useState<keyof typeof SHAPES>("square");
	function morph(next: keyof typeof SHAPES) {
		setShape(next);
		if (path.current)
			animate(
				path.current,
				{ d: SHAPES[next] },
				{ duration: 0.6, bounce: 0.2 },
			);
	}
	return (
		<div className={ROW}>
			<svg viewBox="0 0 100 100" className="size-28" aria-hidden="true">
				<path ref={path} d={SHAPES.square} fill="var(--chart-1)" />
			</svg>
			<div className="flex gap-2">
				{(Object.keys(SHAPES) as (keyof typeof SHAPES)[]).map((name) => (
					<Button
						key={name}
						size="sm"
						variant={name === shape ? "default" : "outline"}
						onClick={() => morph(name)}
					>
						{name}
					</Button>
				))}
			</div>
		</div>
	);
}

const PARAGRAPHS = Array.from({ length: 8 }, (_unused, index) => index);

export function ScrollProgress() {
	const container = useRef<HTMLDivElement>(null);
	const bar = useRef<HTMLDivElement>(null);
	useEffect(() => {
		if (!container.current || !bar.current) return;
		const controls = animate(
			bar.current,
			{ scaleX: [0, 1] },
			{ type: "tween", ease: "linear", duration: 1 },
		);
		const stop = scroll(controls, { container: container.current });
		return () => {
			stop();
			controls.cancel();
		};
	}, []);
	return (
		<div className="relative w-full max-w-md overflow-hidden rounded-xl border">
			<div
				ref={bar}
				className="absolute inset-x-0 top-0 z-10 h-1 origin-left bg-[var(--chart-1)]"
			/>
			<div ref={container} className="h-48 overflow-y-auto p-4 text-sm">
				{PARAGRAPHS.map((index) => (
					<p key={index} className="mb-4 text-muted-foreground">
						Scroll this box. The bar is a browser animation on a scroll
						timeline: no JavaScript runs while it moves.
					</p>
				))}
			</div>
		</div>
	);
}

export function InViewFade() {
	const container = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const root = container.current;
		if (!root) return;
		return inView(
			Array.from(root.querySelectorAll("[data-card]")),
			(element) => {
				animate(element, { opacity: [0, 1], y: [24, 0] }, { duration: 0.5 });
				return () => {
					animate(
						element,
						{ opacity: 0, y: 24 },
						{ type: "tween", duration: 0.2 },
					);
				};
			},
			{ root, amount: 0.4 },
		);
	}, []);
	return (
		<div
			ref={container}
			className="grid h-56 w-full max-w-md gap-4 overflow-y-auto rounded-xl border p-4"
		>
			{PARAGRAPHS.map((index) => (
				<div
					key={index}
					data-card
					className="rounded-lg border p-4 text-sm opacity-0"
				>
					Card {index + 1} fades in when 40 % of it shows, and out when it
					leaves.
				</div>
			))}
		</div>
	);
}

export function Resize() {
	const box = useRef<HTMLDivElement>(null);
	const [size, setSize] = useState({ width: 0, height: 0 });
	useEffect(() => {
		if (!box.current) return;
		return resize(box.current, (_element, next) => setSize(next));
	}, []);
	return (
		<div
			ref={box}
			className="grid min-h-20 w-64 min-w-40 max-w-full resize place-items-center overflow-auto rounded-xl border text-sm tabular-nums"
		>
			{Math.round(size.width)} × {Math.round(size.height)} — drag the corner
		</div>
	);
}

export function FollowPointer() {
	const area = useRef<HTMLDivElement>(null);
	const dot = useRef<HTMLDivElement>(null);
	const pointerX = useMotionValue(0);
	const pointerY = useMotionValue(0);
	const x = useSpring(pointerX, { duration: 0.5, bounce: 0.25 });
	const y = useSpring(pointerY, { duration: 0.5, bounce: 0.25 });
	const colour = useTransform(
		x,
		[0, 400],
		["var(--chart-1)", "var(--chart-2)"],
	);
	useEffect(() => {
		function paint() {
			if (!dot.current) return;
			dot.current.style.translate = `${x.get()}px ${y.get()}px`;
			dot.current.style.background = colour.get();
		}
		const stops = [
			x.on("change", paint),
			y.on("change", paint),
			colour.on("change", paint),
		];
		paint();
		return () => {
			for (const stop of stops) stop();
		};
	}, [x, y, colour]);
	function follow(event: PointerEvent<HTMLDivElement>) {
		const bounds = event.currentTarget.getBoundingClientRect();
		pointerX.set(event.clientX - bounds.left - 16);
		pointerY.set(event.clientY - bounds.top - 16);
	}
	return (
		<div
			ref={area}
			onPointerMove={follow}
			className="relative h-48 w-full max-w-md touch-none overflow-hidden rounded-xl border"
		>
			<div ref={dot} className="absolute top-0 left-0 size-8 rounded-full" />
			<span className={`absolute right-3 bottom-2 ${LABEL}`}>
				Move the pointer here
			</span>
		</div>
	);
}

interface Toast {
	readonly id: number;
	readonly text: string;
}

function exitToast(element: Element): AnimationControls {
	return animate(
		element,
		{ opacity: 0, x: 40 },
		{ type: "tween", duration: 0.2 },
	);
}

export function PresenceList() {
	const [toasts, setToasts] = useState<Toast[]>([
		{ id: 1, text: "Saved" },
		{ id: 2, text: "Invitation sent" },
	]);
	const next = useRef(3);
	function add() {
		const id = next.current++;
		setToasts((list) => [...list, { id, text: `Notification ${id}` }]);
	}
	return (
		<div className="grid w-full max-w-xs gap-3">
			<ul className="grid gap-2">
				<Presence>
					{toasts.map((toast) => (
						<li
							key={toast.id}
							exit={exitToast}
							className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
						>
							{toast.text}
							<Button
								size="sm"
								variant="ghost"
								onClick={() =>
									setToasts((list) =>
										list.filter((other) => other.id !== toast.id),
									)
								}
							>
								Dismiss
							</Button>
						</li>
					))}
				</Presence>
			</ul>
			<div className={ROW}>
				<Button variant="outline" size="sm" onClick={add}>
					Add
				</Button>
			</div>
		</div>
	);
}

function Card() {
	const [isPresent, safeToRemove] = usePresence();
	const [scope, animate] = useAnimate<HTMLDivElement>();
	useEffect(() => {
		const element = scope.current;
		if (!element) return;
		if (isPresent) {
			animate(
				element,
				{ opacity: [0, 1], scale: [0.96, 1] },
				{ duration: 0.3 },
			);
			return;
		}
		animate(
			element,
			{ opacity: 0, scale: 0.96 },
			{ type: "tween", duration: 0.15 },
		).then(safeToRemove);
	}, [isPresent, safeToRemove, animate, scope]);
	return (
		<div
			ref={scope}
			className="max-w-xs rounded-xl border p-4 text-sm shadow-sm"
		>
			This card plays its own entrance and exit through usePresence.
		</div>
	);
}

export function PresenceCard() {
	const [open, setOpen] = useState(true);
	return (
		<div className="grid min-h-32 w-full content-start gap-3">
			<div className={ROW}>
				<Button variant="outline" onClick={() => setOpen(!open)}>
					{open ? "Hide" : "Show"}
				</Button>
			</div>
			<Presence>{open && <Card key="card" />}</Presence>
		</div>
	);
}

const POLICIES: readonly ReducedMotionPolicy[] = ["user", "always", "never"];

export function ReducedMotion() {
	const [scope, animate] = useAnimate<HTMLDivElement>();
	const [policy, setPolicy] = useState<ReducedMotionPolicy>("user");
	const [shown, setShown] = useState(true);
	const reduced = useReducedMotion();
	useEffect(() => {
		setReducedMotion(policy);
		return () => setReducedMotion("user");
	}, [policy]);
	function toggle() {
		const next = !shown;
		setShown(next);
		animate(
			scope.current as HTMLDivElement,
			{ x: next ? 0 : 200, opacity: next ? 1 : 0.25 },
			{ duration: 0.6 },
		);
	}
	return (
		<div className="grid w-full gap-3">
			<div className={TRACK}>
				<div ref={scope} className={BOX} />
			</div>
			<div className={ROW}>
				<Button onClick={toggle}>Toggle</Button>
				{POLICIES.map((option) => (
					<Button
						key={option}
						size="sm"
						variant={option === policy ? "default" : "outline"}
						onClick={() => setPolicy(option)}
					>
						{option}
					</Button>
				))}
				<span className={LABEL}>
					{reduced
						? "Reducing: the move jumps, the fade plays."
						: "Full motion."}
				</span>
			</div>
		</div>
	);
}
