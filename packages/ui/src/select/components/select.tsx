import { SelectContent } from "#/select/components/select-content.tsx";
import { SelectGroup } from "#/select/components/select-group.tsx";
import { SelectItem } from "#/select/components/select-item.tsx";
import { SelectLabel } from "#/select/components/select-label.tsx";
import { SelectRoot } from "#/select/components/select-root.tsx";
import { SelectScrollDownButton } from "#/select/components/select-scroll-down-button.tsx";
import { SelectScrollUpButton } from "#/select/components/select-scroll-up-button.tsx";
import { SelectSeparator } from "#/select/components/select-separator.tsx";
import { SelectTrigger } from "#/select/components/select-trigger.tsx";
import { SelectValue } from "#/select/components/select-value.tsx";

/**
 * The Select parts as one namespace.
 */
export const Select = {
	Root: SelectRoot,
	Content: SelectContent,
	Group: SelectGroup,
	Item: SelectItem,
	Label: SelectLabel,
	ScrollDownButton: SelectScrollDownButton,
	ScrollUpButton: SelectScrollUpButton,
	Separator: SelectSeparator,
	Trigger: SelectTrigger,
	Value: SelectValue,
};
