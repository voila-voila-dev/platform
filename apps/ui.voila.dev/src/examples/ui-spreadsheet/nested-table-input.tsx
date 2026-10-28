import { Input } from "@voila.dev/ui/input";
import { Spreadsheet } from "@voila.dev/ui/spreadsheet";
import { useState } from "react";

export function Nested() {
	const [tiers, setTiers] = useState([
		{ from: "10", discount: "5" },
		{ from: "50", discount: "10" },
	]);
	const updateTier = (index: number, patch: Partial<(typeof tiers)[number]>) =>
		setTiers((previous) =>
			previous.map((tier, i) => (i === index ? { ...tier, ...patch } : tier)),
		);
	return (
		<div className="w-full max-w-3xs">
			<Spreadsheet.NestedInput
				summary={`${tiers.length} tiers`}
				ariaLabel="Quantity discounts"
				title="Quantity discounts"
				description="A discount applies from its quantity upwards."
			>
				<Spreadsheet.Root>
					<Spreadsheet.Columns>
						<Spreadsheet.Column width={90} />
						<Spreadsheet.Column width={110} />
					</Spreadsheet.Columns>
					<Spreadsheet.Header>
						<tr>
							<Spreadsheet.Head>From</Spreadsheet.Head>
							<Spreadsheet.Head>Discount %</Spreadsheet.Head>
						</tr>
					</Spreadsheet.Header>
					<Spreadsheet.Body>
						{tiers.map((tier, index) => (
							<Spreadsheet.Row key={tier.from}>
								<Spreadsheet.Cell>
									<Input
										type="number"
										aria-label={`Tier ${index + 1} quantity`}
										value={tier.from}
										onChange={(event) =>
											updateTier(index, { from: event.target.value })
										}
									/>
								</Spreadsheet.Cell>
								<Spreadsheet.Cell>
									<Input
										type="number"
										aria-label={`Tier ${index + 1} discount`}
										value={tier.discount}
										onChange={(event) =>
											updateTier(index, { discount: event.target.value })
										}
									/>
								</Spreadsheet.Cell>
							</Spreadsheet.Row>
						))}
					</Spreadsheet.Body>
				</Spreadsheet.Root>
			</Spreadsheet.NestedInput>
		</div>
	);
}
