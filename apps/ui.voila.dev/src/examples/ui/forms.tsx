import { CopyIcon, MagnifyingGlassIcon, StarIcon } from "@phosphor-icons/react";
import type { BadgeColor } from "@voila.dev/ui/badge";
import { Button } from "@voila.dev/ui/button";
import { Calendar } from "@voila.dev/ui/calendar";
import { Card } from "@voila.dev/ui/card";
import { Checkbox } from "@voila.dev/ui/checkbox";
import { CheckboxGroup } from "@voila.dev/ui/checkbox-group";
import { ColorPicker } from "@voila.dev/ui/color-picker";
import { Combobox } from "@voila.dev/ui/combobox";
import { DatePicker } from "@voila.dev/ui/date-picker";
import { DateTimePicker } from "@voila.dev/ui/date-time-picker";
import { Field } from "@voila.dev/ui/field";
import {
	businessIdMask,
	FormattedInput,
	idNumberMask,
	phoneMask,
} from "@voila.dev/ui/formatted-input";
import { IconPicker } from "@voila.dev/ui/icon-picker";
import { ImageUploadField } from "@voila.dev/ui/image-upload-field";
import { Input } from "@voila.dev/ui/input";
import { InputGroup } from "@voila.dev/ui/input-group";
import { InputOTP } from "@voila.dev/ui/input-otp";
import { Label } from "@voila.dev/ui/label";
import { MoneyInput } from "@voila.dev/ui/money-input";
import { NativeDatePicker } from "@voila.dev/ui/native-date-picker";
import { NativeSelect } from "@voila.dev/ui/native-select";
import { RadioGroup } from "@voila.dev/ui/radio-group";
import { Rating } from "@voila.dev/ui/rating";
import { ResponsiveSelect } from "@voila.dev/ui/responsive-select";
import { SegmentedControl } from "@voila.dev/ui/segmented-control";
import { Select } from "@voila.dev/ui/select";
import { Slider } from "@voila.dev/ui/slider";
import { Stepper } from "@voila.dev/ui/stepper";
import { Switch } from "@voila.dev/ui/switch";
import { Textarea } from "@voila.dev/ui/textarea";
import { TimePicker } from "@voila.dev/ui/time-picker";
import { Toggle } from "@voila.dev/ui/toggle";
import { ToggleGroup } from "@voila.dev/ui/toggle-group";
import { TranslationInput } from "@voila.dev/ui/translation-input";
import { useState } from "react";

/* -------------------------------------------------------------------------- */
/* Quick-start hero                                                           */
/* -------------------------------------------------------------------------- */

export function QuickStartHero() {
	const [date, setDate] = useState<Date | null>(new Date(2026, 5, 20));
	return (
		<Card.Root className="w-full max-w-md">
			<Card.Header>
				<Card.Title>Publish a project</Card.Title>
				<Card.Description>
					Freelancers matching the role are notified when it goes live.
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<Field.Group>
					<Field.Root>
						<Field.Label htmlFor="qs-project-title">Title</Field.Label>
						<Input
							id="qs-project-title"
							defaultValue="Product designer — launch week"
						/>
					</Field.Root>
					<div className="grid grid-cols-2 gap-4">
						<Field.Root>
							<Field.Label>Role</Field.Label>
							<Select.Root defaultValue="designer">
								<Select.Trigger className="w-full">
									<Select.Value />
								</Select.Trigger>
								<Select.Content>
									<Select.Item value="designer">Designer</Select.Item>
									<Select.Item value="developer">Developer</Select.Item>
									<Select.Item value="writer">Copywriter</Select.Item>
								</Select.Content>
							</Select.Root>
						</Field.Root>
						<Field.Root>
							<Field.Label>Date</Field.Label>
							<DatePicker.Root
								value={date}
								onValueChange={setDate}
								placeholder="Project date"
								calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
							/>
						</Field.Root>
					</div>
					<div className="flex items-center gap-2">
						<Switch id="qs-project-urgent" defaultChecked />
						<Label htmlFor="qs-project-urgent">Mark as urgent</Label>
					</div>
				</Field.Group>
			</Card.Content>
			<Card.Footer className="justify-end gap-2">
				<Button variant="ghost">Save draft</Button>
				<Button>Publish</Button>
			</Card.Footer>
		</Card.Root>
	);
}

/* -------------------------------------------------------------------------- */
/* Text inputs                                                                */
/* -------------------------------------------------------------------------- */

export function InputExample() {
	return (
		<div className="flex w-full max-w-72 flex-col gap-3">
			<Input placeholder="Search freelancers" />
			<Input type="email" defaultValue="not-an-email" aria-invalid />
			<Input readOnly defaultValue="INV-2026-00421" />
			<Input disabled placeholder="Project location" />
		</div>
	);
}

export function TextareaExample() {
	return (
		<Textarea
			className="w-full max-w-96"
			defaultValue="On-site design support for the launch week. Join the kickoff call one hour before the demo for briefing and final checks."
		/>
	);
}

export function LabelExample() {
	return (
		<div className="grid w-full max-w-72 gap-2">
			<Label htmlFor="workspace-email">Workspace email</Label>
			<Input id="workspace-email" type="email" placeholder="team@example.com" />
		</div>
	);
}

export function FieldExample() {
	return (
		<div className="w-full max-w-96">
			<Field.Group>
				<Field.Root>
					<Field.Label htmlFor="workspace-name">Company name</Field.Label>
					<Input id="workspace-name" placeholder="Northwind Trading Co." />
					<Field.Description>
						Shown to freelancers on every project you publish.
					</Field.Description>
				</Field.Root>
				<Field.Root data-invalid>
					<Field.Label htmlFor="contact-email">Contact email</Field.Label>
					<Input
						id="contact-email"
						type="email"
						defaultValue="staff@"
						aria-invalid
					/>
					<Field.Error>Enter a complete email address.</Field.Error>
				</Field.Root>
				<Field.Separator>Optional</Field.Separator>
				<Field.Root>
					<Field.Label htmlFor="project-notes">Project notes</Field.Label>
					<Textarea
						id="project-notes"
						placeholder="Access instructions, credentials, tooling…"
					/>
				</Field.Root>
			</Field.Group>
		</div>
	);
}

export function InputGroupExample() {
	return (
		<div className="flex w-full max-w-80 flex-col gap-3">
			<InputGroup.Root>
				<InputGroup.Addon>
					<MagnifyingGlassIcon />
				</InputGroup.Addon>
				<InputGroup.Input placeholder="Search freelancers…" />
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Addon>
					<InputGroup.Text>https://</InputGroup.Text>
				</InputGroup.Addon>
				<InputGroup.Input placeholder="your-company.example" />
			</InputGroup.Root>
			<InputGroup.Root>
				<InputGroup.Input
					readOnly
					defaultValue="https://acme.dev/invite/8f2a"
				/>
				<InputGroup.Addon align="inline-end">
					<InputGroup.Button size="icon-xs" aria-label="Copy invite link">
						<CopyIcon />
					</InputGroup.Button>
				</InputGroup.Addon>
			</InputGroup.Root>
		</div>
	);
}

export function InputOTPExample() {
	return (
		<InputOTP.Root maxLength={6}>
			<InputOTP.Group>
				<InputOTP.Slot index={0} />
				<InputOTP.Slot index={1} />
				<InputOTP.Slot index={2} />
			</InputOTP.Group>
			<InputOTP.Separator />
			<InputOTP.Group>
				<InputOTP.Slot index={3} />
				<InputOTP.Slot index={4} />
				<InputOTP.Slot index={5} />
			</InputOTP.Group>
		</InputOTP.Root>
	);
}

export function FormattedInputExample() {
	return (
		<div className="flex w-full max-w-72 flex-col gap-3">
			<FormattedInput mask={businessIdMask} placeholder="123 456 789 00012" />
			<FormattedInput mask={idNumberMask} defaultValue="10003456789" />
			<FormattedInput mask={phoneMask} defaultValue="0612345678" />
		</div>
	);
}

export function MoneyInputExample() {
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

export function TranslationInputExample() {
	const [value, setValue] = useState<Record<string, string>>({
		"fr-FR": "Refonte de la page d'accueil",
		"en-GB": "",
	});
	const [locale, setLocale] = useState("fr-FR");
	return (
		<div className="w-full max-w-sm">
			<TranslationInput
				value={value}
				onValueChange={setValue}
				locale={locale}
				locales={["fr-FR", "en-GB"]}
				onLocaleChange={setLocale}
				localeLabel="Language"
				localeCodes={{ "fr-FR": "FR", "en-GB": "EN" }}
			/>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Choice                                                                     */
/* -------------------------------------------------------------------------- */

export function CheckboxExample() {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-start gap-3">
				<Checkbox id="project-terms" />
				<div className="grid gap-1 text-sm">
					<Label htmlFor="project-terms">Accept project terms</Label>
					<p className="text-muted-foreground">
						You confirm your availability for the full duration.
					</p>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<Checkbox id="project-notifications" defaultChecked />
				<Label htmlFor="project-notifications">Notify me about projects</Label>
			</div>
			<div className="flex items-center gap-3">
				<Checkbox id="project-partial" indeterminate />
				<Label htmlFor="project-partial">Some skills selected</Label>
			</div>
		</div>
	);
}

const skills = [
	{ name: "design", label: "Design" },
	{ name: "development", label: "Development" },
	{ name: "copywriting", label: "Copywriting" },
];

export function CheckboxGroupExample() {
	return (
		<CheckboxGroup defaultValue={["design"]} className="w-full max-w-64">
			{skills.map((skill) => (
				<div key={skill.name} className="flex items-center gap-2">
					<Checkbox name={skill.name} id={`skills-${skill.name}`} />
					<Label htmlFor={`skills-${skill.name}`}>{skill.label}</Label>
				</div>
			))}
		</CheckboxGroup>
	);
}

export function RadioGroupExample() {
	return (
		<RadioGroup.Root defaultValue="designer" className="w-full max-w-64">
			{[
				{ value: "designer", label: "Designer" },
				{ value: "developer", label: "Developer" },
				{ value: "writer", label: "Copywriter" },
			].map((option) => (
				<div key={option.value} className="flex items-center gap-2">
					<RadioGroup.Item value={option.value} id={`role-${option.value}`} />
					<Label htmlFor={`role-${option.value}`}>{option.label}</Label>
				</div>
			))}
		</RadioGroup.Root>
	);
}

export function SwitchExample() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2">
				<Switch id="notify-projects" defaultChecked />
				<Label htmlFor="notify-projects">Notify me about new projects</Label>
			</div>
			<div className="flex items-center gap-4">
				<Switch size="sm" defaultChecked />
				<Switch defaultChecked />
				<Switch disabled />
			</div>
		</div>
	);
}

export function SelectExample() {
	return (
		<Select.Root>
			<Select.Trigger className="w-56">
				<Select.Value placeholder="Select a role" />
			</Select.Trigger>
			<Select.Content>
				<Select.Group>
					<Select.Label>Creative</Select.Label>
					<Select.Item value="designer">Designer</Select.Item>
					<Select.Item value="writer">Copywriter</Select.Item>
				</Select.Group>
				<Select.Group>
					<Select.Label>Technical</Select.Label>
					<Select.Item value="developer">Developer</Select.Item>
					<Select.Item value="data-analyst">Data analyst</Select.Item>
				</Select.Group>
			</Select.Content>
		</Select.Root>
	);
}

export function NativeSelectExample() {
	return (
		<NativeSelect.Root defaultValue="branding" className="w-56">
			<NativeSelect.OptGroup label="Creative work">
				<NativeSelect.Option value="branding">Branding</NativeSelect.Option>
				<NativeSelect.Option value="illustration">
					Illustration
				</NativeSelect.Option>
			</NativeSelect.OptGroup>
			<NativeSelect.OptGroup label="Technical work">
				<NativeSelect.Option value="frontend">Frontend</NativeSelect.Option>
				<NativeSelect.Option value="data">Data analysis</NativeSelect.Option>
			</NativeSelect.OptGroup>
		</NativeSelect.Root>
	);
}

export function ResponsiveSelectExample() {
	const [value, setValue] = useState("designer");
	return (
		<div className="w-full max-w-72">
			<ResponsiveSelect.Root value={value} onValueChange={setValue}>
				<ResponsiveSelect.Trigger className="w-full">
					<ResponsiveSelect.Value placeholder="Select a role" />
				</ResponsiveSelect.Trigger>
				<ResponsiveSelect.Content>
					<ResponsiveSelect.Item value="designer">
						Designer
					</ResponsiveSelect.Item>
					<ResponsiveSelect.Item value="developer">
						Developer
					</ResponsiveSelect.Item>
					<ResponsiveSelect.Item value="writer">
						Copywriter
					</ResponsiveSelect.Item>
				</ResponsiveSelect.Content>
			</ResponsiveSelect.Root>
		</div>
	);
}

const roles = [
	"Designer",
	"Developer",
	"Copywriter",
	"Data analyst",
	"Consultant",
	"Illustrator",
];

export function ComboboxExample() {
	return (
		<Combobox.Root items={roles}>
			<Combobox.Input placeholder="Select a role" className="w-64" />
			<Combobox.Content>
				<Combobox.Empty>No role found.</Combobox.Empty>
				<Combobox.List>
					{(role: string) => (
						<Combobox.Item key={role} value={role}>
							{role}
						</Combobox.Item>
					)}
				</Combobox.List>
			</Combobox.Content>
		</Combobox.Root>
	);
}

export function SliderExample() {
	return (
		<div className="flex w-full max-w-72 flex-col gap-6">
			<Slider.Root defaultValue={50} />
			<div className="space-y-2">
				<p className="font-medium text-sm">Hourly rate (USD)</p>
				<Slider.Root defaultValue={[35, 65]} min={20} max={100} />
			</div>
		</div>
	);
}

export function ToggleExample() {
	return (
		<>
			<Toggle aria-label="Mark freelancer as favorite">
				<StarIcon
					data-icon="inline-start"
					className="group-data-pressed/toggle:hidden"
				/>
				<StarIcon
					data-icon="inline-start"
					weight="fill"
					className="hidden group-data-pressed/toggle:inline"
				/>
				Favorite
			</Toggle>
			<Toggle variant="outline" defaultPressed>
				Outline
			</Toggle>
		</>
	);
}

export function ToggleGroupExample() {
	return (
		<div className="flex flex-col gap-4">
			<ToggleGroup.Root defaultValue={["week"]} variant="outline">
				<ToggleGroup.Item value="day">Day</ToggleGroup.Item>
				<ToggleGroup.Item value="week">Week</ToggleGroup.Item>
				<ToggleGroup.Item value="month">Month</ToggleGroup.Item>
			</ToggleGroup.Root>
			<ToggleGroup.Root
				multiple
				defaultValue={["designer", "writer"]}
				variant="outline"
			>
				<ToggleGroup.Item value="designer">Designer</ToggleGroup.Item>
				<ToggleGroup.Item value="developer">Developer</ToggleGroup.Item>
				<ToggleGroup.Item value="writer">Copywriter</ToggleGroup.Item>
			</ToggleGroup.Root>
		</div>
	);
}

export function SegmentedControlExample() {
	return (
		<div className="flex flex-col items-start gap-4">
			<SegmentedControl.Root defaultValue="week" size="sm">
				<SegmentedControl.Item value="day">Day</SegmentedControl.Item>
				<SegmentedControl.Item value="week">Week</SegmentedControl.Item>
				<SegmentedControl.Item value="month">Month</SegmentedControl.Item>
			</SegmentedControl.Root>
			<SegmentedControl.Root defaultValue="week">
				<SegmentedControl.Item value="day">Day</SegmentedControl.Item>
				<SegmentedControl.Item value="week">Week</SegmentedControl.Item>
				<SegmentedControl.Item value="month">Month</SegmentedControl.Item>
			</SegmentedControl.Root>
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Pickers                                                                    */
/* -------------------------------------------------------------------------- */

export function ColorPickerExample() {
	const [color, setColor] = useState<BadgeColor | null>("emerald");
	return (
		<div className="w-full max-w-56">
			<ColorPicker value={color} onValueChange={setColor} />
		</div>
	);
}

export function IconPickerExample() {
	const [iconName, setIconName] = useState<string | null>("PaletteIcon");
	return (
		<div className="w-full max-w-64">
			<IconPicker
				value={iconName}
				onValueChange={setIconName}
				placeholder="Pick a category icon"
			/>
		</div>
	);
}

export function RatingExample() {
	return (
		<div className="flex flex-col items-start gap-4">
			<Rating.Root value={4} count={128} />
			<Rating.Root value={3.6} size="lg" />
			<ControlledRatingInput />
		</div>
	);
}

function ControlledRatingInput() {
	const [value, setValue] = useState(3);
	return <Rating.Input value={value} onChange={setValue} />;
}

export function CalendarExample() {
	const [selected, setSelected] = useState<Date | undefined>(
		new Date(2026, 5, 20),
	);
	return (
		<Calendar.Root
			mode="single"
			selected={selected}
			onSelect={setSelected}
			defaultMonth={new Date(2026, 5, 20)}
			className="rounded-lg border"
		/>
	);
}

export function DatePickerExample() {
	const [date, setDate] = useState<Date | null>(new Date(2026, 5, 20));
	return (
		<DatePicker.Root
			value={date}
			onValueChange={setDate}
			placeholder="Project date"
			calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
		/>
	);
}

export function DateTimePickerExample() {
	const [value, setValue] = useState<Date | null>(new Date(2026, 5, 20, 9, 30));
	return (
		<DateTimePicker.Root
			value={value}
			onValueChange={setValue}
			placeholder="Project start"
			calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
		/>
	);
}

export function TimePickerExample() {
	const [time, setTime] = useState<string | null>("14:30");
	return (
		<TimePicker value={time} onValueChange={setTime} placeholder="Start time" />
	);
}

export function NativeDatePickerExample() {
	return (
		<div className="flex flex-col gap-3">
			<NativeDatePicker.Date defaultValue="2026-06-20" />
			<NativeDatePicker.Time defaultValue="14:30" />
			<NativeDatePicker.DateTime defaultValue="2026-06-20T14:30" />
		</div>
	);
}

/* -------------------------------------------------------------------------- */
/* Media and progress                                                         */
/* -------------------------------------------------------------------------- */

export function ImageUploadFieldExample() {
	return (
		<ImageUploadField
			className="w-full max-w-sm"
			value="https://github.com/shadcn.png"
			onFileCropped={() => {}}
			onRemove={() => {}}
		/>
	);
}

const onboardingSteps = [
	{ step: 1, title: "Profile" },
	{ step: 2, title: "Availability" },
	{ step: 3, title: "Review" },
];

export function StepperExample() {
	return (
		<Stepper.Root value={2} className="w-full max-w-xl">
			{onboardingSteps.map(({ step, title }) => (
				<Stepper.Item key={step} step={step}>
					<Stepper.Indicator />
					<Stepper.Title>{title}</Stepper.Title>
					{step < onboardingSteps.length ? <Stepper.Separator /> : null}
				</Stepper.Item>
			))}
		</Stepper.Root>
	);
}
