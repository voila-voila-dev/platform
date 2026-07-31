import { Resizable } from "@voila.dev/ui/resizable";

function Pane({ label }: { label: string }) {
	return (
		<div className="flex h-full items-center justify-center p-6">
			<span className="font-medium text-sm">{label}</span>
		</div>
	);
}

export function Default() {
	return (
		<div className="h-48 w-full max-w-xl">
			<Resizable.PanelGroup className="rounded-lg border">
				<Resizable.Panel defaultSize={50}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="font-medium text-sm">Project list</span>
					</div>
				</Resizable.Panel>
				<Resizable.Handle withHandle />
				<Resizable.Panel defaultSize={50}>
					<div className="flex h-full items-center justify-center p-6">
						<span className="font-medium text-sm">Project details</span>
					</div>
				</Resizable.Panel>
			</Resizable.PanelGroup>
		</div>
	);
}

export function Vertical() {
	return (
		<div className="h-56 w-full max-w-xl">
			<Resizable.PanelGroup
				orientation="vertical"
				className="rounded-lg border"
			>
				<Resizable.Panel defaultSize={60} minSize={20}>
					<Pane label="Editor" />
				</Resizable.Panel>
				<Resizable.Handle withHandle />
				<Resizable.Panel defaultSize={40} collapsible collapsedSize={0}>
					<Pane label="Drag me shut" />
				</Resizable.Panel>
			</Resizable.PanelGroup>
		</div>
	);
}
