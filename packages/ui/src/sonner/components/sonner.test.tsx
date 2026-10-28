// @vitest-environment jsdom
import { act, cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { Toaster, toast } from "#/sonner/components/sonner.tsx";

beforeEach(() => {
	document.documentElement.classList.remove("dark");
});

afterEach(() => {
	// Sonner keeps toasts in module-level state; dismiss them between tests.
	act(() => {
		toast.dismiss();
	});
	cleanup();
});

function queryToaster() {
	return document.querySelector("[data-sonner-toaster]");
}

/* Sonner mounts its list lazily — the toaster element only exists once a
 * toast has fired — so every DOM assertion starts by showing a toast. */
async function renderWithToast(ui: React.ReactElement, title = "Toast title") {
	const screen = render(ui);
	act(() => {
		toast(title);
	});
	await screen.findByText(title);
	return screen;
}

describe("Toaster", () => {
	it("renders the notifications region once a toast fires", async () => {
		await renderWithToast(<Toaster />, "Project published");
		expect(queryToaster()).not.toBeNull();
	});

	it("resolves the light theme without any theme provider", async () => {
		await renderWithToast(<Toaster />);
		expect(queryToaster()?.getAttribute("data-sonner-theme")).toBe("light");
	});

	it("follows the .dark class on the document root", async () => {
		await renderWithToast(<Toaster />);
		act(() => {
			document.documentElement.classList.add("dark");
		});
		// The MutationObserver callback fires as a microtask.
		await act(async () => {
			await Promise.resolve();
		});
		expect(queryToaster()?.getAttribute("data-sonner-theme")).toBe("dark");
	});

	it("lets consumers override the theme through props", async () => {
		await renderWithToast(<Toaster theme="dark" />);
		expect(queryToaster()?.getAttribute("data-sonner-theme")).toBe("dark");
	});

	it("passes position through to sonner", async () => {
		await renderWithToast(<Toaster position="top-center" />);
		const toaster = queryToaster();
		expect(toaster?.getAttribute("data-y-position")).toBe("top");
		expect(toaster?.getAttribute("data-x-position")).toBe("center");
	});

	it("shows a toast with its title and description", async () => {
		const screen = render(<Toaster />);
		act(() => {
			toast("Project published", {
				description: "Freelancers in your network have been notified.",
			});
		});
		expect(await screen.findByText("Project published")).toBeTruthy();
		expect(
			screen.getByText("Freelancers in your network have been notified."),
		).toBeTruthy();
	});

	it("tints status icons with the kit's status tokens", async () => {
		const screen = render(<Toaster />);
		act(() => {
			toast.success("Booking confirmed");
			toast.warning("Project starts soon");
			toast.error("Payment could not be processed");
		});
		await screen.findByText("Payment could not be processed");
		const icon = (type: string) =>
			document.querySelector(
				`[data-sonner-toast][data-type=${type}] [data-icon] svg`,
			);
		expect(icon("success")?.classList.contains("text-success")).toBe(true);
		expect(icon("warning")?.classList.contains("text-warning")).toBe(true);
		expect(icon("error")?.classList.contains("text-destructive")).toBe(true);
	});

	it("uses the kit Spinner as the loading icon", async () => {
		const screen = render(<Toaster />);
		act(() => {
			toast.loading("Publishing project…");
		});
		await screen.findByText("Publishing project…");
		const spinner = document.querySelector(
			"[data-sonner-toast][data-type=loading] [data-slot=spinner]",
		);
		expect(spinner).not.toBeNull();
	});

	it("renders a close button on toasts by default", async () => {
		await renderWithToast(<Toaster />, "Project published");
		expect(document.querySelector("[data-close-button]")).not.toBeNull();
	});
});
