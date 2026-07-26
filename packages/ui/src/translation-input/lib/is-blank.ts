/** Whether a locale holds nothing yet - missing, empty, or whitespace only. */
export function isBlank(text: string | undefined): boolean {
	return (text ?? "").trim().length === 0;
}
