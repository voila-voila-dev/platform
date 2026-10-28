import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { ComboboxClear } from "#/combobox/components/combobox-clear.tsx";
import { ComboboxTrigger } from "#/combobox/components/combobox-trigger.tsx";
import { InputGroup } from "#/input-group/components/input-group.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends ComboboxPrimitive.Input.Props {
	showTrigger?: boolean;
	showClear?: boolean;
}

export function ComboboxInput({
	className,
	children,
	disabled = false,
	showTrigger = true,
	showClear = false,
	...props
}: Props) {
	return (
		<InputGroup.Root className={cn("w-auto", className)}>
			<ComboboxPrimitive.Input
				render={<InputGroup.Input disabled={disabled} />}
				{...props}
			/>
			<InputGroup.Addon align="inline-end">
				{showTrigger && (
					<InputGroup.Button
						size="icon-xs"
						variant="ghost"
						render={<ComboboxTrigger />}
						data-slot="input-group-button"
						className="group-has-data-[slot=combobox-clear]/input-group:hidden data-pressed:bg-transparent"
						disabled={disabled}
					/>
				)}
				{showClear && <ComboboxClear disabled={disabled} />}
			</InputGroup.Addon>
			{children}
		</InputGroup.Root>
	);
}
