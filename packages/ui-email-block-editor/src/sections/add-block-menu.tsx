import { PlusIcon } from "@phosphor-icons/react";
import { Button } from "@voila.dev/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@voila.dev/ui/components/dropdown-menu";
import type { ReactElement } from "react";
import {
	EMAIL_BLOCK_DEFINITIONS,
	EMAIL_BLOCK_TYPES,
} from "#/blocks/block-definitions.tsx";
import type { EmailEditorBlockType } from "#/document/types.ts";

/**
 * The "Add a block" menu, fed by the block registry. The default trigger
 * is the outlined empty-state button; the block toolbar passes its own icon
 * trigger instead.
 */
export function AddBlockMenu({
	onAdd,
	trigger,
	types = EMAIL_BLOCK_TYPES,
}: {
	onAdd: (type: EmailEditorBlockType) => void;
	trigger?: ReactElement;
	/** The offerable types; a grid cell passes the leaf types only. */
	types?: ReadonlyArray<EmailEditorBlockType>;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					trigger ?? (
						<Button variant="outline" size="sm">
							<PlusIcon aria-hidden />
							Add a block
						</Button>
					)
				}
			/>
			<DropdownMenuContent align="start">
				{types.map((type) => {
					const definition = EMAIL_BLOCK_DEFINITIONS[type];
					return (
						<DropdownMenuItem key={type} onClick={() => onAdd(type)}>
							<definition.icon aria-hidden />
							{definition.label}
						</DropdownMenuItem>
					);
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
