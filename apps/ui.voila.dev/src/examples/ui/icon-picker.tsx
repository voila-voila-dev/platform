import { IconPicker } from "@voila.dev/ui/icon-picker";
import { useState } from "react";

export function IconPickerExample() {
	const [iconName, setIconName] = useState<string | null>("PaletteIcon");
	return (
		<div className="w-full max-w-64">
			<IconPicker
				value={iconName}
				onValueChange={setIconName}
				placeholder="Pick a category icon"
			/>
		</div>
	);
}
