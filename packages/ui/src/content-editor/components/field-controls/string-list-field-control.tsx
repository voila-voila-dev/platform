import { PlusIcon, XIcon } from "@phosphor-icons/react";
import { Button } from "#/button/components/button.tsx";
import type { FieldControlProps } from "#/content-editor/components/field-controls/field-control-props.ts";
import { useContentEditorLabels } from "#/content-editor/context/content-editor-context.tsx";
import { useFieldText } from "#/content-editor/hooks/use-field-text.ts";
import { Input } from "#/input/components/input.tsx";

/** One input per item, removed one by one, added at the end. */
export function StringListFieldControl({
	id,
	field,
	value,
	onChange,
}: FieldControlProps<"string-list">) {
	const { chrome } = useContentEditorLabels();
	const text = useFieldText();
	const replace = (index: number, item: string) =>
		onChange(value.map((current, at) => (at === index ? item : current)));
	return (
		<div id={id} className="flex flex-col gap-1.5">
			{value.map((item, index) => (
				// The position is the identity: items are plain strings and may repeat.
				<div key={index} className="flex items-center gap-1">
					<Input
						value={item}
						aria-label={`${text(field.label)} ${index + 1}`}
						placeholder={text(field.placeholder)}
						onChange={(event) => replace(index, event.target.value)}
					/>
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						aria-label={chrome.removeItem(index + 1)}
						onClick={() => onChange(value.filter((_, at) => at !== index))}
					>
						<XIcon aria-hidden />
					</Button>
				</div>
			))}
			<Button
				type="button"
				variant="outline"
				size="sm"
				className="self-start"
				onClick={() => onChange([...value, ""])}
			>
				<PlusIcon aria-hidden />
				{chrome.addItem}
			</Button>
		</div>
	);
}
