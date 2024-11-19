"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase/firebase";
import { ArtWork } from "@/lib/types/artworkTypes";
import { doc, getDoc } from "firebase/firestore";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface ViewArtProps {
	artworkId: string;
}

const ViewArt: React.FC<ViewArtProps> = ({ artworkId }) => {
	const [artwork, setArtwork] = useState<ArtWork | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(true);

	useEffect(() => {
		const fetchArtwork = async () => {
			try {
				const artRef = doc(db, "artworks", artworkId);
				const artSnapshot = await getDoc(artRef);

				if (artSnapshot.exists()) {
					setArtwork(artSnapshot.data() as ArtWork);
				} else {
					setError("Artwork not found.");
					console.warn("Document does not exist for ID:", artworkId);
				}
			} catch (error) {
				setError("Failed to load artwork data.");
				console.error("Error fetching data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchArtwork();
	}, [artworkId]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;

	const {
		title,
		artist_full_name,
		artist_birth,
		description,
		provenance,
		medium,
		dimensions: { length, width, height },
		area,
		aspect_ratio,
	} = artwork as ArtWork;

	return (
		<section className="w-screen h-full md:h-screen flex flex-col md:flex-row bg-gray-100 overflow-y-scroll scrollbar-hide">
			{/* Image Area */}
			<div className="relative md:flex-1 h-screen w-screen md:w-[80%] bg-none">
				<Link href={"/"} className="absolute z-10">
					<Button className="ml-4 mt-4" size={"sm"}>
						<ArrowLeft />
					</Button>
				</Link>
				<div className="relative h-screen w-screen bg-gray-200">
					<Image
						src={artwork?.img_url as string}
						alt="Artwork image"
						fill
						className="object-cover shadow-lg"
					/>
				</div>
			</div>

			{/* Side Dashboard */}
			<Card className="relative md:h-screen md:w-[20%] shadow-lg p-6">
				<CardHeader>
					<CardTitle className="font-semibold text-md max-h-12 overflow-y-scroll scrollbar-hide">
						{title}
					</CardTitle>
				</CardHeader>
				<CardContent className="relative flex flex-col gap-4 max-h-[80%] overflow-y-scroll scrollbar-hide">
					<h4 className="text-md font-medium">
						{artist_full_name}
						<span className="text-gray-500 text-sm">
							{Number.isNaN(artist_birth) ? "" : `, ${artist_birth}`}
						</span>
					</h4>
					<p className="text-sm">{description}</p>
					{provenance && <p className="text-sm font-light">Provenance: {provenance}</p>}
					{medium && <p className="text-sm font-light">Medium: {medium}</p>}
					<div className="space-y-1 flex flex-col items-end">
						<p className="text-sm font-light self-start">Dimensions:</p>
						{Number.isNaN(length) ? "" : <p className="text-sm">Length: {length} cm</p>}
						<div className="flex flex-col items-start">
							<p className="text-sm">Width: {width} cm</p>
							<p className="text-sm">Height: {height} cm</p>
							<p className="text-sm">Area: {area} cm²</p>
							<p className="text-sm">Aspect Ratio: {aspect_ratio}</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</section>
	);
};

export default ViewArt;
