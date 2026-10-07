/** The few words the chart says itself. French when the chart's locale is, English otherwise. */
export interface ChartMessages {
	readonly keyboardHint: string;
	readonly roleDescription: string;
	readonly legend: string;
	readonly series: string;
	readonly dataTable: (label: string) => string;
}

const FRENCH: ChartMessages = {
	keyboardHint:
		"Flèches pour parcourir les valeurs, Entrée pour épingler, Échap pour quitter.",
	roleDescription: "graphique",
	legend: "Légende",
	series: "Série",
	dataTable: (label) => `Données : ${label}`,
};

const ENGLISH: ChartMessages = {
	keyboardHint:
		"Arrow keys to move through the values, Enter to pin, Escape to leave.",
	roleDescription: "chart",
	legend: "Legend",
	series: "Series",
	dataTable: (label) => `Data: ${label}`,
};

export function messagesFor(locale: string): ChartMessages {
	return locale.toLowerCase().startsWith("fr") ? FRENCH : ENGLISH;
}
