import { Context, type Effect } from "effect";
import type { Sha256Hex } from "#security/value-objects/sha256-hex";

export class HashService extends Context.Service<
	HashService,
	{
		readonly sha256: (value: string) => Effect.Effect<Sha256Hex>;
		readonly sha256Bytes: (bytes: Uint8Array) => Effect.Effect<Sha256Hex>;
	}
>()("@voila.dev/platform/HashService") {}
