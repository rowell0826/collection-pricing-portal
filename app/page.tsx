import NavBar from "@/components/navBar/NavBar";
import PrivateRoute from "@/components/privateRoute/PrivateRoute";

export default function Home() {
	return (
		<PrivateRoute>
			<div>
				<NavBar />
			</div>
		</PrivateRoute>
	);
}
