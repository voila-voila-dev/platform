import { FileCodeIcon, FilePdfIcon, XIcon } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Attachment } from "@voila.dev/ui/attachment";
import { Spinner } from "@voila.dev/ui/spinner";

const meta = {
	title: "UI/Attachment",
	component: Attachment.Root,
	tags: ["autodocs"],
} satisfies Meta<typeof Attachment.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	render: () => (
		<Attachment.Root className="w-full max-w-sm">
			<Attachment.Media>
				<FileCodeIcon />
			</Attachment.Media>
			<Attachment.Content>
				<Attachment.Title>message-renderer.tsx</Attachment.Title>
				<Attachment.Description>TypeScript · 12 KB</Attachment.Description>
			</Attachment.Content>
			<Attachment.Actions>
				<Attachment.Action aria-label="Remove message-renderer.tsx">
					<XIcon />
				</Attachment.Action>
			</Attachment.Actions>
		</Attachment.Root>
	),
};

export const Uploading: Story = {
	render: () => (
		<Attachment.Root state="uploading" className="w-full max-w-sm">
			<Attachment.Media>
				<Spinner />
			</Attachment.Media>
			<Attachment.Content>
				<Attachment.Title>sales-dashboard.pdf</Attachment.Title>
				<Attachment.Description>Uploading · 64%</Attachment.Description>
			</Attachment.Content>
			<Attachment.Actions>
				<Attachment.Action aria-label="Cancel upload">
					<XIcon />
				</Attachment.Action>
			</Attachment.Actions>
		</Attachment.Root>
	),
};

export const ErrorState: Story = {
	render: () => (
		<Attachment.Root state="error" className="w-full max-w-sm">
			<Attachment.Media>
				<FilePdfIcon />
			</Attachment.Media>
			<Attachment.Content>
				<Attachment.Title>annual-report.pdf</Attachment.Title>
				<Attachment.Description>Upload failed</Attachment.Description>
			</Attachment.Content>
			<Attachment.Actions>
				<Attachment.Action aria-label="Remove annual-report.pdf">
					<XIcon />
				</Attachment.Action>
			</Attachment.Actions>
		</Attachment.Root>
	),
};

export const VerticalImages: Story = {
	render: () => (
		<Attachment.Group className="max-w-sm">
			{[
				["workspace.png", "PNG · 820 KB"],
				["desk-reference.jpg", "JPG · 1.1 MB"],
				["office-reference.jpg", "JPG · 940 KB"],
			].map(([name, meta]) => (
				<Attachment.Root key={name} orientation="vertical">
					<Attachment.Media variant="image">
						<img
							src={`https://picsum.photos/seed/${name}/300/300`}
							alt={name}
						/>
					</Attachment.Media>
					<Attachment.Content>
						<Attachment.Title>{name}</Attachment.Title>
						<Attachment.Description>{meta}</Attachment.Description>
					</Attachment.Content>
				</Attachment.Root>
			))}
		</Attachment.Group>
	),
};
