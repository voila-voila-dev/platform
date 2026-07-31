import { NativeSelect } from "@voila.dev/ui/native-select";

export function Default() {
	return (
		<NativeSelect.Root defaultValue="branding" className="w-56">
			<NativeSelect.OptGroup label="Creative work">
				<NativeSelect.Option value="branding">Branding</NativeSelect.Option>
				<NativeSelect.Option value="illustration">
					Illustration
				</NativeSelect.Option>
			</NativeSelect.OptGroup>
			<NativeSelect.OptGroup label="Technical work">
				<NativeSelect.Option value="frontend">Frontend</NativeSelect.Option>
				<NativeSelect.Option value="data">Data analysis</NativeSelect.Option>
			</NativeSelect.OptGroup>
		</NativeSelect.Root>
	);
}
