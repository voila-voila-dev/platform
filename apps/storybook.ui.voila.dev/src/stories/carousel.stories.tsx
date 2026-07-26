import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { Carousel, type CarouselApi } from "@voila.dev/ui/carousel";
import * as React from "react";

const meta = {
	title: "UI/Carousel",
	component: Carousel.Root,
	tags: ["autodocs"],
	argTypes: {
		orientation: {
			control: "inline-radio",
			options: ["horizontal", "vertical"],
		},
		opts: { control: "object" },
	},
} satisfies Meta<typeof Carousel.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
	args: {
		orientation: "horizontal",
	},
	render: (args) => (
		<div className="mx-12 w-full max-w-xs">
			<Carousel.Root {...args}>
				<Carousel.Content>
					{[1, 2, 3, 4, 5].map((slideNumber) => (
						<Carousel.Item key={slideNumber}>
							<div className="flex aspect-square items-center justify-center rounded-xl bg-muted text-4xl font-semibold">
								{slideNumber}
							</div>
						</Carousel.Item>
					))}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
			</Carousel.Root>
		</div>
	),
};

export const MultipleItems: Story = {
	render: () => (
		<div className="mx-12 w-full max-w-md">
			<Carousel.Root opts={{ align: "start" }}>
				<Carousel.Content>
					{[
						"Designer",
						"Developer",
						"Data analyst",
						"Copywriter",
						"Consultant",
						"Strategist",
					].map((role) => (
						<Carousel.Item key={role} className="basis-1/3">
							<div className="flex aspect-square items-center justify-center rounded-xl bg-muted p-2 text-center text-sm font-medium">
								{role}
							</div>
						</Carousel.Item>
					))}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
			</Carousel.Root>
		</div>
	),
};

export const Vertical: Story = {
	render: () => (
		<div className="my-12 w-full max-w-xs">
			<Carousel.Root orientation="vertical" className="mx-auto w-48">
				<Carousel.Content className="h-48">
					{[1, 2, 3, 4, 5].map((slideNumber) => (
						<Carousel.Item key={slideNumber}>
							<div className="flex h-44 items-center justify-center rounded-xl bg-muted text-4xl font-semibold">
								{slideNumber}
							</div>
						</Carousel.Item>
					))}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
			</Carousel.Root>
		</div>
	),
};

export const WithDots: Story = {
	render: () => (
		<div className="mx-12 w-full max-w-xs">
			<Carousel.Root opts={{ loop: true }}>
				<Carousel.Content>
					{[1, 2, 3, 4, 5].map((slideNumber) => (
						<Carousel.Item key={slideNumber}>
							<div className="flex aspect-square items-center justify-center rounded-xl bg-muted text-4xl font-semibold">
								{slideNumber}
							</div>
						</Carousel.Item>
					))}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
				<Carousel.Dots />
			</Carousel.Root>
		</div>
	),
};

export const InsetControls: Story = {
	render: () => (
		<div className="w-full max-w-xs">
			<Carousel.Root>
				<Carousel.Content containerClassName="rounded-xl">
					{[1, 2, 3, 4, 5].map((slideNumber) => (
						<Carousel.Item key={slideNumber}>
							<div className="flex aspect-square items-center justify-center rounded-xl bg-muted text-4xl font-semibold">
								{slideNumber}
							</div>
						</Carousel.Item>
					))}
				</Carousel.Content>
				<Carousel.Previous inset />
				<Carousel.Next inset />
			</Carousel.Root>
		</div>
	),
};

function CurrentSlideExample() {
	const [api, setApi] = React.useState<CarouselApi>();
	const [current, setCurrent] = React.useState(1);
	const [count, setCount] = React.useState(0);

	React.useEffect(() => {
		if (!api) return;
		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap() + 1);
		const onSelect = () => setCurrent(api.selectedScrollSnap() + 1);
		api.on("select", onSelect);
		return () => {
			api.off("select", onSelect);
		};
	}, [api]);

	return (
		<div className="mx-12 w-full max-w-xs">
			<Carousel.Root setApi={setApi}>
				<Carousel.Content>
					{[1, 2, 3, 4, 5].map((slideNumber) => (
						<Carousel.Item key={slideNumber}>
							<div className="flex aspect-square items-center justify-center rounded-xl bg-muted text-4xl font-semibold">
								{slideNumber}
							</div>
						</Carousel.Item>
					))}
				</Carousel.Content>
				<Carousel.Previous />
				<Carousel.Next />
			</Carousel.Root>
			<p className="pt-2 text-center text-sm text-muted-foreground">
				Slide {current} of {count}
			</p>
		</div>
	);
}

export const WithCurrentSlide: Story = {
	render: () => <CurrentSlideExample />,
};
