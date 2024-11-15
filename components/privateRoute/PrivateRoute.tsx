"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/authContext/AuthContext";
import { useEffect } from "react";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { user, loading } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			router.push("/signIn");
		}
	}, [user, loading, router]);

	if (loading || !user) {
		return <div className="w-screen h-screen flex justify-center items-center">Loading...</div>;
	}

	return <>{children}</>;
};

export default PrivateRoute;
