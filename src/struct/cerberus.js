
const events = require("events");

const discord = require("./discord");
const web = require("./web");
const db = require("./database");
const logger = require("../util/logger");

module.exports = class Cerberus {
	constructor() {
		this.events = new events.EventEmitter();
		this.modules = {
			discord: discord,
			web: web,
			db: db
		}
		this.services = {
			discord: new this.modules.discord.Client(this),
			web: new this.modules.web(this),
			db: new this.modules.db(this)
		}
		this.sev = {
			d: false,
			w: false,
			db: false
		}

		return this;
	}

	log(text) {
		logger.log(text);
	}

	registerDiscord(token) {
		if(!token) throw new Error("No token passed.");

		this.services.discord.on("ready", () => this.events.emit("discord/ready"));
		this.services.discord.on("message", msg => this.events.emit("discord/message", msg));
		this.services.discord.on("disconnect", () => this.events.emit("discord/disconnect"));

		this.services.discord.login(token);
	}

	registerWebservice(data) {
		if(!data) throw new Error("No data passed.");
		if(!data.WEBSERVICE_PORT) throw new Error("No WEBSERVICE_PORT passed.");
		if(!data.VHOST_DOMAIN) throw new Error("No VHOST_DOMAIN passed.");
		if(!data.JWT_SECRET) throw new Error("No JWT_SECRET passed.");
		this.sev.w = this.services.web.events;

		this.sev.w.on("ready", () => this.events.emit("web/ready"));
		this.sev.w.on("addRoute", route => this.events.emit("web/addRoute", route));

		this.services.web.start(data);
	}

	registerDatabase() {
		this.sev.db = this.services.db.events;

		this.sev.db.on("ready", () => this.events.emit("db/ready"));
		this.sev.db.on("read", data => this.events.emit("db/read", data));
		this.sev.db.on("write", data => this.events.emit("db/write", data));

		this.services.db.start();
	}

	killDiscord() {
		this.services.discord.destroy();
		this.events.emit("discord/killed");
	}
}
