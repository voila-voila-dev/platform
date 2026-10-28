import { TrashIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import type * as React from "react";
import { Button } from "#/button/components/button.tsx";
import type { ImageUploadShape } from "#/image-upload-field/lib/image-upload-field-types.ts";
import { cn } from "#/lib/utils.ts";
import { Progress } from "#/progress/components/progress.tsx";

interface Props extends React.ComponentProps<"div"> {
	value: string;
	shape: ImageUploadShape;
	aspectRatio: number;
	isUploading: boolean;
	replaceLabel: React.ReactNode;
	removeLabel: React.ReactNode;
	onReplace: () => void;
	onRemove?: () => void;
}

/**
 * The "view" state: the current image with Replace / Remove, or a Progress bar
 * while the parent's upload is in flight.
 */
export function ImageUploadFieldView({
	value,
	shape,
	aspectRatio,
	isUploading,
	replaceLabel,
	removeLabel,
	onReplace,
	onRemove,
	className,
	...props
}: Props) {
	const isCircle = shape === "circle";
	return (
		<div
			data-slot="image-upload-field"
			data-shape={shape}
			data-state="view"
			className={cn("flex flex-col items-center gap-3", className)}
			{...props}
		>
			<img
				src={value}
				alt=""
				data-slot="image-upload-field-preview"
				style={{ aspectRatio: String(aspectRatio) }}
				className={cn(
					"w-full max-w-xs border border-border object-cover",
					isCircle ? "mx-auto size-32 rounded-full" : "rounded-lg",
				)}
			/>
			{isUploading ? (
				<Progress.Root
					value={null}
					className="w-full max-w-xs"
					data-slot="image-upload-field-progress"
				/>
			) : (
				<div className="flex items-center gap-2">
					<Button type="button" variant="outline" size="sm" onClick={onReplace}>
						<UploadSimpleIcon />
						{replaceLabel}
					</Button>
					{onRemove ? (
						<Button type="button" variant="ghost" size="sm" onClick={onRemove}>
							<TrashIcon />
							{removeLabel}
						</Button>
					) : null}
				</div>
			)}
		</div>
	);
}
