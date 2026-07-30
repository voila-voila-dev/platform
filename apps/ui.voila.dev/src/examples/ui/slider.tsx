import { Slider } from "@voila.dev/ui/slider";

export function SliderExample() {
	return (
		<div className="flex w-full max-w-72 flex-col gap-6">
			<Slider.Root defaultValue={50} />
			<div className="space-y-2">
				<p className="font-medium text-sm">Hourly rate (USD)</p>
				<Slider.Root defaultValue={[35, 65]} min={20} max={100} />
			</div>
		</div>
	);
}
