import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { TestimonialGrid } from "@voila.dev/ui/landing";
import { testimonials } from "./landing-fixtures";

const meta = {
	title: "Landing/TestimonialGrid",
	component: TestimonialGrid.Root,
	tags: ["autodocs"],
	parameters: {
		layout: "padded",
	},
} satisfies Meta<typeof TestimonialGrid.Root>;

export default meta;

type Story = StoryObj<typeof meta>;

/** Reproduces the original Astro site's `section-testimonials.astro`. */
export const Default: Story = {
	render: () => (
		<TestimonialGrid.Root>
			{testimonials.map((testimonial, index) => (
				<TestimonialGrid.Item
					key={testimonial.name}
					style={{ animationDelay: `${index * 0.1}s` }}
				>
					<TestimonialGrid.QuoteIcon />
					<TestimonialGrid.Quote>{testimonial.quote}</TestimonialGrid.Quote>
					<TestimonialGrid.Footer>
						<TestimonialGrid.Avatar accent={testimonial.accent}>
							{testimonial.name.charAt(0)}
						</TestimonialGrid.Avatar>
						<TestimonialGrid.Author>
							<TestimonialGrid.AuthorName>
								{testimonial.name}
							</TestimonialGrid.AuthorName>
							<TestimonialGrid.AuthorRole>
								{testimonial.role}
							</TestimonialGrid.AuthorRole>
						</TestimonialGrid.Author>
						<TestimonialGrid.Rating />
					</TestimonialGrid.Footer>
				</TestimonialGrid.Item>
			))}
		</TestimonialGrid.Root>
	),
};
