import { showAlert } from "@/lib/helperFunc";
import { google } from "googleapis";

export async function POST(request: Request) {
	try {
		const { spreadsheetId, range, values } = await request.json();

		let credentials;

		if (process.env.GOOGLE_SERVICE_ACCOUNT_BASE64) {
			const decodedCredentials = Buffer.from(
				process.env.GOOGLE_SERVICE_ACCOUNT_BASE64,
				"base64"
			).toString("utf-8");

			credentials = JSON.parse(decodedCredentials);
		} else if (process.env.GOOGLE_SERVICE_ACCOUNT) {
			credentials = await import(process.env.GOOGLE_SERVICE_ACCOUNT!);
		} else {
			throw new Error("Google service account credentials are not available.");
		}

		const auth = new google.auth.GoogleAuth({
			credentials,
			scopes: ["https://www.googleapis.com/auth/spreadsheets"],
		});
		const sheets = google.sheets({ version: "v4", auth });

		await sheets.spreadsheets.values.append({
			spreadsheetId,
			range,
			valueInputOption: "RAW",
			requestBody: { values },
		});

		showAlert("success", "Data sent to pricing");

		return new Response(JSON.stringify({ message: "Data appended successfully" }), {
			status: 200,
		});
	} catch (error) {
		console.error("Error:", error);

		return new Response(
			JSON.stringify({
				error: error instanceof Error ? error.message : "An unknown error occurred",
			}),
			{ status: 500 }
		);
	}
}
