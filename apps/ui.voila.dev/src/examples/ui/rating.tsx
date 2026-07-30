import { Rating } from "@voila.dev/ui/rating";
import { useState } from "react";

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
