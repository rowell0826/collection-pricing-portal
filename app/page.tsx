import NavBar from "@/components/navBar/NavBar";
import PrivateRoute from "@/components/privateRoute/PrivateRoute";

export default function Home() {
	return (
		<PrivateRoute>
			<div className="flex justify-center">
				<NavBar />
			</div>
		</PrivateRoute>
	);
}
