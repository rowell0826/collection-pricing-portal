"use client";

import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CompsResultsTable = () => {
	return (
		<Table className="flex justify-center">
			<TableHeader>
				<TableRow>
					<TableHead>ID</TableHead>
					<TableHead>Artist Name</TableHead>
					<TableHead>Artwork Title</TableHead>
					<TableHead>Artwork Title (Comp#1)</TableHead>
					<TableHead>Artwork Title (Comp#2)</TableHead>
					<TableHead>Artwork Title (Comp#3)</TableHead>
					<TableHead>Calculated Price (USD)</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{/* Map the data here */}
				<TableRow>
					<TableHead></TableHead>
					<TableHead></TableHead>
					<TableHead></TableHead>
					<TableHead></TableHead>
					<TableHead></TableHead>
					<TableHead></TableHead>
					<TableHead></TableHead>
				</TableRow>
			</TableBody>
		</Table>
	);
};

export default CompsResultsTable;
