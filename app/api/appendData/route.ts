import { google } from "googleapis";

export async function POST(request: Request) {
	try {
		const { spreadsheetId, range, values } = await request.json();

		const auth = new google.auth.GoogleAuth({
			credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT || "{}"),
			scopes: ["https://www.googleapis.com/auth/spreadsheets"],
		});
		const sheets = google.sheets({ version: "v4", auth });
		const response = await sheets.spreadsheets.values.append({
			spreadsheetId,
			range,
			valueInputOption: "RAW",
			requestBody: { values },
		});

		console.log("Sheets API Response:", response.data);

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
