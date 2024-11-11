"use client";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Button } from "../ui/button";
import { FormItems } from "@/lib/types/formTypes";
import { FcGoogle } from "react-icons/fc";
import Link from "next/link";
import {
	createUserDocumentFromAuth,
	signInAuthUserWithEmailAndPassword,
	signInWithGooglePopup,
} from "@/lib/firebase/firebase";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";
import { showAlert } from "@/lib/helperFunc";
import ParticlesComponent from "../tsParticles/Particles";

const formSchema = z.object({
	emailAddress: z.string().email({ message: "Please enter a valid email address" }),
	password: z.string().min(6, { message: "Password must be at least 6 characters long" }),
});

const formItemLabels: FormItems[] = [
	{
		labelText: "Email Address",
		placeHolderText: "Email Address",
		inputType: "email",
		formDefaultValue: "emailAddress",
	},
	{
		labelText: "Password",
		placeHolderText: "Password",
		inputType: "password",
		formDefaultValue: "password",
	},
];

export default function SignInForm() {
	const router = useRouter();

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			emailAddress: "",
			password: "",
		},
	});

	const handleSubmit = async (data: z.infer<typeof formSchema>) => {
		try {
			const { emailAddress, password } = data;
			const userCredential = await signInAuthUserWithEmailAndPassword(emailAddress, password);

			if (userCredential) {
				console.log("User signed in successfully", userCredential.user);

				router.push("/");
			} else {
				// Handle the case where userCredential is undefined
				console.error("Sign-in failed: userCredential is undefined");
			}
		} catch (error) {
			if (error instanceof FirebaseError) {
				switch (error.code) {
					case "auth/wrong-password":
						showAlert("warning", "Incorrect password for email");
						break;
					case "auth/user-not-found":
						showAlert("error", "No user associated with this email");
						break;
					default:
						console.error("Sign-in error:", error.message);
				}
			} else {
				// Handle unexpected errors
				console.error("An unexpected error occurred:", error);
			}
		}
	};

	const handleGoogleSignIn = async () => {
		try {
			const result = await signInWithGooglePopup();
			const user = result.user;

			// Extract necessary user details
			const userDetails = {
				emailAddress: user.email ?? "",
				displayName: user.displayName ?? "",
				role: "",
			};

			// Create or update user document in Firestore
			await createUserDocumentFromAuth(user.uid, userDetails);

			router.push("/");
		} catch (error) {
			if (error instanceof FirebaseError) {
				console.error("Google sign-in error:", error.message);
			} else {
				console.error("An unexpected error occurred:", error);
			}
		}
	};

	return (
		<section className="w-full h-[70%] flex justify-center items-center my-auto">
			<div className="border border-slate-100 shadow-lg rounded-lg p-8 w-full min-w-80 max-w-80 max-h-max text-foreground bg-white">
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="max-w-md w-full flex flex-col gap-4"
					>
						{formItemLabels.map(
							({ labelText, placeHolderText, inputType, formDefaultValue }, idx) => (
								<FormField
									key={idx}
									control={form.control}
									name={formDefaultValue as keyof z.infer<typeof formSchema>}
									render={({ field }) => {
										return (
											<FormItem>
												<FormLabel>{labelText}</FormLabel>
												<FormControl>
													<Input
														placeholder={placeHolderText}
														type={inputType}
														{...field}
													/>
												</FormControl>
												<FormMessage>
													{
														form.formState.errors[
															formDefaultValue as keyof z.infer<
																typeof formSchema
															>
														]?.message
													}
												</FormMessage>
											</FormItem>
										);
									}}
								/>
							)
						)}

						<div className="flex flex-col justify-center items-center gap-4 text-foreground">
							<Button type="submit" className="w-full" variant={"default"}>
								Sign In
							</Button>
							<Button
								type="button"
								className="w-full border flex justify-center items-center gap-1 text-foreground"
								variant={"secondary"}
								onClick={handleGoogleSignIn}
							>
								<FcGoogle size={20} />
								Sign In with Google
							</Button>
						</div>

						<p className="text-[12px]">
							<Link href="/passwordReset" className="text-cyan-900">
								Forgot Password?
							</Link>
						</p>

						<p className="text-[12px]">
							<Link href="/signup" className="text-cyan-900">
								Register here
							</Link>{" "}
						</p>
					</form>
				</Form>
			</div>
			<ParticlesComponent />
		</section>
	);
}
