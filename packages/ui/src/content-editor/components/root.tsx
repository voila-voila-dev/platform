import { Plate, usePlateEditor } from "platejs/react";
import { type ReactNode, useEffect, useMemo, useRef } from "react";
import {
	type ContentEditorConfigContextValue,
	ContentEditorConfigProvider,
} from "#/content-editor/context/content-editor-context.tsx";
import type { ContentValue } from "#/content-editor/features/content-value.ts";
import type {
	ContentCapability,
	ContentEditorMode,
	ContentFeature,
	ContentUploadedImage,
} from "#/content-editor/features/feature-definition.tsx";
import {
	type ContentRegistry,
	toContentRegistry,
} from "#/content-editor/features/registry.ts";
import {
	type ContentEditorLabelsInput,
	mergeContentEditorLabels,
} from "#/content-editor/labels.ts";
import { emptyContentValue } from "#/content-editor/lib/empty-value.ts";
import { newContentNodeId } from "#/content-editor/lib/ids.ts";
import {
	type ContentEditorThemeInput,
	mergeContentEditorTheme,
} from "#/content-editor/theme.ts";
import { cn } from "#/lib/utils.ts";

function featureKeys(
	features: ReadonlyArray<ContentFeature> | ContentRegistry,
): ReadonlyArray<string> {
	return (
		Array.isArray(features) ? features : (features as ContentRegistry).features
	).map((feature) => feature.key);
}

export interface ContentEditorRootProps<
	Value extends ContentValue = ContentValue,
> {
	/**
	 * The features this editor offers. `createContentFeatures` returns the
	 * ones this package ships; add your own, drop what you do not want,
	 * reorder them. Either the list or a registry built from it.
	 */
	features: ReadonlyArray<ContentFeature> | ContentRegistry;
	/** The document being edited, plain serialisable data; `null` is empty. */
	value: Value | null;
	/** Called with the whole next document on every edit, keystrokes included. */
	onChange: (value: Value) => void;
	/**
	 * `block` is the full editor. `inline` drops every block feature (marks and
	 * links only). `single-line` is inline with one paragraph and Enter as a
	 * submit rather than a break.
	 */
	mode?: ContentEditorMode;
	readOnly?: boolean;
	/** Delegated image upload: receives the picked file, resolves with its
	 * url. Omit to hide every image affordance. */
	onUploadImage?: (file: File) => Promise<ContentUploadedImage>;
	/** Node-id factory, injectable for deterministic tests. */
	generateNodeId?: () => string;
	labels?: ContentEditorLabelsInput;
	theme?: ContentEditorThemeInput;
	className?: string;
	children: ReactNode;
}

/**
 * The editor's provider. It renders no chrome of its own: what the editor
 * looks like is the parts you compose inside it.
 *
 * Plate owns a mutable editor seeded once; `value` is honoured after that by
 * re-seeding only when the host hands down a document the editor did not
 * itself emit, so a host that stores every change and echoes it back never
 * fights the caret, and a host that loads a draft late still sees it land.
 * That re-seed reports through `onChange` once, like any edit: what the
 * editor holds is what it says it holds.
 */
export function ContentEditorRoot<Value extends ContentValue = ContentValue>({
	features,
	value,
	onChange,
	mode = "block",
	readOnly = false,
	onUploadImage,
	generateNodeId = newContentNodeId,
	labels,
	theme,
	className,
	children,
}: ContentEditorRootProps<Value>) {
	// A host that builds its feature list inline hands down a new array on
	// every render; the registry, and with it the Plate editor, is rebuilt
	// only when the feature keys or the mode differ, since rebuilding the
	// editor would reseed it and undo the edit that caused the render.
	const previous = useRef<{
		readonly signature: string;
		readonly registry: ContentRegistry;
	} | null>(null);
	const signature = `${mode}:${featureKeys(features).join(",")}`;
	if (previous.current === null || previous.current.signature !== signature) {
		previous.current = {
			signature,
			registry: toContentRegistry(features, mode),
		};
	}
	const registry = previous.current.registry;
	const initialValue = useMemo(
		() => (value === null || value.length === 0 ? emptyContentValue() : value),
		// Seeds the editor once; later values arrive through the sync effect below.
		[],
	);
	const editor = usePlateEditor(
		{
			plugins: [...registry.plugins],
			value: initialValue as never,
			override: { components: { ...registry.components } },
		},
		[registry],
	);

	const lastEmitted = useRef<ContentValue | null>(initialValue);
	useEffect(() => {
		if (value === null || value === lastEmitted.current) {
			return;
		}
		lastEmitted.current = value;
		editor.tf.setValue(value as never);
	}, [editor, value]);

	const config = useMemo<ContentEditorConfigContextValue>(() => {
		const capabilities = new Set<ContentCapability>();
		if (onUploadImage !== undefined) {
			capabilities.add("upload-image");
		}
		return {
			registry,
			mode,
			labels: mergeContentEditorLabels(labels),
			theme: mergeContentEditorTheme(theme),
			capabilities,
			uploadImage: onUploadImage ?? null,
			generateNodeId,
			readOnly,
		};
	}, [registry, mode, labels, theme, onUploadImage, generateNodeId, readOnly]);

	return (
		<ContentEditorConfigProvider value={config}>
			<Plate
				editor={editor}
				readOnly={readOnly}
				onChange={({ value: next }) => {
					lastEmitted.current = next as ContentValue;
					onChange(next as Value);
				}}
			>
				<div
					data-slot="content-editor"
					data-mode={mode}
					data-read-only={readOnly || undefined}
					className={cn("flex flex-col gap-2", className)}
					style={config.theme.variables as React.CSSProperties}
				>
					{children}
				</div>
			</Plate>
		</ContentEditorConfigProvider>
	);
}
