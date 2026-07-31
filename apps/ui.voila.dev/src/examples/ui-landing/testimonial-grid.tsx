import { TestimonialGrid } from "@voila.dev/ui/landing";

const testimonials = [
	{
		quote:
			"Finding a designer for our launches used to be an obstacle course. Now we post our brief and hear back within the day.",
		name: "Head of product",
		role: "SaaS startup",
		accent: "primary",
	},
	{
		quote:
			"I work on projects that match my skills, with a clear framework. Acme helped me grow my independent practice.",
		name: "Freelance product designer",
		role: "Network member",
		accent: "highlight",
	},
] as const;

export function Default() {
	return (
		<TestimonialGrid.Root>
			{testimonials.map((testimonial) => (
				<TestimonialGrid.Item key={testimonial.name}>
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
	);
}
