import { Label } from "@voila.dev/ui/label";
import { RadioGroup } from "@voila.dev/ui/radio-group";

export function RadioGroupExample() {
	return (
		<RadioGroup.Root defaultValue="designer" className="w-full max-w-64">
			{[
				{ value: "designer", label: "Designer" },
				{ value: "developer", label: "Developer" },
				{ value: "writer", label: "Copywriter" },
			].map((option) => (
				<div key={option.value} className="flex items-center gap-2">
					<RadioGroup.Item value={option.value} id={`role-${option.value}`} />
					<Label htmlFor={`role-${option.value}`}>{option.label}</Label>
				</div>
			))}
		</RadioGroup.Root>
	);
}
