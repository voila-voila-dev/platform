import { ImageIcon, PlayIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { useRef, useState } from "react";
import { Button } from "#/components/button.tsx";
import type {
	EmailBlockComponentProps,
	EmailBlockDefinition,
} from "#/email-block-editor/blocks/block-definitions.tsx";
import type {
	EmailEditorImageBlock,
	EmailEditorImageOverlay,
	EmailEditorImageWidth,
} from "#/email-block-editor/document/types.ts";
import { BlockOptionSection } from "#/email-block-editor/sections/block-options/block-option-row.tsx";
import {
	SelectOption,
	ToggleOption,
} from "#/email-block-editor/sections/block-options/select-option.tsx";
import {
	LinkOption,
	TextOption,
} from "#/email-block-editor/sections/block-options/text-option.tsx";
import { EMAIL_COLOR, EMAIL_FONT } from "#/email-block-editor/theme.ts";

/**
 * How much of the card's inner width each option occupies. `contained` is the
 * option for a visual that should not bleed edge to edge (a logo, a portrait);
 * the renderer uses the same ratio against the 536px content width.
 */
export const EMAIL_IMAGE_WIDTH_RATIO: {
	readonly [W in EmailEditorImageWidth]: number;
} = { full: 1, contained: 0.6 };

const WIDTH_OPTIONS: ReadonlyArray<{
	readonly value: EmailEditorImageWidth;
	readonly label: string;
}> = [
	{ value: "full", label: "Full width" },
	{ value: "contained", label: "Reduced width (centered)" },
];

const OVERLAY_OPTIONS: ReadonlyArray<{
	readonly value: EmailEditorImageOverlay;
	readonly label: string;
}> = [
	{ value: "none", label: "None" },
	{ value: "play", label: "Play button (video thumbnail)" },
];

/** The play badge composited over a video thumbnail. */
function PlayOverlay() {
	return (
		<span
			className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex size-14 items-center justify-center rounded-full"
			style={{ backgroundColor: EMAIL_COLOR.brand }}
			aria-hidden
		>
			<PlayIcon size={24} weight="fill" color="#ffffff" />
		</span>
	);
}

/**
 * A content image. Without a source it renders a dashed drop zone that opens a
 * file picker; the actual upload is delegated to the host through
 * `onUploadImage` (the admin wires its ticketed upload). Mirrors the domain
 * `emailImage` component (width, radius and play overlay all follow the
 * block's options).
 */
function ImageBlockView({
	block,
	onChange,
	onUploadImage,
}: EmailBlockComponentProps<EmailEditorImageBlock>) {
	if (block.src !== "") {
		return (
			<div
				className="relative mx-auto"
				style={{
					width: `${EMAIL_IMAGE_WIDTH_RATIO[block.width] * 100}%`,
				}}
			>
				<img
					src={block.src}
					alt={block.alt}
					className={block.rounded ? "block w-full rounded-lg" : "block w-full"}
				/>
				{block.overlay === "play" ? <PlayOverlay /> : null}
			</div>
		);
	}

	return (
		<ImageDropZone
			onUploadImage={onUploadImage}
			onUploaded={(src) => onChange({ ...block, src })}
		/>
	);
}

/** The empty state: a dashed zone that opens the file picker. The upload
 * itself is the host's job, so without `onUploadImage` it is simply inert. */
function ImageDropZone({
	onUploadImage,
	onUploaded,
}: {
	onUploadImage?: (file: File) => Promise<string>;
	onUploaded: (src: string) => void;
}) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [uploading, setUploading] = useState(false);

	const upload = async (file: File) => {
		if (!onUploadImage) {
			return;
		}
		setUploading(true);
		try {
			onUploaded(await onUploadImage(file));
		} finally {
			setUploading(false);
		}
	};

	return (
		<>
			<button
				type="button"
				onClick={() => fileInputRef.current?.click()}
				disabled={onUploadImage === undefined || uploading}
				className="flex w-full flex-col items-center gap-2 rounded-lg border border-dashed px-4 py-10 text-[14px] disabled:cursor-not-allowed"
				style={{
					borderColor: EMAIL_COLOR.muted,
					color: EMAIL_COLOR.muted,
					fontFamily: EMAIL_FONT,
				}}
			>
				<ImageIcon size={24} aria-hidden />
				{uploading ? "Uploading…" : "Add an image"}
			</button>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={(event) => {
					const file = event.target.files?.[0];
					if (file) {
						void upload(file);
					}
					event.target.value = "";
				}}
			/>
		</>
	);
}

function ImageUploadButton({
	block,
	onChange,
	onUploadImage,
}: {
	block: EmailEditorImageBlock;
	onChange: (block: EmailEditorImageBlock) => void;
	onUploadImage: (file: File) => Promise<string>;
}) {
	const fileInputRef = useRef<HTMLInputElement>(null);
	return (
		<>
			<Button
				variant="outline"
				size="sm"
				onClick={() => fileInputRef.current?.click()}
			>
				<UploadSimpleIcon aria-hidden />
				{block.src === "" ? "Upload an image" : "Replace the image"}
			</Button>
			<input
				ref={fileInputRef}
				type="file"
				accept="image/*"
				className="hidden"
				onChange={(event) => {
					const file = event.target.files?.[0];
					if (file) {
						void onUploadImage(file).then((src) => onChange({ ...block, src }));
					}
					event.target.value = "";
				}}
			/>
		</>
	);
}

function ImageBlockSettings({
	block,
	onChange,
	onUploadImage,
}: EmailBlockComponentProps<EmailEditorImageBlock>) {
	return (
		<>
			<BlockOptionSection title="Content">
				<TextOption
					label="Alt text"
					value={block.alt}
					onChange={(alt) => onChange({ ...block, alt })}
					description="Shown when the email client blocks the image."
				/>
				<TextOption
					label="Image URL"
					value={block.src}
					onChange={(src) => onChange({ ...block, src })}
					placeholder="https://"
				/>
				{onUploadImage ? (
					<ImageUploadButton
						block={block}
						onChange={onChange}
						onUploadImage={onUploadImage}
					/>
				) : null}
			</BlockOptionSection>
			<BlockOptionSection title="Appearance">
				<SelectOption
					label="Width"
					value={block.width}
					options={WIDTH_OPTIONS}
					onChange={(width) => onChange({ ...block, width })}
				/>
				<SelectOption
					label="Overlay"
					value={block.overlay}
					options={OVERLAY_OPTIONS}
					onChange={(overlay) => onChange({ ...block, overlay })}
					description={
						block.overlay === "play"
							? "No email client plays an embedded video: the thumbnail links to the URL below. Outlook shows the badge under the image."
							: undefined
					}
				/>
				<ToggleOption
					label="Rounded corners"
					checked={block.rounded}
					onChange={(rounded) => onChange({ ...block, rounded })}
					description="Outlook (Word engine) always renders square corners."
				/>
			</BlockOptionSection>
			<BlockOptionSection title="Link">
				<LinkOption
					value={block.href}
					onChange={(href) => onChange({ ...block, href })}
					description="Leave empty for a non-clickable image."
				/>
			</BlockOptionSection>
		</>
	);
}

export const imageBlockDefinition: EmailBlockDefinition<EmailEditorImageBlock> =
	{
		label: "Image",
		icon: ImageIcon,
		View: ImageBlockView,
		Settings: ImageBlockSettings,
	};
