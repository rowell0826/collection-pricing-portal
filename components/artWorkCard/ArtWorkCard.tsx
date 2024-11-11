"use client";
import { db } from "@/lib/firebase/firebase";
import { ArtWork } from "@/lib/types/artworkTypes";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import Image from "next/image";

const ArtWorkCard = () => {
	const [artworkData, setArtworkData] = useState<ArtWork[]>([]);

	useEffect(() => {
		const fetchArtworkData = async () => {
			try {
				const q = query(collection(db, "artworks"));
				const artworkSnapshot = await getDocs(q);

				if (!artworkSnapshot.empty) {
					const artworks: ArtWork[] = [];
					artworkSnapshot.forEach((doc) => {
						const data = doc.data() as ArtWork;
						artworks.push(data);
					});
					setArtworkData(artworks);
				}
			} catch (error) {
				console.error("Failed to fetch data", error);
			}
		};

		fetchArtworkData();
	}, []);

	return (
		<div className="flex flex-col justify-start items-center">
			<h2 className="my-4">ART COLLECTIONS</h2>
			<div className="w-screen h-[100%] flex flex-col justify-center items-center">
				<div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
					{artworkData.map((artwork) => (
						<Card
							key={artwork.id}
							className="rounded-md h-[380px] w-[240px] min-w-[240px]"
						>
							<Link href={"https://google.com"} className="rounded-md">
								<CardHeader className="relative h-[50%]">
									<Image
										src={artwork.img_url[0]}
										alt="Artwork Image"
										priority
										fill
										className="w-full rounded-t-md"
									/>
								</CardHeader>
								<CardContent className="max-h-[50%] overflow-y-scroll scrollbar-hide">
									<h6 className="text-sm">{artwork.title}</h6>
									<p className="text-xs my-2">by {artwork.artist_full_name}</p>

									<p className="text-xs my-2 max-h-[50px] scrollbar-hide overflow-y-scroll">
										{artwork.description}
									</p>

									<div className="flex justify-between">
										<span className="text-[0.6rem]">
											Area(cm): {artwork.area}{" "}
										</span>
										<span className="text-[0.6rem]">
											Aspect Ratio(cm): {artwork.aspect_ratio}
										</span>
									</div>
								</CardContent>
							</Link>
						</Card>
					))}
				</div>
			</div>
		</div>
	);
};

export default ArtWorkCard;
