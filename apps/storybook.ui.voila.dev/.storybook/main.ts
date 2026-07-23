import type { StorybookConfig } from "@storybook/tanstack-react";
import type { UserConfig } from "vite";

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(ts|tsx)"],
	addons: ["@storybook/addon-themes"],
	framework: "@storybook/tanstack-react",
	// On Vite 8 (Rolldown), @storybook/builder-vite force-enables the
	// experimental `output.strictExecutionOrder`, which wraps modules in lazy
	// init functions and severs the `createSelectorCreator`/`lruMemoize`
	// import bindings of `@base-ui/utils/store/createSelectorMemoized` — every
	// production-built story with a Base UI popup then crashes with
	// "createSelectorCreator is not defined" (dev mode is unaffected). The
	// builder sets the flag from a plugin `config` hook, after `viteFinal`
	// runs, so the only handle left is a later `enforce: "post"` plugin that
	// switches it back off.
	viteFinal: (viteConfig) => {
		viteConfig.plugins ??= [];
		viteConfig.plugins.push({
			name: "voila:disable-strict-execution-order",
			enforce: "post",
			config(config: UserConfig) {
				const output = config.build?.rolldownOptions?.output;
				if (output && !Array.isArray(output)) {
					// strictExecutionOrder is experimental and not in the types yet.
					(output as Record<string, unknown>).strictExecutionOrder = false;
				}
			},
		});
		return viteConfig;
	},
};

export default config;
