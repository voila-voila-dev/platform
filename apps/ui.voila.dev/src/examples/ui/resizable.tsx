import { Resizable } from "@voila.dev/ui/resizable";

export function ResizableExample() {
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
