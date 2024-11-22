import { Dispatch, SetStateAction } from "react";
import { ArtWork } from "./artworkTypes";

export interface Comp {
	artist_full_name: string;
	title: string;
	medium: string;
	date_of_creation: number | "";
	date_sold: number | "";
	length: number | "";
	width: number | "";
	height: number | "";
	sale_price: number | "";
	img_url: string;
}

export interface CompsContextType {
	title: string;
	setTitle: (value: string) => void;
	artist: string;
	setArtist: (value: string) => void;
	id: string;
	setId: (value: string) => void;
	searchResults: Partial<ArtWork>;
	setSearchResults: (value: Partial<ArtWork>) => void;
	isSearchEmpty: boolean;
	setIsSearchEmpty: Dispatch<SetStateAction<boolean>>;
	comps: Comp[];
	compFields: Partial<Comp>;
	setComps: Dispatch<SetStateAction<Comp[]>>;
	setCompFields: Dispatch<SetStateAction<Partial<Comp>>>;
	addCompHandler: (comp: Partial<Comp>) => void;
	isAddEnabled: boolean;
	searchHandler: () => Promise<void>;
	handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleAddComparison: () => void;
}
