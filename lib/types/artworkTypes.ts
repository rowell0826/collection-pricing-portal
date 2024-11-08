export interface ArtWork {
	id: string;
	title: string;
	artist_full_name: string;
	artist_birth: number | undefined;
	date_of_creation: number | undefined;
	dimensions: {
		length: number;
		width: number;
		height: number;
	};
	medium: string;
	sale_price: number;
	description: string;
	provenance: string;
	img_url: string[];
	aspect_ratio: number;
	area: number;
}
