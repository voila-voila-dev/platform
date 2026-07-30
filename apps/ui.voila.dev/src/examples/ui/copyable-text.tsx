import { CopyableText } from "@voila.dev/ui/copyable-text";

export function CopyableTextExample() {
	return (
		<div className="flex flex-col gap-2">
			<CopyableText value="camille@example.com" />
			<CopyableText value="+33690972105" muted />
			<CopyableText
				value="019f7557-04dd-7000-b488-d3f9a2647960"
				label="019f7557"
				className="text-xs"
			/>
		</div>
	);
}
