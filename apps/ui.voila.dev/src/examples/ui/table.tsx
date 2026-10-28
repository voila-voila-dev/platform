import { Table } from "@voila.dev/ui/table";
import { projects } from "./fixtures";

export function Default() {
	return (
		<Table.Root>
			<Table.Caption>Recent projects for your workspace.</Table.Caption>
			<Table.Header>
				<Table.Row>
					<Table.Head>Reference</Table.Head>
					<Table.Head>Client</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head className="text-right">Amount</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{projects.map((project) => (
					<Table.Row key={project.reference}>
						<Table.Cell className="font-medium">{project.reference}</Table.Cell>
						<Table.Cell>{project.client}</Table.Cell>
						<Table.Cell>{project.status}</Table.Cell>
						<Table.Cell className="text-right">{project.amount}</Table.Cell>
					</Table.Row>
				))}
			</Table.Body>
			<Table.Footer>
				<Table.Row>
					<Table.Cell colSpan={3}>Total</Table.Cell>
					<Table.Cell className="text-right">570.00 USD</Table.Cell>
				</Table.Row>
			</Table.Footer>
		</Table.Root>
	);
}
