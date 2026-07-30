import { Field } from "@voila.dev/ui/field";
import { Input } from "@voila.dev/ui/input";
import { Textarea } from "@voila.dev/ui/textarea";

export function FieldExample() {
	return (
		<div className="w-full max-w-96">
			<Field.Group>
				<Field.Root>
					<Field.Label htmlFor="workspace-name">Company name</Field.Label>
					<Input id="workspace-name" placeholder="Northwind Trading Co." />
					<Field.Description>
						Shown to freelancers on every project you publish.
					</Field.Description>
				</Field.Root>
				<Field.Root data-invalid>
					<Field.Label htmlFor="contact-email">Contact email</Field.Label>
					<Input
						id="contact-email"
						type="email"
						defaultValue="staff@"
						aria-invalid
					/>
					<Field.Error>Enter a complete email address.</Field.Error>
				</Field.Root>
				<Field.Separator>Optional</Field.Separator>
				<Field.Root>
					<Field.Label htmlFor="project-notes">Project notes</Field.Label>
					<Textarea
						id="project-notes"
						placeholder="Access instructions, credentials, tooling…"
					/>
				</Field.Root>
			</Field.Group>
		</div>
	);
}
