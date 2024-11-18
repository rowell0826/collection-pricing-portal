"use client";
import { db } from "@/lib/firebase/firebase";
import { ArtWork, ArtworkContextProps } from "@/lib/types/artworkTypes";
import { collection, getDocs, query } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";

const ArtworkContext = createContext<ArtworkContextProps | undefined>(undefined);

export const ArtworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [artworkData, setArtworkData] = useState<ArtWork[]>([]);
	const [filteredData, setFilteredData] = useState<ArtWork[]>([]);

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
					setFilteredData(artworks);
				}
			} catch (error) {
				console.error("Failed to fetch data", error);
			}
		};

		fetchArtworkData();
	}, []);

	const searchArtwork = (query: string) => {
		const lowerCaseQuery = query.toLowerCase();
		const filtered = artworkData.filter(
			(artwork) =>
				artwork.title.toLowerCase().includes(lowerCaseQuery) ||
				artwork.artist_full_name.toLowerCase().includes(lowerCaseQuery)
		);
		setFilteredData(filtered);
	};

	return (
		<ArtworkContext.Provider
			value={{ artworkData, filteredData, setArtworkData, searchArtwork }}
		>
			{children}
		</ArtworkContext.Provider>
	);
};

export const useArtwork = (): ArtworkContextProps => {
	const context = useContext(ArtworkContext);

	if (!context) {
		throw new Error("useArtwork must be used within an ArtworkProvider");
	}

	return context;
};
