require("dotenv").config();

const express = require("express");
const app = new express.Router();
const ejwt = require("express-jwt");
const jwt = require("jsonwebtoken");

const database = require("../struct/database");
const db = new database();
db.start();

app.all("/", (req, res) => {
	res.status(200).send("OK");
});

app.get("/users/create", (req, res) => {
	let { id } = db.createUser({username: req.query.user, password: req.query.pass});
	res.status(200).redirect(`/users/${id}`);
});

app.get("/users/:id", (req, res) => {
	let user = db.userIds.get(req.params.id);
	if(user) return res.status(200).json(user);
	res.status(404).json({message:"Unknown User"});
});

const auth = (roles=[]) => {
	if(typeof(roles) === "string") roles = [roles];

	return [
		ejwt({secret: process.env.JWT_SECRET, algorithms: ["HS256"]}, (req, res, next) => {
			if(roles.length && !roles.includes(req.user.role)) return res.status(401).json({message: "Unauthorized"});
			next();
		})
	]
}

module.exports = {
	name: "API",
	dir: "api.",
	router: app
}
