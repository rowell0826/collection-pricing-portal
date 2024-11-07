import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const [backgroundColor, setBackgroundColor] = useState<string>("");
const [textColor, setTextColor] = useState<string>("");

const updateColors = () => {
	const bgColor = getComputedStyle(document.documentElement)
		.getPropertyValue("--background")
		.trim();
	const fgColor = getComputedStyle(document.documentElement)
		.getPropertyValue("--foreground")
		.trim();

	setBackgroundColor(bgColor);
	setTextColor(fgColor);
};

useEffect(() => {
	// Ensure this code runs only on the client-side
	if (typeof window !== "undefined") {
		updateColors();
	}
}, []);

export const showAlert = (
	iconImg: "success" | "error" | "warning" | "info" | "question",
	htmlTxt: string
) => {
	Swal.fire({
		position: "top",
		icon: iconImg,
		html: htmlTxt,
		timer: 1500,
		showConfirmButton: false,
		toast: true,
		background: `hsl(${backgroundColor})`,
		color: `hsl(${textColor})`,
	});
};
