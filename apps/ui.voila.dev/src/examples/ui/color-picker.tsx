import type { BadgeColor } from "@voila.dev/ui/badge";
import { ColorPicker } from "@voila.dev/ui/color-picker";
import { useState } from "react";

export function ColorPickerExample() {
	const [color, setColor] = useState<BadgeColor | null>("emerald");
	return (
		<div className="w-full max-w-56">
			<ColorPicker value={color} onValueChange={setColor} />
		</div>
	);
}
