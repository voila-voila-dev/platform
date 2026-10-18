import { Context, type Effect } from "effect";

export class SecureRandom extends Context.Service<
	SecureRandom,
	{
		readonly digitCode: (length: number) => Effect.Effect<string>;
		readonly token: (byteLength: number) => Effect.Effect<string>;
	}
>()("@voila.dev/platform/SecureRandom") {}
