import { CopyIcon, MagnifyingGlassIcon, StarIcon } from "@phosphor-icons/react";
import type { BadgeColor } from "@voila.dev/ui/components/badge";
import { Button } from "@voila.dev/ui/components/button";
import { Calendar } from "@voila.dev/ui/components/calendar";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@voila.dev/ui/components/card";
import { Checkbox } from "@voila.dev/ui/components/checkbox";
import { CheckboxGroup } from "@voila.dev/ui/components/checkbox-group";
import { ColorPicker } from "@voila.dev/ui/components/color-picker";
import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@voila.dev/ui/components/combobox";
import { DatePicker } from "@voila.dev/ui/components/date-picker";
import { DateTimePicker } from "@voila.dev/ui/components/date-time-picker";
import {
	Field,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldSeparator,
} from "@voila.dev/ui/components/field";
import {
	businessIdMask,
	FormattedInput,
	idNumberMask,
	phoneMask,
} from "@voila.dev/ui/components/formatted-input";
import { IconPicker } from "@voila.dev/ui/components/icon-picker";
import { ImageUploadField } from "@voila.dev/ui/components/image-upload-field";
import { Input } from "@voila.dev/ui/components/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
} from "@voila.dev/ui/components/input-group";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "@voila.dev/ui/components/input-otp";
import { Label } from "@voila.dev/ui/components/label";
import { MoneyInput } from "@voila.dev/ui/components/money-input";
import {
	NativeDatePicker,
	NativeDateTimePicker,
	NativeTimePicker,
} from "@voila.dev/ui/components/native-date-picker";
import {
	NativeSelect,
	NativeSelectOptGroup,
	NativeSelectOption,
} from "@voila.dev/ui/components/native-select";
import {
	RadioGroup,
	RadioGroupItem,
} from "@voila.dev/ui/components/radio-group";
import { Rating, RatingInput } from "@voila.dev/ui/components/rating";
import { ResponsiveSelect } from "@voila.dev/ui/components/responsive-select";
import {
	SegmentedControl,
	SegmentedControlItem,
} from "@voila.dev/ui/components/segmented-control";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "@voila.dev/ui/components/select";
import { Slider } from "@voila.dev/ui/components/slider";
import {
	Stepper,
	StepperIndicator,
	StepperItem,
	StepperSeparator,
	StepperTitle,
} from "@voila.dev/ui/components/stepper";
import { Switch } from "@voila.dev/ui/components/switch";
import { Textarea } from "@voila.dev/ui/components/textarea";
import { TimePicker } from "@voila.dev/ui/components/time-picker";
import { Toggle } from "@voila.dev/ui/components/toggle";
import {
	ToggleGroup,
	ToggleGroupItem,
} from "@voila.dev/ui/components/toggle-group";
import { TranslationInput } from "@voila.dev/ui/components/translation-input";
import { useState } from "react";

/* -------------------------------------------------------------------------- */
/* Quick-start hero                                                           */
/* -------------------------------------------------------------------------- */

export function QuickStartHero() {
	const [date, setDate] = useState<Date | null>(new Date(2026, 5, 20));
	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Publish a project</CardTitle>
				<CardDescription>
					Freelancers matching the role are notified when it goes live.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<FieldGroup>
					<Field>
						<FieldLabel htmlFor="qs-project-title">Title</FieldLabel>
						<Input
							id="qs-project-title"
							defaultValue="Product designer — launch week"
						/>
					</Field>
					<div className="grid grid-cols-2 gap-4">
						<Field>
							<FieldLabel>Role</FieldLabel>
							<Select defaultValue="designer">
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="designer">Designer</SelectItem>
									<SelectItem value="developer">Developer</SelectItem>
									<SelectItem value="writer">Copywriter</SelectItem>
								</SelectContent>
							</Select>
						</Field>
						<Field>
							<FieldLabel>Date</FieldLabel>
							<DatePicker
								value={date}
								onValueChange={setDate}
								placeholder="Project date"
								calendarProps={{ defaultMonth: new Date(2026, 5, 1) }}
							/>
						</Field>
					</div>
					<div className="flex items-center gap-2">
						<Switch id="qs-project-urgent" defaultChecked />
						<Label htmlFor="qs-project-urgent">Mark as urgent</Label>
					</div>
				</FieldGroup>
			</CardContent>
			<CardFooter className="justify-end gap-2">
				<Button variant="ghost">Save draft</Button>
				<Button>Publish</Button>
			</CardFooter>
		</Card>
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
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor="workspace-name">Company name</FieldLabel>
					<Input id="workspace-name" placeholder="Northwind Trading Co." />
					<FieldDescription>
						Shown to freelancers on every project you publish.
					</FieldDescription>
				</Field>
				<Field data-invalid>
					<FieldLabel htmlFor="contact-email">Contact email</FieldLabel>
					<Input
						id="contact-email"
						type="email"
						defaultValue="staff@"
						aria-invalid
					/>
					<FieldError>Enter a complete email address.</FieldError>
				</Field>
				<FieldSeparator>Optional</FieldSeparator>
				<Field>
					<FieldLabel htmlFor="project-notes">Project notes</FieldLabel>
					<Textarea
						id="project-notes"
						placeholder="Access instructions, credentials, tooling…"
					/>
				</Field>
			</FieldGroup>
		</div>
	);
}

export function InputGroupExample() {
	return (
		<div className="flex w-full max-w-80 flex-col gap-3">
			<InputGroup>
				<InputGroupAddon>
					<MagnifyingGlassIcon />
				</InputGroupAddon>
				<InputGroupInput placeholder="Search freelancers…" />
			</InputGroup>
			<InputGroup>
				<InputGroupAddon>
					<InputGroupText>https://</InputGroupText>
				</InputGroupAddon>
				<InputGroupInput placeholder="your-company.example" />
			</InputGroup>
			<InputGroup>
				<InputGroupInput readOnly defaultValue="https://acme.dev/invite/8f2a" />
				<InputGroupAddon align="inline-end">
					<InputGroupButton size="icon-xs" aria-label="Copy invite link">
						<CopyIcon />
					</InputGroupButton>
				</InputGroupAddon>
			</InputGroup>
		</div>
	);
}

export function InputOTPExample() {
	return (
		<InputOTP maxLength={6}>
			<InputOTPGroup>
				<InputOTPSlot index={0} />
				<InputOTPSlot index={1} />
				<InputOTPSlot index={2} />
			</InputOTPGroup>
			<InputOTPSeparator />
			<InputOTPGroup>
				<InputOTPSlot index={3} />
				<InputOTPSlot index={4} />
				<InputOTPSlot index={5} />
			</InputOTPGroup>
		</InputOTP>
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
		<RadioGroup defaultValue="designer" className="w-full max-w-64">
			{[
				{ value: "designer", label: "Designer" },
				{ value: "developer", label: "Developer" },
				{ value: "writer", label: "Copywriter" },
			].map((option) => (
				<div key={option.value} className="flex items-center gap-2">
					<RadioGroupItem value={option.value} id={`role-${option.value}`} />
					<Label htmlFor={`role-${option.value}`}>{option.label}</Label>
				</div>
			))}
		</RadioGroup>
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
		<Select>
			<SelectTrigger className="w-56">
				<SelectValue placeholder="Select a role" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Creative</SelectLabel>
					<SelectItem value="designer">Designer</SelectItem>
					<SelectItem value="writer">Copywriter</SelectItem>
				</SelectGroup>
				<SelectGroup>
					<SelectLabel>Technical</SelectLabel>
					<SelectItem value="developer">Developer</SelectItem>
					<SelectItem value="data-analyst">Data analyst</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}

export function NativeSelectExample() {
	return (
		<NativeSelect defaultValue="branding" className="w-56">
			<NativeSelectOptGroup label="Creative work">
				<NativeSelectOption value="branding">Branding</NativeSelectOption>
				<NativeSelectOption value="illustration">
					Illustration
				</NativeSelectOption>
			</NativeSelectOptGroup>
			<NativeSelectOptGroup label="Technical work">
				<NativeSelectOption value="frontend">Frontend</NativeSelectOption>
				<NativeSelectOption value="data">Data analysis</NativeSelectOption>
			</NativeSelectOptGroup>
		</NativeSelect>
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
		<Combobox items={roles}>
			<ComboboxInput placeholder="Select a role" className="w-64" />
			<ComboboxContent>
				<ComboboxEmpty>No role found.</ComboboxEmpty>
				<ComboboxList>
					{(role: string) => (
						<ComboboxItem key={role} value={role}>
							{role}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}

export function SliderExample() {
	return (
		<div className="flex w-full max-w-72 flex-col gap-6">
			<Slider defaultValue={50} />
			<div className="space-y-2">
				<p className="font-medium text-sm">Hourly rate (USD)</p>
				<Slider defaultValue={[35, 65]} min={20} max={100} />
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
			<ToggleGroup defaultValue={["week"]} variant="outline">
				<ToggleGroupItem value="day">Day</ToggleGroupItem>
				<ToggleGroupItem value="week">Week</ToggleGroupItem>
				<ToggleGroupItem value="month">Month</ToggleGroupItem>
			</ToggleGroup>
			<ToggleGroup
				multiple
				defaultValue={["designer", "writer"]}
				variant="outline"
			>
				<ToggleGroupItem value="designer">Designer</ToggleGroupItem>
				<ToggleGroupItem value="developer">Developer</ToggleGroupItem>
				<ToggleGroupItem value="writer">Copywriter</ToggleGroupItem>
			</ToggleGroup>
		</div>
	);
}

export function SegmentedControlExample() {
	return (
		<div className="flex flex-col items-start gap-4">
			<SegmentedControl defaultValue="week" size="sm">
				<SegmentedControlItem value="day">Day</SegmentedControlItem>
				<SegmentedControlItem value="week">Week</SegmentedControlItem>
				<SegmentedControlItem value="month">Month</SegmentedControlItem>
			</SegmentedControl>
			<SegmentedControl defaultValue="week">
				<SegmentedControlItem value="day">Day</SegmentedControlItem>
				<SegmentedControlItem value="week">Week</SegmentedControlItem>
				<SegmentedControlItem value="month">Month</SegmentedControlItem>
			</SegmentedControl>
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
			<Rating value={4} count={128} />
			<Rating value={3.6} size="lg" />
			<ControlledRatingInput />
		</div>
	);
}

function ControlledRatingInput() {
	const [value, setValue] = useState(3);
	return <RatingInput value={value} onChange={setValue} />;
}

export function CalendarExample() {
	const [selected, setSelected] = useState<Date | undefined>(
		new Date(2026, 5, 20),
	);
	return (
		<Calendar
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
		<DatePicker
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
		<DateTimePicker
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
			<NativeDatePicker defaultValue="2026-06-20" />
			<NativeTimePicker defaultValue="14:30" />
			<NativeDateTimePicker defaultValue="2026-06-20T14:30" />
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
		<Stepper value={2} className="w-full max-w-xl">
			{onboardingSteps.map(({ step, title }) => (
				<StepperItem key={step} step={step}>
					<StepperIndicator />
					<StepperTitle>{title}</StepperTitle>
					{step < onboardingSteps.length ? <StepperSeparator /> : null}
				</StepperItem>
			))}
		</Stepper>
	);
}
