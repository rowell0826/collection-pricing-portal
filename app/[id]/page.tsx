import ViewArt from "@/components/viewArt/ViewArt";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	console.log("Route param ID:", params);
	const id = (await params).id;

	return <ViewArt artworkId={id} />;
}
