import type * as React from "react";
import { DropdownMenu } from "#/dropdown-menu/components/dropdown-menu.tsx";

interface Props extends React.ComponentProps<typeof DropdownMenu.RadioGroup> {}

export function MenubarRadioGroup(props: Props) {
	return <DropdownMenu.RadioGroup data-slot="menubar-radio-group" {...props} />;
}
