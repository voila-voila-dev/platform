import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { ImageUploadField } from "@voila.dev/ui/components/image-upload-field";
import { useState } from "react";

const AVATAR_IMAGE = "https://github.com/shadcn.png";
const COVER_IMAGE =
	"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80";

const meta = {
	title: "UI/ImageUploadField",
	component: ImageUploadField,
	tags: ["autodocs"],
	argTypes: {
		shape: {
			control: "select",
			options: ["circle", "rectangle"],
		},
	},
	args: {
		onFileCropped: () => {},
		className: "w-full max-w-sm",
	},
} satisfies Meta<typeof ImageUploadField>;

export default meta;

type Story = StoryObj<typeof meta>;

// No value yet: starts in the dropzone → crop → confirm flow.
export const Default: Story = {};

export const AvatarWithValue: Story = {
	args: {
		value: AVATAR_IMAGE,
		onRemove: () => {},
	},
};

export const CoverRectangle: Story = {
	args: {
		value: COVER_IMAGE,
		shape: "rectangle",
		aspectRatio: 3,
		onRemove: () => {},
	},
};

export const Uploading: Story = {
	args: {
		value: AVATAR_IMAGE,
		isUploading: true,
	},
};

/**
 * The component is network-free: the parent receives the cropped Blob, uploads
 * it, then passes the resulting URL back as `value`. This story fakes the
 * upload with an object URL and a short delay.
 */
function FakeUploadFlow() {
	const [value, setValue] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	return (
		<ImageUploadField
			className="w-full max-w-sm"
			value={value}
			isUploading={isUploading}
			onFileCropped={(blob) => {
				setIsUploading(true);
				setTimeout(() => {
					setValue(URL.createObjectURL(blob));
					setIsUploading(false);
				}, 800);
			}}
			onRemove={() => setValue(null)}
		/>
	);
}

export const FullFlow: Story = {
	render: () => <FakeUploadFlow />,
};
