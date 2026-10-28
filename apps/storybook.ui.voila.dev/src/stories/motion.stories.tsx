import type { Meta, StoryObj } from "@storybook/tanstack-react";
import {
	ColourMix,
	Counter,
	FollowPointer,
	Interpolate,
	InViewFade,
	PathMorph,
	PresenceCard,
	PresenceList,
	QuickStart,
	ReducedMotion,
	Resize,
	ScrollProgress,
	Sequence,
	SpringBounce,
	SpringOrTween,
	StaggerList,
} from "./motion-examples";

const meta = {
	title: "Motion/Examples",
	parameters: { layout: "padded" },
} satisfies Meta;

export default meta;

type Story = StoryObj<typeof meta>;

/** `animate` from `@voila.dev/motion/dom`: a spring played by the browser. Click mid-flight. */
export const Spring: Story = { render: () => <QuickStart /> };

export const Bounce: Story = { render: () => <SpringBounce /> };

export const SpringVersusTween: Story = { render: () => <SpringOrTween /> };

export const Stagger: Story = { render: () => <StaggerList /> };

export const Timeline: Story = { render: () => <Sequence /> };

/** A motion value written to the page in its change listener: no re-render per frame. */
export const AnimatedNumber: Story = { render: () => <Counter /> };

export const Colours: Story = { render: () => <ColourMix /> };

export const Ranges: Story = { render: () => <Interpolate /> };

export const MorphPath: Story = { render: () => <PathMorph /> };

/** A scroll timeline when the browser has one, the frame loop otherwise. */
export const ScrollLinked: Story = { render: () => <ScrollProgress /> };

export const InView: Story = { render: () => <InViewFade /> };

export const ResizeObserved: Story = { render: () => <Resize /> };

export const SpringFollowsPointer: Story = { render: () => <FollowPointer /> };

export const ExitAnimations: Story = { render: () => <PresenceList /> };

export const OwnExit: Story = { render: () => <PresenceCard /> };

/** The global policy, `user` by default. Under reduction the move jumps and the fade still plays. */
export const ReducedMotionPolicy: Story = { render: () => <ReducedMotion /> };
