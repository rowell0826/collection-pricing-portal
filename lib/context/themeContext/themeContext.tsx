import { ThemeContextProps } from "@/lib/types/themeContextTypes";
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [theme, setTheme] = useState<boolean>(false);

	const toggleTheme = () => {
		setTheme(!theme);

		if (!theme) {
			document.documentElement.classList.add("dark");
			localStorage.setItem("theme", "dark");
		} else {
			document.documentElement.classList.remove("dark");
			localStorage.removeItem("theme");
		}
	};

	return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextProps => {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error("Theme must be used within a ThemeProvider");
	}

	return context;
};
