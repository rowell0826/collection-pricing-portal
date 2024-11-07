import Swal from "sweetalert2";

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
		background: `rgba(0,0,0, 1)`,
		color: `rgba(255,255,255, 1)`,
	});
};
