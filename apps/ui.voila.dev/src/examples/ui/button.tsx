import { ArrowRightIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { Button } from "@voila.dev/ui/button";

export function Default() {
	return <Button>Save changes</Button>;
}

export function ConfirmDestructive() {
	return (
		<>
			<Button variant="outline">Cancel</Button>
			<Button variant="destructive">
				<TrashIcon /> Delete project
			</Button>
		</>
	);
}

export function IconSizes() {
	return (
		<>
			<Button size="icon-xs" aria-label="Add">
				<PlusIcon />
			</Button>
			<Button size="icon-sm" aria-label="Add">
				<PlusIcon />
			</Button>
			<Button size="icon" aria-label="Add">
				<PlusIcon />
			</Button>
			<Button size="icon-lg" aria-label="Add">
				<PlusIcon />
			</Button>
		</>
	);
}

export function Loading() {
	return (
		<>
			<Button loading>Saving…</Button>
			<Button variant="outline" loading>
				Uploading
			</Button>
			<Button variant="destructive" loading>
				Deleting
			</Button>
		</>
	);
}

export function AsAnchor() {
	return (
		<>
			<Button render={<a href="https://ui.voila.dev">Read the docs</a>} />
			<Button
				variant="outline"
				render={
					<a href="https://ui.voila.dev">
						With an icon <ArrowRightIcon />
					</a>
				}
			/>
		</>
	);
}
