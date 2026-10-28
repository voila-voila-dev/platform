import { XIcon } from "@phosphor-icons/react";
import * as React from "react";
import { cn } from "#/lib/utils.ts";
import { SpreadsheetImagePreview } from "#/spreadsheet/components/spreadsheet-image-preview.tsx";
import { useSpreadsheetImageDrop } from "#/spreadsheet/hooks/use-spreadsheet-image-drop.ts";

interface Props extends Omit<React.ComponentProps<"td">, "onDrop" | "onPaste"> {
	/** Displayed thumbnail URL; empty or null renders the placeholder. */
	src?: string | null;
	/** Alt text of the thumbnail - the row's label, not "image". */
	alt?: string;
	/** What `gridNavigation` copy serializes for this cell. */
	value?: string;
	/** Hands over the picked `File`. Upload it, then feed the URL back as `src`. */
	onFileSelect: (file: File) => void;
	/** Omit to make the image non-clearable (no remove affordance is drawn). */
	onRemove?: () => void;
	/** Swaps the thumbnail for a spinner while your upload runs. */
	uploading?: boolean;
	/** Blocks all three import paths: the picker, the drop and the paste. */
	disabled?: boolean;
	/** `accept` for the hidden file input, e.g. `"image/png,image/jpeg"`. */
	accept?: string;
	/** Accessible name of the picker button, e.g. "Import an image, row 3". */
	pickLabel: string;
	/** Accessible name of the remove button. Only drawn when `onRemove` is passed. */
	removeLabel?: string;
}

/**
 * Image cell: a thumbnail that imports a file three ways - click to open the
 * picker, drop a file onto the cell, or paste one from the clipboard while the
 * cell is focused. Presentational like every other part: it neither uploads
 * nor holds the file. `onFileSelect` hands over the picked `File` (upload it,
 * then feed the resulting URL back as `src`) and `uploading` swaps the
 * thumbnail for a spinner while that runs.
 *
 * Under `gridNavigation` the cell copies as `value` (the slug or id behind the
 * image, not the URL) - declaring it is what keeps the hidden file input from
 * being serialized as the cell's value.
 */
export function SpreadsheetCellImage({
	src,
	alt = "",
	value = "",
	onFileSelect,
	onRemove,
	uploading = false,
	disabled = false,
	accept = "image/*",
	pickLabel,
	removeLabel,
	className,
	...props
}: Props) {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const { dragging, cellProps } = useSpreadsheetImageDrop({
		onFileSelect,
		disabled: disabled || uploading,
	});
	const hasImage = src !== null && src !== undefined && src.length > 0;
	return (
		<td
			data-slot="spreadsheet-cell-image"
			data-grid-value={value}
			className={cn(
				"group/image-cell relative border-r border-b border-input p-0 text-center align-middle last:border-r-0",
				dragging && "inset-ring-2 inset-ring-ring/70 bg-primary/10",
				className,
			)}
			{...cellProps}
			{...props}
		>
			<input
				ref={inputRef}
				type="file"
				accept={accept}
				className="hidden"
				tabIndex={-1}
				onChange={(event) => {
					const file = event.target.files?.[0];
					// Cleared so picking the SAME file twice in a row still fires
					// `change` (the browser skips it when the value is unchanged).
					event.target.value = "";
					if (file !== undefined) {
						onFileSelect(file);
					}
				}}
			/>
			<button
				type="button"
				aria-label={pickLabel}
				disabled={disabled || uploading}
				className="flex h-8 w-full items-center justify-center outline-none hover:bg-muted/50 focus-visible:inset-ring-2 focus-visible:inset-ring-ring/70 disabled:pointer-events-none disabled:opacity-50"
				onClick={() => inputRef.current?.click()}
			>
				<SpreadsheetImagePreview src={src} alt={alt} uploading={uploading} />
			</button>
			{hasImage && onRemove !== undefined && removeLabel !== undefined ? (
				<button
					type="button"
					aria-label={removeLabel}
					disabled={disabled || uploading}
					// Pointer-revealed, but always reachable: focus brings it back for
					// keyboard users, who have no hover to trigger it with.
					className="absolute top-0.5 right-0.5 hidden size-4 place-items-center rounded-full bg-background text-muted-foreground outline-none group-hover/image-cell:grid hover:text-destructive focus-visible:grid focus-visible:inset-ring-2 focus-visible:inset-ring-ring/70"
					onClick={onRemove}
				>
					<XIcon aria-hidden="true" className="size-2.5" />
				</button>
			) : null}
		</td>
	);
}
