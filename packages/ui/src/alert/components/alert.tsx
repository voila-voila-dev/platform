import { AlertAction } from "#/alert/components/alert-action.tsx";
import { AlertClose } from "#/alert/components/alert-close.tsx";
import { AlertDescription } from "#/alert/components/alert-description.tsx";
import { AlertRoot } from "#/alert/components/alert-root.tsx";
import { AlertTitle } from "#/alert/components/alert-title.tsx";

/**
 * The Alert parts as one namespace.
 */
export const Alert = {
	Root: AlertRoot,
	Action: AlertAction,
	Close: AlertClose,
	Description: AlertDescription,
	Title: AlertTitle,
};
