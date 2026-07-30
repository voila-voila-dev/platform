import { Button } from "@voila.dev/ui/button";
import { Card } from "@voila.dev/ui/card";
import { DatePicker } from "@voila.dev/ui/date-picker";
import { Field } from "@voila.dev/ui/field";
import { Input } from "@voila.dev/ui/input";
import { Label } from "@voila.dev/ui/label";
import { Select } from "@voila.dev/ui/select";
import { Switch } from "@voila.dev/ui/switch";
import { useState } from "react";

export function QuickStartHero() {
	const [date, setDate] = useState<Date | null>(new Date(2026, 5, 20));
	return (
		<Card.Root className="w-full max-w-md">
			<Card.Header>
				<Card.Title>Publish a project</Card.Title>
				<Card.Description>
					Freelancers matching the role are notified when it goes live.
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<Field.Group>
					<Field.Root>
						<Field.Label htmlFor="qs-project-title">Title</Field.Label>
						<Input
							id="qs-project-title"
							defaultValue="Product designer — launch week"
						/>
					</Field.Root>
					<div className="grid grid-cols-2 gap-4">
						<Field.Root>
							<Field.Label>Role</Field.Label>
							<Select.Root defaultValue="designer">
								<Select.Trigger className="w-full">
									<Select.Value />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="designer">Designer</Select.Item>
									<Select.Item value="developer">Developer</Select.Item>
									<Select.Item value="writer">Copywriter</Select.Item>
								</Select.Content>
							</Select.Root>
						</Field.Root>
						<Field.Root>
							<Field.Label>Date</Field.Label>
							<DatePicker.Root
								value={date}
								onValueChange={setDate}
								placeholder="Project date"
								calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
							/>
						</Field.Root>
					</div>
					<div className="flex items-center gap-2">
						<Switch id="qs-project-urgent" defaultChecked />
						<Label htmlFor="qs-project-urgent">Mark as urgent</Label>
					</div>
				</Field.Group>
			</Card.Content>
			<Card.Footer className="justify-end gap-2">
				<Button variant="ghost">Save draft</Button>
				<Button>Publish</Button>
			</Card.Footer>
		</Card.Root>
	);
}

/* -------------------------------------------------------------------------- */
/* Text inputs                                                                */
/* -------------------------------------------------------------------------- */
