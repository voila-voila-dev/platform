import { EmojiPicker } from "@voila.dev/ui/emoji-picker";
import { useState } from "react";

export function Default() {
	const [emoji, setEmoji] = useState("😊");
	return (
		<div className="flex flex-col items-center gap-3">
			<div className="rounded-xl bg-popover shadow-md ring-1 ring-foreground/10">
				<EmojiPicker
					onEmojiSelect={setEmoji}
					searchPlaceholder="Search emoji"
					loadingLabel="Loading…"
					emptyLabel="No emoji found"
				/>
			</div>
			<span className="text-2xl">{emoji}</span>
		</div>
	);
}
