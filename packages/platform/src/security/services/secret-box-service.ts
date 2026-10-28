import { Context, type Effect } from "effect";
import type { SecretBoxError } from "#security/errors/secret-box-error";

/**
 * Encrypts a secret before it is stored and decrypts it where it is used, so
 * the database and its backups never hold the value in clear. `boundTo` names
 * the record the value belongs to: a sealed text copied onto another record
 * does not open there.
 */
export class SecretBoxService extends Context.Service<
	SecretBoxService,
	{
		readonly seal: (
			plaintext: string,
			boundTo: string,
		) => Effect.Effect<string, SecretBoxError>;
		readonly open: (
			sealed: string,
			boundTo: string,
		) => Effect.Effect<string, SecretBoxError>;
	}
>()("@voila.dev/platform/SecretBoxService") {}
