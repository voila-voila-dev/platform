import { CopyIcon, MagnifyingGlassIcon, StarIcon } from "@phosphor-icons/react";
import type { BadgeColor } from "@voila.dev/ui/components/badge";
import { Calendar } from "@voila.dev/ui/components/calendar";
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
	FormattedInput,
	frenchPhoneMask,
	rppsMask,
	siretMask,
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
/* Text inputs                                                                */
/* -------------------------------------------------------------------------- */

export function InputExample() {
	return (
		<div className="flex w-full max-w-72 flex-col gap-3">
			<Input placeholder="Search providers" />
			<Input type="email" defaultValue="not-an-email" aria-invalid />
			<Input readOnly defaultValue="RPPS 10003456789" />
			<Input disabled placeholder="Mission location" />
		</div>
	);
}

export function TextareaExample() {
	return (
		<Textarea
			className="w-full max-w-96"
			defaultValue="Pitch-side physiotherapy cover for the Saturday home match. Arrive one hour before kick-off for taping and warm-up support."
		/>
	);
}

export function LabelExample() {
	return (
		<div className="grid w-full max-w-72 gap-2">
			<Label htmlFor="organization-email">Organization email</Label>
			<Input
				id="organization-email"
				type="email"
				placeholder="contact@club.fr"
			/>
		</div>
	);
}

export function FieldExample() {
	return (
		<div className="w-full max-w-96">
			<FieldGroup>
				<Field>
					<FieldLabel htmlFor="organization-name">Club name</FieldLabel>
					<Input id="organization-name" placeholder="Clermont Rugby Club" />
					<FieldDescription>
						Shown to providers on every mission you publish.
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
					<FieldLabel htmlFor="mission-notes">Mission notes</FieldLabel>
					<Textarea
						id="mission-notes"
						placeholder="Access instructions, parking, equipment…"
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
				<InputGroupInput placeholder="Search providers…" />
			</InputGroup>
			<InputGroup>
				<InputGroupAddon>
					<InputGroupText>https://</InputGroupText>
				</InputGroupAddon>
				<InputGroupInput placeholder="club-website.example" />
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
			<FormattedInput mask={siretMask} placeholder="123 456 789 00012" />
			<FormattedInput mask={rppsMask} defaultValue="10003456789" />
			<FormattedInput mask={frenchPhoneMask} defaultValue="0612345678" />
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
				currency="EUR"
				currencyLabel="Currency"
			/>
		</div>
	);
}

export function TranslationInputExample() {
	const [value, setValue] = useState<Record<string, string>>({
		"fr-FR": "Couverture kiné du match",
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
				localeLabel="Langue"
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
				<Checkbox id="mission-terms" />
				<div className="grid gap-1 text-sm">
					<Label htmlFor="mission-terms">Accept mission terms</Label>
					<p className="text-muted-foreground">
						You confirm your availability for the full duration.
					</p>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<Checkbox id="mission-notifications" defaultChecked />
				<Label htmlFor="mission-notifications">Notify me about missions</Label>
			</div>
			<div className="flex items-center gap-3">
				<Checkbox id="mission-partial" indeterminate />
				<Label htmlFor="mission-partial">Some specialties selected</Label>
			</div>
		</div>
	);
}

const skills = [
	{ name: "physiotherapy", label: "Physiotherapy" },
	{ name: "osteopathy", label: "Osteopathy" },
	{ name: "nursing", label: "Nursing" },
];

export function CheckboxGroupExample() {
	return (
		<CheckboxGroup defaultValue={["physiotherapy"]} className="w-full max-w-64">
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
		<RadioGroup defaultValue="physiotherapist" className="w-full max-w-64">
			{[
				{ value: "physiotherapist", label: "Physiotherapist" },
				{ value: "osteopath", label: "Osteopath" },
				{ value: "nurse", label: "Nurse" },
			].map((option) => (
				<div key={option.value} className="flex items-center gap-2">
					<RadioGroupItem
						value={option.value}
						id={`profession-${option.value}`}
					/>
					<Label htmlFor={`profession-${option.value}`}>{option.label}</Label>
				</div>
			))}
		</RadioGroup>
	);
}

export function SwitchExample() {
	return (
		<div className="flex flex-col gap-4">
			<div className="flex items-center gap-2">
				<Switch id="notify-missions" defaultChecked />
				<Label htmlFor="notify-missions">Notify me about new missions</Label>
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
				<SelectValue placeholder="Select a specialty" />
			</SelectTrigger>
			<SelectContent>
				<SelectGroup>
					<SelectLabel>Rehabilitation</SelectLabel>
					<SelectItem value="physiotherapist">Physiotherapist</SelectItem>
					<SelectItem value="osteopath">Osteopath</SelectItem>
				</SelectGroup>
				<SelectGroup>
					<SelectLabel>Medical</SelectLabel>
					<SelectItem value="nurse">Nurse</SelectItem>
					<SelectItem value="sports-doctor">Sports doctor</SelectItem>
				</SelectGroup>
			</SelectContent>
		</Select>
	);
}

export function NativeSelectExample() {
	return (
		<NativeSelect defaultValue="rugby" className="w-56">
			<NativeSelectOptGroup label="Team sports">
				<NativeSelectOption value="rugby">Rugby</NativeSelectOption>
				<NativeSelectOption value="football">Football</NativeSelectOption>
			</NativeSelectOptGroup>
			<NativeSelectOptGroup label="Individual sports">
				<NativeSelectOption value="athletics">Athletics</NativeSelectOption>
				<NativeSelectOption value="tennis">Tennis</NativeSelectOption>
			</NativeSelectOptGroup>
		</NativeSelect>
	);
}

export function ResponsiveSelectExample() {
	const [value, setValue] = useState("physiotherapist");
	return (
		<div className="w-full max-w-72">
			<ResponsiveSelect.Root value={value} onValueChange={setValue}>
				<ResponsiveSelect.Trigger className="w-full">
					<ResponsiveSelect.Value placeholder="Select a specialty" />
				</ResponsiveSelect.Trigger>
				<ResponsiveSelect.Content>
					<ResponsiveSelect.Item value="physiotherapist">
						Physiotherapist
					</ResponsiveSelect.Item>
					<ResponsiveSelect.Item value="osteopath">
						Osteopath
					</ResponsiveSelect.Item>
					<ResponsiveSelect.Item value="nurse">Nurse</ResponsiveSelect.Item>
				</ResponsiveSelect.Content>
			</ResponsiveSelect.Root>
		</div>
	);
}

const specialties = [
	"Physiotherapist",
	"Osteopath",
	"Nurse",
	"Sports doctor",
	"Podiatrist",
	"Dietitian",
];

export function ComboboxExample() {
	return (
		<Combobox items={specialties}>
			<ComboboxInput placeholder="Select a specialty" className="w-64" />
			<ComboboxContent>
				<ComboboxEmpty>No specialty found.</ComboboxEmpty>
				<ComboboxList>
					{(specialty: string) => (
						<ComboboxItem key={specialty} value={specialty}>
							{specialty}
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
				<p className="font-medium text-sm">Hourly rate (EUR)</p>
				<Slider defaultValue={[35, 65]} min={20} max={100} />
			</div>
		</div>
	);
}

export function ToggleExample() {
	return (
		<>
			<Toggle aria-label="Mark provider as favorite">
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
				defaultValue={["physiotherapist", "nurse"]}
				variant="outline"
			>
				<ToggleGroupItem value="physiotherapist">
					Physiotherapist
				</ToggleGroupItem>
				<ToggleGroupItem value="osteopath">Osteopath</ToggleGroupItem>
				<ToggleGroupItem value="nurse">Nurse</ToggleGroupItem>
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
	const [iconName, setIconName] = useState<string | null>("FirstAidKitIcon");
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
			placeholder="Mission date"
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
			placeholder="Mission start"
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
	{ step: 1, title: "Profil" },
	{ step: 2, title: "Disponibilités" },
	{ step: 3, title: "Validation" },
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
