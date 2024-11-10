"use client";
import React from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { barkerLogo } from "../constants/constants";
import Link from "next/link";
import { useAuth } from "@/lib/context/authContext/AuthContext";
import { signOutUser } from "@/lib/firebase/firebase";

const NavBar = () => {
	const { userName } = useAuth();

	const searchArtWorks = () => {};

	return (
		<nav
			className="w-full max-w-[80%] h-16 flex justify-evenly items-center gap-8 text-xs
        "
		>
			<div className="w-96 flex justify-evenly items-center gap-2">
				<Link href={"/addArtWork"} className="w-[50%]">
					<p>ADD ARTWORK</p>
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
				<p>MAKE COMPARABLES</p>
				<div className="flex justify-center items-center gap-1">
					<p>{userName?.toUpperCase()} / </p>
					<p onClick={signOutUser} className="cursor-pointer">
						SIGN OUT
					</p>
				</div>
			</div>
		</nav>
	);
};

export default NavBar;
