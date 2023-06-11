const express = require("express");
const app = express();
const { nanoid } = require("nanoid");
const knex = require("knex")(require("./config/knexConfig"));

const serviceConfig = require("./config/serviceConfig");
const urlPattern = serviceConfig.urlPattern;
const PORT = serviceConfig.PORT;
const BASE_URL = serviceConfig.BASE_URL;

app.use(express.json());

//Logger
app.use((req, res, next) => {
	console.log(req.path);
	next();
});

// Handle root path
app.use("/", express.static("./public"));

// Acces site by minidfied url
app.get("/:url", async (req, res) => {
	if (!req?.params?.url) return res.sendStatus(404);

	const requestedURL = BASE_URL + req.params.url;

	try {
		const result = await knex("sites")
			.select("original_url", "visit_counter")
			.where("short_url", requestedURL);

		const originalURL = result[0]?.original_url;
		if (!originalURL) return res.sendStatus(404);

		const visit_counter = result[0]?.visit_counter + 1;

		// const updateResult =
		await knex("sites")
			.update({
				visit_counter: visit_counter,
			})
			.where({
				short_url: requestedURL,
			});

		// if (!updateResult)
		// 	return res.status(500).json({ message: "Internal Server Error!" });

		res.status(301).redirect(originalURL);
	} catch (e) {
		console.log(e.stack);
		return res.status(500).json({ message: "Internal Server Error!" });
	}
});

// Handle minifing URL path
app.post("/shorten", async (req, res) => {
	if (!req?.body?.orgURL)
		return res.status(400).json({ message: "URL is required!" });
	if (!urlPattern.test(req.body.orgURL)) {
		return res.status(400).json({ message: "URL is invalid!" });
	}

	let originalURL = req.body.orgURL;
	const shortURL = BASE_URL + nanoid();

	if (!originalURL.includes("http://") && !originalURL.includes("https://"))
		originalURL = "https://" + originalURL;

	try {
		await knex("sites").insert({
			original_url: originalURL,
			short_url: shortURL,
			visit_counter: 0,
		});

		res.status(201).json({ originalURL: originalURL, shortURL: shortURL });
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
