import { Effect, Option } from "effect";

export function inMemoryEntityStore<Item>(keyOf: (item: Item) => string) {
	const store = new Map<string, Item>();
	function values(): Array<Item> {
		return [...store.values()];
	}

	return {
		seed: (items: ReadonlyArray<Item>) => {
			for (const item of items) store.set(keyOf(item), item);
		},
		values,
		get: (key: string) =>
			Effect.sync(() => Option.fromNullishOr(store.get(key))),
		getMany: (keys: ReadonlyArray<string>) =>
			Effect.sync(() =>
				keys.flatMap((key) => {
					const item = store.get(key);
					return item === undefined ? [] : [item];
				}),
			),
		findFirst: (predicate: (item: Item) => boolean) =>
			Effect.sync(() => Option.fromNullishOr(values().find(predicate))),
		findAll: (predicate: (item: Item) => boolean) =>
			Effect.sync(() => values().filter(predicate)),
		save: (item: Item) =>
			Effect.sync(() => {
				store.set(keyOf(item), item);
				return item;
			}),
		delete: (key: string) =>
			Effect.sync(() => {
				store.delete(key);
			}),
	};
}
