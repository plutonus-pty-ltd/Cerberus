const express = require("express");
const app = new express.Router();

app.get("/", (req, res) => {
	res.status(200).send("OK");
});

module.exports = client => {
	return {
		name: "Main",
		dir: "/",
		router: app
	}
}
