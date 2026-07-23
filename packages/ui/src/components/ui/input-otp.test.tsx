// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSeparator,
	InputOTPSlot,
} from "#/components/ui/input-otp.tsx";

// input-otp schedules selection-sync timers (setTimeout at 0/10/50ms) from a
// mount effect. With real timers a pending one can fire after Vitest tears down
// the jsdom window and call a React state setter, surfacing as a flaky
// "window is not defined" unhandled error. Faking only setTimeout/clearTimeout
// (leaving Date, microtasks, and the React scheduler untouched) captures those
// timers so we can drop them before teardown.
beforeEach(() => {
	vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
});

afterEach(() => {
	cleanup();
	vi.clearAllTimers();
	vi.useRealTimers();
});

// input-otp observes its container; jsdom ships no ResizeObserver.
class ResizeObserverStub {
	observe() {}
	unobserve() {}
	disconnect() {}
}
globalThis.ResizeObserver ??=
	ResizeObserverStub as unknown as typeof ResizeObserver;

type OtpProps = Partial<
	Omit<React.ComponentProps<typeof InputOTP>, "children" | "render">
>;

function renderOtp(props?: OtpProps) {
	return render(
		<InputOTP maxLength={6} {...props}>
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
		</InputOTP>,
	);
}

function queryInput(screen: ReturnType<typeof render>) {
	return screen.baseElement.querySelector("[data-slot=input-otp]");
}

function queryContainer(screen: ReturnType<typeof render>) {
	// input-otp's container (the containerClassName target) wraps the input in
	// an absolutely-positioned div, so it is the input's grandparent.
	return screen.baseElement.querySelector("[data-input-otp-container=true]");
}

function querySlots(screen: ReturnType<typeof render>) {
	return Array.from(
		screen.baseElement.querySelectorAll("[data-slot=input-otp-slot]"),
	);
}

describe("InputOTP", () => {
	it("renders the hidden input and six slots", () => {
		const screen = renderOtp();
		expect(queryInput(screen)?.tagName).toBe("INPUT");
		expect(querySlots(screen).length).toBe(6);
	});

	it("renders a separator with a role", () => {
		const screen = renderOtp();
		expect(
			screen.baseElement.querySelector("[data-slot=input-otp-separator]"),
		).not.toBeNull();
		expect(
			screen.baseElement
				.querySelector("[data-slot=input-otp-separator]")
				?.getAttribute("role"),
		).toBe("separator");
	});

	it("reflects the value into the slots", () => {
		const screen = renderOtp({ value: "12", maxLength: 6 });
		const slots = querySlots(screen);
		expect(slots[0]?.textContent).toBe("1");
		expect(slots[1]?.textContent).toBe("2");
		expect(slots[2]?.textContent).toBe("");
	});

	it("does not ship the stray cn-input-otp marker class", () => {
		const screen = renderOtp();
		expect(queryContainer(screen)?.className).not.toContain("cn-input-otp");
	});

	it("styles disabled slots with the muted treatment", () => {
		const screen = renderOtp({ disabled: true, maxLength: 6 });
		const container = queryContainer(screen);
		expect(container?.className).toContain(
			"[&:has(:disabled)_[data-slot=input-otp-slot]]:bg-muted",
		);
		expect(container?.className).toContain(
			"[&:has(:disabled)_[data-slot=input-otp-slot]]:cursor-not-allowed",
		);
		expect((queryInput(screen) as HTMLInputElement).disabled).toBe(true);
	});

	it("uses the ring-3 idiom on the active slot styles", () => {
		const screen = renderOtp();
		const slot = querySlots(screen)[0];
		expect(slot?.className).toContain("data-[active=true]:ring-3");
		expect(slot?.className).not.toContain("data-[active=true]:ring-[3px]");
	});

	it("stops the caret blink under reduced motion and drops the no-op duration", () => {
		const screen = renderOtp({ value: "", maxLength: 6 });
		const input = queryInput(screen) as HTMLInputElement;
		// The fake caret renders only on the active slot while focused.
		fireEvent.focus(input);
		const caret = screen.baseElement.querySelector(".animate-caret-blink");
		expect(caret).not.toBeNull();
		expect(caret?.className).toContain("motion-reduce:animate-none");
		expect(caret?.className).not.toContain("duration-1000");
	});

	it("forwards aria-invalid down to the input", () => {
		const screen = renderOtp({ "aria-invalid": true, maxLength: 6 });
		expect(queryInput(screen)?.getAttribute("aria-invalid")).toBe("true");
	});

	it("merges containerClassName onto the container", () => {
		const screen = renderOtp({
			containerClassName: "custom-container-class",
			maxLength: 6,
		});
		const container = queryContainer(screen);
		expect(container?.classList.contains("custom-container-class")).toBe(true);
	});
});
