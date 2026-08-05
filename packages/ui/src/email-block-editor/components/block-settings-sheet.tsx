import { Drawer } from "#/drawer/components/drawer.tsx";
import { BlockSettingsPanel } from "#/email-block-editor/components/block-settings-panel.tsx";

interface Props {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

/** The block settings panel as a bottom sheet, for the viewports where a 280px
 * column would put the options a screenful away from their block. */
export function BlockSettingsSheet({ open, onOpenChange }: Props) {
	return (
		<Drawer.Root open={open} onOpenChange={onOpenChange}>
			<Drawer.Content>
				<Drawer.Header>
					<Drawer.Title>Block settings</Drawer.Title>
					<Drawer.Description className="sr-only">
						Options for the selected block.
					</Drawer.Description>
				</Drawer.Header>
				<div className="flex flex-col gap-4 overflow-y-auto px-4 pb-8">
					<BlockSettingsPanel />
				</div>
			</Drawer.Content>
		</Drawer.Root>
	);
}
