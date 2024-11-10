"use client";
import { FormItems } from "@/lib/types/formTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { ArtWork } from "@/lib/types/artworkTypes";
import { addDoc, collection } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";
import { generateUniqueId } from "@/lib/helperFunc";

const formSchema = z.object({
	title: z.string(),
	artist_full_name: z
		.string()
		.min(6, { message: "Artist name must be at least 6 characters long" }),
	artist_birth: z.number().optional(),
	date_of_creation: z.number().optional(),
	medium: z.string(),
	description: z.string(),
	provenance: z.string(),
	length: z.number().positive().default(0),
	width: z.number().positive().default(0),
	height: z.number().positive().default(0),
	aspect_ratio: z.number().default(0),
	area: z.number().default(0),
	img_url: z.string(),
	sale_price: z.number().default(0),
});

const formItemLabels: FormItems[] = [
	{
		labelText: "Artwork title",
		placeHolderText: "Artwork title",
		inputType: "text",
		formDefaultValue: "title",
	},
	{
		labelText: "Artist Full Name",
		placeHolderText: "Enter artist's full name",
		inputType: "text",
		formDefaultValue: "artist_full_name",
	},
	{
		labelText: "Artist Birth Date",
		placeHolderText: "Select artist's birth date",
		inputType: "number",
		formDefaultValue: "artist_birth",
	},
	{
		labelText: "Year of Creation",
		placeHolderText: "Select creation date",
		inputType: "number",
		formDefaultValue: "year_of_creation",
	},
	{
		labelText: "Medium",
		placeHolderText: "Enter medium of artwork",
		inputType: "text",
		formDefaultValue: "medium",
	},
	{
		labelText: "Image URL",
		placeHolderText: "Enter image URL",
		inputType: "url",
		formDefaultValue: "img_url",
	},
	{
		labelText: "Description",
		placeHolderText: "Enter description",
		inputType: "text",
		formDefaultValue: "description",
	},
	{
		labelText: "Provenance",
		placeHolderText: "Enter provenance information",
		inputType: "text",
		formDefaultValue: "provenance",
	},
	{
		labelText: "Length (cm)",
		placeHolderText: "Enter length",
		inputType: "number",
		formDefaultValue: "length",
	},
	{
		labelText: "Width (cm)",
		placeHolderText: "Enter width",
		inputType: "number",
		formDefaultValue: "width",
	},
	{
		labelText: "Height (cm)",
		placeHolderText: "Enter height",
		inputType: "number",
		formDefaultValue: "height",
	},
	{
		labelText: "Aspect Ratio",
		placeHolderText: "Auto-calculated aspect ratio",
		inputType: "number",
		formDefaultValue: "aspect_ratio",
	},
	{
		labelText: "Area (sq. cm)",
		placeHolderText: "Auto-calculated area",
		inputType: "number",
		formDefaultValue: "area",
	},
	{
		labelText: "Sale Price",
		placeHolderText: "Input sale price in usd",
		inputType: "number",
		formDefaultValue: "sale_price",
	},
];

const ArtworkForm = () => {
	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			artist_full_name: "",
			artist_birth: undefined,
			date_of_creation: undefined,
			medium: "",
			description: "",
			provenance: "",
			length: 0,
			width: 0,
			height: 0,
			aspect_ratio: 0,
			area: 0,
			img_url: "",
		},
	});

	const handleSubmit = async (data: z.infer<typeof formSchema>) => {
		const artworkId = generateUniqueId();

		try {
			const artwork: ArtWork = {
				id: artworkId,
				title: data.title,
				artist_full_name: data.artist_full_name,
				artist_birth: Number(data.artist_birth),
				date_of_creation: Number(data.date_of_creation),
				medium: data.medium,
				img_url: [data.img_url],
				description: data.description,
				provenance: data.provenance,
				dimensions: {
					length: Number(data.length),
					width: Number(data.width),
					height: Number(data.height),
				},
				aspect_ratio: data.width / data.height,
				area: data.width * data.height,
				sale_price: 0,
			};
			await addDoc(collection(db, "artworks"), artwork);

			console.log("Artwork added");
		} catch (error) {
			console.log("Failed to add to firestore collection ", error);
		}
	};

	return (
		<section className="max-w-screen flex flex-col items-center mt-4">
			<div className="border border-slate-100 shadow-lg rounded-lg p-8 w-full min-w-80 max-h-max text-foreground bg-white">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(handleSubmit)}>
						<div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
							{/* Artwork Title */}
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem className="col-span-1">
										<FormLabel>Artwork title</FormLabel>
										<FormControl>
											<Input placeholder="Artwork title" {...field} />
										</FormControl>
										<FormMessage>
											{form.formState.errors.title?.message}
										</FormMessage>
									</FormItem>
								)}
							/>

							{/* Artist Full Name */}
							<FormField
								control={form.control}
								name="artist_full_name"
								render={({ field }) => (
									<FormItem className="col-span-1">
										<FormLabel>Artist Full Name</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter artist's full name"
												{...field}
											/>
										</FormControl>
										<FormMessage>
											{form.formState.errors.artist_full_name?.message}
										</FormMessage>
									</FormItem>
								)}
							/>

							{/* Artist Birth Date */}
							<FormField
								control={form.control}
								name="artist_birth"
								render={({ field }) => {
									const displayValue = field.value ?? undefined;

									return (
										<FormItem className="col-span-1">
											<FormLabel>Artist Birth Date</FormLabel>
											<FormControl>
												<Input
													placeholder="Enter a year"
													type="number"
													{...field}
													value={Number(displayValue)}
													min={1000}
													max={2010}
													onChange={(e) =>
														field.onChange(Number(e.target.value))
													}
												/>
											</FormControl>
											<FormMessage>
												{form.formState.errors.artist_birth?.message}
											</FormMessage>
										</FormItem>
									);
								}}
							/>

							{/* Date of Creation */}
							<FormField
								control={form.control}
								name="date_of_creation"
								render={({ field }) => {
									const currentYear = new Date().getFullYear();

									const displayValue = field.value ?? undefined;

									return (
										<FormItem className="col-span-1">
											<FormLabel>Date of Creation</FormLabel>
											<FormControl>
												<Input
													type="number"
													placeholder="Enter a year"
													{...field}
													value={Number(displayValue)}
													min={1000}
													max={currentYear}
													onChange={(e) =>
														field.onChange(Number(e.target.value))
													}
												/>
											</FormControl>
											<FormMessage>
												{form.formState.errors.date_of_creation?.message}
											</FormMessage>
										</FormItem>
									);
								}}
							/>

							{/* Medium */}
							<FormField
								control={form.control}
								name="medium"
								render={({ field }) => (
									<FormItem className="col-span-1">
										<FormLabel>Medium</FormLabel>
										<FormControl>
											<Input
												placeholder="Enter medium of artwork"
												{...field}
											/>
										</FormControl>
										<FormMessage>
											{form.formState.errors.medium?.message}
										</FormMessage>
									</FormItem>
								)}
							/>

							{/* Image URL */}
							<FormField
								control={form.control}
								name="img_url"
								render={({ field }) => (
									<FormItem className="col-span-1">
										<FormLabel>Image URL</FormLabel>
										<FormControl>
											<Input placeholder="Enter image URL" {...field} />
										</FormControl>
										<FormMessage>
											{form.formState.errors.img_url?.message}
										</FormMessage>
									</FormItem>
								)}
							/>

							{/* Description */}
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem className="col-span-1">
										<FormLabel>Description</FormLabel>
										<FormControl>
											<textarea
												placeholder="Enter description"
												className="border border-gray-300 rounded-md p-2 h-32 resize-none w-full"
												{...field}
											/>
										</FormControl>
										<FormMessage>
											{form.formState.errors.description?.message}
										</FormMessage>
									</FormItem>
								)}
							/>

							{/* Provenance */}
							<FormField
								control={form.control}
								name="provenance"
								render={({ field }) => (
									<FormItem className="col-span-1">
										<FormLabel>Provenance</FormLabel>
										<FormControl>
											<textarea
												placeholder="Enter provenance information"
												className="border border-gray-300 rounded-md p-2 h-32 resize-none w-full"
												{...field}
											/>
										</FormControl>
										<FormMessage>
											{form.formState.errors.provenance?.message}
										</FormMessage>
									</FormItem>
								)}
							/>

							{/* Length, Width (Stacked in One Column) */}
							<div className="col-span-1 grid gap-4">
								{["length", "width"].map((dimension) => (
									<FormField
										key={dimension}
										control={form.control}
										name={dimension as keyof z.infer<typeof formSchema>}
										render={({ field }) => {
											const displayValue = field.value ?? 0;

											return (
												<FormItem>
													<FormLabel>
														{dimension.charAt(0).toUpperCase() +
															dimension.slice(1)}{" "}
														(cm)
													</FormLabel>
													<FormControl>
														<Input
															type="number"
															placeholder={`Enter ${dimension}`}
															{...field}
															value={Number(displayValue)}
															onChange={(e) =>
																field.onChange(
																	Number(e.target.value)
																)
															}
														/>
													</FormControl>
													<FormMessage>
														{
															form.formState.errors[
																dimension as keyof z.infer<
																	typeof formSchema
																>
															]?.message
														}
													</FormMessage>
												</FormItem>
											);
										}}
									/>
								))}
							</div>

							{/* Aspect Ratio */}
							<FormField
								control={form.control}
								name="aspect_ratio"
								render={({ field }) => (
									<FormItem className="col-span-1">
										<FormLabel>Aspect Ratio</FormLabel>
										<FormControl>
											<Input
												placeholder="Auto-calculated aspect ratio"
												disabled
												{...field}
											/>
										</FormControl>
										<FormMessage>
											{form.formState.errors.aspect_ratio?.message}
										</FormMessage>
									</FormItem>
								)}
							/>

							{/* Area */}
							<FormField
								control={form.control}
								name="area"
								render={({ field }) => (
									<FormItem className="col-span-1">
										<FormLabel>Area (sq. cm)</FormLabel>
										<FormControl>
											<Input
												placeholder="Auto-calculated area"
												disabled
												{...field}
											/>
										</FormControl>
										<FormMessage>
											{form.formState.errors.area?.message}
										</FormMessage>
									</FormItem>
								)}
							/>
							{/* Height */}
							<FormField
								control={form.control}
								name="height"
								render={({ field }) => (
									<FormItem className="col-span-1">
										<FormLabel>Height (cm)</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder={"Enter height"}
												{...field}
												value={Number(field.value)}
												onChange={(e) =>
													field.onChange(Number(e.target.value))
												}
											/>
										</FormControl>
										<FormMessage>
											{form.formState.errors.area?.message}
										</FormMessage>
									</FormItem>
								)}
							/>

							{/* Sale Price */}
							<FormField
								control={form.control}
								name="sale_price"
								render={({ field }) => (
									<FormItem className="col-span-1">
										<FormLabel>Sale Price (usd)</FormLabel>
										<FormControl>
											<Input
												type="number"
												placeholder={"Enter sale price"}
												{...field}
												value={Number(field.value)}
												onChange={(e) => {
													console.log(typeof Number(e.target.value));
													field.onChange(Number(e.target.value));
												}}
											/>
										</FormControl>
										<FormMessage>
											{form.formState.errors.area?.message}
										</FormMessage>
									</FormItem>
								)}
							/>
						</div>
						<div className="w-full relative flex justify-center gap-4 mt-4">
							<Button type="submit">ADD</Button>
							<Button>RESET</Button>
						</div>
					</form>
				</Form>
			</div>
		</section>
	);
};

export default ArtworkForm;
