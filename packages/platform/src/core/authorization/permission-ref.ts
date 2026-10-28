export interface PermissionRef {
	readonly kind: string;
	readonly name: string;
}

export function permissionRef(kind: string, name: string): PermissionRef {
	return { kind, name };
}

export function renderPermissionRef(ref: PermissionRef): string {
	return `${ref.kind}:${ref.name}`;
}
