/** The few words the chart says itself. French when the chart's locale is, English otherwise. */
export interface ChartMessages {
	readonly keyboardHint: string;
	readonly roleDescription: string;
	readonly legend: string;
	readonly series: string;
	readonly resetZoom: string;
	readonly showing: (from: string, to: string) => string;
	readonly zoomHint: string;
	readonly brushStart: string;
	readonly brushEnd: string;
	readonly selected: (from: string, to: string) => string;
	readonly dataTable: (label: string) => string;
}

const FRENCH: ChartMessages = {
	keyboardHint:
		"Flèches pour parcourir les valeurs, Entrée pour épingler, Échap pour quitter.",
	roleDescription: "graphique",
	legend: "Légende",
	series: "Série",
	resetZoom: "Réinitialiser le zoom",
	showing: (from, to) => `Affiché : ${from} – ${to}`,
	zoomHint:
		" + et − pour zoomer, Maj et flèches pour se déplacer, 0 pour revenir.",
	brushStart: "Début de la sélection",
	brushEnd: "Fin de la sélection",
	selected: (from, to) => `Sélection : ${from} – ${to}`,
	dataTable: (label) => `Données : ${label}`,
};

const ENGLISH: ChartMessages = {
	keyboardHint:
		"Arrow keys to move through the values, Enter to pin, Escape to leave.",
	roleDescription: "chart",
	legend: "Legend",
	series: "Series",
	resetZoom: "Reset zoom",
	showing: (from, to) => `Showing ${from} – ${to}`,
	zoomHint: " + and − to zoom, Shift and the arrows to pan, 0 to reset.",
	brushStart: "Selection start",
	brushEnd: "Selection end",
	selected: (from, to) => `Selected ${from} – ${to}`,
	dataTable: (label) => `Data: ${label}`,
};

export function messagesFor(locale: string): ChartMessages {
	return locale.toLowerCase().startsWith("fr") ? FRENCH : ENGLISH;
}
