import { Button } from "@voila.dev/ui/button";
import { DirectionProvider } from "@voila.dev/ui/direction";
import { DropdownMenu } from "@voila.dev/ui/dropdown-menu";

export function DirectionExample() {
	return (
		<DirectionProvider direction="rtl">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger render={<Button variant="outline" />}>
					القائمة
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Item>تعديل المهمة</DropdownMenu.Item>
					<DropdownMenu.Item>نسخ</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</DirectionProvider>
	);
}

/* -------------------------------------------------------------------------- */
/* Chat                                                                       */
/* -------------------------------------------------------------------------- */
