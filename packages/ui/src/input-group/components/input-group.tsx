import { InputGroupAddon } from "#/input-group/components/input-group-addon.tsx";
import { InputGroupButton } from "#/input-group/components/input-group-button.tsx";
import { InputGroupInput } from "#/input-group/components/input-group-input.tsx";
import { InputGroupRoot } from "#/input-group/components/input-group-root.tsx";
import { InputGroupText } from "#/input-group/components/input-group-text.tsx";
import { InputGroupTextarea } from "#/input-group/components/input-group-textarea.tsx";

/**
 * The InputGroup parts as one namespace.
 */
export const InputGroup = {
	Root: InputGroupRoot,
	Addon: InputGroupAddon,
	Button: InputGroupButton,
	Input: InputGroupInput,
	Text: InputGroupText,
	Textarea: InputGroupTextarea,
};
