const express = require("express");
const app = new express.Router();

app.get("/", (req, res) => {
	res.status(200).render("home");
});

module.exports = client => {
	return {
		name: "Main",
		dir: "/",
		router: app
	}
}
