import NavBar from "@/components/navBar/NavBar";
import PrivateRoute from "@/components/privateRoute/PrivateRoute";

const ArtWork = () => {
	return (
		<PrivateRoute>
			<div className="w-screen h-screen flex flex-col items-center">
				<NavBar />
			</div>
		</PrivateRoute>
	);
};

export default ArtWork;
