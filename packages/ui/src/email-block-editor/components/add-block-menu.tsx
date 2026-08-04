import { PlusIcon } from "@phosphor-icons/react";
import type { ReactElement } from "react";
import { Button } from "#/button/components/button.tsx";
import { DropdownMenu } from "#/dropdown-menu/components/dropdown-menu.tsx";
import {
	EMAIL_BLOCK_DEFINITIONS,
	EMAIL_BLOCK_TYPES,
} from "#/email-block-editor/blocks/block-definitions.tsx";
import { useEmailEditorLabels } from "#/email-block-editor/context/email-editor-context.tsx";
import type { EmailEditorBlockType } from "#/email-block-editor/document/types.ts";

interface Props {
	onAdd: (type: EmailEditorBlockType) => void;
	trigger?: ReactElement;
	/** The offerable types; a grid cell passes the leaf types only. */
	types?: ReadonlyArray<EmailEditorBlockType>;
}

/**
 * The "Add a block" menu, fed by the block registry. The default trigger
 * is the outlined empty-state button; the block toolbar passes its own icon
 * trigger instead.
 */
export function AddBlockMenu({
	onAdd,
	trigger,
	types = EMAIL_BLOCK_TYPES,
}: Props) {
	const { chrome, blockNames } = useEmailEditorLabels();
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				render={
					trigger ?? (
						<Button variant="outline" size="sm">
							<PlusIcon aria-hidden />
							{chrome.addBlock}
						</Button>
					)
				}
			/>
			<DropdownMenu.Content align="start">
				{types.map((type) => {
					const definition = EMAIL_BLOCK_DEFINITIONS[type];
					return (
						<DropdownMenu.Item key={type} onClick={() => onAdd(type)}>
							<definition.icon aria-hidden />
							{/* A consumer's own block is not in `blockNames`; its
							    definition carries its own label. */}
							{blockNames[type] ?? definition.label}
						</DropdownMenu.Item>
					);
				})}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
