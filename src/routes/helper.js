const express = require("express");
const app = new express.Router();

module.exports = client => {
	return {
		name: "Helper",
		dir: "*",
		router: app
	}
}
