import { Combobox } from "@voila.dev/ui/combobox";

const roles = [
	"Designer",
	"Developer",
	"Copywriter",
	"Data analyst",
	"Consultant",
	"Illustrator",
];

export function Default() {
	return (
		<Combobox.Root items={roles}>
			<Combobox.Input placeholder="Select a role" className="w-64" />
			<Combobox.Content>
				<Combobox.Empty>No role found.</Combobox.Empty>
				<Combobox.List>
					{(role: string) => (
						<Combobox.Item key={role} value={role}>
							{role}
						</Combobox.Item>
					)}
				</Combobox.List>
			</Combobox.Content>
		</Combobox.Root>
	);
}
