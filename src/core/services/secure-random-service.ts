import { Context, type Effect } from "effect";

export class SecureRandomService extends Context.Service<
	SecureRandomService,
	{
		readonly digitCode: (length: number) => Effect.Effect<string>;
		readonly token: (byteLength: number) => Effect.Effect<string>;
	}
>()("@voila.dev/platform/SecureRandomService") {}
