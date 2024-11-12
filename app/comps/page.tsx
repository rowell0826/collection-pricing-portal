"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/lib/firebase/firebase";
import { ArtWork } from "@/lib/types/artworkTypes";
import { collection, doc, getDocs, query, where } from "firebase/firestore";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
				} else {
					console.log("No matching documents found.");
					setSearchResults(defaultValue);
				}
			} else {
				console.log("No query criteria provided.");
			}
		} catch (error) {
			console.error("Error searching for artwork:", error);
		}
	};

	return (
		<div className="flex">
			<Link href={"/"}>
				<Button className="ml-4 mt-4 absolute" size={"sm"}>
					<ArrowLeft />
				</Button>
			</Link>
			<div className="flex-1 flex justify-center items-center gap-4">
				<Card className="rounded-md h-[340px] w-[240px] min-w-[240px]">
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
								src="https://via.placeholder.com/240x340" // Fallback Image
								alt="Artwork Image"
								priority
								fill
								className="w-full rounded-t-md"
							/>
						)}
					</CardHeader>
					<CardContent className="h-full max-h-[40%] overflow-y-scroll scrollbar-hide">
						<h6 className="text-sm mt-2">{searchResults.title}</h6>
						<p className="text-xs mt-2">{searchResults.artist_full_name}</p>

						<p className="text-xs max-h-[50px] scrollbar-hide overflow-y-scroll">
							Medium: {searchResults.medium}
						</p>

						<p className="text-xs">Created: {searchResults.date_of_creation}</p>

						<span className="text-[0.6rem]">
							Sale Price: {searchResults.sale_price}
						</span>
					</CardContent>
				</Card>

				{/* Comps */}
				<Card className="rounded-md h-[340px] w-[240px] min-w-[240px]">
					<CardHeader className="relative h-[60%]">
						<Image
							src={"https://via.placeholder.com/240x340"}
							alt="Artwork Image"
							priority
							fill
							className="w-full rounded-t-md"
						/>
					</CardHeader>
					<CardContent className="h-full max-h-[40%] overflow-y-scroll scrollbar-hide">
						<h6 className="text-sm mt-2">Artwork Title</h6>

						<p className="text-xs mt-2">Created by Artist Full name</p>

						<p className="text-xs max-h-[50px] scrollbar-hide overflow-y-scroll">
							Medium:
						</p>

						<p className="text-xs">Created: 1940</p>

						<span className="text-[0.6rem]">Sale Price</span>
					</CardContent>
				</Card>
			</div>
			<Tabs className="w-1/5 h-screen p-4 border-l border-gray-200 min-w-[240px]">
				<TabsList>
					<TabsTrigger value="artwork">Artwork</TabsTrigger>
					<TabsTrigger value="comparables">Comparables</TabsTrigger>
				</TabsList>
				<TabsContent value="artwork">
					<Card>
						<CardHeader>Search Artwork</CardHeader>
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
							<Button>Reset</Button>
						</CardFooter>
					</Card>
				</TabsContent>
				<TabsContent value="comparables">
					<Card className="min-w-[300px]">
						<CardHeader>Add Comparables</CardHeader>
						<CardContent className="space-y-2">
							<div className="space-y-1">
								<Label>Artist Name</Label>
								<Input id="artist_full_name" className="h-6" />
							</div>
							<div className="space-y-1">
								<Label>Title</Label>
								<Input id="title" className="h-6" />
							</div>
							<div className="space-y-1">
								<Label>Medium</Label>
								<Input id="medium" className="h-6" />
							</div>
							<div className="space-y-1">
								<Label>Art Creation Date</Label>
								<Input id="art_creation_date" className="h-6" />
							</div>
							<div className="space-y-1">
								<Label>Sale Price</Label>
								<Input id="sale_price" className="h-6" />
							</div>
						</CardContent>
						<CardFooter className="flex justify-evenly">
							<Button>Add</Button>
							<Button>Reset</Button>
						</CardFooter>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
};

export default Comps;
