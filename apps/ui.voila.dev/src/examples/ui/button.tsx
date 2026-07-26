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

export function Variants() {
	return (
		<>
			<Button variant="default">Default</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="destructive">Destructive</Button>
			<Button variant="link">Link</Button>
		</>
	);
}

export function SurfaceVariants() {
	return (
		<>
			<Button variant="brand">Freelancer</Button>
			<Button variant="highlight">Client</Button>
		</>
	);
}

export function Sizes() {
	return (
		<>
			<Button size="xs">Extra small</Button>
			<Button size="sm">Small</Button>
			<Button size="default">Default</Button>
			<Button size="lg">Large</Button>
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

export function WithIcons() {
	return (
		<>
			<Button>
				<PlusIcon /> New project
			</Button>
			<Button variant="outline">
				Continue <ArrowRightIcon />
			</Button>
			<Button variant="destructive">
				<TrashIcon /> Delete
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

export function Disabled() {
	return (
		<>
			<Button disabled>Default</Button>
			<Button variant="secondary" disabled>
				Secondary
			</Button>
			<Button variant="outline" disabled>
				Outline
			</Button>
		</>
	);
}

export function Shapes() {
	return (
		<>
			<Button shape="pill">Get started</Button>
			<Button shape="pill" variant="outline">
				Learn more
			</Button>
			<Button shape="pill" size="lg">
				Book a demo
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
