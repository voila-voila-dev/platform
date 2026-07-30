import { Gallery } from "@voila.dev/ui/gallery";

const galleryImages = [
	{
		src: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
		alt: "Bright open-plan office",
	},
	{
		src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
		alt: "Team collaborating at a desk",
	},
	{
		src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
		alt: "Laptop with code on screen",
	},
	{
		src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
		alt: "Planning notes on a desk",
	},
];

export function GalleryExample() {
	return <Gallery.Root images={galleryImages} />;
}
