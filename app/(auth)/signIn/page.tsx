"use client";
import { barkerLogo, barkerLogoDk } from "@/components/constants/constants";
import SignInForm from "@/components/signInForm/SignInForm";
import { useTheme } from "next-themes";
import Image from "next/image";
import React from "react";

const SignIn = () => {
	const { theme } = useTheme();
	return (
		<section className="w-full h-screen flex flex-col justify-center items-center my-auto">
			<div className="w-40 h-20 flex justify-center items-center">
				<Image
					src={theme === "light" ? barkerLogo : barkerLogoDk}
					alt="Barker Logo"
					className="pr-4 object-fill"
				/>
			</div>
			<SignInForm />
		</section>
	);
};

export default SignIn;
