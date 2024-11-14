import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/context/authContext/AuthContext";
import { ThemeProvider as NextThemesProvider, ThemeProvider } from "next-themes";

const montserrat = Montserrat({ weight: "500", subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Barker Client Collection Pricing Portal",
	description: "Generated by create next app",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<AuthProvider>
				<body className={`${montserrat.className} antialiased`}>
					<ThemeProvider
						attribute="class"
						defaultTheme="system"
						enableSystem
						disableTransitionOnChange
					>
						{children}
					</ThemeProvider>
				</body>
			</AuthProvider>
		</html>
	);
}
