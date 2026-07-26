import { Combobox as ComboboxPrimitive } from "@base-ui/react";
import { XIcon } from "@phosphor-icons/react";
import { Button } from "#/button/components/button.tsx";
import { cn } from "#/lib/utils.ts";

interface Props extends ComboboxPrimitive.Chip.Props {
	showRemove?: boolean;
}

export function ComboboxChip({
	className,
	children,
	showRemove = true,
	...props
}: Props) {
	return (
		<ComboboxPrimitive.Chip
			data-slot="combobox-chip"
			// h-5.25 (21px) keeps chips compact enough to sit two-deep inside the
			// 32px-min chips row without forcing it to grow.
			className={cn(
				"flex h-[calc(--spacing(5.25))] w-fit items-center justify-center gap-1 rounded-sm bg-muted px-1.5 text-xs font-medium whitespace-nowrap text-foreground has-disabled:pointer-events-none has-disabled:cursor-not-allowed has-disabled:opacity-50 has-data-[slot=combobox-chip-remove]:pr-0",
				className,
			)}
			{...props}
		>
			{children}
			{showRemove && (
				<ComboboxPrimitive.ChipRemove
					render={<Button variant="ghost" size="icon-xs" />}
					className="-ml-1 opacity-50 hover:opacity-100"
					data-slot="combobox-chip-remove"
				>
					<XIcon className="pointer-events-none" />
				</ComboboxPrimitive.ChipRemove>
			)}
		</ComboboxPrimitive.Chip>
	);
}
