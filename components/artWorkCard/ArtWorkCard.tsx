"use client";
import { Card, CardContent, CardHeader } from "../ui/card";
import Link from "next/link";
import Image from "next/image";
import { useArtwork } from "@/lib/context/artworkContext/ArtworkContext";

const ArtWorkCard = () => {
	const { filteredData } = useArtwork();

	return (
		<div className="w-screen flex flex-col justify-start items-center">
			<h2 className="my-4">ART COLLECTIONS</h2>
			<div className="relative w-full h-[100%] flex justify-center items-center">
				<div className="relative flex flex-col md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 justify-center items-center ml-4">
					{filteredData.map((artwork) => (
						<Card
							key={artwork.id}
							className="rounded-md h-[380px] w-[260px] min-w-[240px]"
						>
							<Link href={`/${artwork.id}`} className="rounded-md">
								<CardHeader className="relative h-[50%]">
									<Image
										src={
											Array.isArray(artwork.img_url)
												? artwork.img_url[0]
												: artwork.img_url
										}
										alt="Artwork Image"
										priority
										fill
										className="w-full rounded-t-md"
									/>
								</CardHeader>
								<CardContent className="max-h-[50%] overflow-y-scroll scrollbar-hide">
									<h6 className="text-sm max-h-9 mt-2 flex justify-between scrollbar-hide overflow-y-scroll">
										{artwork.title}
										<span className="text-[0.5rem] text-gray-500">
											{artwork.id}
										</span>
									</h6>
									<p className="text-xs my-2">by {artwork.artist_full_name}</p>

									<p className="text-xs my-2 max-h-[50px] scrollbar-hide overflow-y-scroll">
										{artwork.description}
									</p>

									<div className="flex justify-between">
										<span className="text-[0.6rem]">
											Area(cm²): {artwork.area}{" "}
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
