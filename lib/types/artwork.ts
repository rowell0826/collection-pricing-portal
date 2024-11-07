export interface ArtWork {
	id: string;
	title: string;
	artist_name: string;
	artist_birth: string;
	date_of_creation: string;
	dimensions: {
		length: number;
		width: number;
		height: number;
	};
	medium: string;
	sale_price: number;
	description: string;
	provenance: string;
	image_url: string[];
}
