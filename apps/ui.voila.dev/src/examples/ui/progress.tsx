import { Progress } from "@voila.dev/ui/progress";

export function ProgressDefault() {
	return (
		<div className="flex w-full flex-col gap-6">
			<Progress.Root value={35}>
				<Progress.Label>Profile completion</Progress.Label>
				<Progress.Value />
			</Progress.Root>
			<Progress.Root value={null}>
				<Progress.Label>Uploading…</Progress.Label>
			</Progress.Root>
			<Progress.Root value={1200} max={2000}>
				<Progress.Label>Storage used</Progress.Label>
				<Progress.Value>{(_, value) => `${value} / 2000 MB`}</Progress.Value>
			</Progress.Root>
		</div>
	);
}
