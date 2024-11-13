import Swal from "sweetalert2";

export const showAlert = (
	iconImg: "success" | "error" | "warning" | "info" | "question",
	htmlTxt: string
) => {
	Swal.fire({
		position: "top",
		icon: iconImg,
		html: htmlTxt,
		timer: 2000,
		showConfirmButton: false,
		toast: true,
		background: `rgba(0,0,0, 1)`,
		color: `rgba(255,255,255, 1)`,
	});
};

export const generateUniqueId = (length = 5) => {
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	const numbers = "0123456789";

	if (length < 5) {
		throw new Error("Length must be at least 5 to accommodate 2 letters and 3 numbers.");
	}

	// Generate the first two letters
	let result = "";
	for (let i = 0; i < 2; i++) {
		result += letters.charAt(Math.floor(Math.random() * letters.length));
	}

	// Generate the remaining three numbers
	for (let i = 0; i < length - 2; i++) {
		result += numbers.charAt(Math.floor(Math.random() * numbers.length));
	}

	// Shuffle the result to randomize letter and number positions
	return shuffleString(result);
};

// Helper function to shuffle a string
export const shuffleString = (str: string) => {
	return str
		.split("")
		.sort(() => 0.5 - Math.random())
		.join("");
};
