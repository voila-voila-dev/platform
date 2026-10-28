import { animate } from "@voila.dev/motion";
import { useMotionValue } from "@voila.dev/motion/react";
import * as React from "react";

export type StatCardFormat = Intl.NumberFormat | ((value: number) => string);

interface Props {
	value: number;
	format?: StatCardFormat;
}

/** As many decimals as the target has, so a count never shows "12.37" on its way to 13. */
function defaultFormat(target: number): (value: number) => string {
	const decimals = String(target).split(".")[1]?.length ?? 0;
	return (value) => value.toFixed(decimals);
}

function formatter(
	format: StatCardFormat | undefined,
	target: number,
): (value: number) => string {
	if (format instanceof Intl.NumberFormat) {
		return (value) => format.format(value);
	}
	return format ?? defaultFormat(target);
}

/**
 * A number that springs from its previous value when it changes. Each frame
 * writes the text node directly, so the card never re-renders mid-flight. The
 * moving digits are hidden from assistive tech; the final value sits beside
 * them, visually hidden, so a reader hears one number, not every frame.
 * The server and the first render show the final value; reduced motion jumps.
 */
export function StatCardNumber({ value, format }: Props) {
	const shown = React.useRef<HTMLSpanElement>(null);
	const current = useMotionValue(value);
	const text = formatter(format, value)(value);
	const formatRef = React.useRef(format);
	formatRef.current = format;

	React.useLayoutEffect(() => {
		if (current.get() === value) return;
		const write = formatter(formatRef.current, value);
		const controls = animate(current, value, {
			duration: 0.8,
			// React's own text node: replacing it would leave React writing to a detached one.
			onUpdate: (next) => {
				const node = shown.current?.firstChild;
				if (node) node.nodeValue = write(next);
			},
		});
		return () => controls.stop();
	}, [current, value]);

	return (
		<>
			<span ref={shown} aria-hidden="true">
				{text}
			</span>
			<span className="sr-only">{text}</span>
		</>
	);
}
