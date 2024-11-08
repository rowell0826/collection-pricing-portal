"use client";
import { FormItems } from "@/lib/types/formTypes";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

const formSchema = z.object({
	title: z.string(),
	artist_full_name: z
		.string()
		.min(6, { message: "Artist name must be at least 6 characters long" }),
	artist_birth: z.date().max(new Date(), { message: "Too young!" }).optional(),
	date_of_creation: z.date().optional(),
	medium: z.string(),
	description: z.string(),
	provenance: z.string(),
	length: z.number(),
	width: z.number(),
	height: z.number(),
	aspect_ratio: z.number(), // width/height
	area: z.number(), // width x height
	img_url: z.string(),
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
		inputType: "date",
		formDefaultValue: "artist_birth",
	},
	{
		labelText: "Date of Creation",
		placeHolderText: "Select creation date",
		inputType: "date",
		formDefaultValue: "date_of_creation",
	},
	{
		labelText: "Medium",
		placeHolderText: "Enter medium of artwork",
		inputType: "text",
		formDefaultValue: "medium",
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
		labelText: "Image URL",
		placeHolderText: "Enter image URL",
		inputType: "url",
		formDefaultValue: "img_url",
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

	return <div className="w-full h-screen flex flex-col items-center"></div>;
};

export default ArtworkForm;
