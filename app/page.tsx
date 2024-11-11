import ArtWorkCard from "@/components/artWorkCard/ArtWorkCard";
import NavBar from "@/components/navBar/NavBar";
import PrivateRoute from "@/components/privateRoute/PrivateRoute";

export default function Home() {
	return (
		<PrivateRoute>
			<div className="flex flex-col justify-start items-center">
				<NavBar />
				<ArtWorkCard />
			</div>
		</PrivateRoute>
	);
}
