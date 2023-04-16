const express = require("express");
const app = express();
const { nanoid } = require("nanoid");
const mysql = require("mysql");

const dbCredentials = require("./config/dbCredentials");
const serviceConfig = require("./config/serviceConfig");
const urlPattern = serviceConfig.urlPattern;
const PORT = serviceConfig.PORT;
const BASE_URL = serviceConfig.BASE_URL;

let conn = mysql.createConnection(dbCredentials);
conn.connect();

app.use(express.json());

//Logger
app.use((req, res, next) => {
	console.log(req.path);
	next();
});

// Handle root path
app.use("/", express.static("./public"));

// Acces site by minidfied url
app.get("/:url", (req, res) => {
	if (!req?.params?.url) return res.sendStatus(404);

	const requestedURL = BASE_URL + req.params.url;

	try {
		const queryString = `SELECT original_url, visit_counter FROM sites WHERE short_url=?`;

		conn.query(queryString, [requestedURL], (err, results, fields) => {
			if (err)
				return res.status(500).json({ message: "Internal Server Error!" });

			const originalURL = results[0]?.original_url;
			if (!originalURL) return res.sendStatus(404);
			const visit_counter = results[0]?.visit_counter;

			const incCounterQuery =
				"UPDATE sites set visit_counter=? WHERE short_url=?";

			conn.query(
				incCounterQuery,
				[visit_counter + 1, requestedURL],
				(err, results, fields) => {
					if (err) return res.sendStatus(500);

					res.status(301).redirect(originalURL);
				}
			);
		});
	} catch (e) {
		console.log(e.stack);
		return res.status(500).json({ message: "Internal Server Error!" });
	}
});

// Handle minifing URL path
app.post("/shorten", (req, res) => {
	if (!req?.body?.orgURL)
		return res.status(400).json({ message: "URL is required!" });
	if (!urlPattern.test(req.body.orgURL)) {
		return res.status(400).json({ message: "URL is invalid!" });
	}

	let originalURL = req.body.orgURL;
	let shortURL = BASE_URL + nanoid();

	if (!originalURL.includes("http://") && !originalURL.includes("https://"))
		originalURL = "https://" + originalURL;

	try {
		const queryString = `INSERT INTO sites VALUES(NULL, ?, ?, 0)`;

		conn.query(queryString, [originalURL, shortURL], (err, results, fields) => {
			if (err)
				return res.status(500).json({ message: "Internal Server Error!" });

			res.status(201).json({ originalURL: originalURL, shortURL: shortURL });
		});
	} catch (e) {
		console.log(e.stack);
		return res.status(500).json({ message: "Internal Server Error!" });
	}
});

// Handle incorect path
app.all("*", (req, res) => {
	res.sendStatus(404);
});

// Error logger
app.use((err, req, res, next) => {
	console.log(err.stack);
	res.status(500).send("Internal Server Error!");
});

app.listen(PORT, () => {
	console.log(`Server started at port ${PORT}!`);
});

conn.on("error", (err) => {
	console.log(err);

	conn = mysql.createConnection(dbCredentials);
});
