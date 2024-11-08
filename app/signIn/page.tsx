import { barkerLogo } from "@/components/constants/constants";
import SignInForm from "@/components/signInForm/SignInForm";
import Image from "next/image";
import React from "react";

const SignIn = () => {
	return (
		<section className="w-full h-[70%] flex flex-col justify-center items-center my-auto">
			<div className="w-40 h-20 flex justify-center ">
				<Image src={barkerLogo} alt="Barker Logo" className="pr-4 object-fill" />
			</div>
			<SignInForm />
		</section>
	);
};

export default SignIn;
