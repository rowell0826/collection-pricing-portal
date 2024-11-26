"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { db } from "@/lib/firebase/firebase";
import { ArtWork } from "@/lib/types/artworkTypes";
import { Comp, CompGroupData } from "@/lib/types/comparablesTypes";
import { collection, getDocs, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const CompsResultsTable = () => {
	const [compData, setCompData] = useState<CompGroupData[]>([]);

	useEffect(() => {
		const fetchCompData = async () => {
			const compRef = collection(db, "comps");
			const compDataQuery = query(compRef);

			try {
				const compDataSnapshot = await getDocs(compDataQuery);
				const compDataSet: CompGroupData[] = compDataSnapshot.docs.map((comp) => {
					const data = comp.data();
					return {
						id: Number(comp.id),
						date_created: data.date_created || "",
						artwork: (data.artwork as ArtWork) || "",
						comps: (data.comps as Comp[]) || [],
						calculated_price: data.calculated_price || "",
					};
				});

				setCompData(compDataSet);
			} catch (error) {
				console.log("Unable to fetch data. ", error);
			}
		};

		fetchCompData();
	}, []);

	console.log(`CompData: ${compData}`);

	return (
		<div className="w-screen h-full relative flex flex-col items-center">
			<div className="w-full flex justify-start items-center">
				<Button className="ml-4 my-4" size={"sm"}>
					<Link href={"/"}>
						<ArrowLeft />
					</Link>
				</Button>
			</div>
			<Table className="w-[80%] justify-self-center mt-4">
				<TableHeader>
					<TableRow>
						<TableHead>ID</TableHead>
						<TableHead>Artist Name</TableHead>
						<TableHead>Artwork Title</TableHead>
						<TableHead>Artwork Title (Comp#1)</TableHead>
						<TableHead>Artwork Title (Comp#2)</TableHead>
						<TableHead>Artwork Title (Comp#3)</TableHead>
						<TableHead>Calculated Price (USD)</TableHead>
						<TableHead>Date Created</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{/* Map the data here */}
					{compData.map((comp) => (
						<TableRow key={comp.id}>
							<TableCell>{comp.id}</TableCell>
							<TableCell>{comp.artwork.artist_full_name}</TableCell>
							<TableCell>{comp.artwork.title}</TableCell>
							<TableCell>{comp.comps[0].title}</TableCell>
							<TableCell>{comp.comps[1].title}</TableCell>
							<TableCell>{comp.comps[2].title}</TableCell>
							<TableCell>{comp.calculated_price}</TableCell>
							<TableCell>
								{new Date(
									(comp.date_created as { seconds: number }).seconds * 1000
								).toString()}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
};

export default CompsResultsTable;
