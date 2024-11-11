export interface ArtWork {
	id: string;
	title: string;
	artist_full_name: string;
	artist_birth: number | undefined;
	date_of_creation: number | undefined;
	dimensions: {
		length: number | undefined;
		width: number | undefined;
		height: number | undefined;
	};
	medium: string;
	sale_price: number;
	description: string;
	provenance: string;
	img_url: string[];
	aspect_ratio: number;
	area: number;
}
