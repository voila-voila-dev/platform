import { Block, fakeUploadImage } from "./fixtures";

export function Image() {
	return (
		<Block
			initial={{
				id: "image",
				type: "image",
				src: "https://placehold.co/536x200/png",
				alt: "Campaign visual",
				href: "",
				width: "full",
				overlay: "none",
				rounded: true,
			}}
		/>
	);
}

export function ImageEmpty() {
	return (
		<Block
			initial={{
				id: "image-empty",
				type: "image",
				src: "",
				alt: "",
				href: "",
				width: "full",
				overlay: "none",
				rounded: true,
			}}
			onUploadImage={fakeUploadImage}
		/>
	);
}
