import ArtWorkCard from "@/components/artWorkCard/ArtWorkCard";
import NavBar from "@/components/navBar/NavBar";
import PrivateRoute from "@/components/privateRoute/PrivateRoute";
import { ArtworkProvider } from "@/lib/context/artworkContext/ArtworkContext";

export default function Home() {
	return (
		<PrivateRoute>
			<div className="flex flex-col justify-start items-center">
				<ArtworkProvider>
					<NavBar />
					<ArtWorkCard />
				</ArtworkProvider>
			</div>
		</PrivateRoute>
	);
}
