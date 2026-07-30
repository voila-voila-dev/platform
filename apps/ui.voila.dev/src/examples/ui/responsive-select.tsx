import { ResponsiveSelect } from "@voila.dev/ui/responsive-select";
import { useState } from "react";

export function ResponsiveSelectExample() {
	const [value, setValue] = useState("designer");
	return (
		<div className="w-full max-w-72">
			<ResponsiveSelect.Root value={value} onValueChange={setValue}>
				<ResponsiveSelect.Trigger className="w-full">
					<ResponsiveSelect.Value placeholder="Select a role" />
				</ResponsiveSelect.Trigger>
				<ResponsiveSelect.Content>
					<ResponsiveSelect.Item value="designer">
						Designer
					</ResponsiveSelect.Item>
					<ResponsiveSelect.Item value="developer">
						Developer
					</ResponsiveSelect.Item>
					<ResponsiveSelect.Item value="writer">
						Copywriter
					</ResponsiveSelect.Item>
				</ResponsiveSelect.Content>
			</ResponsiveSelect.Root>
		</div>
	);
}
