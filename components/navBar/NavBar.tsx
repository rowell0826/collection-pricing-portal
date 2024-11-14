"use client";
import React from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { barkerLogo, barkerLogoDk } from "../constants/constants";
import Link from "next/link";
import { useAuth } from "@/lib/context/authContext/AuthContext";
import { signOutUser } from "@/lib/firebase/firebase";
import { Switch } from "../ui/switch";
import { useTheme } from "next-themes";

const NavBar = () => {
	const { userName } = useAuth();
	const { setTheme, theme } = useTheme();

	const searchArtWorks = () => {};

	return (
		<nav
			className="w-full max-w-[90%] h-16 flex justify-evenly items-center gap-8 text-xs
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
					<Image
						src={theme === "dark" ? barkerLogoDk : barkerLogo}
						alt="barker logo"
						className="w-full h-full"
					/>
				</Link>
			</div>
			<div className="flex justify-between items-center gap-4">
				<Link href={"/comps"}>
					<p className="cursor-pointer">MAKE COMPARABLES</p>
				</Link>
				<div className="flex justify-center items-center gap-1">
					<p>{userName?.toUpperCase()} / </p>
					<p onClick={signOutUser} className="cursor-pointer">
						SIGN OUT
					</p>
				</div>
			</div>
			<Switch onClick={() => setTheme(theme === "light" ? "dark" : "light")} />
		</nav>
	);
};

export default NavBar;
