"use client";

import { db } from "@/lib/firebase/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import { createContext, useEffect } from "react";

const ArtworkContext = createContext<ArtworkContextProps | undefined>(undefined);

export const ArtworkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	

	return <ArtworkContext.Provider>{children}</ArtworkContext.Provider>;
};
