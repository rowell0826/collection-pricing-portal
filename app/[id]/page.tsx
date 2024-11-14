import ViewArt from "@/components/viewArt/ViewArt";

interface PageProps {
	params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
	const id = (await params).id;

	return <ViewArt artworkId={id} />;
}
