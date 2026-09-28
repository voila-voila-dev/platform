import type {
	ContentEditorLabelsInput,
	ContentValue,
} from "@voila.dev/ui/content-editor";

/** Every built-in node once, so one story shows the whole vocabulary. */
export const sampleContent: ContentValue = [
	{
		type: "h2",
		id: "intro",
		children: [{ text: "A content editor for your own app" }],
	},
	{
		type: "p",
		children: [
			{ text: "Rich text with " },
			{ text: "bold", bold: true },
			{ text: ", " },
			{ text: "italic", italic: true },
			{ text: ", " },
			{ text: "code", code: true },
			{ text: " and a " },
			{ type: "a", url: "https://ui.voila.dev", children: [{ text: "link" }] },
			{ text: ". Type / for a block, select text for the floating toolbar." },
		],
	},
	{
		type: "callout",
		icon: "💡",
		children: [
			{ text: "A callout keeps an aside next to the text it comments." },
		],
	},
	{ type: "h3", children: [{ text: "Lists" }] },
	{
		type: "p",
		listStyleType: "disc",
		indent: 1,
		children: [{ text: "Bulleted" }],
	},
	{
		type: "p",
		listStyleType: "disc",
		indent: 1,
		children: [{ text: "Indented with Tab" }],
	},
	{
		type: "p",
		listStyleType: "decimal",
		indent: 1,
		children: [{ text: "Numbered" }],
	},
	{
		type: "blockquote",
		children: [{ text: "A quote, for when someone else said it better." }],
	},
	{
		type: "code_block",
		lang: "ts",
		children: [
			{
				type: "code_line",
				children: [{ text: "const html = contentToHtml(value, {" }],
			},
			{ type: "code_line", children: [{ text: "  features: READERS," }] },
			{ type: "code_line", children: [{ text: "});" }] },
		],
	},
	{ type: "hr", children: [{ text: "" }] },
	{
		type: "table",
		colSizes: [220, 160, 160],
		children: [
			{
				type: "tr",
				children: [
					{ type: "th", children: [{ text: "Plan" }] },
					{ type: "th", children: [{ text: "Price" }] },
					{ type: "th", children: [{ text: "Seats" }] },
				],
			},
			{
				type: "tr",
				children: [
					{ type: "td", children: [{ text: "Starter" }] },
					{ type: "td", children: [{ text: "Free" }] },
					{ type: "td", children: [{ text: "1" }] },
				],
			},
			{
				type: "tr",
				children: [
					{
						type: "td",
						background: "var(--color-muted)",
						children: [{ text: "Team" }],
					},
					{
						type: "td",
						colSpan: 2,
						children: [{ text: "29 € for up to 10 seats" }],
					},
				],
			},
		],
	},
	{
		type: "image",
		url: "https://placehold.co/960x480/png",
		alt: "A placeholder",
		caption: "An image with its caption",
		children: [{ text: "" }],
	},
	{
		type: "youtube-video",
		videoId: "dQw4w9WgXcQ",
		caption: "A YouTube embed",
		children: [{ text: "" }],
	},
	{ type: "x-post", postId: "20", children: [{ text: "" }] },
	{
		type: "file",
		url: "https://example.com/report.pdf",
		name: "report.pdf",
		children: [{ text: "" }],
	},
	{ type: "p", children: [{ text: "" }] },
];

/**
 * A document to try the keyboard on: each block says what to press on it,
 * and it ends on an image, the void a caret used to get trapped in.
 */
export const keyboardContent: ContentValue = [
	{
		type: "p",
		children: [
			{ text: "Shift+Enter breaks this line" },
			{ text: " without starting a new paragraph.", italic: true },
		],
	},
	{
		type: "p",
		children: [
			{ text: "Select " },
			{ text: "these words", bold: true },
			{ text: " and press ⌘K, or paste a URL over them." },
		],
	},
	{
		type: "p",
		listStyleType: "disc",
		indent: 1,
		children: [{ text: "Enter on an empty item leaves the list" }],
	},
	{
		type: "p",
		listStyleType: "disc",
		indent: 2,
		children: [{ text: "Backspace at the start of an item outdents it" }],
	},
	{
		type: "p",
		children: [
			{ text: "Arrow down onto the divider, then Backspace, then ⌘Z." },
		],
	},
	{ type: "hr", children: [{ text: "" }] },
	{
		type: "p",
		children: [
			{
				text: "Type - , 1. , > , ## , --- or **bold** at the start of an empty line.",
			},
		],
	},
	{
		type: "image",
		url: "https://placehold.co/960x320/png",
		alt: "A placeholder",
		caption: "Arrow down from here to leave the image",
		children: [{ text: "" }],
	},
];

export const inlineContent: ContentValue = [
	{
		type: "p",
		children: [
			{ text: "A single line with " },
			{ text: "marks", bold: true },
			{ text: " and a " },
			{ type: "a", url: "https://ui.voila.dev", children: [{ text: "link" }] },
		],
	},
];

/** No backend in the stories: the picked file is served from an object URL. */
export async function fakeUploadImage(file: File) {
	await new Promise((resolve) => setTimeout(resolve, 600));
	return { url: URL.createObjectURL(file) };
}

export const frenchLabels: ContentEditorLabelsInput = {
	chrome: {
		editor: "Éditeur de contenu",
		placeholder: "Écrivez, ou tapez / pour insérer un bloc…",
		slashPlaceholder: "Filtrer les blocs…",
		slashEmpty: "Aucun bloc ne correspond.",
		insert: "Insérer",
		caption: "Ajouter une légende…",
		altText: "Texte alternatif",
		url: "URL",
		name: "Nom",
		apply: "Appliquer",
		remove: "Retirer",
		cancel: "Annuler",
		edit: "Modifier",
		pickImage: "Cliquez pour téléverser une image",
		dropToUpload: "Déposez pour téléverser",
		uploading: "Téléversement…",
		uploadDisabled: "Le téléversement d’images n’est pas disponible ici.",
		uploadFailed: (reason) => `Téléversement impossible : ${reason}`,
		invalidEmbed: "Ce lien n’est pas reconnu par ce bloc.",
		changeIcon: "Changer l’icône",
		unknownElement: (type) => `Bloc inconnu : ${type}`,
		characters: (count) => `${count} caractères`,
		words: (count) => `${count} mots`,
	},
	items: {
		bold: "Gras",
		italic: "Italique",
		underline: "Souligné",
		strikethrough: "Barré",
		code: "Code",
		paragraph: "Texte",
		heading2: "Titre 2",
		heading3: "Titre 3",
		bulletedList: "Liste à puces",
		numberedList: "Liste numérotée",
		indent: "Augmenter le retrait",
		outdent: "Réduire le retrait",
		quote: "Citation",
		divider: "Séparateur",
		callout: "Encadré",
		codeBlock: "Bloc de code",
		table: "Tableau",
		image: "Image",
		video: "Vidéo",
		file: "Fichier",
		youtube: "Vidéo YouTube",
		xPost: "Post X",
		link: "Lien",
		unlink: "Retirer le lien",
		undo: "Annuler",
		redo: "Rétablir",
		addRowAbove: "Ajouter une ligne au-dessus",
		addRowBelow: "Ajouter une ligne en dessous",
		addColumnLeft: "Ajouter une colonne à gauche",
		addColumnRight: "Ajouter une colonne à droite",
		deleteRow: "Supprimer la ligne",
		deleteColumn: "Supprimer la colonne",
		deleteTable: "Supprimer le tableau",
	},
};

/** A post as a blog import writes it: Markdown, read back through `contentFromMarkdown`. */
export const importedArticleMarkdown = `## Before the season

Read the [training plan](/blog/training-plan) first, then the
[federation rules](https://www.ffhandball.fr).

> Three things to check:
>
> - the licence
> - the medical certificate

| Week | Load |
| ---- | ---- |
| 1    | Light |
| 2    | Medium |

\`\`\`ts
const load = weeks.map((week) => week.minutes);
if (load.at(-1) > 90) warn("<too much>");
\`\`\`
`;
