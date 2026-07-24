import { Badge } from "@voila.dev/ui/components/badge";
import { Button } from "@voila.dev/ui/components/button";
import { Input } from "@voila.dev/ui/components/input";
import { Label } from "@voila.dev/ui/components/label";
import type { CSSProperties } from "react";

/**
 * A live rebrand: the same markup twice, the second time inside a wrapper
 * that redefines a handful of token custom properties inline. Nothing else
 * changes; the components follow because they only ever read the semantic
 * names. This is exactly what an app-level override in globals.css does,
 * scoped to a div so both brands can sit side by side.
 */
const rebrand = {
	"--primary": "oklch(0.55 0.21 145)",
	"--primary-foreground": "oklch(0.99 0 0)",
	"--ring": "oklch(0.55 0.21 145)",
	"--radius": "0.25rem",
} as CSSProperties;

function SignupPanel({
	caption,
	id,
	style,
}: {
	caption: string;
	id: string;
	style?: CSSProperties;
}) {
	return (
		<div
			style={style}
			className="w-full max-w-xs rounded-xl border border-border bg-background p-5"
		>
			<p className="mb-4 text-muted-foreground text-xs">{caption}</p>
			<div className="mb-4 flex items-center justify-between">
				<span className="font-heading font-semibold text-foreground">
					Create your account
				</span>
				<Badge>Free plan</Badge>
			</div>
			<div className="grid gap-2">
				<Label htmlFor={`tokens-email-${id}`}>Email</Label>
				<Input
					id={`tokens-email-${id}`}
					type="email"
					placeholder="ada@example.com"
				/>
			</div>
			<div className="mt-4 grid gap-2">
				<Button className="w-full">Create account</Button>
				<Button variant="outline" className="w-full">
					Continue with SSO
				</Button>
			</div>
		</div>
	);
}

export function BrandSwap() {
	return (
		<>
			<SignupPanel id="before" caption="Default palette" />
			<SignupPanel id="after" caption="Four properties later" style={rebrand} />
		</>
	);
}
