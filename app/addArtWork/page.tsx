import ArtworkForm from "@/components/artworkForm/ArtworkForm";
import NavBar from "@/components/navBar/NavBar";
import PrivateRoute from "@/components/privateRoute/PrivateRoute";

const ArtWork = () => {
	return (
		<PrivateRoute>
			<div className="flex flex-col items-center">
				<NavBar />
				<ArtworkForm />
			</div>
		</PrivateRoute>
	);
};

export default ArtWork;
