"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArtWork } from "@/lib/types/artworkTypes";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { showAlert } from "@/lib/helperFunc";
import { Sidebar, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useComps } from "@/lib/context/compsContext/ComparablesContext";

const defaultValue: Partial<ArtWork> = {
	title: "",
	artist_full_name: "",
	medium: "",
	date_of_creation: "",
};

const Comps = () => {
	const [isDisabled, setIsDisabled] = useState<boolean>(false);

	const {
		title,
		setTitle,
		artist,
		setArtist,
		id,
		setId,
		searchResults,
		isSearchEmpty,
		comps,
		compFields,
		isAddEnabled,
		searchHandler,
		handleAddComparison,
		handleInputChange,
		setIsSearchEmpty,
		setSearchResults,
		setComps,
		setCompFields,
	} = useComps();

	const currentYear = new Date().getFullYear();

	const isCompEmpty =
		comps.length === 0 ||
		comps.some((comp) => !comp.title || !comp.artist_full_name || !comp.medium);

	// Send artworks and comps to data science gsheet
	const pricingHandler = async () => {
		setIsDisabled(true);

		const {
			title,
			artist_full_name,
			medium,
			date_of_creation,
			artist_birth,
			description,
			provenance,
			dimensions = { length: 0, width: 0, height: 0 },
			aspect_ratio,
			area,
			img_url,
		} = searchResults;

		const allArtistsMatch = comps.every((comp) => comp.artist_full_name === artist_full_name);

		if (!allArtistsMatch) {
			showAlert("info", "Artist names do not match across all comps. Aborting operation.");
			console.log("Artist names do not match across all comps. Aborting operation.");
			return;
		} else if (comps.length === 0) {
			showAlert("info", "Please add comparables before submitting.");
			console.log("Please add comparables before submitting.");

			return;
		}

		const { length, width, height } = dimensions;

		const validImgUrl = Array.isArray(img_url) ? img_url.join(", ") : img_url;

		try {
			const response = await fetch("/api/appendData", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID,
					range: "input_artwork!A2:M2",
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

			for (let i = 0; i < comps.length; i++) {
				const comp = comps[i];
				const range = `comp_${i + 1}!A2:I2`; //  comp_1, comp_2, comp_3 based on the index iteration
				const compData = [
					comp.title,
					comp.medium,
					comp.length,
					comp.width,
					comp.height,
					comp.date_of_creation,
					comp.date_sold,
					comp.sale_price,
					comp.img_url,
				];

				const compResponse = await fetch("/api/appendData", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID,
						range: range,
						values: [compData],
					}),
				});

				const compTextResponse = await compResponse.text();

				if (compResponse.ok) {
					try {
						const result = JSON.parse(compTextResponse);
						console.log(result);
					} catch (jsonError) {
						console.error("Error parsing JSON:", jsonError);
					}
				} else {
					console.error("Error response:", compTextResponse);
				}
			}

			const compsResponseToSrDataMgr = await fetch("/api/appendData", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					spreadsheetId: process.env.NEXT_PUBLIC_GOOGLE_SHEET_ID2,
					range: "Comps!A2",
					values: [[artist_full_name]],
				}),
			});

			const compsTextResponseToSrDataMgr = await compsResponseToSrDataMgr.text();

			if (compsResponseToSrDataMgr.ok) {
				try {
					const result = JSON.parse(compsTextResponseToSrDataMgr);
					console.log(result);
				} catch (error) {
					console.error("Error parsing JSON:", error);
				}
			} else {
				console.error("Error response:", compsTextResponseToSrDataMgr);
			}
			showAlert("success", "Data has been sent");
		} catch (error) {
			console.error("Network or unexpected error:", error);
		} finally {
			setIsDisabled(false);
		}
	};

	return (
		<SidebarProvider>
			<div className="flex w-screen h-screen">
				<div className="h-[10%] flex justify-between items-center">
					<Button className="ml-4" size={"sm"}>
						<Link href={"/"}>
							<ArrowLeft />
						</Link>
					</Button>
				</div>
				<div className="w-full flex flex-col">
					<div className="h-screen flex justify-center items-center gap-4">
						<Card
							className={`${
								isSearchEmpty ? "hidden" : ""
							} rounded-md h-[360px] w-[240px] min-w-[240px}`}
						>
							<CardHeader className="relative h-[60%]">
								{searchResults.img_url ? (
									<Image
										src={searchResults.img_url}
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
							<CardContent className="h-full max-h-[40%] scrollbar-hide">
								<h6 className="text-sm mt-2 ">{searchResults.title}</h6>
								<p className="text-xs mt-2 max-h-[30px] overflow-y-scroll scrollbar-hide">
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
							</CardContent>
						</Card>

						{/* Comps */}
						{comps.map((comp, index) => (
							<Card
								key={index}
								className={`${
									isCompEmpty ? "hidden" : ""
								} rounded-md h-[360px] w-[240px] min-w-[240px]`}
							>
								<CardHeader className="relative h-[60%]">
									<Image
										src={comp.img_url}
										alt="Comps Image"
										priority
										fill
										className="w-full rounded-t-md"
									/>
								</CardHeader>
								<CardContent className="h-full max-h-[40%] overflow-y-scroll scrollbar-hide">
									<h6 className="text-sm mt-2">{comp.title}</h6>
									<p className="text-xs mt-2">
										Created by {comp.artist_full_name}
									</p>
									<p className="text-xs max-h-[50px] scrollbar-hide overflow-y-scroll">
										Medium: {comp.medium}
									</p>
									<p className="text-xs">Created: {comp.date_of_creation}</p>
									<span className="text-[0.6rem]">
										Sale Price: {`${comp.sale_price} usd`}
									</span>
								</CardContent>
							</Card>
						))}
					</div>
					<div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-20">
						<Button onClick={pricingHandler} disabled={isDisabled}>
							Send for Pricing
						</Button>
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

				{/* Side Dashboard */}
				<div className="relative w-[8%] h-[10%] flex justify-between items-center">
					<SidebarTrigger className="" />
				</div>
				<Sidebar className="w-1/5 h-screen p-4 border-l border-gray-200" side="right">
					<Tabs className="relative w-full">
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
							<div className="min-h-[470px] scrollbar-hide rounded-lg">
								<Card className="max-h-md:max-h-[500px]  overflow-y-scroll scrollbar-hide">
									<CardHeader className="max-h-10">
										<CardTitle className="font-normal mb-2">
											ADD COMPARABLES
										</CardTitle>
									</CardHeader>

									<CardContent className="space-y-2">
										<div className="space-y-1">
											<Label>Artist Name</Label>
											<Input
												id="artist_full_name"
												name="artist_full_name"
												className="h-6"
												value={compFields.artist_full_name || ""}
												onChange={handleInputChange}
											/>
										</div>
										<div className="space-y-1">
											<Label>Title</Label>
											<Input
												id="title"
												name="title"
												className="h-6"
												value={compFields.title || ""}
												onChange={handleInputChange}
											/>
										</div>
										<div className="space-y-1">
											<Label>Medium</Label>
											<Input
												id="medium"
												name="medium"
												className="h-6"
												value={compFields.medium || ""}
												onChange={handleInputChange}
											/>
										</div>
										<div className="space-y-1">
											<Label>Length</Label>
											<Input
												id="length"
												name="length"
												className="h-6"
												value={compFields.length || ""}
												onChange={handleInputChange}
											/>
										</div>
										<div className="space-y-1">
											<Label>Width</Label>
											<Input
												id="width"
												name="width"
												className="h-6"
												value={compFields.width || ""}
												onChange={handleInputChange}
											/>
										</div>
										<div className="space-y-1">
											<Label>Height</Label>
											<Input
												id="height"
												name="height"
												className="h-6"
												value={compFields.height}
												onChange={handleInputChange}
											/>
										</div>
										<div className="space-y-1">
											<Label>Art Creation Date</Label>
											<Input
												id="art_creation_date"
												name="date_of_creation"
												type="number"
												min={1000}
												max={Number(currentYear)}
												className="h-6"
												value={compFields.date_of_creation}
												onChange={handleInputChange}
											/>
										</div>
										<div className="space-y-1">
											<Label>Sale Price(USD)</Label>
											<Input
												id="sale_price"
												name="sale_price"
												type="number"
												className="h-6"
												value={compFields.sale_price}
												onChange={handleInputChange}
											/>
										</div>
										<div className="space-y-1">
											<Label>Date Sold</Label>
											<Input
												id="date_sold"
												name="date_sold"
												type="number"
												min={1900}
												max={Number(currentYear)}
												className="h-6"
												value={compFields.date_sold || ""}
												onChange={handleInputChange}
											/>
										</div>
										<div className="space-y-1">
											<Label>Image url</Label>
											<Input
												id="img_url"
												name="img_url"
												className="h-6"
												value={compFields.img_url || ""}
												onChange={handleInputChange}
											/>
										</div>
									</CardContent>
									<CardFooter className="flex justify-evenly">
										<Button
											onClick={handleAddComparison}
											disabled={!isAddEnabled}
										>
											Add
										</Button>
										<Button
											onClick={() => {
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
												setIsCompEmpty(true);
											}}
										>
											Reset
										</Button>
									</CardFooter>
								</Card>
							</div>
						</TabsContent>
					</Tabs>
				</Sidebar>
			</div>
		</SidebarProvider>
	);
};

export default Comps;
