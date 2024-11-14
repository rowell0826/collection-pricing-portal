import ViewArt from "@/components/viewArt/ViewArt";

interface PageProps {
	params: { id: string };
}

export default function Page({ params }: PageProps) {
	const { id } = params;
	console.log("Route param ID:", id);

	return <ViewArt params={{ id }} />;
}
