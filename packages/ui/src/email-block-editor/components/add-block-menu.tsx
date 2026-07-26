import { PlusIcon } from "@phosphor-icons/react";
import type { ReactElement } from "react";
import { Button } from "#/button/components/button.tsx";
import { DropdownMenu } from "#/dropdown-menu/components/dropdown-menu.tsx";
import {
	EMAIL_BLOCK_DEFINITIONS,
	EMAIL_BLOCK_TYPES,
} from "#/email-block-editor/blocks/block-definitions.tsx";
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
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger
				render={
					trigger ?? (
						<Button variant="outline" size="sm">
							<PlusIcon aria-hidden />
							Add a block
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
							{definition.label}
						</DropdownMenu.Item>
					);
				})}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	);
}
