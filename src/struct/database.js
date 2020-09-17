require("dotenv").config();

const events = require("events");
const snowflake = require("flake-idgen");
const crypto = require("crypto");
const flake = new snowflake();
const intf = require("biguint-format");
const db = require("better-sqlite3");

module.exports = class Database {
	constructor() {
		this.events = new events.EventEmitter();
		this.db = false;

		this.users = {get:()=>{return false}};
		this.userIds = {get:()=>{return false}};

		return this;
	}

	start() {
		this.db = new db("./store/cerberus.db");
		this.db.prepare("CREATE TABLE IF NOT EXISTS USERS (id INTEGER, username TEXT PRIMARY KEY, key TEXT, salt TEXT, access TEXT);").run();

		this.users = {
			get: username => {
				let user = this.db.prepare("SELECT * FROM USERS WHERE username = ?").get(username);
				this.events.emit("read", {message:`get user ${username}`});
				return user;
			}
		}

		this.userIds = {
			get: id => {
				let user = this.db.prepare("SELECT * FROM USERS WHERE id = ?").get(id);
				this.events.emit("read", {message:`get user ${id}`});
				return user;
			}
		}

		this.events.emit("ready");
	}

	createUser(details) {
		let user = this.users.get(details.username);
		if(user) return false;

		let id = intf(flake.next(), "dec");
		let salt = crypto.randomBytes(16).toString("hex");
		let hash = crypto.pbkdf2Sync(details.password, salt, 1000, 64, "sha512").toString("hex");

		user = {
			id: id,
			username: details.username,
			key: hash,
			salt: salt,
			access: JSON.stringify([])
		}

		this.db.prepare("INSERT INTO USERS (id, username, key, salt, access) VALUES (@id, @username, @key, @salt, @access);").run(user);
		this.events.emit("write", {message:`add user ${details.username}`});

		return user;
	}
}
