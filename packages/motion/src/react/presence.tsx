import * as React from "react";

/** Plays a child's way out; Presence removes it once the returned promise settles. */
export type Exit = (element: Element) => PromiseLike<unknown> | undefined;

declare module "react" {
	interface Attributes {
		/** Inside a `<Presence>`: plays this child's way out before it unmounts. */
		exit?: Exit;
	}
}

interface PresenceState {
	readonly isPresent: boolean;
	/** For a child that animates its own exit: tells Presence it may go. */
	readonly safeToRemove: () => void;
	/** Called by `usePresence`: Presence then waits for `safeToRemove`. */
	readonly register: () => () => void;
}

const PresenceContext = React.createContext<PresenceState | null>(null);

/**
 * Whether this component is still wanted, and the function that lets it go
 * once its own exit has played. Outside a Presence it is always present.
 */
export function usePresence(): readonly [boolean, () => void] {
	const state = React.useContext(PresenceContext);
	const register = state?.register;
	React.useLayoutEffect(() => register?.(), [register]);
	return [state?.isPresent ?? true, state?.safeToRemove ?? noop];
}

function noop() {}

type Keyed = React.ReactElement<{ exit?: Exit; ref?: React.Ref<Element> }>;

function keyedChildren(children: React.ReactNode): Keyed[] {
	return React.Children.toArray(children).filter((child): child is Keyed =>
		React.isValidElement(child),
	);
}

/** The new children, with the ones that left kept where they were. */
function merge(previous: readonly Keyed[], current: readonly Keyed[]): Keyed[] {
	const keys = new Set(current.map((child) => child.key));
	const merged = [...current];
	for (const [index, child] of previous.entries()) {
		if (keys.has(child.key)) continue;
		const before = previous[index - 1]?.key;
		const at = merged.findIndex((other) => other.key === before);
		merged.splice(at + 1, 0, child);
	}
	return merged;
}

interface Slot {
	ownRef: React.Ref<Element> | undefined;
	readonly ref: (element: Element | null) => void;
	readonly present: PresenceState;
	readonly absent: PresenceState;
}

export interface PresenceProps {
	readonly children?: React.ReactNode;
	/** Called each time the last exiting child is gone. */
	readonly onExitComplete?: () => void;
}

/**
 * Keeps a removed child on screen until its exit has played: the `exit`
 * prop it carries (given the child's element, through its ref), or the
 * child's own `usePresence`. Children need a stable `key`. An exiting child
 * is inert: it can't take focus or clicks on its way out.
 */
export function Presence({ children, onExitComplete }: PresenceProps) {
	const current = keyedChildren(children);
	const rendered = React.useRef<Keyed[]>(current);
	const gone = React.useRef(new Set<string | null>());
	const elements = React.useRef(new Map<string | null, Element>());
	const registered = React.useRef(new Map<string | null, number>());
	const [, rerender] = React.useReducer((count: number) => count + 1, 0);

	const currentKeys = new Set(current.map((child) => child.key));
	const present = React.useRef(currentKeys);
	present.current = currentKeys;
	/** Exits under way, so a later exit doesn't restart them, and a return can undo them. */
	const leaving = React.useRef(
		new Map<string | null, PromiseLike<unknown> | undefined>(),
	);
	const shown = merge(
		rendered.current.filter((child) => !gone.current.has(child.key)),
		current,
	);
	for (const key of currentKeys) gone.current.delete(key);
	rendered.current = shown;
	const exiting = shown.filter((child) => !currentKeys.has(child.key));

	const remove = React.useCallback(
		(key: string | null) => {
			// Gone already, or back before its exit finished.
			if (gone.current.has(key) || present.current.has(key)) return;
			gone.current.add(key);
			leaving.current.delete(key);
			rerender();
			const left = rendered.current.some(
				(child) =>
					!gone.current.has(child.key) && !present.current.has(child.key),
			);
			if (!left) onExitComplete?.();
		},
		[onExitComplete],
	);

	const exitingKeys = exiting.map((child) => child.key).join("\u0000");
	// biome-ignore lint/correctness/useExhaustiveDependencies: keyed on the set of exiting children.
	React.useLayoutEffect(() => {
		for (const [key, played] of leaving.current) {
			if (!present.current.has(key)) continue;
			leaving.current.delete(key);
			elements.current.get(key)?.removeAttribute("inert");
			(played as { cancel?: () => void } | undefined)?.cancel?.();
		}
		for (const child of exiting) {
			if (leaving.current.has(child.key)) continue;
			const element = elements.current.get(child.key);
			element?.setAttribute("inert", "");
			const played = element && child.props.exit?.(element);
			leaving.current.set(child.key, played);
			if (played) {
				Promise.resolve(played).then(
					() => remove(child.key),
					() => remove(child.key),
				);
			} else if (!registered.current.get(child.key)) {
				remove(child.key);
			}
		}
	}, [exitingKeys]);

	const removeRef = React.useRef(remove);
	removeRef.current = remove;
	const slots = React.useRef(new Map<string | null, Slot>());

	/**
	 * Stable per key: the ref React sees and the context values never change
	 * identity between renders, so a child's own callback ref isn't detached
	 * and reattached each time, and `usePresence` consumers only re-render
	 * when their presence flips.
	 */
	function slotFor(key: string | null): Slot {
		const existing = slots.current.get(key);
		if (existing) return existing;
		function register() {
			registered.current.set(key, (registered.current.get(key) ?? 0) + 1);
			return () => {
				registered.current.set(key, (registered.current.get(key) ?? 1) - 1);
			};
		}
		function safeToRemove() {
			removeRef.current(key);
		}
		const slot: Slot = {
			ownRef: undefined,
			ref(element) {
				if (element) elements.current.set(key, element);
				else elements.current.delete(key);
				const ownRef = slot.ownRef;
				if (typeof ownRef === "function") ownRef(element);
				else if (ownRef)
					(ownRef as React.RefObject<Element | null>).current = element;
			},
			present: { isPresent: true, safeToRemove, register },
			absent: { isPresent: false, safeToRemove, register },
		};
		slots.current.set(key, slot);
		return slot;
	}

	return shown.map((child) => {
		const key = child.key;
		const { exit: _exit, ref: ownRef, ...props } = child.props;
		const slot = slotFor(key);
		slot.ownRef = ownRef;
		return (
			<PresenceContext.Provider
				key={key}
				value={currentKeys.has(key) ? slot.present : slot.absent}
			>
				{React.createElement(child.type, { ...props, ref: slot.ref })}
			</PresenceContext.Provider>
		);
	});
}
