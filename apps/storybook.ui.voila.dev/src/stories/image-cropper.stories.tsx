import {
	ArrowCounterClockwiseIcon,
	ArrowsClockwiseIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Button } from "@voila.dev/ui/button";
import {
	ImageCropper,
	type ImageCropperCropArea,
	useImageCropper,
} from "@voila.dev/ui/image-cropper";
import { ResponsiveDialog } from "@voila.dev/ui/responsive-dialog";
import { useState } from "react";
import { expect, fireEvent, waitFor } from "storybook/test";

const LANDSCAPE_IMAGE =
	"https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1200&q=80";
const PORTRAIT_IMAGE = "https://github.com/shadcn.png";

const meta = {
	title: "UI/ImageCropper",
	component: ImageCropper.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof ImageCropper.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<div className="w-96">
			<ImageCropper.Root>
				<ImageCropper.Dropzone />
				<ImageCropper.Area />
			</ImageCropper.Root>
		</div>
	),
};

export const WithImage: Story = {
	render: () => (
		<div className="w-96">
			<ImageCropper.Root defaultImage={LANDSCAPE_IMAGE}>
				<ImageCropper.Area />
				<p className="text-center text-muted-foreground text-xs">
					Drag to reposition, pinch or scroll to zoom, double-tap to toggle.
				</p>
			</ImageCropper.Root>
		</div>
	),
};

/** The crop format is fixed on the root component: pass `aspectRatio`. */
export const Formats: Story = {
	render: () => (
		<div className="flex w-[28rem] flex-col gap-8">
			{[
				{ label: "1 / 1 — avatar", aspectRatio: 1 },
				{ label: "4 / 3 — card", aspectRatio: 4 / 3 },
				{ label: "16 / 9 — cover", aspectRatio: 16 / 9 },
				{ label: "3 / 1 — banner", aspectRatio: 3 },
			].map(({ label, aspectRatio }) => (
				<div key={label} className="flex flex-col gap-2">
					<p className="font-medium text-muted-foreground text-xs">{label}</p>
					<ImageCropper.Root
						aspectRatio={aspectRatio}
						defaultImage={LANDSCAPE_IMAGE}
					>
						<ImageCropper.Area />
					</ImageCropper.Root>
				</div>
			))}
		</div>
	),
};

export const CircleAvatar: Story = {
	render: () => (
		<div className="w-72">
			<ImageCropper.Root
				aspectRatio={1}
				maxZoom={6}
				defaultImage={PORTRAIT_IMAGE}
			>
				<ImageCropper.Area shape="circle" />
				<p className="text-center text-muted-foreground text-xs">
					Drag to reposition, pinch or scroll to zoom, double-tap to toggle.
				</p>
			</ImageCropper.Root>
		</div>
	),
};

function CropperToolbar() {
	const { imageSource, resetCrop, openFilePicker, removeImage } =
		useImageCropper();
	if (imageSource === null) return null;
	return (
		<div className="flex items-center justify-center gap-1">
			<Button
				type="button"
				variant="ghost"
				size="icon"
				aria-label="Reset crop"
				onClick={resetCrop}
			>
				<ArrowCounterClockwiseIcon />
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				aria-label="Replace image"
				onClick={openFilePicker}
			>
				<ArrowsClockwiseIcon />
			</Button>
			<Button
				type="button"
				variant="ghost"
				size="icon"
				aria-label="Remove image"
				onClick={removeImage}
			>
				<TrashIcon />
			</Button>
		</div>
	);
}

export const WithToolbar: Story = {
	render: () => (
		<div className="w-96">
			<ImageCropper.Root defaultImage={LANDSCAPE_IMAGE}>
				<ImageCropper.Dropzone />
				<ImageCropper.Area />
				<CropperToolbar />
			</ImageCropper.Root>
		</div>
	),
};

function CropToPreviewButton({
	onCropped,
}: {
	onCropped: (objectUrl: string) => void;
}) {
	const { cropToBlob, imageSource } = useImageCropper();
	return (
		<Button
			type="button"
			disabled={imageSource === null}
			onClick={async () => {
				const blob = await cropToBlob({
					width: 320,
					type: "image/jpeg",
					quality: 0.9,
				});
				onCropped(URL.createObjectURL(blob));
			}}
		>
			Crop image
		</Button>
	);
}

export const CroppedResultPreview: Story = {
	render: () => {
		const [preview, setPreview] = useState<string | null>(null);
		return (
			<div className="flex items-start gap-6">
				<div className="w-96">
					<ImageCropper.Root aspectRatio={4 / 3} defaultImage={LANDSCAPE_IMAGE}>
						<ImageCropper.Dropzone />
						<ImageCropper.Area />
						<CropToPreviewButton onCropped={setPreview} />
					</ImageCropper.Root>
				</div>
				<div className="flex w-48 flex-col gap-2">
					<p className="font-medium text-sm">Result (320px JPEG)</p>
					{preview === null ? (
						<p className="text-muted-foreground text-sm">
							Adjust the crop, then press “Crop image”.
						</p>
					) : (
						<img
							src={preview}
							alt="Cropped result"
							className="w-full rounded-lg border"
						/>
					)}
				</div>
			</div>
		);
	},
};

function SaveAvatarButton({
	onSaved,
}: {
	onSaved: (objectUrl: string) => void;
}) {
	const { cropToBlob, imageSource } = useImageCropper();
	return (
		<Button
			type="button"
			className="w-full"
			disabled={imageSource === null}
			onClick={async () => {
				const blob = await cropToBlob({ width: 256, type: "image/webp" });
				onSaved(URL.createObjectURL(blob));
			}}
		>
			Save avatar
		</Button>
	);
}

export const InResponsiveDialog: Story = {
	render: () => {
		const [open, setOpen] = useState(false);
		const [avatar, setAvatar] = useState<string>(PORTRAIT_IMAGE);
		return (
			<div className="flex flex-col items-center gap-4">
				<img
					src={avatar}
					alt="Current avatar"
					className="size-24 rounded-full border object-cover"
				/>
				<ResponsiveDialog.Root open={open} onOpenChange={setOpen}>
					<ResponsiveDialog.Trigger
						render={<Button variant="outline">Change avatar</Button>}
					/>
					<ResponsiveDialog.Content>
						<ResponsiveDialog.Header>
							<ResponsiveDialog.Title>Change avatar</ResponsiveDialog.Title>
							<ResponsiveDialog.Description>
								Pick a photo, then adjust the crop. On mobile this opens as a
								drawer with pinch-to-zoom gestures.
							</ResponsiveDialog.Description>
						</ResponsiveDialog.Header>
						<ResponsiveDialog.Body className="flex flex-col gap-3 pb-4">
							<ImageCropper.Root
								aspectRatio={1}
								maxZoom={6}
								defaultImage={PORTRAIT_IMAGE}
							>
								<ImageCropper.Dropzone />
								<ImageCropper.Area shape="circle" />
								<SaveAvatarButton
									onSaved={(objectUrl) => {
										setAvatar(objectUrl);
										setOpen(false);
									}}
								/>
							</ImageCropper.Root>
						</ResponsiveDialog.Body>
					</ResponsiveDialog.Content>
				</ResponsiveDialog.Root>
			</div>
		);
	},
};

export const CropChangeReadout: Story = {
	render: () => {
		const [cropArea, setCropArea] = useState<ImageCropperCropArea | null>(null);
		return (
			<div className="flex w-96 flex-col gap-3">
				<ImageCropper.Root
					defaultImage={LANDSCAPE_IMAGE}
					onCropChange={setCropArea}
				>
					<ImageCropper.Area />
				</ImageCropper.Root>
				<p className="text-center font-mono text-muted-foreground text-xs">
					{cropArea === null
						? "No crop yet"
						: `x: ${Math.round(cropArea.x)} · y: ${Math.round(cropArea.y)} · ${Math.round(cropArea.width)} × ${Math.round(cropArea.height)} px`}
				</p>
			</div>
		);
	},
};

export const LocalizedLabels: Story = {
	render: () => (
		<div className="w-96">
			<ImageCropper.Root aspectRatio={16 / 9}>
				<ImageCropper.Dropzone
					label="Choisir une image"
					description="Cliquez pour parcourir ou glissez-déposez"
				/>
				<ImageCropper.Area aria-label="Déplacez l’image, pincez ou faites défiler pour zoomer" />
			</ImageCropper.Root>
		</div>
	),
};

export const Disabled: Story = {
	render: () => (
		<div className="flex w-96 flex-col gap-6">
			<ImageCropper.Root disabled>
				<ImageCropper.Dropzone />
			</ImageCropper.Root>
			<ImageCropper.Root disabled defaultImage={LANDSCAPE_IMAGE}>
				<ImageCropper.Area />
			</ImageCropper.Root>
		</div>
	),
};

export const UploadFlow: Story = {
	render: () => (
		<div className="w-96">
			<ImageCropper.Root>
				<ImageCropper.Dropzone />
				<ImageCropper.Area />
			</ImageCropper.Root>
		</div>
	),
	play: async ({ canvasElement }) => {
		const canvas = document.createElement("canvas");
		canvas.width = 320;
		canvas.height = 240;
		const canvasContext = canvas.getContext("2d");
		if (canvasContext === null) return;
		const gradient = canvasContext.createLinearGradient(0, 0, 320, 240);
		gradient.addColorStop(0, "#0ea5e9");
		gradient.addColorStop(1, "#8b5cf6");
		canvasContext.fillStyle = gradient;
		canvasContext.fillRect(0, 0, 320, 240);
		const blob = await new Promise<Blob | null>((resolve) =>
			canvas.toBlob(resolve, "image/png"),
		);
		if (blob === null) return;
		const input = canvasElement.querySelector<HTMLInputElement>(
			"[data-slot=image-cropper-input]",
		);
		if (input === null) return;
		fireEvent.change(input, {
			target: {
				files: [new File([blob], "sample.png", { type: "image/png" })],
			},
		});
		await waitFor(() =>
			expect(
				canvasElement.querySelector("[data-slot=image-cropper-area]"),
			).not.toBeNull(),
		);
	},
};
