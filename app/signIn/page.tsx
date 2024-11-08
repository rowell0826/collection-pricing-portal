import { barkerLogo } from "@/components/constants/constants";
import SignInForm from "@/components/signInForm/SignInForm";
import Image from "next/image";
import React from "react";

const SignIn = () => {
	return (
		<div className="w-full h-screen flex flex-col items-center">
			<div className="w-40 h-20 flex justify-center absolute">
				<Image src={barkerLogo} alt="Barker Logo" className="pr-4 object-fill" />
			</div>
			<SignInForm />
		</div>
	);
};

export default SignIn;
