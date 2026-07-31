import { MoneyInput } from "@voila.dev/ui/money-input";
import { useState } from "react";

export function Default() {
	const [value, setValue] = useState("120");
	return (
		<div className="w-full max-w-xs">
			<MoneyInput
				value={value}
				onValueChange={setValue}
				currency="USD"
				currencyLabel="Currency"
			/>
		</div>
	);
}
