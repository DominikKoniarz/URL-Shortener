const urlInput = document.querySelector("#form-url-input");
const errorField = document.querySelector(".error");
const submitText = document.querySelector("#submit-text");
const submitLoader = document.querySelector("#submit-loader");
const form = document.querySelector("#form");
const afterSubmit = document.querySelector("#after-submit");
const originalURLField = document.querySelector("#original-url");
const shortURLField = document.querySelector("#short-url");
const copyButton = document.querySelector("#copy-button");
const shortAnotherButton = document.querySelector("#short-another");

const showResult = (result) => {
	form.style.display = "none";
	afterSubmit.style.display = "block";

	originalURLField.value = result.originalURL;
	shortURLField.value = result.shortURL;
};

const manageSubmitLoader = (state) => {
	if (state) {
		submitLoader.style.display = "block";
		submitText.style.display = "none";
	} else {
		submitLoader.style.display = "none";
		submitText.style.display = "block";
	}
};

const hideError = () => {
	errorField.classList.remove("error-active");
	errorField.textContent = "";
};

const printError = (text) => {
	errorField.classList.add("error-active");
	errorField.textContent = text;
};

const askApiToShorten = async (url) => {
	hideError();
	manageSubmitLoader(true);

	const json = {
		orgURL: url,
	};

	try {
		const response = await fetch("/shorten", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(json),
		});

		if (!response.ok) {
			const errorText = await response.json();
			return printError(errorText.message);
		} else {
			const result = await response.json();

			showResult(result);
			urlInput.value = "";
		}
	} catch (e) {
		printError("Server is offline! Try again later!");
	} finally {
		manageSubmitLoader(false);
	}
};

form.addEventListener("submit", (e) => {
	e.preventDefault();
	askApiToShorten(urlInput.value);
});

copyButton.addEventListener("click", () => {
	navigator.clipboard.writeText(shortURLField.value);
});

shortAnotherButton.addEventListener("click", () => {
	afterSubmit.style.display = "none";
	form.style.display = "block";
});
