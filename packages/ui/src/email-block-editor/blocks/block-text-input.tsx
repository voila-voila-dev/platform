import type { CSSProperties } from "react";
import { cn } from "#/lib/utils.ts";

interface Props {
	value: string;
	onChange: (value: string) => void;
	ariaLabel: string;
	placeholder?: string;
	className?: string;
	style?: CSSProperties;
}

/**
 * A single-line field that *wraps* instead of clipping. An `<input>` scrolls
 * its overflow out of sight, which is wrong on a canvas that has to mirror the
 * email: inside a 178px grid cell a heading or a stat label has to run onto a
 * second line exactly as the reader will see it.
 *
 * So it is a one-row `<textarea>` sized to its content, with Enter suppressed
 * — the block model holds a plain string, and a line break in it would mean
 * nothing to the renderer.
 */
export function BlockTextInput({
	value,
	onChange,
	ariaLabel,
	placeholder,
	className,
	style,
}: Props) {
	return (
		<textarea
			aria-label={ariaLabel}
			rows={1}
			value={value}
			placeholder={placeholder}
			onChange={(event) => onChange(event.target.value)}
			onKeyDown={(event) => {
				if (event.key === "Enter") {
					event.preventDefault();
				}
			}}
			className={cn(
				"w-full resize-none overflow-hidden border-none bg-transparent p-0 outline-none [field-sizing:content] placeholder:opacity-40",
				className,
			)}
			style={style}
		/>
	);
}
