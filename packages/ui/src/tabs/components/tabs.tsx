import { TabsContent } from "#/tabs/components/tabs-content.tsx";
import { TabsList } from "#/tabs/components/tabs-list.tsx";
import { TabsRoot } from "#/tabs/components/tabs-root.tsx";
import { TabsTrigger } from "#/tabs/components/tabs-trigger.tsx";

/**
 * The Tabs parts as one namespace.
 */
export const Tabs = {
	Root: TabsRoot,
	Content: TabsContent,
	List: TabsList,
	Trigger: TabsTrigger,
};
