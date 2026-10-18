import { Schema } from "effect";
import { Id } from "#core/ids/id";

export const OrganizationId = Id.pipe(Schema.brand("OrganizationId"));

export type OrganizationId = typeof OrganizationId.Type;
