"use client";
import { db } from "@/lib/firebase/firebase";
import { ArtWork } from "@/lib/types/artworkTypes";
import { Comp, CompsContextType } from "@/lib/types/comparablesTypes";
import { collection, getDocs, query, where } from "firebase/firestore";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const defaultValue: Partial<ArtWork> = {
	title: "",
	artist_full_name: "",
	medium: "",
	date_of_creation: "",
};

const CompsContext = createContext<CompsContextType | undefined>(undefined);

export const CompsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [title, setTitle] = useState<string>("");
	const [id, setId] = useState<string>("");
	const [artist, setArtist] = useState<string>("");
	const [searchResults, setSearchResults] = useState<Partial<ArtWork>>({});
	const [isSearchEmpty, setIsSearchEmpty] = useState<boolean>(true);

	// Comps state handlers
	const [comps, setComps] = useState<Comp[]>([]);
	const [compFields, setCompFields] = useState<Partial<Comp>>({
		artist_full_name: "",
		title: "",
		medium: "",
		date_of_creation: "",
		sale_price: "",
		length: "",
		width: "",
		height: "",
		date_sold: "",
		img_url: "",
	});

	useEffect(() => {
		const storedSearchResults = localStorage.getItem("searchResults");
		const storedComps = localStorage.getItem("comps");

		if (storedSearchResults) {
			setSearchResults(JSON.parse(storedSearchResults));
			setIsSearchEmpty(false);
		}
		if (storedComps) {
			setComps(JSON.parse(storedComps));
		}
	}, []);

	useEffect(() => {
		if (!isSearchEmpty) {
			localStorage.setItem("searchResults", JSON.stringify(searchResults));
		} else {
			localStorage.removeItem("searchResults");
		}
	}, [searchResults, isSearchEmpty]);

	useEffect(() => {
		if (comps.length > 0) {
			localStorage.setItem("comps", JSON.stringify(comps));
		} else {
			localStorage.removeItem("comps");
		}
	}, [comps]);

	const searchHandler = async () => {
		try {
			const artworkRef = collection(db, "artworks");
			let q;

			if (title) {
				q = query(
					artworkRef,
					where("title", ">=", title),
					where("title", "<=", title + "\uf8ff")
				);
			} else if (artist) {
				q = query(
					artworkRef,
					where("artist_full_name", ">=", artist),
					where("artist_full_name", "<=", artist + "\uf8ff")
				);
			} else if (id) {
				q = query(artworkRef, where("id", "==", id));
			}

			if (q) {
				const querySnapshot = await getDocs(q);
				if (!querySnapshot.empty) {
					const doc = querySnapshot.docs[0];
					setSearchResults({ id: doc.id, ...doc.data() } as ArtWork);
					setIsSearchEmpty(false);
				} else {
					console.log("No matching documents found.");
					setSearchResults(defaultValue);
					setIsSearchEmpty(true);
				}
			} else {
				console.log("No query criteria provided.");
			}
		} catch (error) {
			console.error("Error searching for artwork:", error);
		}
	};

	const addCompHandler = (comp: Partial<Comp>) => {
		setComps((prevComps) => {
			const completeComp: Comp = {
				artist_full_name: comp.artist_full_name || "",
				title: comp.title || "",
				medium: comp.medium || "",
				date_of_creation: comp.date_of_creation || "",
				sale_price: comp.sale_price || 0,
				length: comp.length || 0,
				width: comp.width || 0,
				height: comp.height || 0,
				date_sold: comp.date_sold || "",
				img_url: comp.img_url || "",
			};

			const updatedComps =
				prevComps.length < 3
					? [...prevComps, completeComp]
					: [...prevComps.slice(1), completeComp];
			return updatedComps;
		});
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		setCompFields((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleAddComparison = () => {
		addCompHandler(compFields);
		setCompFields({
			artist_full_name: "",
			title: "",
			medium: "",
			date_of_creation: "",
			sale_price: "",
			length: "",
			width: "",
			height: "",
			date_sold: "",
			img_url: "",
		});
	};

	const isAddEnabled = useMemo(() => {
		return (
			Boolean(compFields.title) &&
			Boolean(compFields.artist_full_name) &&
			Boolean(compFields.medium) &&
			Boolean(compFields.height) &&
			Boolean(compFields.width) &&
			Boolean(compFields.date_of_creation) &&
			Boolean(compFields.date_sold) &&
			Boolean(compFields.sale_price)
		);
	}, [compFields]);

	return (
		<CompsContext.Provider
			value={{
				title,
				setTitle,
				artist,
				setArtist,
				compFields,
				id,
				setId,
				searchResults,
				setSearchResults,
				isSearchEmpty,
				setIsSearchEmpty,
				comps,
				addCompHandler,
				isAddEnabled,
				searchHandler,
				handleInputChange,
				handleAddComparison,
				setComps,
				setCompFields,
			}}
		>
			{children}
		</CompsContext.Provider>
	);
};

export const useComps = () => {
	const context = useContext(CompsContext);
	if (!context) {
		throw new Error("useComps must be used within a CompsProvider");
	}
	return context;
};
