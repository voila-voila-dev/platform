import { PlusIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "#/button/components/button.tsx";
import type { EmailEditorOfferBlock } from "#/email-block-editor/document/types.ts";
import { Input } from "#/input/components/input.tsx";

interface Props {
	block: EmailEditorOfferBlock;
	onChange: (block: EmailEditorOfferBlock) => void;
}

/** The editable list of an offer's included features. */
export function OfferFeatureSettings({ block, onChange }: Props) {
	return (
		<div className="flex flex-col gap-2">
			<span className="font-medium text-sm">Included features</span>
			{block.features.map((feature, index) => (
				<div key={index} className="flex items-center gap-2">
					<Input
						aria-label={`Included feature ${index + 1}`}
						value={feature}
						onChange={(event) =>
							onChange({
								...block,
								features: block.features.map((current, at) =>
									at === index ? event.target.value : current,
								),
							})
						}
						className="h-8"
					/>
					<Button
						variant="ghost"
						size="icon-sm"
						aria-label={`Remove feature ${index + 1}`}
						onClick={() =>
							onChange({
								...block,
								features: block.features.filter((_, at) => at !== index),
							})
						}
					>
						<XIcon aria-hidden />
					</Button>
				</div>
			))}
			<Button
				variant="outline"
				size="sm"
				onClick={() =>
					onChange({ ...block, features: [...block.features, ""] })
				}
			>
				<PlusIcon aria-hidden />
				Add a feature
			</Button>
		</div>
	);
}
