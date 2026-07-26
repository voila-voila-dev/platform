import { CommandDialog } from "#/command/components/command-dialog.tsx";
import { CommandEmpty } from "#/command/components/command-empty.tsx";
import { CommandGroup } from "#/command/components/command-group.tsx";
import { CommandInput } from "#/command/components/command-input.tsx";
import { CommandItem } from "#/command/components/command-item.tsx";
import { CommandList } from "#/command/components/command-list.tsx";
import { CommandRoot } from "#/command/components/command-root.tsx";
import { CommandSeparator } from "#/command/components/command-separator.tsx";
import { CommandShortcut } from "#/command/components/command-shortcut.tsx";

/**
 * The Command parts as one namespace.
 */
export const Command = {
	Root: CommandRoot,
	Dialog: CommandDialog,
	Empty: CommandEmpty,
	Group: CommandGroup,
	Input: CommandInput,
	Item: CommandItem,
	List: CommandList,
	Separator: CommandSeparator,
	Shortcut: CommandShortcut,
};
