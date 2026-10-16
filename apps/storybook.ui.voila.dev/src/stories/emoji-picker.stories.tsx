import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { EmojiPicker } from "@voila.dev/ui/emoji-picker";
import { Popover } from "@voila.dev/ui/popover";
import { useState } from "react";
import { expect, waitFor } from "storybook/test";

const meta = {
	title: "UI/EmojiPicker",
	component: EmojiPicker,
	tags: ["autodocs"],
	args: {
		onEmojiSelect: () => {},
	},
} satisfies Meta<typeof EmojiPicker>;

export default meta;

type Story = StoryObj<typeof meta>;

function Picked({ locale }: { locale?: "en" | "fr" }) {
	const [emoji, setEmoji] = useState<string | null>(null);
	return (
		<div className="flex flex-col items-center gap-3">
			<div className="rounded-xl bg-popover shadow-md ring-1 ring-foreground/10">
				<EmojiPicker
					onEmojiSelect={setEmoji}
					locale={locale}
					searchPlaceholder={
						locale === "fr" ? "Rechercher un emoji" : "Search emoji"
					}
					loadingLabel={locale === "fr" ? "Chargement…" : "Loading…"}
					emptyLabel={locale === "fr" ? "Aucun emoji trouvé" : "No emoji found"}
				/>
			</div>
			<p className="text-muted-foreground text-sm">
				{emoji === null ? "—" : <span className="text-2xl">{emoji}</span>}
			</p>
		</div>
	);
}

export const Default: Story = {
	render: () => <Picked />,
	play: async ({ canvasElement }) => {
		await waitFor(
			() =>
				expect(
					canvasElement.querySelectorAll("[data-slot=emoji-picker-emoji]")
						.length,
				).toBeGreaterThan(0),
			{ timeout: 10_000 },
		);
	},
};

export const French: Story = {
	render: () => <Picked locale="fr" />,
};

export const InPopover: Story = {
	render: () => {
		const [emoji, setEmoji] = useState("😊");
		const [open, setOpen] = useState(false);
		return (
			<Popover.Root open={open} onOpenChange={setOpen}>
				<Popover.Trigger className="flex size-10 items-center justify-center rounded-md text-2xl ring-1 ring-foreground/10">
					{emoji}
				</Popover.Trigger>
				<Popover.Content className="w-auto p-0">
					<EmojiPicker
						autoFocus
						searchPlaceholder="Search emoji"
						onEmojiSelect={(picked) => {
							setEmoji(picked);
							setOpen(false);
						}}
					/>
				</Popover.Content>
			</Popover.Root>
		);
	},
};
