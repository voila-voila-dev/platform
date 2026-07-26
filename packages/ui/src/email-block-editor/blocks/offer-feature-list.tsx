import { CheckIcon } from "@phosphor-icons/react";
import { EMAIL_COLOR } from "#/email-block-editor/theme.ts";

interface Props {
	features: ReadonlyArray<string>;
}

/** The ticked included features, mirroring the bulleted list the renderer
 * emits for them. */
export function OfferFeatureList({ features }: Props) {
	if (features.length === 0) {
		return null;
	}
	return (
		<ul className="flex list-none flex-col gap-1 p-0">
			{features.map((feature, index) => (
				<li
					key={index}
					className="flex items-start gap-2 text-[14px] leading-[1.5]"
					style={{ color: EMAIL_COLOR.ink }}
				>
					<CheckIcon
						size={16}
						aria-hidden
						style={{ color: EMAIL_COLOR.brand, marginTop: 3 }}
					/>
					{feature}
				</li>
			))}
		</ul>
	);
}
