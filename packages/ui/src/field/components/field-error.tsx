import { useMemo } from "react";
import { cn } from "#/lib/utils.ts";

interface Props extends React.ComponentProps<"div"> {
	errors?: Array<{ message?: string } | undefined>;
}

export function FieldError({ className, children, errors, ...props }: Props) {
	const content = useMemo(() => {
		if (children) {
			return children;
		}

		if (!errors?.length) {
			return null;
		}

		const uniqueErrors = [
			...new Map(errors.map((error) => [error?.message, error])).values(),
		];

		if (uniqueErrors?.length === 1) {
			return uniqueErrors[0]?.message;
		}

		return (
			<ul className="ml-4 flex list-disc flex-col gap-1">
				{uniqueErrors.map(
					(error) =>
						error?.message && <li key={error.message}>{error.message}</li>,
				)}
			</ul>
		);
	}, [children, errors]);

	if (!content) {
		return null;
	}

	return (
		<div
			role="alert"
			data-slot="field-error"
			className={cn(
				"text-sm font-normal text-destructive",
				"animate-in fade-in slide-in-from-top-1 motion-reduce:animate-none",
				className,
			)}
			{...props}
		>
			{content}
		</div>
	);
}
