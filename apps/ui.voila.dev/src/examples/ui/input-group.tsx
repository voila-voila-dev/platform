import { CopyIcon, MagnifyingGlassIcon } from "@phosphor-icons/react";
import { InputGroup } from "@voila.dev/ui/input-group";

export function Default() {
	return (
		<div className="flex w-full max-w-80 flex-col gap-3">
			<InputGroup.Root>
				<InputGroup.Addon>
					<MagnifyingGlassIcon />
				</InputGroup.Addon>
				<InputGroup.Input placeholder="Search freelancers…" />
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Addon>
					<InputGroup.Text>https://</InputGroup.Text>
				</InputGroup.Addon>
				<InputGroup.Input placeholder="your-company.example" />
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Input
					readOnly
					defaultValue="https://acme.dev/invite/8f2a"
				/>
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button size="icon-xs" aria-label="Copy invite link">
						<CopyIcon />
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>
	);
}
