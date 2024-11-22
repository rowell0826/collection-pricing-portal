import { google } from "googleapis";

export async function GET(request: Request) {
	try {
		const url = new URL(request.url);
		const spreadsheetId = url.searchParams.get("spreadsheetId");
		const range = url.searchParams.get("range");

		if (!spreadsheetId || !range) {
			throw new Error("Missing required query parameters: spreadsheetId or range.");
		}

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

		// Authenticate with Google Sheets API
		const auth = new google.auth.GoogleAuth({
			credentials,
			scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
		});
		const sheets = google.sheets({ version: "v4", auth });

		// Fetch data from the Google Sheet using the provided range
		const response = await sheets.spreadsheets.values.get({
			spreadsheetId,
			range,
		});

		// Return the fetched data as JSON
		return new Response(JSON.stringify(response.data.values), {
			headers: {
				"Content-Type": "application/json",
			},
			status: 200,
		});
	} catch (error) {
		// Log and return the error if something goes wrong
		console.error("Error:", error);

		return new Response(
			JSON.stringify({
				error: error instanceof Error ? error.message : "An unknown error occurred",
			}),
			{ status: 500 }
		);
	}
}
