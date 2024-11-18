import { Dispatch, SetStateAction } from "react";

export interface ArtWork {
	id: string;
	title: string;
	artist_full_name: string;
	artist_birth: number | string;
	date_of_creation: number | string;
	dimensions: {
		length: number | string;
		width: number | string;
		height: number | string;
	};
	medium: string;
	sale_price: number;
	description: string;
	provenance: string;
	img_url: string;
	aspect_ratio: number;
	area: number;
}

export interface ArtworkContextProps {
	artworkData: ArtWork[];
	filteredData: ArtWork[];
	setArtworkData: Dispatch<SetStateAction<ArtWork[]>>;
	searchArtwork: (q: string) => void;
}
