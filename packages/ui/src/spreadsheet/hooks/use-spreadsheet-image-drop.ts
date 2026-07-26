import * as React from "react";

/**
 * First image file in a drop or clipboard payload, or null when it carries
 * none. `DataTransferItemList` is the clipboard's only reliable file view in
 * Safari, so both sources are read through `files` after normalizing.
 */
function firstImageFile(data: DataTransfer | null): File | null {
	if (data === null) {
		return null;
	}
	for (const file of Array.from(data.files)) {
		if (file.type.startsWith("image/")) {
			return file;
		}
	}
	return null;
}

interface Options {
	onDragEnter: React.DragEventHandler<HTMLTableCellElement>;
	onDragOver: React.DragEventHandler<HTMLTableCellElement>;
	onDragLeave: React.DragEventHandler<HTMLTableCellElement>;
	onDrop: React.DragEventHandler<HTMLTableCellElement>;
	onPaste: React.ClipboardEventHandler<HTMLTableCellElement>;
}

/**
 * The two pointer-free import gestures of an image cell: dropping a file onto
 * it and pasting one from the clipboard (the file picker is a plain button, it
 * needs no hook). Returns `dragging` for the drop highlight plus the props to
 * spread on the cell.
 *
 * Both handlers stop propagation once they have consumed a file: the table's
 * grid layer owns paste (TSV) and the rows own drag (reordering), and neither
 * should also see an image landing on a cell. A payload without an image file
 * is left to bubble untouched.
 *
 * `dragenter`/`dragleave` fire per descendant as the pointer crosses the
 * thumbnail and the buttons inside the cell, so the highlight is driven by a
 * depth counter rather than a boolean - a plain toggle flickers off the moment
 * the pointer enters a child.
 */
export function useSpreadsheetImageDrop({
	onFileSelect,
	disabled,
}: {
	onFileSelect: (file: File) => void;
	disabled: boolean;
}): { dragging: boolean; cellProps: Options } {
	const [dragging, setDragging] = React.useState(false);
	const depth = React.useRef(0);

	const reset = () => {
		depth.current = 0;
		setDragging(false);
	};

	return {
		dragging,
		cellProps: {
			onDragEnter: (event) => {
				if (disabled || firstImageFile(event.dataTransfer) === null) {
					return;
				}
				event.preventDefault();
				event.stopPropagation();
				depth.current += 1;
				setDragging(true);
			},
			onDragOver: (event) => {
				if (disabled || firstImageFile(event.dataTransfer) === null) {
					return;
				}
				// Without preventDefault on dragover the browser refuses the drop.
				event.preventDefault();
				event.stopPropagation();
				event.dataTransfer.dropEffect = "copy";
			},
			onDragLeave: (event) => {
				if (depth.current === 0) {
					return;
				}
				event.stopPropagation();
				depth.current -= 1;
				if (depth.current === 0) {
					setDragging(false);
				}
			},
			onDrop: (event) => {
				const file = firstImageFile(event.dataTransfer);
				if (disabled || file === null) {
					reset();
					return;
				}
				event.preventDefault();
				event.stopPropagation();
				reset();
				onFileSelect(file);
			},
			onPaste: (event) => {
				const file = firstImageFile(event.clipboardData);
				if (disabled || file === null) {
					return; // Text payload: the grid's TSV paste layer takes it.
				}
				event.preventDefault();
				event.stopPropagation();
				onFileSelect(file);
			},
		},
	};
}
