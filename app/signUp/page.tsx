import { barkerLogo } from "@/components/constants/constants";
import SignUpForm from "@/components/signUpForm/SignUpForm";
import Image from "next/image";

const SignUp = () => {
	return (
		<div className="w-full h-screen flex flex-col items-center">
			<div className="w-40 h-20 flex justify-center ">
				<Image src={barkerLogo} alt="Barker Logo" className="pr-4 object-fill" />
			</div>
			<SignUpForm />
		</div>
	);
};

export default SignUp;
