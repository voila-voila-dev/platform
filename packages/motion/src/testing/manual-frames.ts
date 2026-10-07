import { setFrameDriver } from "#/frame/driver.ts";
import { resetFrameLoop } from "#/frame/frame.ts";

const FRAME = 1000 / 60;

export interface ManualFrames {
	/** Moves the clock by `ms`, running each 60 Hz frame it crosses while one is requested. */
	advance(ms: number): void;
	/** The clock, in milliseconds. */
	time(): number;
	/** Back to the browser's frames, with an empty loop. */
	restore(): void;
}

/** Installs a clock the test steps by hand, starting at 0 with an empty loop. */
export function manualFrames(): ManualFrames {
	let time = 0;
	let tick: ((timestamp: number) => void) | undefined;
	resetFrameLoop();
	setFrameDriver({
		request(next) {
			tick = next;
		},
		cancel() {
			tick = undefined;
		},
		now: () => time,
	});
	return {
		advance(ms) {
			const end = time + ms;
			// Frames land on the 60 Hz grid however the test slices its steps.
			let frameAt = (Math.floor(time / FRAME + 1e-9) + 1) * FRAME;
			while (frameAt <= end + 1e-9) {
				time = frameAt;
				const next = tick;
				tick = undefined;
				next?.(time);
				frameAt += FRAME;
			}
			time = end;
		},
		time: () => time,
		restore() {
			resetFrameLoop();
			setFrameDriver(undefined);
		},
	};
}
