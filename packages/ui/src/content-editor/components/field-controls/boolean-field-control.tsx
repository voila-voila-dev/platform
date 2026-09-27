import type { FieldControlProps } from "#/content-editor/components/field-controls/field-control-props.ts";
import { Switch } from "#/switch/components/switch.tsx";

export function BooleanFieldControl({
	id,
	value,
	onChange,
}: FieldControlProps<"boolean">) {
	return <Switch id={id} checked={value} onCheckedChange={onChange} />;
}
