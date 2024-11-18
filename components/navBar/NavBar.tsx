"use client";
import React, { useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { barkerLogo, barkerLogoDk } from "../constants/constants";
import Link from "next/link";
import { useAuth } from "@/lib/context/authContext/AuthContext";
import { signOutUser } from "@/lib/firebase/firebase";
import { useTheme } from "next-themes";
import Switch11 from "../OriginSwitch/OriginSwitch";
import BurgerButton from "../burgerButton/BurgerButton";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu";
import { useArtwork } from "@/lib/context/artworkContext/ArtworkContext";

const NavBar = () => {
	const [open, setOpen] = useState<boolean>(false);

	const { userName, role } = useAuth();
	const { searchArtwork } = useArtwork();
	const { theme } = useTheme();

	const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		searchArtwork(e.target.value);
	};

	return (
		<section className="w-screen flex justify-center">
			{/* Mobile viewport */}
			<nav className="md:hidden w-full max-w-[90%] my-2 flex justify-between items-center">
				<div className="w-40 h-16 flex-grow flex justify-center">
					<Link href={"/"}>
						<Image
							src={theme === "dark" ? barkerLogoDk : barkerLogo}
							alt="barker logo"
							className="w-full h-full max-w-[160px]"
						/>
					</Link>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<div className="ml-auto mr-4">
							<BurgerButton toggle={setOpen} open={open} />
						</div>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-56">
						<DropdownMenuLabel>
							<div className="flex justify-between">
								<p>{userName}</p>
								<p className="text-foreground font-extralight font-">{role}</p>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator className="bg-gray-400" />
						<DropdownMenuGroup>
							<DropdownMenuItem className="cursor-pointer">
								<Link href={"/addArtWork"}>ADD ARTWORK</Link>
							</DropdownMenuItem>
							<DropdownMenuItem className="cursor-pointer">
								<Link href={"/comps"}>MAKE COMPARABLES</Link>
							</DropdownMenuItem>
							<DropdownMenuSeparator className="bg-gray-400" />
							<DropdownMenuItem className="cursor-pointer" onClick={signOutUser}>
								SIGNOUT
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</nav>

			{/* Medium to larger viewport */}
			<nav
				className="hidden w-full max-w-[90%] h-16 md:flex justify-evenly items-center gap-8 text-xs
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
						onChange={searchHandler}
					/>
				</div>

				<div className="w-40 h-16 flex-grow flex justify-center">
					<Link href={"/"}>
						<Image
							src={theme === "dark" ? barkerLogoDk : barkerLogo}
							alt="barker logo"
							className="w-full h-full max-w-[160px]"
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
				<Switch11 />
			</nav>
		</section>
	);
};

export default NavBar;
