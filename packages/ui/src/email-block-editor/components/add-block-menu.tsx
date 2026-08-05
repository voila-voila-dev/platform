import { PlusIcon } from "@phosphor-icons/react";
import type { ReactElement } from "react";
import { Button } from "#/button/components/button.tsx";
import { DropdownMenu } from "#/dropdown-menu/components/dropdown-menu.tsx";
import {
	useEmailEditorLabels,
	useEmailEditorRegistry,
} from "#/email-block-editor/context/email-editor-context.tsx";

interface Props {
	onAdd: (type: string) => void;
	trigger?: ReactElement;
	/** The offerable types; a container's cell passes the ones it accepts. */
	types?: ReadonlyArray<string>;
}

/**
 * The "Add a block" menu, fed by the block registry. The default trigger
 * is the outlined empty-state button; the block toolbar passes its own icon
 * trigger instead.
 */
export function AddBlockMenu({ onAdd, trigger, types }: Props) {
	const { chrome, blockNames } = useEmailEditorLabels();
	const registry = useEmailEditorRegistry();
	const offered = types ?? registry.types;
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
				{offered.map((type) => {
					const definition = registry.definitionFor(type);
					if (definition === undefined) {
						return null;
					}
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
