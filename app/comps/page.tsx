"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/firebase/firebase";
import { ArtWork } from "@/lib/types/artworkTypes";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { google } from "googleapis";

export interface Comp {
	artist_full_name: string;
	title: string;
	medium: string;
	date_of_creation: number | "";
	sale_price: number;
	img_url: string[];
}

const defaultValue: Partial<ArtWork> = {
	title: "",
	artist_full_name: "",
	medium: "",
	date_of_creation: "",
	sale_price: 0,
};

const Comps = () => {
	const [title, setTitle] = useState<string>("");
	const [id, setId] = useState<string>("");
	const [artist, setArtist] = useState<string>("");
	const [searchResults, setSearchResults] = useState<Partial<ArtWork>>(defaultValue);
	const [isSearchEmpty, setIsSearchEmpty] = useState<boolean>(true);
	const [isCompEmpty, setIsCompEmpty] = useState<boolean>(true);

	// Comps state handlers
	const [comps, setComps] = useState<Comp[]>([]);
	const [compTitle, setCompTitle] = useState<string>("");
	const [compArtist, setCompArtist] = useState<string>("");
	const [compMedium, setCompMedium] = useState<string>("");
	const [compCreation, setCompCreation] = useState<number | "">("");
	const [compPrice, setCompPrice] = useState<number>(0);
	const [compImg, setCompImg] = useState<string[]>([]);

	const currentYear = new Date().getFullYear();

	useEffect(() => {
		const storedSearchResults = localStorage.getItem("searchResults");
		const storedComps = localStorage.getItem("comps");

		if (storedSearchResults) {
			setSearchResults(JSON.parse(storedSearchResults));
			setIsSearchEmpty(false);
		}
		if (storedComps) {
			setComps(JSON.parse(storedComps));
			setIsCompEmpty(false);
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
		if (!isCompEmpty) {
			localStorage.setItem("comps", JSON.stringify(comps));
		} else {
			localStorage.removeItem("comps");
		}
	}, [comps, isCompEmpty]);

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

	const addCompHandler = () => {
		const newComp = {
			artist_full_name: compArtist,
			title: compTitle,
			medium: compMedium,
			date_of_creation: compCreation,
			sale_price: compPrice,
			img_url: compImg,
		};
		setComps((prevComps) => {
			const updatedComps =
				prevComps.length < 3 ? [...prevComps, newComp] : [...prevComps.slice(1), newComp];
			setIsCompEmpty(false);
			return updatedComps;
		});

		setCompTitle("");
		setCompArtist("");
		setCompCreation("");
		setCompImg([]);
		setCompMedium("");
		setCompPrice(0);
	};

	const isAddEnabled = useMemo(() => {
		return (
			compArtist.trim() !== "" &&
			compTitle.trim() !== "" &&
			compMedium.trim() !== "" &&
			compCreation &&
			compPrice > 0 &&
			compImg.length > 0
		);
	}, [compArtist, compTitle, compMedium, compCreation, compPrice, compImg]);

	const pricingHandler = async () => {
		const {
			title,
			artist_full_name,
			medium,
			date_of_creation,
			sale_price,
			artist_birth,
			description,
			provenance,
			dimensions = { length: 0, width: 0, height: 0 },
			aspect_ratio,
			area,
			img_url,
		} = searchResults;

		const { length, width, height } = dimensions;

		const validImgUrl = Array.isArray(img_url) ? img_url.join(", ") : img_url;

		try {
			const response = await fetch("/api/appendData", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					spreadsheetId: "1BPMFSCd449_5-zC8-dZf97s1rPfqMv-HLJCORdFSorw",
					range: "Sheet1!A2:M2",
					values: [
						[
							artist_full_name,
							artist_birth,
							title,
							date_of_creation,
							medium,
							description,
							provenance,
							length,
							width,
							height,
							aspect_ratio,
							area,
							validImgUrl,
							sale_price,
						],
					],
				}),
			});

			const textResponse = await response.text();

			if (response.ok) {
				try {
					const result = JSON.parse(textResponse);
					console.log(result);
				} catch (jsonError) {
					console.error("Error parsing JSON:", jsonError);
				}
			} else {
				console.error("Error response:", textResponse);
			}
		} catch (error) {
			console.error("Network or unexpected error:", error);
		}
	};

	return (
		<div className="flex w-screen h-screen">
			<div className="flex-1 flex flex-col">
				<Link href={"/"}>
					<Button className="ml-4 mt-4 " size={"sm"}>
						<ArrowLeft />
					</Button>
				</Link>
				<div className="h-screen flex justify-center items-center gap-4">
					<Card
						className={`${
							isSearchEmpty ? "hidden" : ""
						} rounded-md h-[340px] w-[240px] min-w-[240px}`}
					>
						<CardHeader className="relative h-[60%]">
							{Array.isArray(searchResults.img_url) &&
							searchResults.img_url.length > 0 ? (
								<Image
									src={searchResults.img_url[0]}
									alt="Artwork Image"
									priority
									fill
									className="w-full rounded-t-md"
								/>
							) : (
								<Image
									src="https://via.placeholder.com/240x340"
									alt="Artwork Image"
									priority
									fill
									className="w-full rounded-t-md"
								/>
							)}
						</CardHeader>
						<CardContent className="h-full max-h-[40%] overflow-y-scroll scrollbar-hide">
							<h6 className="text-sm mt-2">{searchResults.title}</h6>
							<p className="text-xs mt-2">
								Created by {searchResults.artist_full_name}
							</p>

							<p className="text-xs max-h-[50px] scrollbar-hide overflow-y-scroll">
								Medium: {searchResults.medium}
							</p>

							<p className="text-xs">
								Created:{" "}
								{Number.isNaN(searchResults.date_of_creation)
									? ""
									: searchResults.date_of_creation}
							</p>

							<span className="text-[0.6rem]">
								Sale Price:{" "}
								{Number.isNaN(searchResults.sale_price)
									? ""
									: searchResults.sale_price}
							</span>
						</CardContent>
					</Card>

					{/* Comps */}
					{comps.map((comp, index) => (
						<Card
							key={index}
							className={`${
								isCompEmpty ? "hidden" : ""
							} rounded-md h-[340px] w-[240px] min-w-[240px]`}
						>
							<CardHeader className="relative h-[60%]">
								<Image
									src={comp.img_url[0]}
									alt="Comps Image"
									priority
									fill
									className="w-full rounded-t-md"
								/>
							</CardHeader>
							<CardContent className="h-full max-h-[40%] overflow-y-scroll scrollbar-hide">
								<h6 className="text-sm mt-2">{comp.title}</h6>
								<p className="text-xs mt-2">Created by {comp.artist_full_name}</p>
								<p className="text-xs max-h-[50px] scrollbar-hide overflow-y-scroll">
									Medium: {comp.medium}
								</p>
								<p className="text-xs">Created: {comp.date_of_creation}</p>
								<span className="text-[0.6rem]">Sale Price: {comp.sale_price}</span>
							</CardContent>
						</Card>
					))}
				</div>
				<div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-20">
					<Button onClick={pricingHandler}>Send for Pricing</Button>
					<Button
						onClick={() => {
							setSearchResults(defaultValue);
							setComps([]);
							setIsCompEmpty(true);
							setIsSearchEmpty(true);
						}}
					>
						Reset
					</Button>
				</div>
			</div>

			<Tabs className="w-1/5 h-screen p-4 border-l border-gray-200 min-w-[240px]">
				<TabsList>
					<TabsTrigger value="artwork">Artwork</TabsTrigger>
					<TabsTrigger value="comparables">Comparables</TabsTrigger>
				</TabsList>
				<TabsContent value="artwork">
					<Card>
						<CardHeader>
							<CardTitle className="font-normal">SEARCH ARTWORK</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="space-y-1">
								<Label>ID</Label>
								<Input
									id="id"
									className="h-6"
									value={id}
									onChange={(e) => setId(e.target.value)}
								/>
							</div>
							<div className="space-y-1">
								<Label>Title</Label>
								<Input
									id="title"
									className="h-6"
									value={title}
									onChange={(e) => setTitle(e.target.value)}
								/>
							</div>
							<div className="space-y-1">
								<Label>Artist Name</Label>
								<Input
									id="artist_name"
									className="h-6"
									value={artist}
									onChange={(e) => setArtist(e.target.value)}
								/>
							</div>
						</CardContent>
						<CardFooter className="flex justify-evenly">
							<Button onClick={searchHandler}>Search</Button>
							<Button
								onClick={() => {
									setId("");
									setTitle("");
									setArtist("");
									setIsSearchEmpty(true);
									setSearchResults(defaultValue);
								}}
							>
								Reset
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>
				<TabsContent value="comparables">
					<Card>
						<CardHeader className="max-h-10">
							<CardTitle className="font-normal">ADD COMPARABLES</CardTitle>
						</CardHeader>
						<CardContent className="space-y-2">
							<div className="space-y-1">
								<Label>Artist Name</Label>
								<Input
									id="artist_full_name"
									className="h-6"
									value={compArtist}
									onChange={(e) => setCompArtist(e.target.value)}
								/>
							</div>
							<div className="space-y-1">
								<Label>Title</Label>
								<Input
									id="title"
									className="h-6"
									value={compTitle}
									onChange={(e) => setCompTitle(e.target.value)}
								/>
							</div>
							<div className="space-y-1">
								<Label>Medium</Label>
								<Input
									id="medium"
									className="h-6"
									value={compMedium}
									onChange={(e) => setCompMedium(e.target.value)}
								/>
							</div>
							<div className="space-y-1">
								<Label>Art Creation Date</Label>
								<Input
									id="art_creation_date"
									type="number"
									min={1000}
									max={Number(currentYear)}
									className="h-6"
									value={compCreation}
									onChange={(e) => setCompCreation(Number(e.target.value))}
								/>
							</div>
							<div className="space-y-1">
								<Label>Sale Price(USD)</Label>
								<Input
									id="sale_price"
									type="number"
									className="h-6"
									value={compPrice}
									onChange={(e) => setCompPrice(Number(e.target.value))}
								/>
							</div>
							<div className="space-y-1">
								<Label>Image url</Label>
								<Input
									id="img_url"
									className="h-6"
									value={compImg}
									onChange={(e) =>
										setCompImg((prev) => [...prev, e.target.value])
									}
								/>
							</div>
						</CardContent>
						<CardFooter className="flex justify-evenly">
							<Button onClick={addCompHandler} disabled={!isAddEnabled}>
								Add
							</Button>
							<Button
								onClick={() => {
									setCompArtist("");
									setCompCreation("");
									setCompImg([]);
									setCompMedium("");
									setCompPrice(0);
									setCompTitle("");
									setIsCompEmpty(true);
								}}
							>
								Reset
							</Button>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Comps;
