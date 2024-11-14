import ViewArt from "@/components/viewArt/ViewArt";

interface PageProps {
	params: { id: string };
}

export default async function Page({ params }: PageProps) {
	console.log("Route param ID:", params);
	const { id } = params;

	return <ViewArt artworkId={id} />;
}
