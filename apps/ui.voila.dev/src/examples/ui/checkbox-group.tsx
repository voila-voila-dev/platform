import { Checkbox } from "@voila.dev/ui/checkbox";
import { CheckboxGroup } from "@voila.dev/ui/checkbox-group";
import { Label } from "@voila.dev/ui/label";
import { skills } from "./fixtures";

export function CheckboxGroupExample() {
	return (
		<CheckboxGroup defaultValue={["design"]} className="w-full max-w-64">
			{skills.map((skill) => (
				<div key={skill.name} className="flex items-center gap-2">
					<Checkbox name={skill.name} id={`skills-${skill.name}`} />
					<Label htmlFor={`skills-${skill.name}`}>{skill.label}</Label>
				</div>
			))}
		</CheckboxGroup>
	);
}
