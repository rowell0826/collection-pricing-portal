"use client";
import React from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { barkerLogo } from "../constants/constants";
import Link from "next/link";

const NavBar = () => {
	const searchArtWorks = () => {};

	return (
		<nav
			className="h-16 flex justify-evenly items-center gap-8 text-xs
        "
		>
			<div className="flex justify-evenly items-center gap-2">
				<Link href={"/addArtWork"} className="w-[50%]">
					<p>Add Artwork</p>
				</Link>
				<Input
					alt="search"
					placeholder="Search artwork"
					className="rounded-lg"
					onChange={searchArtWorks}
				/>
			</div>
			<div className="w-40 h-16 flex justify-center">
				<Link href={"/"}>
					<Image src={barkerLogo} alt="barker logo" className="w-full h-full" />
				</Link>
			</div>
			<div className="flex justify-between items-center gap-4">
				<p>Make Comparables</p>
				<div className="flex justify-center items-center gap-1">
					<p>User name / </p>
					<p>Sign Out</p>
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
